import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text,
  ScrollView,
  SafeAreaView
} from 'react-native';
import EquipmentInspection from '../components/EquipmentInspection';
import { VoiceAndBarcodeProvider } from '../contexts/VoiceAndBarcodeContext';

// Example equipment schemas
const TEST_SCHEMAS = {
  'TRAP-001': {
    name: 'Rodent Trap',
    description: 'Standard rodent trap inspection',
    fields: [
      {
        name: 'condition',
        label: 'Trap Condition',
        type: 'enum',
        options: ['Good', 'Damaged', 'Missing'],
        required: true
      },
      {
        name: 'baitLevel',
        label: 'Bait Level',
        type: 'enum',
        options: ['Full', 'Half', 'Empty'],
        required: true
      },
      {
        name: 'activity',
        label: 'Activity Detected',
        type: 'boolean',
        required: true
      },
      {
        name: 'activityType',
        label: 'Type of Activity',
        type: 'enum',
        options: ['None', 'Droppings', 'Capture', 'Bait Consumed'],
        required: false
      },
      {
        name: 'notes',
        label: 'Additional Notes',
        type: 'string',
        multiline: true,
        required: false
      },
      {
        name: 'photo',
        label: 'Photo Evidence',
        type: 'image',
        required: false
      }
    ]
  },
  'BAIT-001': {
    name: 'Bait Station',
    description: 'Exterior bait station inspection',
    fields: [
      {
        name: 'condition',
        label: 'Station Condition',
        type: 'enum',
        options: ['Good', 'Damaged', 'Missing'],
        required: true
      },
      {
        name: 'secured',
        label: 'Properly Secured',
        type: 'boolean',
        required: true
      },
      {
        name: 'baitBlocks',
        label: 'Number of Bait Blocks',
        type: 'number',
        required: true
      },
      {
        name: 'consumption',
        label: 'Bait Consumption',
        type: 'enum',
        options: ['None', 'Light', 'Moderate', 'Heavy'],
        required: true
      },
      {
        name: 'replaced',
        label: 'Bait Replaced',
        type: 'boolean',
        required: true
      },
      {
        name: 'weather',
        label: 'Weather Conditions',
        type: 'enum',
        options: ['Dry', 'Wet', 'Flooded'],
        required: true
      },
      {
        name: 'notes',
        label: 'Additional Notes',
        type: 'string',
        multiline: true,
        required: false
      }
    ]
  }
};

// Example inspection history
const TEST_HISTORY = {
  'TRAP-001': {
    condition: 'Good',
    baitLevel: 'Half',
    activity: false,
    activityType: 'None',
    notes: 'Last inspection: No issues found'
  },
  'BAIT-001': {
    condition: 'Good',
    secured: true,
    baitBlocks: 2,
    consumption: 'Light',
    replaced: false,
    weather: 'Dry',
    notes: 'Last inspection: Regular maintenance performed'
  }
};

const TestInspection = () => {
  const [showInspection, setShowInspection] = useState(false);
  const [lastInspection, setLastInspection] = useState(null);

  // Mock functions for equipment inspection
  const getEquipmentSchema = async (barcode) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const schema = TEST_SCHEMAS[barcode];
    if (!schema) {
      throw new Error('Unknown equipment type');
    }
    return schema;
  };

  const getLastInspection = async (barcode) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return TEST_HISTORY[barcode] || null;
  };

  const saveInspection = async (data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Saving inspection:', data);
    setLastInspection(data);
    return data;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Equipment Inspection Test</Text>
        
        <Text style={styles.subtitle}>Test Barcodes:</Text>
        <View style={styles.barcodeList}>
          {Object.keys(TEST_SCHEMAS).map(code => (
            <View key={code} style={styles.barcodeItem}>
              <Text style={styles.code}>{code}</Text>
              <Text style={styles.description}>
                {TEST_SCHEMAS[code].name}
              </Text>
            </View>
          ))}
        </View>

        <Button
          title="Start Test Inspection"
          onPress={() => setShowInspection(true)}
        />

        {lastInspection && (
          <View style={styles.lastInspection}>
            <Text style={styles.subtitle}>Last Inspection:</Text>
            <ScrollView style={styles.inspectionData}>
              <Text>
                {JSON.stringify(lastInspection, null, 2)}
              </Text>
            </ScrollView>
          </View>
        )}
      </View>

      {showInspection && (
        <VoiceAndBarcodeProvider>
          <EquipmentInspection
            getEquipmentSchema={getEquipmentSchema}
            getLastInspection={getLastInspection}
            saveInspection={saveInspection}
            onComplete={() => setShowInspection(false)}
            onCancel={() => setShowInspection(false)}
          />
        </VoiceAndBarcodeProvider>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  barcodeList: {
    marginBottom: 24,
  },
  barcodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  code: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
    minWidth: 100,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  lastInspection: {
    marginTop: 24,
    flex: 1,
  },
  inspectionData: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  }
});

export default TestInspection;
