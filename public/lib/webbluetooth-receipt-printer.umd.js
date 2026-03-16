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
                }
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
                    return server.getPrimaryService(this.options.filters[0].services[0]);
                }).then(service => {
                    this.service = service;
                    return service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
                }).then(characteristic => {
                    this.characteristic = characteristic;
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
                    return server.getPrimaryService(this.options.filters[0].services[0]);
                }).then(service => {
                    this.service = service;
                    return service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
                }).then(characteristic => {
                    this.characteristic = characteristic;
                    this.handleConnect();
                    resolve();
                }).catch(error => {
                    reject(error);
                });
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
