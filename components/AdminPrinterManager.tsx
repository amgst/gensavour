
import React, { useState, useEffect } from 'react';

declare const WebBluetoothReceiptPrinter: any;

const AdminPrinterManager: React.FC = () => {
  const [printer, setPrinter] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [pairedDevices, setPairedDevices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPairedDevices = async () => {
      if (navigator.bluetooth && typeof navigator.bluetooth.getDevices === 'function') {
        const devices = await navigator.bluetooth.getDevices();
        setPairedDevices(devices);
      }
    };

    if (typeof WebBluetoothReceiptPrinter !== 'undefined') {
      const printerInstance = new WebBluetoothReceiptPrinter();
      printerInstance.addEventListener('connected', (device: any) => {
        setConnectedDevice(device);
        setIsConnecting(false);
        getPairedDevices(); // Refresh the list
      });
      printerInstance.addEventListener('disconnected', () => {
        setConnectedDevice(null);
        setIsConnecting(false);
        getPairedDevices(); // Refresh the list
      });
      setPrinter(printerInstance);
    }

    getPairedDevices();
  }, []);

  const handleConnect = async () => {
    if (!printer) {
      setError('Printer library not loaded. Please reload the page.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const connected = await printer.connect();
      if (connected) {
        setConnectedDevice(printer.device);
      }
    } catch (err) {
      setError(`Failed to connect: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (printer && printer.device) {
      await printer.disconnect();
      setConnectedDevice(null);
    }
  };

  const handleReconnect = async (device: any) => {
    if (!printer) {
      setError('Printer library not loaded. Please reload the page.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await printer.reconnect(device);
    } catch (err) {
      setError(`Failed to reconnect: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
      <h3 className="text-lg font-bold text-stone-800 mb-4">Bluetooth Printer</h3>
      <div className="space-y-4">
        <button
          onClick={connectedDevice ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className={`w-full font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:bg-stone-400 ${
            connectedDevice
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/10'
              : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/10'
          }`}
        >
          {isConnecting ? 'Connecting...' : connectedDevice ? 'Disconnect Printer' : 'Connect to Printer'}
        </button>
        {connectedDevice && (
          <div className="text-sm text-stone-600 p-4 bg-emerald-50 rounded-lg">
            <p>Successfully connected to: <span className="font-bold">{connectedDevice.name}</span></p>
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600 p-4 bg-red-50 rounded-lg font-medium">
            <p>{error}</p>
          </div>
        )}
      </div>

      {pairedDevices.length > 0 && (
        <div className="mt-8">
          <h4 className="text-md font-bold text-stone-700 mb-4">Previously Paired Printers</h4>
          <div className="space-y-2">
            {pairedDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <span className="font-medium text-stone-800">{device.name}</span>
                <button
                  onClick={() => handleReconnect(device)}
                  className="text-sm font-bold text-emerald-800 hover:underline"
                >
                  Reconnect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrinterManager;
