import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import VoiceFormController from './VoiceFormController';
import SchemaManager from '../../../../shared/schemas/schemaManager';
import equipmentInspectionSchema from '../../../../shared/schemas/tests/equipmentInspection';
import {
  mockVoiceRecognition,
  mockBarcodeScanner,
  mockLocation,
  wait,
} from '../../../../jest/testUtils';

jest.mock('@react-native-voice/voice', () => mockVoiceRecognition);
jest.mock('expo-barcode-scanner', () => mockBarcodeScanner);
jest.mock('expo-location', () => mockLocation);

describe('VoiceFormController', () => {
  let form;
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockVoiceRecognition.results = [];
    SchemaManager.registerSchema('equipment-inspection', equipmentInspectionSchema);
    form = SchemaManager.createForm('equipment-inspection');
  });

  const renderComponent = (props = {}) => {
    return render(
      <VoiceFormController
        form={form}
        onSubmit={onSubmit}
        onCancel={onCancel}
        {...props}
      />
    );
  };

  describe('Voice Control', () => {
    it('should start voice recognition on mount', async () => {
      renderComponent();
      await wait(100);
      expect(mockVoiceRecognition.start).toHaveBeenCalled();
    });

    it('should handle navigation commands', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        mockVoiceRecognition.simulateResult('next');
        await wait(100);
      });

      const currentField = getByTestId('current-field');
      expect(currentField.props.fieldIndex).toBe(1);
    });

    it('should handle field value input', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        mockVoiceRecognition.simulateResult('condition is good');
        await wait(100);
      });

      const conditionField = getByTestId('field-condition');
      expect(conditionField.props.value).toBe('Good');
    });

    it('should provide voice feedback for errors', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        mockVoiceRecognition.simulateResult('invalid value');
        await wait(100);
      });

      const errorMessage = getByTestId('error-message');
      expect(errorMessage).toBeDefined();
    });
  });

  describe('Form Navigation', () => {
    it('should handle field focus changes', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        const field = getByTestId('field-barcode');
        fireEvent.press(field);
        await wait(100);
      });

      expect(getByTestId('current-field').props.name).toBe('barcode');
    });

    it('should validate fields before navigation', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        mockVoiceRecognition.simulateResult('next');
        await wait(100);
      });

      const errorMessage = getByTestId('error-message');
      expect(errorMessage).toBeDefined();
      expect(getByTestId('current-field').props.name).toBe('barcode');
    });
  });

  describe('Barcode Integration', () => {
    it('should handle barcode scan commands', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        mockVoiceRecognition.simulateResult('scan barcode');
        await wait(100);
        mockBarcodeScanner.simulateScan('TRAP-123');
        await wait(100);
      });

      const barcodeField = getByTestId('field-barcode');
      expect(barcodeField.props.value).toBe('TRAP-123');
    });

    it('should validate barcode format', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        mockVoiceRecognition.simulateResult('scan barcode');
        await wait(100);
        mockBarcodeScanner.simulateScan('invalid-format');
        await wait(100);
      });

      const errorMessage = getByTestId('error-message');
      expect(errorMessage).toBeDefined();
    });
  });

  describe('Form Submission', () => {
    it('should validate all fields before submission', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        mockVoiceRecognition.simulateResult('submit');
        await wait(100);
      });

      expect(onSubmit).not.toHaveBeenCalled();
      const errorMessage = getByTestId('error-message');
      expect(errorMessage).toBeDefined();
    });

    it('should submit form with valid data', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        // Fill required fields
        form.setFieldValue('barcode', 'TRAP-123');
        form.setFieldValue('equipmentType', 'Trap');
        form.setFieldValue('location', {
          latitude: 37.7749,
          longitude: -122.4194,
        });

        mockVoiceRecognition.simulateResult('submit');
        await wait(100);
      });

      expect(onSubmit).toHaveBeenCalled();
      const submittedData = onSubmit.mock.calls[0][0];
      expect(submittedData.barcode).toBe('TRAP-123');
    });
  });

  describe('Error Recovery', () => {
    it('should allow correction of invalid input', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        // First, provide invalid input
        mockVoiceRecognition.simulateResult('invalid value');
        await wait(100);

        // Then, correct it
        mockVoiceRecognition.simulateResult('correction: good');
        await wait(100);
      });

      const conditionField = getByTestId('field-condition');
      expect(conditionField.props.value).toBe('Good');
    });

    it('should handle voice recognition errors', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        mockVoiceRecognition.simulateError('Voice recognition error');
        await wait(100);
      });

      const errorMessage = getByTestId('error-message');
      expect(errorMessage).toBeDefined();

      // Should auto-restart voice recognition
      expect(mockVoiceRecognition.start).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('should provide voice feedback for field changes', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        const field = getByTestId('field-condition');
        fireEvent.press(field);
        await wait(100);
      });

      const feedback = getByTestId('voice-feedback');
      expect(feedback.props.message).toContain('condition');
    });

    it('should announce validation errors', async () => {
      const { getByTestId } = renderComponent();

      await act(async () => {
        mockVoiceRecognition.simulateResult('submit');
        await wait(100);
      });

      const feedback = getByTestId('voice-feedback');
      expect(feedback.props.message).toContain('required');
    });
  });
});
