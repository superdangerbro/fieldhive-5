import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import TestInspection from './TestInspection';
import SchemaManager from '../../../shared/schemas/schemaManager';
import equipmentInspectionSchema from '../../../shared/schemas/tests/equipmentInspection';
import {
  mockVoiceRecognition,
  mockBarcodeScanner,
  mockLocation,
  mockStorage,
  mockFirebaseData,
  wait,
} from '../../../jest/testUtils';
import { VoiceAndBarcodeProvider } from '../contexts/VoiceAndBarcodeContext';

// Mock all required modules
jest.mock('@react-native-voice/voice', () => mockVoiceRecognition);
jest.mock('expo-barcode-scanner', () => mockBarcodeScanner);
jest.mock('expo-location', () => mockLocation);
jest.mock('@react-native-async-storage/async-storage', () => mockStorage);
jest.mock('firebase/firestore', () => mockFirebaseData);
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

describe('TestInspection Screen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockVoiceRecognition.results = [];
    SchemaManager.registerSchema('equipment-inspection', equipmentInspectionSchema);
  });

  const renderScreen = (props = {}) => {
    return render(
      <VoiceAndBarcodeProvider>
        <TestInspection
          navigation={mockNavigation}
          {...props}
        />
      </VoiceAndBarcodeProvider>
    );
  };

  describe('Screen Initialization', () => {
    it('should render initial instructions', () => {
      const { getByTestId, getByText } = renderScreen();
      expect(getByTestId('instructions')).toBeDefined();
      expect(getByText(/scan a barcode/i)).toBeDefined();
    });

    it('should initialize voice control', async () => {
      renderScreen();
      await wait(100);
      expect(mockVoiceRecognition.start).toHaveBeenCalled();
    });

    it('should request necessary permissions', async () => {
      renderScreen();
      await wait(100);
      expect(mockBarcodeScanner.requestPermissionsAsync).toHaveBeenCalled();
      expect(mockLocation.requestForegroundPermissionsAsync).toHaveBeenCalled();
    });
  });

  describe('Complete Inspection Workflow', () => {
    it('should complete a full inspection using voice and barcode', async () => {
      const { getByTestId, queryByTestId } = renderScreen();

      // Step 1: Start inspection with voice command
      await act(async () => {
        mockVoiceRecognition.simulateResult('start inspection');
        await wait(100);
      });
      expect(getByTestId('scanner-active')).toBeDefined();

      // Step 2: Scan barcode
      await act(async () => {
        mockBarcodeScanner.simulateScan('TRAP-123');
        await wait(100);
      });
      expect(getByTestId('field-barcode').props.value).toBe('TRAP-123');

      // Step 3: Get location
      await act(async () => {
        mockLocation.simulateLocation({
          latitude: 37.7749,
          longitude: -122.4194,
        });
        await wait(100);
      });

      // Step 4: Fill out inspection form using voice
      await act(async () => {
        // Equipment condition
        mockVoiceRecognition.simulateResult('condition is good');
        await wait(100);
        expect(getByTestId('field-condition').props.value).toBe('Good');

        // Activity check
        mockVoiceRecognition.simulateResult('no activity found');
        await wait(100);
        expect(getByTestId('field-activityFound').props.value).toBe(false);

        // Maintenance check
        mockVoiceRecognition.simulateResult('no maintenance needed');
        await wait(100);
        expect(getByTestId('field-maintenanceNeeded').props.value).toBe(false);

        // Add notes
        mockVoiceRecognition.simulateResult('add note regular inspection completed');
        await wait(100);
        expect(getByTestId('field-notes').props.value).toBe('regular inspection completed');
      });

      // Step 5: Submit form
      await act(async () => {
        mockVoiceRecognition.simulateResult('submit');
        await wait(100);
      });

      // Verify form submission
      expect(mockFirebaseData.collection).toHaveBeenCalledWith('inspections');
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('should handle offline workflow', async () => {
      const { getByTestId } = renderScreen();

      // Simulate offline state
      mockFirebaseData.collection = jest.fn().mockImplementation(() => {
        throw new Error('Network error');
      });

      // Complete inspection workflow
      await act(async () => {
        // Scan barcode
        mockBarcodeScanner.simulateScan('TRAP-123');
        await wait(100);

        // Get location
        mockLocation.simulateLocation({
          latitude: 37.7749,
          longitude: -122.4194,
        });
        await wait(100);

        // Fill form
        mockVoiceRecognition.simulateResult('condition is good');
        await wait(100);

        // Submit
        mockVoiceRecognition.simulateResult('submit');
        await wait(100);
      });

      // Verify offline storage
      expect(mockStorage.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(mockStorage.data.get('pending-inspections'));
      expect(savedData[0].barcode).toBe('TRAP-123');

      // Simulate coming back online
      mockFirebaseData.collection = jest.fn().mockReturnValue({
        add: jest.fn().mockResolvedValue({ id: 'new-inspection' }),
      });

      // Verify sync
      await act(async () => {
        await wait(100);
      });
      expect(mockStorage.data.get('pending-inspections')).toBe('[]');
    });
  });

  describe('Error Handling', () => {
    it('should handle voice recognition errors', async () => {
      const { getByTestId } = renderScreen();

      await act(async () => {
        mockVoiceRecognition.simulateError('Voice recognition error');
        await wait(100);
      });

      expect(getByTestId('error-message')).toBeDefined();
      expect(mockVoiceRecognition.start).toHaveBeenCalledTimes(2); // Auto-restart
    });

    it('should handle invalid barcode format', async () => {
      const { getByTestId } = renderScreen();

      await act(async () => {
        mockBarcodeScanner.simulateScan('invalid-format');
        await wait(100);
      });

      expect(getByTestId('error-message')).toBeDefined();
    });

    it('should handle location errors', async () => {
      const { getByTestId } = renderScreen();

      mockLocation.getCurrentPosition.mockImplementation((_, error) => 
        error(new Error('Location error'))
      );

      await act(async () => {
        mockBarcodeScanner.simulateScan('TRAP-123');
        await wait(100);
      });

      expect(getByTestId('error-message')).toBeDefined();
    });

    it('should handle form validation errors', async () => {
      const { getByTestId } = renderScreen();

      await act(async () => {
        // Try to submit without required fields
        mockVoiceRecognition.simulateResult('submit');
        await wait(100);
      });

      expect(getByTestId('error-message')).toBeDefined();
    });
  });

  describe('Voice Feedback', () => {
    it('should provide step-by-step guidance', async () => {
      const { getByTestId } = renderScreen();

      await act(async () => {
        mockBarcodeScanner.simulateScan('TRAP-123');
        await wait(100);
      });

      const feedback = getByTestId('voice-feedback');
      expect(feedback.props.message).toContain('condition');
    });

    it('should confirm actions', async () => {
      const { getByTestId } = renderScreen();

      await act(async () => {
        mockVoiceRecognition.simulateResult('condition is good');
        await wait(100);
      });

      const feedback = getByTestId('voice-feedback');
      expect(feedback.props.message).toContain('recorded');
    });

    it('should announce errors', async () => {
      const { getByTestId } = renderScreen();

      await act(async () => {
        mockVoiceRecognition.simulateResult('invalid command');
        await wait(100);
      });

      const feedback = getByTestId('voice-feedback');
      expect(feedback.props.message).toContain('error');
    });
  });
});
