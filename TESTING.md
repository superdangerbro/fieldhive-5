# Testing Guide

This document outlines the testing setup, conventions, and best practices for the FieldHive application.

## Test Structure

Tests are organized into several suites:

- **Core Components**: Essential functionality tests for core features
- **Voice Recognition**: Tests for voice input and processing
- **Dynamic Forms**: Tests for form generation and handling
- **Schema Validation**: Tests for data schema validation
- **Integration Tests**: End-to-end tests for complete workflows

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:core
npm run test:voice
npm run test:forms
npm run test:schemas
npm run test:integration

# Watch mode
npm run test:watch

# Update snapshots
npm run test:update

# Generate coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run tests without output
npm run test:quiet
```

### Command Line Options

- `--watch`: Watch files for changes and rerun tests
- `--coverage`: Generate code coverage report
- `--updateSnapshot`: Update snapshot files
- `--ci`: Run in CI mode
- `--quiet`: Minimize output
- `--suite=<name>`: Run specific test suite

## Test Files

- Test files should be co-located with the code they test
- Use `.test.ts` or `.test.tsx` extension
- Follow the naming pattern: `[ComponentName].test.ts`

## Mocks and Utilities

### Voice Recognition

```typescript
import { mockVoiceRecognition } from '@tests/testUtils';

// Simulate voice input
mockVoiceRecognition.simulateResult('condition is good');

// Simulate error
mockVoiceRecognition.simulateError('No speech detected');
```

### Barcode Scanner

```typescript
import { mockBarcodeScanner } from '@tests/testUtils';

// Simulate barcode scan
mockBarcodeScanner.simulateScan('TRAP-123');
```

### Wait Utilities

```typescript
import { wait, waitFor } from '@tests/testUtils';

// Wait for specific duration
await wait(1000);

// Wait for condition
await waitFor(() => expect(element).toBeVisible());
```

## Best Practices

1. **Test Organization**
   - Group related tests using `describe` blocks
   - Use clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern

```typescript
describe('EquipmentInspection', () => {
  describe('when scanning barcode', () => {
    it('should trigger inspection form', async () => {
      // Arrange
      const component = render(<EquipmentInspection />);
      
      // Act
      mockBarcodeScanner.simulateScan('TRAP-123');
      
      // Assert
      expect(component.getByTestId('inspection-form')).toBeVisible();
    });
  });
});
```

2. **Mocking**
   - Use the provided mock utilities
   - Reset mocks between tests
   - Mock only what's necessary

3. **Async Testing**
   - Use `async/await` for asynchronous tests
   - Handle promises properly
   - Use `waitFor` for conditions that need time

4. **Coverage**
   - Aim for 80% coverage minimum
   - Focus on critical paths
   - Don't write tests just for coverage

## Custom Matchers

```typescript
// Form data matcher
expect(formData).toMatchFormData({
  condition: 'good',
  activityFound: false,
});

// DOM matchers
expect(element).toBeVisible();
expect(element).toHaveTextContent('Expected text');
```

## Test Environment

- Tests run in a JSDOM environment
- Timezone is set to UTC
- System time is mocked
- Random values are consistent
- Window dimensions are fixed

## Mobile-Specific Testing

- Use `setupMobile.js` configuration
- Mock native modules
- Test both iOS and Android paths
- Handle platform-specific features

## Web-Specific Testing

- Use `setupWeb.js` configuration
- Test responsive behavior
- Handle browser APIs
- Test accessibility

## Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Release tags

Coverage reports are generated and stored as artifacts.

## Debugging Tests

1. Use the `--watch` mode
2. Check Jest output
3. Use `console.log` (removed in CI)
4. Run specific tests with `--testNamePattern`

## Common Issues

1. **Async Test Timeouts**
   - Increase timeout with `jest.setTimeout()`
   - Check async operations
   - Use `waitFor` properly

2. **Snapshot Mismatches**
   - Review changes carefully
   - Update with `--updateSnapshot`
   - Keep snapshots minimal

3. **Mock Issues**
   - Reset mocks between tests
   - Check mock implementation
   - Verify mock calls

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
