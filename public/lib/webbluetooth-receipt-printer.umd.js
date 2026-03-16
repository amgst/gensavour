(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WebBluetoothReceiptPrinter = factory());
})(this, (function () { 'use strict';

    class WebBluetoothReceiptPrinter {

        /**
         * The vendor and product IDs of the printer
         * @private
         */
        options = {
            filters: [
                {
                    services: ['000018f0-0000-1000-8000-00805f9b34fb']
                },
                {
                    services: ['0000ff00-0000-1000-8000-00805f9b34fb']
                },
                {
                    services: ['49535343-fe7d-41aa-8956-7245aa70821b']
                },
                {
                    services: ['e7810400-410c-4340-9b37-88484e56840d']
                },
                {
                    services: ['00001101-0000-1000-8000-00805f9b34fb']
                }
            ],
            optionalServices: [
                '000018f0-0000-1000-8000-00805f9b34fb',
                '0000ff00-0000-1000-8000-00805f9b34fb',
                '49535343-fe7d-41aa-8956-7245aa70821b',
                'e7810400-410c-4340-9b37-88484e56840d',
                '00001101-0000-1000-8000-00805f9b34fb'
            ]
        };

        /**
         * The bluetooth device
         * @private
         */
        device = null;

        /**
         * The bluetooth server
         * @private
         */
        server = null;

        /**
         * The bluetooth service
         * @private
         */
        service = null;

        /**
         * The bluetooth characteristic
         * @private
         */
        characteristic = null;

        /**
         * The event listeners
         * @private
         */
        listeners = {
            connected: [],
            disconnected: []
        };

        /**
         * Connect to a bluetooth printer
         * 
         * @returns {Promise}
         */
        connect() {
            return new Promise((resolve, reject) => {
                navigator.bluetooth.requestDevice(this.options).then(device => {
                    this.device = device;
                    this.device.addEventListener('gattserverdisconnected', e => this.handleDisconnect(e));
                    return device.gatt.connect();
                }).then(server => {
                    this.server = server;
                    return this.findServiceAndCharacteristic(server);
                }).then(() => {
                    this.handleConnect();
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        }

        /**
         * Reconnect to a bluetooth printer
         * 
         * @param {object} device The device to reconnect to
         * @returns {Promise}
         */
        reconnect(device) {
            return new Promise((resolve, reject) => {
                this.device = device;
                this.device.addEventListener('gattserverdisconnected', e => this.handleDisconnect(e));
                device.gatt.connect().then(server => {
                    this.server = server;
                    return this.findServiceAndCharacteristic(server);
                }).then(() => {
                    this.handleConnect();
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        }

        /**
         * Find a writable characteristic in the given server
         * 
         * @private
         * @param {BluetoothRemoteGATTServer} server 
         * @returns {Promise}
         */
        async findServiceAndCharacteristic(server) {
            const services = await server.getPrimaryServices();
            for (const service of services) {
                const characteristics = await service.getCharacteristics();
                for (const characteristic of characteristics) {
                    if (characteristic.properties.write || characteristic.properties.writeWithoutResponse) {
                        this.service = service;
                        this.characteristic = characteristic;
                        return;
                    }
                }
            }
            throw new Error('No writable characteristic found');
        }

        /**
         * Disconnect from the bluetooth printer
         * 
         * @returns {Promise}
         */
        disconnect() {
            return new Promise((resolve) => {
                if (this.device && this.device.gatt.connected) {
                    this.device.gatt.disconnect();
                }
                resolve();
            });
        }

        /**
         * Handle the connection event
         * 
         * @private
         */
        handleConnect() {
            this.listeners.connected.forEach(listener => listener(this.device));
        }

        /**
         * Handle the disconnection event
         * 
         * @private
         */
        handleDisconnect() {
            this.listeners.disconnected.forEach(listener => listener(this.device));
            this.device = null;
            this.server = null;
            this.service = null;
            this.characteristic = null;
        }

        /**
         * Print data to the printer
         * 
         * @param {Array} data The data to print
         * @returns {Promise}
         */
        print(data) {
            return this.characteristic.writeValue(data);
        }

        /**
         * Add an event listener
         * 
         * @param {string} event The event to listen for
         * @param {function} callback The callback to execute
         */
        addEventListener(event, callback) {
            if (this.listeners[event]) {
                this.listeners[event].push(callback);
            }
        }

        /**
         * Remove an event listener
         * 
         * @param {string} event The event to remove the listener from
         * @param {function} callback The callback to remove
         */
        removeEventListener(event, callback) {
            if (this.listeners[event]) {
                this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
            }
        }
    }

    return WebBluetoothReceiptPrinter;

}));
