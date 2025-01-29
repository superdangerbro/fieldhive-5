declare module '@testing-library/react-hooks' {
  export function renderHook<TProps, TResult>(
    callback: (props: TProps) => TResult,
    options?: {
      initialProps?: TProps;
      wrapper?: React.ComponentType<any>;
    }
  ): {
    result: { current: TResult };
    rerender: (props?: TProps) => void;
    unmount: () => void;
    waitFor: (callback: () => boolean | void | Promise<boolean | void>, options?: {
      interval?: number;
      timeout?: number;
    }) => Promise<void>;
  };
}

declare module '../../utils/nlpProcessor' {
  export class NLPProcessor {
    processVoiceInput(text: string): Promise<{
      condition?: 'good' | 'fair' | 'poor';
      activityFound?: boolean;
      maintenanceNeeded?: boolean;
      notes?: string;
      confidence?: number;
      requiresVerification?: boolean;
      locationDetails?: {
        position?: string;
        landmark?: string;
        relation?: string;
      };
      equipmentType?: string;
      equipmentCategory?: string;
      maintenanceDetails?: {
        action?: string;
        component?: string;
      };
      complianceNotes?: {
        protocol?: string;
        status?: string;
      };
    }>;
  }
}

declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      (...args: Y): T;
      mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
      mockReturnValue: (value: T) => Mock<T, Y>;
      mockResolvedValue: <U>(value: U) => Mock<Promise<U>, Y>;
      mockRejectedValue: (value: any) => Mock<Promise<T>, Y>;
      mockReturnThis: () => Mock<T, Y>;
      mockClear: () => void;
      mockReset: () => void;
      mockRestore: () => void;
      getMockName: () => string;
      mock: {
        calls: Y[];
        instances: T[];
        contexts: any[];
        results: Array<{ type: 'return' | 'throw'; value: any }>;
      };
      mockName: (name: string) => Mock<T, Y>;
    }

    interface Matchers<R> {
      toBeValidSchema(): R;
      toHaveValidFields(fields: string[]): R;
      toMatchFormData(data: Record<string, any>): R;
      toHaveVoiceCommand(command: string): R;
      toBeOnScreen(): R;
      toHaveStyle(style: Record<string, any>): R;
    }
  }

  interface Window {
    dispatchEvent(event: Event): boolean;
  }

  const jest: {
    fn: <T = any>() => jest.Mock<T>;
    mock: (moduleName: string, factory?: any) => jest.Mock;
    spyOn: (object: any, methodName: string) => jest.Mock;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
    setTimeout: (timeout: number) => void;
    useFakeTimers: () => void;
    useRealTimers: () => void;
    clearAllTimers: () => void;
    requireActual: <T = any>(moduleName: string) => T;
    requireMock: <T = any>(moduleName: string) => T;
    isolateModules: (fn: () => void) => void;
    retryTimes: (numRetries: number) => void;
  };

  interface Event {
    new(type: string, eventInitDict?: EventInit): Event;
    readonly type: string;
    readonly target: EventTarget | null;
    readonly currentTarget: EventTarget | null;
    composedPath(): EventTarget[];
    readonly NONE: 0;
    readonly CAPTURING_PHASE: 1;
    readonly AT_TARGET: 2;
    readonly BUBBLING_PHASE: 3;
    readonly eventPhase: number;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
    readonly bubbles: boolean;
    readonly cancelable: boolean;
    preventDefault(): void;
    readonly defaultPrevented: boolean;
    readonly composed: boolean;
    readonly isTrusted: boolean;
    readonly timeStamp: number;
  }

  interface JestMockFn<T = any, Y extends any[] = any[]> extends jest.Mock<T, Y> {}

  interface Global {
    jest: typeof jest;
  }

  namespace NodeJS {
    interface Global extends Global {}
  }
}

export {};
