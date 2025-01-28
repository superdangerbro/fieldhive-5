import { renderHook, act } from '@testing-library/react-hooks';
import { useVoiceAndBarcode } from '../../../mobile/src/hooks/useVoiceAndBarcode';
import { mockBarcodeScanner, mockVoiceRecognition } from '../../../jest/testUtils';
import { NLPProcessor } from '../../utils/nlpProcessor';

// Mock the NLP processor
jest.mock('../../utils/nlpProcessor');

describe('Voice and Barcode Integration', () => {
  let nlpProcessor;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockBarcodeScanner.onScan = null;
    mockVoiceRecognition.results = [];
    mockVoiceRecognition.onResult = null;
    mockVoiceRecognition.onError = null;

    // Set up NLP processor mock
    nlpProcessor = new NLPProcessor();
    nlpProcessor.processVoiceInput = jest.fn().mockImplementation(async (text) => ({
      condition: text.includes('good') ? 'good' : 
                text.includes('fair') ? 'fair' : 
                text.includes('poor') ? 'poor' : undefined,
      activityFound: text.includes('activity') || text.includes('active'),
      maintenanceNeeded: text.includes('maintenance') || text.includes('repair'),
      notes: text,
    }));
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useVoiceAndBarcode());

    expect(result.current).toMatchObject({
      isListening: false,
      isScanning: false,
      error: null,
      lastCommand: null,
      scannedCode: null,
    });
  });

  it('handles barcode scanning lifecycle', async () => {
    const { result } = renderHook(() => useVoiceAndBarcode());

    // Start scanning
    await act(async () => {
      result.current.startScanning();
    });

    expect(result.current.isScanning).toBe(true);
    expect(mockBarcodeScanner.scan).toHaveBeenCalled();

    // Simulate successful scan
    await act(async () => {
      mockBarcodeScanner.simulateScan('TRAP-123');
    });

    expect(result.current.scannedCode).toBe('TRAP-123');
    expect(result.current.isScanning).toBe(false);
  });

  it('handles voice recognition lifecycle', async () => {
    const { result } = renderHook(() => useVoiceAndBarcode());

    // Start listening
    await act(async () => {
      result.current.startListening();
    });

    expect(result.current.isListening).toBe(true);
    expect(mockVoiceRecognition.start).toHaveBeenCalled();

    // Simulate voice command
    await act(async () => {
      mockVoiceRecognition.simulateResult('condition is good');
    });

    expect(result.current.lastCommand).toBe('condition is good');
    expect(nlpProcessor.processVoiceInput).toHaveBeenCalledWith('condition is good');
  });

  it('coordinates barcode and voice for complete inspection', async () => {
    const onInspectionComplete = jest.fn();
    const { result } = renderHook(() => 
      useVoiceAndBarcode({ onInspectionComplete })
    );

    // Scan barcode first
    await act(async () => {
      result.current.startScanning();
      mockBarcodeScanner.simulateScan('TRAP-123');
    });

    expect(result.current.scannedCode).toBe('TRAP-123');

    // Then process voice commands
    await act(async () => {
      result.current.startListening();
      mockVoiceRecognition.simulateResult('condition is good');
      mockVoiceRecognition.simulateResult('no activity found');
    });

    expect(onInspectionComplete).toHaveBeenCalledWith({
      equipmentId: 'TRAP-123',
      condition: 'good',
      activityFound: false,
      notes: expect.any(String),
    });
  });

  it('handles errors gracefully', async () => {
    const { result } = renderHook(() => useVoiceAndBarcode());

    // Test barcode error
    await act(async () => {
      result.current.startScanning();
      mockBarcodeScanner.onScan({ error: 'Failed to scan' });
    });

    expect(result.current.error).toBe('Failed to scan');
    expect(result.current.isScanning).toBe(false);

    // Clear error and test voice error
    await act(async () => {
      result.current.clearError();
      result.current.startListening();
      mockVoiceRecognition.simulateError('No speech detected');
    });

    expect(result.current.error).toBe('No speech detected');
    expect(result.current.isListening).toBe(false);
  });

  it('handles concurrent operations safely', async () => {
    const { result } = renderHook(() => useVoiceAndBarcode());

    // Try to start both scanning and listening
    await act(async () => {
      result.current.startScanning();
      result.current.startListening();
    });

    // Only one should be active
    expect(result.current.isScanning).toBe(true);
    expect(result.current.isListening).toBe(false);

    // Complete scan and try voice
    await act(async () => {
      mockBarcodeScanner.simulateScan('TRAP-123');
      result.current.startListening();
    });

    expect(result.current.isScanning).toBe(false);
    expect(result.current.isListening).toBe(true);
  });

  it('maintains state between voice commands', async () => {
    const { result } = renderHook(() => useVoiceAndBarcode());

    await act(async () => {
      result.current.startScanning();
      mockBarcodeScanner.simulateScan('TRAP-123');
    });

    // Process multiple voice commands
    await act(async () => {
      result.current.startListening();
      mockVoiceRecognition.simulateResult('condition is good');
    });

    const firstState = result.current.inspectionData;

    await act(async () => {
      mockVoiceRecognition.simulateResult('found activity');
    });

    // Second command should add to, not replace, first command's data
    expect(result.current.inspectionData).toEqual({
      ...firstState,
      activityFound: true,
    });
  });

  it('supports manual override after voice input', async () => {
    const { result } = renderHook(() => useVoiceAndBarcode());

    // Process voice command
    await act(async () => {
      result.current.startScanning();
      mockBarcodeScanner.simulateScan('TRAP-123');
      result.current.startListening();
      mockVoiceRecognition.simulateResult('condition is good');
    });

    // Manually update data
    await act(async () => {
      result.current.updateInspectionData({
        condition: 'fair',
      });
    });

    expect(result.current.inspectionData.condition).toBe('fair');
  });

  it('handles AI service failures gracefully', async () => {
    const { result } = renderHook(() => useVoiceAndBarcode());

    // Mock AI service failure
    nlpProcessor.processVoiceInput.mockRejectedValueOnce(
      new Error('AI service unavailable')
    );

    await act(async () => {
      result.current.startScanning();
      mockBarcodeScanner.simulateScan('TRAP-123');
      result.current.startListening();
      mockVoiceRecognition.simulateResult('condition is good');
    });

    // Should still capture raw voice input
    expect(result.current.lastCommand).toBe('condition is good');
    expect(result.current.error).toBe('AI service unavailable');
    
    // Should still be able to continue with manual input
    await act(async () => {
      result.current.updateInspectionData({
        condition: 'good',
      });
    });

    expect(result.current.inspectionData.condition).toBe('good');
  });

  it('handles offline mode appropriately', async () => {
    const { result } = renderHook(() => useVoiceAndBarcode({ offlineMode: true }));

    await act(async () => {
      result.current.startScanning();
      mockBarcodeScanner.simulateScan('TRAP-123');
      result.current.startListening();
      mockVoiceRecognition.simulateResult('condition is good');
    });

    // Should use basic voice recognition instead of AI
    expect(nlpProcessor.processVoiceInput).not.toHaveBeenCalled();
    expect(result.current.inspectionData).toMatchObject({
      equipmentId: 'TRAP-123',
      condition: 'good',
      offlineCreated: expect.any(Date),
    });
  });
});
