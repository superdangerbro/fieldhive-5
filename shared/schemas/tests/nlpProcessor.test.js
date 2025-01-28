import { NLPProcessor } from '../../utils/nlpProcessor';

describe('NLPProcessor', () => {
  let processor;

  beforeEach(() => {
    processor = new NLPProcessor();
  });

  describe('processVoiceInput', () => {
    it('extracts condition from natural language input', async () => {
      const inputs = [
        {
          text: 'the trap is in good condition',
          expected: { condition: 'good' },
        },
        {
          text: 'condition looks fair, needs cleaning',
          expected: { condition: 'fair' },
        },
        {
          text: 'poor condition, needs replacement',
          expected: { condition: 'poor' },
        },
      ];

      for (const { text, expected } of inputs) {
        const result = await processor.processVoiceInput(text);
        expect(result.condition).toBe(expected.condition);
      }
    });

    it('detects activity status from various phrasings', async () => {
      const inputs = [
        {
          text: 'found activity in the trap',
          expected: { activityFound: true },
        },
        {
          text: 'trap is active with signs of pests',
          expected: { activityFound: true },
        },
        {
          text: 'no activity detected',
          expected: { activityFound: false },
        },
        {
          text: 'trap is empty, no signs',
          expected: { activityFound: false },
        },
      ];

      for (const { text, expected } of inputs) {
        const result = await processor.processVoiceInput(text);
        expect(result.activityFound).toBe(expected.activityFound);
      }
    });

    it('identifies maintenance needs from descriptions', async () => {
      const inputs = [
        {
          text: 'needs maintenance, bait replacement required',
          expected: { maintenanceNeeded: true },
        },
        {
          text: 'requires repair on the trigger mechanism',
          expected: { maintenanceNeeded: true },
        },
        {
          text: 'working properly, no maintenance needed',
          expected: { maintenanceNeeded: false },
        },
        {
          text: 'all good, functioning correctly',
          expected: { maintenanceNeeded: false },
        },
      ];

      for (const { text, expected } of inputs) {
        const result = await processor.processVoiceInput(text);
        expect(result.maintenanceNeeded).toBe(expected.maintenanceNeeded);
      }
    });

    it('handles complex multi-part descriptions', async () => {
      const result = await processor.processVoiceInput(
        'trap is in fair condition with signs of activity, needs maintenance on the bait station'
      );

      expect(result).toEqual({
        condition: 'fair',
        activityFound: true,
        maintenanceNeeded: true,
        notes: expect.any(String),
      });
    });

    it('extracts numerical values and measurements', async () => {
      const inputs = [
        {
          text: 'bait level at 50 percent',
          expected: { baitLevel: 50 },
        },
        {
          text: 'found 3 specimens in trap',
          expected: { activityCount: 3 },
        },
      ];

      for (const { text, expected } of inputs) {
        const result = await processor.processVoiceInput(text);
        expect(result).toMatchObject(expected);
      }
    });

    it('handles negations and contradictions', async () => {
      const inputs = [
        {
          text: 'no activity but trap needs maintenance',
          expected: {
            activityFound: false,
            maintenanceNeeded: true,
          },
        },
        {
          text: 'condition not good but not terrible either',
          expected: {
            condition: 'fair',
          },
        },
      ];

      for (const { text, expected } of inputs) {
        const result = await processor.processVoiceInput(text);
        expect(result).toMatchObject(expected);
      }
    });

    it('processes location-specific information', async () => {
      const result = await processor.processVoiceInput(
        'trap located near the north wall behind storage boxes'
      );

      expect(result.locationDetails).toEqual({
        position: 'north wall',
        landmark: 'storage boxes',
        relation: 'behind',
      });
    });

    it('handles uncertainty in voice input', async () => {
      const result = await processor.processVoiceInput(
        'might be some activity, not entirely sure'
      );

      expect(result).toMatchObject({
        activityFound: null,
        confidence: expect.any(Number),
        requiresVerification: true,
      });
    });

    it('processes time-related information', async () => {
      const result = await processor.processVoiceInput(
        'last checked 2 days ago, replaced bait yesterday'
      );

      expect(result).toMatchObject({
        lastChecked: expect.any(Date),
        lastMaintenance: expect.any(Date),
      });
    });

    it('handles multiple equipment mentions', async () => {
      const result = await processor.processVoiceInput(
        'trap A is good, trap B needs maintenance, and trap C shows activity'
      );

      expect(result).toEqual({
        multipleEquipment: true,
        equipmentStates: [
          { id: 'A', condition: 'good' },
          { id: 'B', maintenanceNeeded: true },
          { id: 'C', activityFound: true },
        ],
      });
    });

    it('falls back to basic recognition when AI fails', async () => {
      // Mock AI service failure
      jest.spyOn(processor, 'callAIService').mockRejectedValueOnce(
        new Error('Service unavailable')
      );

      const result = await processor.processVoiceInput('condition is good');

      // Should still extract basic information
      expect(result).toMatchObject({
        condition: 'good',
        aiProcessed: false,
      });
    });

    it('handles voice recognition confidence levels', async () => {
      const inputs = [
        {
          text: 'condition is good',
          confidence: 0.95,
          expected: { requiresVerification: false },
        },
        {
          text: 'condshun iz gud',
          confidence: 0.45,
          expected: { requiresVerification: true },
        },
      ];

      for (const { text, confidence, expected } of inputs) {
        const result = await processor.processVoiceInput(text, { confidence });
        expect(result.requiresVerification).toBe(expected.requiresVerification);
      }
    });

    it('processes custom vocabulary and industry terms', async () => {
      const result = await processor.processVoiceInput(
        'type 2B bait station with fresh attractant, IPM protocol followed'
      );

      expect(result).toMatchObject({
        equipmentType: '2B',
        equipmentCategory: 'bait station',
        maintenanceDetails: {
          action: 'refresh',
          component: 'attractant',
        },
        complianceNotes: {
          protocol: 'IPM',
          status: 'followed',
        },
      });
    });
  });
});
