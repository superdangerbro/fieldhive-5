import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BarcodeScanner from '../BarcodeScanner';
import DynamicForm from '../DynamicForm';
import { useVoiceAndBarcodeContext } from '../../contexts/VoiceAndBarcodeContext';
import { processCommand } from '../../../shared/utils/nlpProcessor';

const EquipmentInspection = ({
  onComplete,
  onCancel,
  getEquipmentSchema,
  saveInspection,
  getLastInspection
}) => {
  const [scannerVisible, setScannerVisible] = useState(true);
  const [equipment, setEquipment] = useState(null);
  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    isListening,
    isSpeaking,
    error,
    voiceEnabled,
    startListening,
    stopListening,
    registerScanner,
    registerForm,
    announce
  } = useVoiceAndBarcodeContext();

  // Register scanner handlers
  useEffect(() => {
    if (!scannerVisible) return;

    return registerScanner({
      onScan: async ({ data }) => {
        setLoading(true);
        try {
          // Get equipment schema and last inspection
          const schema = await getEquipmentSchema(data);
          if (!schema) {
            throw new Error('Equipment not found');
          }

          const lastInspection = await getLastInspection(data);

          // Set up initial inspection data
          const initialData = {
            equipmentId: data,
            timestamp: new Date(),
            ...lastInspection // Pre-fill with last inspection data if available
          };

          setEquipment({
            id: data,
            schema
          });
          setInspectionData(initialData);
          setScannerVisible(false);

          await announce(`Starting inspection for ${schema.name}`);
        } catch (err) {
          await announce(`Error: ${err.message}`);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      onError: async (err) => {
        console.error('Scanner Error:', err);
        await announce(`Error: ${err.message}`);
      }
    });
  }, [scannerVisible, registerScanner, getEquipmentSchema, getLastInspection, announce]);

  // Register form handlers
  useEffect(() => {
    if (!equipment) return;

    return registerForm({
      onVoiceInput: async (result) => {
        const command = processCommand(result);

        switch (command.type) {
          case 'form':
            if (command.action === 'submit') {
              await handleSubmit();
            } else if (command.action === 'cancel') {
              onCancel?.();
            }
            break;

          case 'navigation':
            if (command.action === 'scan') {
              setScannerVisible(true);
            }
            break;
        }
      },
      onError: async (err) => {
        console.error('Form Error:', err);
        await announce(`Error: ${err.message}`);
      }
    });
  }, [equipment, registerForm, announce]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await saveInspection({
        ...inspectionData,
        equipmentId: equipment.id,
        timestamp: new Date()
      });
      await announce('Inspection completed successfully');
      onComplete?.();
    } catch (err) {
      await announce(`Error saving inspection: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onCancel}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {equipment ? 'Equipment Inspection' : 'Scan Equipment'}
        </Text>
        {equipment && (
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.iconButton, isListening && styles.iconButtonActive]}
              onPress={isListening ? stopListening : startListening}
              disabled={!voiceEnabled}
            >
              <MaterialIcons
                name={isListening ? 'mic' : 'mic-none'}
                size={24}
                color={voiceEnabled ? '#fff' : '#666'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setScannerVisible(true)}
            >
              <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : equipment ? (
        <View style={styles.formContainer}>
          <DynamicForm
            schema={equipment.schema}
            initialData={inspectionData}
            onDataChange={setInspectionData}
            onSubmit={handleSubmit}
            disabled={loading}
            voiceEnabled={voiceEnabled && isListening}
          />
        </View>
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Scan equipment barcode to begin inspection
          </Text>
          {isSpeaking && (
            <Text style={styles.submessage}>
              Listening for voice commands...
            </Text>
          )}
        </View>
      )}

      {/* Scanner Modal */}
      <Modal
        visible={scannerVisible}
        animationType="slide"
        onRequestClose={() => {
          if (equipment) {
            setScannerVisible(false);
          } else {
            onCancel?.();
          }
        }}
      >
        <BarcodeScanner
          onClose={() => {
            if (equipment) {
              setScannerVisible(false);
            } else {
              onCancel?.();
            }
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  iconButtonActive: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  errorContainer: {
    backgroundColor: '#ff3b30',
    padding: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  submessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  }
});

export default EquipmentInspection;
