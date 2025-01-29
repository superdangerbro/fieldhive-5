import { FieldTypes } from '../base';
import { ValidationRuleCreators } from '../validation';
import { ConditionCreators } from '../conditions';
import SchemaManager from '../schemaManager';

// Equipment inspection form schema
const equipmentInspectionSchema = {
  name: 'equipment-inspection',
  title: 'Equipment Inspection Form',
  description: 'Standard inspection form for field equipment',
  version: '1.0.0',
  sections: [
    {
      name: 'equipment-info',
      title: 'Equipment Information',
      description: 'Basic equipment details',
      fields: [
        {
          name: 'barcode',
          type: FieldTypes.BARCODE,
          label: 'Equipment Barcode',
          description: 'Scan the equipment barcode',
          required: true,
          validation: {
            rules: [
              ValidationRuleCreators.required('Please scan the equipment barcode')
            ]
          }
        },
        {
          name: 'equipmentType',
          type: FieldTypes.ENUM,
          label: 'Equipment Type',
          description: 'Select the type of equipment',
          required: true,
          options: ['Trap', 'Bait Station', 'Monitor', 'Sensor'],
          validation: {
            rules: [
              ValidationRuleCreators.required('Please select the equipment type')
            ]
          }
        },
        {
          name: 'location',
          type: FieldTypes.GEOLOCATION,
          label: 'Equipment Location',
          description: 'Current equipment location',
          required: true,
          validation: {
            rules: [
              ValidationRuleCreators.required('Location is required')
            ]
          }
        }
      ]
    },
    {
      name: 'condition',
      title: 'Equipment Condition',
      description: 'Assess the current condition of the equipment',
      fields: [
        {
          name: 'condition',
          type: FieldTypes.ENUM,
          label: 'Overall Condition',
          description: 'Rate the overall condition of the equipment',
          required: true,
          options: ['Good', 'Fair', 'Poor', 'Damaged', 'Missing'],
          validation: {
            rules: [
              ValidationRuleCreators.required('Please rate the equipment condition')
            ]
          }
        },
        {
          name: 'damageDescription',
          type: FieldTypes.STRING,
          label: 'Damage Description',
          description: 'Describe any damage or issues',
          multiline: true,
          rows: 3,
          conditions: [
            ConditionCreators.equals('condition', 'Damaged')
          ]
        },
        {
          name: 'photo',
          type: FieldTypes.IMAGE,
          label: 'Condition Photo',
          description: 'Take a photo of any damage',
          conditions: [
            ConditionCreators.equals('condition', 'Damaged')
          ]
        }
      ]
    },
    {
      name: 'activity',
      title: 'Activity Check',
      description: 'Check for pest activity',
      fields: [
        {
          name: 'activityFound',
          type: FieldTypes.BOOLEAN,
          label: 'Activity Detected',
          description: 'Was any pest activity detected?',
          required: true
        },
        {
          name: 'activityType',
          type: FieldTypes.ENUM,
          label: 'Type of Activity',
          description: 'Select the type of activity detected',
          options: ['Droppings', 'Tracks', 'Damage', 'Live Pest', 'Dead Pest'],
          conditions: [
            ConditionCreators.equals('activityFound', true)
          ],
          validation: {
            rules: [
              ValidationRuleCreators.required('Please select the type of activity')
            ]
          }
        },
        {
          name: 'activityLevel',
          type: FieldTypes.ENUM,
          label: 'Activity Level',
          description: 'Rate the level of activity',
          options: ['Low', 'Medium', 'High'],
          conditions: [
            ConditionCreators.equals('activityFound', true)
          ],
          validation: {
            rules: [
              ValidationRuleCreators.required('Please rate the activity level')
            ]
          }
        },
        {
          name: 'activityPhoto',
          type: FieldTypes.IMAGE,
          label: 'Activity Photo',
          description: 'Take a photo of the activity',
          conditions: [
            ConditionCreators.equals('activityFound', true)
          ]
        }
      ]
    },
    {
      name: 'maintenance',
      title: 'Maintenance',
      description: 'Equipment maintenance tasks',
      fields: [
        {
          name: 'maintenanceNeeded',
          type: FieldTypes.BOOLEAN,
          label: 'Maintenance Required',
          description: 'Does the equipment need maintenance?',
          required: true
        },
        {
          name: 'maintenanceType',
          type: FieldTypes.ENUM,
          label: 'Maintenance Type',
          description: 'Select the type of maintenance needed',
          options: ['Cleaning', 'Repair', 'Replacement', 'Relocation'],
          conditions: [
            ConditionCreators.equals('maintenanceNeeded', true)
          ],
          validation: {
            rules: [
              ValidationRuleCreators.required('Please select the maintenance type')
            ]
          }
        },
        {
          name: 'priority',
          type: FieldTypes.ENUM,
          label: 'Maintenance Priority',
          description: 'Set the maintenance priority',
          options: ['Low', 'Medium', 'High', 'Urgent'],
          conditions: [
            ConditionCreators.equals('maintenanceNeeded', true)
          ],
          validation: {
            rules: [
              ValidationRuleCreators.required('Please set the maintenance priority')
            ]
          }
        }
      ]
    },
    {
      name: 'notes',
      title: 'Additional Notes',
      description: 'Any additional observations or comments',
      fields: [
        {
          name: 'notes',
          type: FieldTypes.STRING,
          label: 'Notes',
          description: 'Enter any additional notes or comments',
          multiline: true,
          rows: 4
        },
        {
          name: 'followUpNeeded',
          type: FieldTypes.BOOLEAN,
          label: 'Follow-up Required',
          description: 'Is a follow-up inspection needed?'
        },
        {
          name: 'followUpDate',
          type: FieldTypes.DATE,
          label: 'Follow-up Date',
          description: 'When should the follow-up inspection occur?',
          conditions: [
            ConditionCreators.equals('followUpNeeded', true)
          ],
          validation: {
            rules: [
              ValidationRuleCreators.required('Please set the follow-up date')
            ]
          }
        }
      ]
    }
  ],
  settings: {
    submitLabel: 'Complete Inspection',
    cancelLabel: 'Cancel',
    showProgressBar: true,
    allowSaveAsDraft: true,
    requireConfirmation: true,
    confirmationMessage: 'Are you sure you want to complete this inspection?'
  }
};

// Register the schema with the schema manager
SchemaManager.registerSchema('equipment-inspection', equipmentInspectionSchema);

export default equipmentInspectionSchema;
