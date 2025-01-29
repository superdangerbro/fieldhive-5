import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  Animated,
  Easing
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';

const VoiceInput = ({
  onSpeechResult,
  onSpeechError,
  onSpeechStart,
  onSpeechEnd,
  isListening,
  prompt
}) => {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Voice.onSpeechStart = () => {
      onSpeechStart?.();
    };

    Voice.onSpeechEnd = () => {
      onSpeechEnd?.();
    };

    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        onSpeechResult?.(event.value[0]);
      }
    };

    Voice.onSpeechError = (error) => {
      onSpeechError?.(error);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      onSpeechError?.(error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  return (
    <View style={styles.container}>
      {prompt && (
        <Text style={styles.prompt}>{prompt}</Text>
      )}
      <Animated.View
        style={[
          styles.pulseContainer,
          {
            transform: [{ scale: pulseAnim }],
            opacity: isListening ? 0.2 : 0
          }
        ]}
      />
      <TouchableOpacity
        style={[
          styles.button,
          isListening && styles.buttonListening
        ]}
        onPress={isListening ? stopListening : startListening}
      >
        <MaterialIcons
          name={isListening ? 'mic' : 'mic-none'}
          size={24}
          color={isListening ? '#fff' : '#666'}
        />
      </TouchableOpacity>
      {isListening && (
        <Text style={styles.listeningText}>Listening...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  pulseContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonListening: {
    backgroundColor: '#007AFF',
  },
  prompt: {
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  listeningText: {
    marginTop: 8,
    fontSize: 14,
    color: '#007AFF',
  }
});

export default VoiceInput;
