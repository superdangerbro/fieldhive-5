// Natural Language Processing utilities for form field values
import { FieldTypes } from '../schemas/base';

// Convert words to numbers
const wordToNumber = {
  zero: 0, one: 1, two: 2, three: 3, four: 4,
  five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90, hundred: 100
};

// Common boolean phrases
const booleanPhrases = {
  true: [
    'yes', 'yeah', 'yep', 'correct', 'true', 'affirmative',
    'confirmed', 'right', 'okay', 'done', 'complete'
  ],
  false: [
    'no', 'nope', 'negative', 'false', 'incorrect',
    'wrong', 'not', 'incomplete', 'none'
  ]
};

// Process numeric words into numbers
const processNumericWords = (text) => {
  const words = text.toLowerCase().split(' ');
  let result = 0;
  let temp = 0;

  for (const word of words) {
    if (word in wordToNumber) {
      const num = wordToNumber[word];
      if (num === 100) {
        temp = temp === 0 ? 100 : temp * 100;
      } else {
        temp += num;
      }
    } else if (word === 'and') {
      continue;
    } else {
      // Try to parse any actual numbers in the text
      const parsed = parseFloat(word);
      if (!isNaN(parsed)) {
        temp += parsed;
      }
    }
  }

  return result + temp;
};

// Process text for different field types
const processFieldValue = (text, fieldType, fieldOptions = {}) => {
  if (!text) return null;

  const normalizedText = text.toLowerCase().trim();

  switch (fieldType) {
    case FieldTypes.NUMBER:
      // First try direct number parsing
      const directNumber = parseFloat(normalizedText);
      if (!isNaN(directNumber)) {
        return directNumber;
      }
      // Then try processing numeric words
      return processNumericWords(normalizedText);

    case FieldTypes.BOOLEAN:
      if (booleanPhrases.true.includes(normalizedText)) {
        return true;
      }
      if (booleanPhrases.false.includes(normalizedText)) {
        return false;
      }
      return null;

    case FieldTypes.DATE:
    case FieldTypes.TIMESTAMP:
      // Handle relative dates
      if (normalizedText === 'today') {
        return new Date();
      }
      if (normalizedText === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      }
      if (normalizedText === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
      }
      // Try parsing the date string
      const date = new Date(text);
      return isNaN(date) ? null : date;

    case FieldTypes.ENUM:
      if (!fieldOptions.options) return null;
      // Find the closest matching option
      return fieldOptions.options.find(option =>
        option.toLowerCase() === normalizedText ||
        option.toLowerCase().includes(normalizedText) ||
        normalizedText.includes(option.toLowerCase())
      ) || null;

    case FieldTypes.STRING:
    default:
      return text;
  }
};

// Process voice commands
const processCommand = (text) => {
  const normalizedText = text.toLowerCase().trim();

  // Navigation commands
  if (['next', 'next field', 'continue'].includes(normalizedText)) {
    return { type: 'navigation', action: 'next' };
  }
  if (['previous', 'back', 'go back'].includes(normalizedText)) {
    return { type: 'navigation', action: 'previous' };
  }
  if (['submit', 'save', 'complete', 'finish'].includes(normalizedText)) {
    return { type: 'form', action: 'submit' };
  }
  if (['cancel', 'exit', 'quit'].includes(normalizedText)) {
    return { type: 'form', action: 'cancel' };
  }
  if (['clear', 'reset', 'start over'].includes(normalizedText)) {
    return { type: 'field', action: 'clear' };
  }
  if (normalizedText.startsWith('set') || normalizedText.startsWith('change')) {
    return { type: 'field', action: 'set', value: text.slice(text.indexOf(' ') + 1) };
  }

  // If no command is recognized, treat it as a field value
  return { type: 'value', value: text };
};

// Process field-specific commands
const processFieldCommand = (text, field) => {
  const command = processCommand(text);
  
  if (command.type === 'value') {
    return {
      type: 'value',
      value: processFieldValue(command.value, field.type, {
        options: field.options
      })
    };
  }

  return command;
};

export {
  processFieldValue,
  processCommand,
  processFieldCommand
};
