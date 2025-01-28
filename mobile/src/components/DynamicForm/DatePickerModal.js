import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerModal = ({
  visible,
  onClose,
  onSelect,
  value,
  mode = 'date',
  minimumDate,
  maximumDate
}) => {
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  const handleChange = (event, date) => {
    if (Platform.OS === 'android') {
      onClose();
      if (event.type === 'set' && date) {
        onSelect(date);
      }
    } else {
      setSelectedDate(date || selectedDate);
    }
  };

  const handleDone = () => {
    onSelect(selectedDate);
    onClose();
  };

  if (Platform.OS === 'android') {
    if (!visible) return null;
    return (
      <DateTimePicker
        value={selectedDate}
        mode={mode}
        is24Hour={true}
        onChange={handleChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.headerButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDone}>
              <Text style={[styles.headerButton, styles.doneButton]}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={selectedDate}
            mode={mode}
            display="spinner"
            onChange={handleChange}
            style={styles.picker}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc'
  },
  headerButton: {
    fontSize: 16,
    color: '#007AFF'
  },
  doneButton: {
    fontWeight: '600'
  },
  picker: {
    height: 200
  }
});

export default DatePickerModal;
