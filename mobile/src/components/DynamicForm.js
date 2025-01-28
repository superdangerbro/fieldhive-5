import React from 'react';
import { View, Text, TextInput, Picker } from 'react-native';

const DynamicForm = ({ fields }) => {
  return (
    <View>
      {fields.map((field) => (
        <View key={field.name}>
          <Text>{field.label}</Text>
          {field.type === 'text' && <TextInput placeholder={field.label} />}
          {field.type === 'select' && (
            <Picker>
              {field.options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          )}
        </View>
      ))}
    </View>
  );
};

export default DynamicForm;
