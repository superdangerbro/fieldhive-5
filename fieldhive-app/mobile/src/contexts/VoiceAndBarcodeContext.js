import React, { createContext, useContext, useState, useCallback } from 'react';
import useVoiceAndBarcode from '../hooks/useVoiceAndBarcode';
import * as Speech from 'expo-speech';

const VoiceAndBarcodeContext = createContext(null);

export const VoiceAndBarcodeProvider = ({ children }) => {
  const [activeScanner, setActiveScanner] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [globalVoiceEnabled, setGlobalVoiceEnabled] = useState(true);

  const {
    isListening,
    isSpeaking,
    error,
    startListening,
    stopListening,
    handleBarcodeScan,
    speak,
    waitForSpeech
  } = useVoiceAndBarcode({
    onBarcodeScanned: async (data) => {
      if (!activeScanner) return;
      await activeScanner.onScan(data);
    },
    onVoiceResult: async (result) => {
      if (!activeForm) return;
      await activeForm.onVoiceInput(result);
    },
    onError: async (err) => {
      console.error('Voice/Barcode Error:', err);
      if (activeForm?.onError) {
        activeForm.onError(err);
      } else if (activeScanner?.onError) {
        activeScanner.onError(err);
      }
    },
    voiceEnabled: globalVoiceEnabled
  });

  // Register a barcode scanner
  const registerScanner = useCallback((handlers) => {
    setActiveScanner(handlers);
    return () => setActiveScanner(null);
  }, []);

  // Register a form for voice input
  const registerForm = useCallback((handlers) => {
    setActiveForm(handlers);
    return () => setActiveForm(null);
  }, []);

  // Toggle global voice control
  const toggleVoice = useCallback(async () => {
    const newState = !globalVoiceEnabled;
    setGlobalVoiceEnabled(newState);
    
    if (newState) {
      await Speech.speak('Voice control enabled', {
        language: 'en',
        pitch: 1,
        rate: 0.9
      });
    } else {
      await Speech.speak('Voice control disabled', {
        language: 'en',
        pitch: 1,
        rate: 0.9
      });
      await stopListening();
    }
  }, [globalVoiceEnabled, stopListening]);

  // Announce a message using text-to-speech
  const announce = useCallback(async (message, options = {}) => {
    if (!globalVoiceEnabled) return;

    await waitForSpeech(); // Wait for any current speech to finish
    await speak(message, options);
  }, [globalVoiceEnabled, waitForSpeech, speak]);

  const value = {
    // Voice state
    isListening,
    isSpeaking,
    error,
    voiceEnabled: globalVoiceEnabled,

    // Voice controls
    startListening,
    stopListening,
    toggleVoice,
    announce,

    // Registration
    registerScanner,
    registerForm,

    // Direct handlers
    handleBarcodeScan,
    speak,
    waitForSpeech
  };

  return (
    <VoiceAndBarcodeContext.Provider value={value}>
      {children}
    </VoiceAndBarcodeContext.Provider>
  );
};

// Custom hook to use the voice and barcode context
export const useVoiceAndBarcodeContext = () => {
  const context = useContext(VoiceAndBarcodeContext);
  if (!context) {
    throw new Error(
      'useVoiceAndBarcodeContext must be used within a VoiceAndBarcodeProvider'
    );
  }
  return context;
};

// HOC to wrap components that need voice and barcode functionality
export const withVoiceAndBarcode = (WrappedComponent) => {
  return function WithVoiceAndBarcodeComponent(props) {
    const voiceAndBarcode = useVoiceAndBarcodeContext();
    return <WrappedComponent {...props} voiceAndBarcode={voiceAndBarcode} />;
  };
};

// Example usage:
/*
// In App.js
import { VoiceAndBarcodeProvider } from './contexts/VoiceAndBarcodeContext';

export default function App() {
  return (
    <VoiceAndBarcodeProvider>
      <Navigation />
    </VoiceAndBarcodeProvider>
  );
}

// In a component
import { useVoiceAndBarcodeContext } from './contexts/VoiceAndBarcodeContext';

function MyComponent() {
  const {
    isListening,
    startListening,
    stopListening,
    announce
  } = useVoiceAndBarcodeContext();

  // Use the context...
}

// Or using the HOC
import { withVoiceAndBarcode } from './contexts/VoiceAndBarcodeContext';

function MyComponent({ voiceAndBarcode }) {
  const { isListening, startListening } = voiceAndBarcode;
  // Use the props...
}

export default withVoiceAndBarcode(MyComponent);
*/
