/// <reference types="jest" />

declare module '@testing-library/jest-dom' {
  export {};
}

declare module '@testing-library/react' {
  export * from '@testing-library/react/pure';
}

declare module '@testing-library/react-native' {
  export * from '@testing-library/react-native/pure';
}

declare module 'react-native' {
  export * from 'react-native/types';
}

declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toBeEmpty(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeInvalid(): R;
    toBeRequired(): R;
    toBeValid(): R;
    toBeChecked(): R;
    toBePartiallyChecked(): R;
    toHaveAttribute(attr: string, value?: any): R;
    toHaveClass(...classNames: string[]): R;
    toHaveStyle(style: Record<string, any>): R;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
    toHaveValue(value?: string | string[] | number): R;
    toBeEmptyDOMElement(): R;
    toContainElement(element: HTMLElement | null): R;
    toContainHTML(html: string): R;
    toHaveFocus(): R;
    toHaveFormValues(values: Record<string, any>): R;
    toBeInTheDOM(): R;
    toHaveDescription(text: string | RegExp): R;
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react';
  const content: (props: SVGProps<SVGElement>) => ReactElement;
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'jest-expo' {
  const preset: any;
  export default preset;
}

declare module '@react-native-async-storage/async-storage/jest/async-storage-mock' {
  const mock: any;
  export default mock;
}

declare module 'react-native-device-info/jest/react-native-device-info-mock' {
  const mock: any;
  export default mock;
}

declare module 'react-native-reanimated/mock' {
  const mock: any;
  export default mock;
}

declare module 'expo-barcode-scanner' {
  export const BarCodeScanner: any;
}

declare module 'expo-camera' {
  export const Camera: any;
}

declare module 'expo-location' {
  export const requestForegroundPermissionsAsync: () => Promise<any>;
  export const getCurrentPositionAsync: (options?: any) => Promise<any>;
  export const watchPositionAsync: (options?: any, callback?: any) => Promise<any>;
}

declare module 'expo-speech' {
  export const speak: (text: string, options?: any) => void;
  export const stop: () => void;
  export const isSpeakingAsync: () => Promise<boolean>;
  export const getAvailableVoicesAsync: () => Promise<any[]>;
}

declare module '@react-native-voice/voice' {
  export const isAvailable: () => Promise<boolean>;
  export const start: (locale?: string) => Promise<void>;
  export const stop: () => Promise<void>;
  export const cancel: () => Promise<void>;
  export const destroy: () => Promise<void>;
  export const removeAllListeners: () => void;
  export const isRecognizing: () => Promise<boolean>;
  export const onSpeechStart: (e: any) => void;
  export const onSpeechRecognized: (e: any) => void;
  export const onSpeechEnd: (e: any) => void;
  export const onSpeechError: (e: any) => void;
  export const onSpeechResults: (e: any) => void;
  export const onSpeechPartialResults: (e: any) => void;
  export const onSpeechVolumeChanged: (e: any) => void;
}
