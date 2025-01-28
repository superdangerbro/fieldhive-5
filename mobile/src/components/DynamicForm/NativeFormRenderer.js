import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import DatePickerModal from './DatePickerModal';
import VoiceFormController from './VoiceFormController';

const NativeFormRenderer = ({
  schema,
  fields,
  formState,
  disabled,
  readOnly
}) => {
  const [datePickerField, setDatePickerField] = useState(null);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const visibleFields = fields.filter(field => !field.hidden);
  const currentField = visibleFields[currentFieldIndex];

  const scrollToField = (index) => {
    if (scrollViewRef.current && visibleFields[index]) {
      scrollViewRef.current.scrollTo({
        y: index * 100, // Approximate field height
        animated: true
      });
    }
  };

  const handleNextField = () => {
    if (currentFieldIndex < visibleFields.length - 1) {
      setCurrentFieldIndex(currentFieldIndex + 1);
      scrollToField(currentFieldIndex + 1);
    }
  };

  const handlePreviousField = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(currentFieldIndex - 1);
      scrollToField(currentFieldIndex - 1);
    }
  };

  const renderField = (field) => {
    const commonStyles = [
      styles.fieldContainer,
      field.error && styles.fieldError,
      field === currentField && voiceModeEnabled && styles.activeField
    ];

    const renderLabel = () => (
      <Text style={[styles.label, field.required && styles.required]}>
        {field.label || field.name}
      </Text>
    );

    const renderError = () => (
      field.error && <Text style={styles.errorText}>{field.error}</Text>
    );

    const renderDescription = () => (
      field.description && <Text style={styles.description}>{field.description}</Text>
    );

    switch (field.type) {
      case 'string':
        return (
          <View style={commonStyles}>
            {renderLabel()}
            <TextInput
              style={[styles.input, field.multiline && styles.multilineInput]}
              value={field.value || ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              multiline={field.multiline}
              numberOfLines={field.multiline ? (field.rows || 3) : 1}
              editable={!field.disabled && !disabled && !readOnly}
              placeholder={field.placeholder}
            />
            {renderError()}
            {renderDescription()}
          </View>
        );

      case 'number':
        return (
          <View style={commonStyles}>
            {renderLabel()}
            <TextInput
              style={styles.input}
              value={String(field.value || '')}
              onChangeText={(text) => {
                const num = parseFloat(text);
                field.onChange(isNaN(num) ? '' : num);
              }}
              onBlur={field.onBlur}
              keyboardType="numeric"
              editable={!field.disabled && !disabled && !readOnly}
            />
            {renderError()}
            {renderDescription()}
          </View>
        );

      case 'boolean':
        return (
          <View style={commonStyles}>
            <View style={styles.switchContainer}>
              {renderLabel()}
              <Switch
                value={Boolean(field.value)}
                onValueChange={field.onChange}
                disabled={field.disabled || disabled || readOnly}
              />
            </View>
            {renderError()}
            {renderDescription()}
          </View>
        );

      case 'date':
      case 'timestamp':
        return (
          <View style={commonStyles}>
            {renderLabel()}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => {
                if (!field.disabled && !disabled && !readOnly) {
                  setDatePickerField({
                    ...field,
                    mode: field.type === 'date' ? 'date' : 'datetime'
                  });
                }
              }}
            >
              <Text style={styles.datePickerText}>
                {field.value ? new Date(field.value).toLocaleString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {renderError()}
            {renderDescription()}
          </View>
        );

      case 'enum':
        return (
          <View style={commonStyles}>
            {renderLabel()}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={field.value || ''}
                onValueChange={field.onChange}
                enabled={!field.disabled && !disabled && !readOnly}
              >
                <Picker.Item label="Select..." value="" />
                {field.options?.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
            {renderError()}
            {renderDescription()}
          </View>
        );

      case 'geolocation':
        return (
          <View style={commonStyles}>
            {renderLabel()}
            <View style={styles.geolocationContainer}>
              <TextInput
                style={[styles.input, styles.geolocationInput]}
                value={field.value?.latitude ? String(field.value.latitude) : ''}
                placeholder="Latitude"
                keyboardType="numeric"
                editable={!field.disabled && !disabled && !readOnly}
                onChangeText={(text) => {
                  const lat = parseFloat(text);
                  field.onChange({
                    ...field.value,
                    latitude: isNaN(lat) ? '' : lat
                  });
                }}
              />
              <TextInput
                style={[styles.input, styles.geolocationInput]}
                value={field.value?.longitude ? String(field.value.longitude) : ''}
                placeholder="Longitude"
                keyboardType="numeric"
                editable={!field.disabled && !disabled && !readOnly}
                onChangeText={(text) => {
                  const lng = parseFloat(text);
                  field.onChange({
                    ...field.value,
                    longitude: isNaN(lng) ? '' : lng
                  });
                }}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={async () => {
                  if (field.disabled || disabled || readOnly) return;
                  try {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                      throw new Error('Location permission denied');
                    }
                    const location = await Location.getCurrentPositionAsync({});
                    field.onChange({
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude
                    });
                  } catch (error) {
                    console.error('Error getting location:', error);
                  }
                }}
              >
                <MaterialIcons name="my-location" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {renderError()}
            {renderDescription()}
          </View>
        );

      case 'file':
      case 'image':
        return (
          <View style={commonStyles}>
            {renderLabel()}
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={async () => {
                if (field.disabled || disabled || readOnly) return;
                try {
                  if (field.type === 'image') {
                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      allowsEditing: true,
                      quality: 1,
                    });
                    if (!result.canceled) {
                      field.onChange(result.assets[0]);
                    }
                  } else {
                    const result = await DocumentPicker.getDocumentAsync({});
                    if (result.type === 'success') {
                      field.onChange(result);
                    }
                  }
                } catch (error) {
                  console.error('Error picking file:', error);
                }
              }}
            >
              <MaterialIcons
                name={field.type === 'image' ? 'image' : 'upload-file'}
                size={24}
                color="#666"
              />
              <Text style={styles.uploadButtonText}>
                {field.value?.name || `Upload ${field.type === 'image' ? 'Image' : 'File'}`}
              </Text>
            </TouchableOpacity>
            {renderError()}
            {renderDescription()}
          </View>
        );

      default:
        return (
          <View style={commonStyles}>
            <Text style={styles.errorText}>
              Unsupported field type: {field.type}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{schema.name}</Text>
        <TouchableOpacity
          style={styles.voiceModeButton}
          onPress={() => setVoiceModeEnabled(!voiceModeEnabled)}
        >
          <MaterialIcons
            name={voiceModeEnabled ? 'mic' : 'mic-off'}
            size={24}
            color={voiceModeEnabled ? '#007AFF' : '#666'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        {fields.map((field) => (
          <View key={field.name}>
            {renderField(field)}
          </View>
        ))}
      </ScrollView>

      {datePickerField && (
        <DatePickerModal
          visible={true}
          value={datePickerField.value ? new Date(datePickerField.value) : new Date()}
          mode={datePickerField.mode}
          onClose={() => setDatePickerField(null)}
          onSelect={(date) => {
            datePickerField.onChange(date);
            setDatePickerField(null);
          }}
        />
      )}

      {voiceModeEnabled && (
        <VoiceFormController
          fields={visibleFields}
          currentField={currentField}
          onFieldChange={(name, value) => {
            const field = fields.find(f => f.name === name);
            if (field) {
              field.onChange(value);
            }
          }}
          onNextField={handleNextField}
          onPreviousField={handlePreviousField}
          disabled={disabled || readOnly}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  voiceModeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  activeField: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
  },
  fieldError: {
    borderColor: 'red',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#e32',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e32',
    fontSize: 12,
    marginTop: 4,
  },
  description: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#fff',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  geolocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  geolocationInput: {
    flex: 1,
  },
  locationButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 16,
    backgroundColor: '#fff',
  },
  uploadButtonText: {
    marginLeft: 8,
    color: '#666',
  },
});

export default NativeFormRenderer;
