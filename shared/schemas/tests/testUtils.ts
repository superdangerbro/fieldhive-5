import { jest } from '@jest/globals';

export interface MockBarcodeScanner {
  scan: jest.Mock;
  onScan: ((result: { data: string } | { error: string }) => void) | null;
  hasPermission: boolean;
  requestPermission: jest.Mock;
  simulateScan: (data: string) => void;
}

export interface MockVoiceRecognition {
  start: jest.Mock;
  stop: jest.Mock;
  destroy: jest.Mock;
  isRecognizing: jest.Mock;
  results: string[];
  onResult: ((result: { value: string[] }) => void) | null;
  onError: ((error: { error: string }) => void) | null;
  simulateResult: (text: string) => void;
  simulateError: (error: string) => void;
}

const createAsyncMock = <T>(returnValue: T): jest.Mock => 
  jest.fn().mockImplementation(() => Promise.resolve(returnValue));

export const createMockBarcodeScanner = (): MockBarcodeScanner => ({
  scan: jest.fn(),
  onScan: null,
  hasPermission: true,
  requestPermission: createAsyncMock(true),
  simulateScan(data: string) {
    if (this.onScan) {
      this.onScan({ data });
    }
  },
});

export const createMockVoiceRecognition = (): MockVoiceRecognition => ({
  start: createAsyncMock(undefined),
  stop: createAsyncMock(undefined),
  destroy: createAsyncMock(undefined),
  isRecognizing: createAsyncMock(false),
  results: [],
  onResult: null,
  onError: null,
  simulateResult(text: string) {
    this.results.push(text);
    if (this.onResult) {
      this.onResult({ value: [text] });
    }
  },
  simulateError(error: string) {
    if (this.onError) {
      this.onError({ error });
    }
  },
});

export const mockBarcodeScanner = createMockBarcodeScanner();
export const mockVoiceRecognition = createMockVoiceRecognition();

export const wait = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const waitFor = async (
  callback: () => void | Promise<void>,
  { timeout = 1000, interval = 50 } = {}
): Promise<void> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      await callback();
      return;
    } catch (error) {
      await wait(interval);
    }
  }

  throw new Error('Timeout waiting for condition');
};

export const simulateEvent = {
  offline: () => window.dispatchEvent(new Event('offline')),
  online: () => window.dispatchEvent(new Event('online')),
  resize: () => window.dispatchEvent(new Event('resize')),
  scroll: () => window.dispatchEvent(new Event('scroll')),
  orientationChange: () => window.dispatchEvent(new Event('orientationchange')),
};

export const cleanUpTests = async (): Promise<void> => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Reset mock states
  mockBarcodeScanner.onScan = null;
  mockVoiceRecognition.results = [];
  mockVoiceRecognition.onResult = null;
  mockVoiceRecognition.onError = null;

  // Clear timeouts and intervals
  jest.clearAllTimers();
};
