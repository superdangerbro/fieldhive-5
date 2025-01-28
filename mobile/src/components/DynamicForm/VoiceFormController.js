import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Vibration,
  Platform
} from 'react-native';
import VoiceInput from './VoiceInput';
import * as Speech from 'expo-speech';
import { processCommand, processFieldCommand } from '../../../shared/utils/nlpProcessor';

const VoiceFormController = ({
  fields,
  currentField,
  onFieldChange,
  onNextField,
  onPreviousField,
  onSubmit,
  onCancel,
  disabled
}) => {
  const [isListening, setIsListening] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [lastCommand, setLastCommand] = useState(null);

  // Generate prompt for current field
  useEffect(() => {
    if (!currentField) return;

    let fieldPrompt = `Please provide ${currentField.label || currentField.name}`;
    
    // Add field-specific instructions
    switch (currentField.type) {
      case 'boolean':
        fieldPrompt += '. Say yes or no';
        break;
      case 'enum':
        if (currentField.options) {
          fieldPrompt += `. Options are: ${currentField.options.join(', ')}`;
        }
        break;
      case 'date':
        fieldPrompt += '. You can say today, tomorrow, or a specific date';
        break;
      case 'number':
        fieldPrompt += '. Say a number';
        break;
    }

    // Add field description if available
    if (currentField.description) {
      fieldPrompt += `. ${currentField.description}`;
    }

    setPrompt(fieldPrompt);

    // Speak the prompt if not disabled
    if (!disabled) {
      Speech.speak(fieldPrompt, {
        language: 'en',
        pitch: 1,
        rate: 0.9,
      });
    }
  }, [currentField, disabled]);

  // Handle voice commands
  const handleVoiceResult = useCallback(async (result) => {
    if (!currentField || disabled) return;

    // Process the voice input
    const command = processCommand(result);
    setLastCommand(command);

    // Provide haptic feedback
    if (Platform.OS === 'ios') {
      Vibration.vibrate([0, 30]);
    } else {
      Vibration.vibrate(30);
    }

    try {
      switch (command.type) {
        case 'navigation':
          if (command.action === 'next') {
            await Speech.speak('Next field');
            onNextField?.();
          } else if (command.action === 'previous') {
            await Speech.speak('Previous field');
            onPreviousField?.();
          }
          break;

        case 'form':
          if (command.action === 'submit') {
            await Speech.speak('Submitting form');
            onSubmit?.();
          } else if (command.action === 'cancel') {
            await Speech.speak('Canceling');
            onCancel?.();
          }
          break;

        case 'field':
          if (command.action === 'clear') {
            onFieldChange?.(currentField.name, null);
            await Speech.speak('Field cleared');
          } else if (command.action === 'set') {
            const fieldCommand = processFieldCommand(command.value, currentField);
            if (fieldCommand.type === 'value' && fieldCommand.value !== null) {
              onFieldChange?.(currentField.name, fieldCommand.value);
              await Speech.speak('Value set');
            } else {
              await Speech.speak('Invalid value');
            }
          }
          break;

        case 'value':
          const fieldCommand = processFieldCommand(command.value, currentField);
          if (fieldCommand.type === 'value' && fieldCommand.value !== null) {
            onFieldChange?.(currentField.name, fieldCommand.value);
            await Speech.speak('Got it');
            // Auto-advance after successful value entry
            setTimeout(() => {
              onNextField?.();
            }, 1000);
          } else {
            await Speech.speak('Sorry, I didn\'t understand that value');
          }
          break;
      }
    } catch (error) {
      console.error('Error handling voice command:', error);
      Speech.speak('Sorry, there was an error processing your command');
    }
  }, [currentField, disabled, onFieldChange, onNextField, onPreviousField, onSubmit, onCancel]);

  const handleSpeechStart = () => {
    setIsListening(true);
  };

  const handleSpeechEnd = () => {
    setIsListening(false);
  };

  const handleSpeechError = (error) => {
    console.error('Speech recognition error:', error);
    setIsListening(false);

    // Provide error feedback
    Vibration.vibrate([0, 50, 0, 50]);
    Speech.speak('Sorry, I didn\'t catch that. Please try again.', {
      language: 'en',
      pitch: 1,
      rate: 0.9,
    });
  };

  if (!currentField || disabled) return null;

  return (
    <View style={styles.container}>
      <VoiceInput
        prompt={prompt}
        isListening={isListening}
        onSpeechStart={handleSpeechStart}
        onSpeechEnd={handleSpeechEnd}
        onSpeechResult={handleVoiceResult}
        onSpeechError={handleSpeechError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Account for bottom safe area
  }
});

export default VoiceFormController;
