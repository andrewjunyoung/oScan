import React, { createContext, useContext, useEffect, useState } from 'react';
import Tesseract from "tesseract.js";

type ScannerEvents = {
  onScan: (isProcessing: boolean) => void;
  onTextExtracted: (text: string) => void;
  onError: (error: Error) => void;
}

class Scanner {
  private static instance: Scanner;
  private listeners: ScannerEvents[] = [];

  private constructor() {}

  static getInstance(): Scanner {
    if (!Scanner.instance) {
      Scanner.instance = new Scanner();
    }
    return Scanner.instance;
  }

  addListener(events: ScannerEvents) {
    this.listeners.push(events);
    return () => {
      this.listeners = this.listeners.filter(l => l !== events);
    };
  }

  private emit<K extends keyof ScannerEvents>(
    event: K,
    ...args: Parameters<ScannerEvents[K]>
  ) {
    this.listeners.forEach(l => l[event](...args));
  }

  async scan(imageData: string | Uint8Array) {
    this.emit('onScan', true);

    try {
      const worker = await Tesseract.createWorker();
      await worker.setParameters({
        preserve_interword_spaces: "1",
      });
      const result = await worker.recognize(imageData);
      this.emit('onTextExtracted', result.data.text);
      await worker.terminate();
    } catch (error) {
      this.emit('onError', error as Error);
    } finally {
      this.emit('onScan', false);
    }
  }
}

const ScannerContext = createContext<Scanner | null>(null);

export const ScannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanner] = useState(() => Scanner.getInstance());
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  useEffect(() => {
    return scanner.addListener({
      onProcessingChange: setIsProcessing,
      onTextExtracted: setExtractedText,
      onError: (error) => {
        console.error(error);
        setExtractedText('Error extracting text');
      }
    });
  }, [scanner]);

  return (
    <ScannerContext.Provider value={scanner}>
      {children}
    </ScannerContext.Provider>
  );
};

export const useScanner = () => {
  const scanner = useContext(ScannerContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  useEffect(() => {
    if (!scanner) return;
    return scanner.addListener({
      onProcessingChange: setIsProcessing,
      onTextExtracted: setExtractedText,
      onError: (error) => {
        console.error(error);
        setExtractedText('Error extracting text');
      }
    });
  }, [scanner]);

  if (!scanner) throw new Error('useScanner must be used within ScannerProvider');

  return {
    scan: (imageData: string | Uint8Array) => scanner.scan(imageData),
    isProcessing,
    extractedText
  };
};
