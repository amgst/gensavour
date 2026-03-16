
import React, { createContext, useContext, useState, useEffect } from 'react';

declare const WebBluetoothReceiptPrinter: any;

interface PrinterContextType {
  printer: any;
  connectedDevice: any;
  setConnectedDevice: (device: any) => void;
  isConnecting: boolean;
  setIsConnecting: (status: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handleReconnect: (device: any) => Promise<void>;
}

const PrinterContext = createContext<PrinterContextType | undefined>(undefined);

export const PrinterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [printer, setPrinter] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof WebBluetoothReceiptPrinter !== 'undefined') {
      const printerInstance = new WebBluetoothReceiptPrinter();
      
      printerInstance.addEventListener('connected', (device: any) => {
        setConnectedDevice(device);
        setIsConnecting(false);
      });

      printerInstance.addEventListener('disconnected', () => {
        setConnectedDevice(null);
        setIsConnecting(false);
      });

      setPrinter(printerInstance);
    }
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
    } catch (err: any) {
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
    } catch (err: any) {
      setError(`Failed to reconnect: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <PrinterContext.Provider value={{
      printer,
      connectedDevice,
      setConnectedDevice,
      isConnecting,
      setIsConnecting,
      error,
      setError,
      handleConnect,
      handleDisconnect,
      handleReconnect
    }}>
      {children}
    </PrinterContext.Provider>
  );
};

export const usePrinter = () => {
  const context = useContext(PrinterContext);
  if (context === undefined) {
    throw new Error('usePrinter must be used within a PrinterProvider');
  }
  return context;
};
