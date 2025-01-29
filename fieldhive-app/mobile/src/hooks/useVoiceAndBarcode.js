import { useState, useCallback, useEffect } from 'react';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

const useVoiceAndBarcode = ({
  onBarcodeScanned,
  onVoiceResult,
  onError,
  voiceEnabled = true,
  autoAdvance = true
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);

  // Initialize voice recognition
  useEffect(() => {
    const initVoice = async () => {
      try {
        await Voice.destroy();
        Voice.onSpeechStart = () => setIsListening(true);
        Voice.onSpeechEnd = () => setIsListening(false);
        Voice.onSpeechResults = (event) => {
          if (event.value && event.value.length > 0) {
            handleVoiceResult(event.value[0]);
          }
        };
        Voice.onSpeechError = (event) => {
          handleError(new Error(event.error?.message || 'Speech recognition error'));
        };
      } catch (err) {
        handleError(err);
      }
    };

    if (voiceEnabled) {
      initVoice();
    }

    return () => {
      if (voiceEnabled) {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, [voiceEnabled]);

  // Handle voice result
  const handleVoiceResult = useCallback(async (result) => {
    try {
      await onVoiceResult?.(result);
      if (autoAdvance) {
        // Wait for any ongoing speech to finish
        await waitForSpeech();
        // Provide success feedback
        await speak('Got it. Next item.');
      }
    } catch (err) {
      handleError(err);
    }
  }, [onVoiceResult, autoAdvance]);

  // Handle barcode scan
  const handleBarcodeScan = useCallback(async ({ type, data }) => {
    try {
      await onBarcodeScanned?.({ type, data });
      // Wait for any ongoing speech to finish
      await waitForSpeech();
      // Provide success feedback
      await speak('Equipment found. Starting inspection.');
    } catch (err) {
      handleError(err);
    }
  }, [onBarcodeScanned]);

  // Handle errors
  const handleError = useCallback((err) => {
    setError(err);
    onError?.(err);
    speak(`Error: ${err.message}`);
  }, [onError]);

  // Start voice recognition
  const startListening = useCallback(async () => {
    try {
      if (!voiceEnabled) return;
      await Voice.start('en-US');
    } catch (err) {
      handleError(err);
    }
  }, [voiceEnabled]);

  // Stop voice recognition
  const stopListening = useCallback(async () => {
    try {
      if (!voiceEnabled) return;
      await Voice.stop();
    } catch (err) {
      handleError(err);
    }
  }, [voiceEnabled]);

  // Speak text and wait for completion
  const speak = useCallback(async (text) => {
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        language: 'en',
        pitch: 1,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onError: (err) => {
          setIsSpeaking(false);
          handleError(err);
        }
      });
    } catch (err) {
      setIsSpeaking(false);
      handleError(err);
    }
  }, []);

  // Wait for any ongoing speech to finish
  const waitForSpeech = useCallback(() => {
    return new Promise((resolve) => {
      if (!isSpeaking) {
        resolve();
        return;
      }

      const checkSpeaking = setInterval(() => {
        if (!isSpeaking) {
          clearInterval(checkSpeaking);
          resolve();
        }
      }, 100);
    });
  }, [isSpeaking]);

  return {
    isListening,
    isSpeaking,
    error,
    startListening,
    stopListening,
    handleBarcodeScan,
    speak,
    waitForSpeech
  };
};

export default useVoiceAndBarcode;
