import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import EquipmentInspection from './index';
import { mockBarcodeScanner, mockVoiceRecognition } from '../../../../jest/testUtils';
import { NLPProcessor } from '../../../shared/utils/nlpProcessor';

// Mock the NLP processor
jest.mock('../../../shared/utils/nlpProcessor', () => ({
  NLPProcessor: jest.fn().mockImplementation(() => ({
    processVoiceInput: jest.fn().mockImplementation(async (text) => {
      // Simple mock implementation for testing
      const result = {
        condition: text.includes('good') ? 'good' : 
                  text.includes('fair') ? 'fair' : 
                  text.includes('poor') ? 'poor' : undefined,
        activityFound: text.includes('activity') || text.includes('active'),
        maintenanceNeeded: text.includes('maintenance') || text.includes('repair'),
        notes: text,
      };
      return result;
    }),
  })),
}));

describe('EquipmentInspection', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockBarcodeScanner.onScan = null;
    mockVoiceRecognition.results = [];
    mockVoiceRecognition.onResult = null;
    mockVoiceRecognition.onError = null;
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<EquipmentInspection />);
    expect(getByTestId('equipment-inspection')).toBeOnScreen();
  });

  it('starts barcode scanning when mounted', () => {
    render(<EquipmentInspection />);
    expect(mockBarcodeScanner.scan).toHaveBeenCalled();
  });

  it('handles barcode scan results', async () => {
    const { getByTestId } = render(<EquipmentInspection />);
    
    await act(async () => {
      mockBarcodeScanner.simulateScan('TRAP-123');
    });

    expect(getByTestId('inspection-form')).toBeOnScreen();
    expect(getByTestId('equipment-id')).toHaveTextContent('TRAP-123');
  });

  it('processes voice commands correctly', async () => {
    const { getByTestId } = render(<EquipmentInspection />);
    
    // First scan a barcode to open the form
    await act(async () => {
      mockBarcodeScanner.simulateScan('TRAP-123');
    });

    // Simulate voice commands
    await act(async () => {
      mockVoiceRecognition.simulateResult('the trap is in good condition');
      mockVoiceRecognition.simulateResult('no activity found');
      mockVoiceRecognition.simulateResult('no maintenance needed');
    });

    // Check that the form was filled out correctly
    expect(getByTestId('condition-field')).toHaveTextContent('good');
    expect(getByTestId('activity-field')).toHaveTextContent('No');
    expect(getByTestId('maintenance-field')).toHaveTextContent('No');
  });

  it('handles voice recognition errors gracefully', async () => {
    const { getByTestId } = render(<EquipmentInspection />);
    
    await act(async () => {
      mockBarcodeScanner.simulateScan('TRAP-123');
    });

    await act(async () => {
      mockVoiceRecognition.simulateError('No speech detected');
    });

    expect(getByTestId('error-message')).toBeOnScreen();
    expect(getByTestId('error-message')).toHaveTextContent('No speech detected');
  });

  it('submits the form with correct data', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId } = render(
      <EquipmentInspection onSubmit={handleSubmit} />
    );
    
    // Scan barcode
    await act(async () => {
      mockBarcodeScanner.simulateScan('TRAP-123');
    });

    // Fill form with voice commands
    await act(async () => {
      mockVoiceRecognition.simulateResult('trap is in good condition');
      mockVoiceRecognition.simulateResult('no activity found');
      mockVoiceRecognition.simulateResult('no maintenance needed');
    });

    // Submit form
    await act(async () => {
      fireEvent.press(getByTestId('submit-button'));
    });

    // Verify submission
    expect(handleSubmit).toHaveBeenCalledWith({
      equipmentId: 'TRAP-123',
      condition: 'good',
      activityFound: false,
      maintenanceNeeded: false,
      notes: expect.any(String),
      timestamp: expect.any(Date),
    });
  });

  it('handles AI processing failure gracefully', async () => {
    // Mock AI service failure
    const nlpProcessor = new NLPProcessor();
    nlpProcessor.processVoiceInput.mockRejectedValueOnce(
      new Error('AI service unavailable')
    );

    const { getByTestId } = render(<EquipmentInspection />);
    
    await act(async () => {
      mockBarcodeScanner.simulateScan('TRAP-123');
    });

    await act(async () => {
      mockVoiceRecognition.simulateResult('trap is in good condition');
    });

    // Should show error but not crash
    expect(getByTestId('error-message')).toBeOnScreen();
    expect(getByTestId('error-message')).toHaveTextContent('AI service unavailable');
    
    // Form should still be usable
    expect(getByTestId('inspection-form')).toBeOnScreen();
  });

  it('supports manual form editing', async () => {
    const { getByTestId } = render(<EquipmentInspection />);
    
    await act(async () => {
      mockBarcodeScanner.simulateScan('TRAP-123');
    });

    // Test manual condition selection
    await act(async () => {
      fireEvent.press(getByTestId('condition-good'));
    });
    expect(getByTestId('condition-field')).toHaveTextContent('good');

    // Test activity toggle
    await act(async () => {
      fireEvent.press(getByTestId('activity-toggle'));
    });
    expect(getByTestId('activity-field')).toHaveTextContent('Yes');

    // Test maintenance toggle
    await act(async () => {
      fireEvent.press(getByTestId('maintenance-toggle'));
    });
    expect(getByTestId('maintenance-field')).toHaveTextContent('Yes');
  });

  it('saves inspection data locally when offline', async () => {
    const mockSaveOffline = jest.fn();
    const { getByTestId } = render(
      <EquipmentInspection saveOffline={mockSaveOffline} />
    );
    
    // Simulate being offline
    global.navigator.onLine = false;

    await act(async () => {
      mockBarcodeScanner.simulateScan('TRAP-123');
      mockVoiceRecognition.simulateResult('good condition no activity');
      fireEvent.press(getByTestId('submit-button'));
    });

    expect(mockSaveOffline).toHaveBeenCalledWith(
      expect.objectContaining({
        equipmentId: 'TRAP-123',
        condition: 'good',
        activityFound: false,
        offlineCreated: expect.any(Date),
      })
    );
  });
});
