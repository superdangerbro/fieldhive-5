declare global {
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
    requireActual: <T = any>(moduleName: string) => T;
    requireMock: <T = any>(moduleName: string) => T;
    isolateModules: (fn: () => void) => void;
    retryTimes: (numRetries: number) => void;
    setTimeout: (timeout: number) => void;
  };

  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      (...args: Y): T;
      mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
      mockReturnValue: (value: T) => Mock<T, Y>;
      mockResolvedValue: <U>(value: U) => Mock<Promise<U>, Y>;
      mockRejectedValue: (value: any) => Mock<Promise<T>, Y>;
      mockReturnThis: () => Mock<T, Y>;
      mockReturnThis: () => this;
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
  }

  interface ExpectExtendMap {
    [key: string]: (received: any, ...args: any[]) => { message: () => string; pass: boolean };
  }

  interface Expect {
    extend(matchers: ExpectExtendMap): void;
  }

  const expect: Expect & ((actual: any) => {
    toBe: (expected: any) => void;
    toEqual: (expected: any) => void;
    toBeDefined: () => void;
    toBeUndefined: () => void;
    toBeNull: () => void;
    toBeTruthy: () => void;
    toBeFalsy: () => void;
    toBeGreaterThan: (expected: number) => void;
    toBeLessThan: (expected: number) => void;
    toContain: (expected: any) => void;
    toHaveBeenCalled: () => void;
    toHaveBeenCalledWith: (...args: any[]) => void;
    toHaveBeenCalledTimes: (count: number) => void;
    toThrow: (error?: string | Error | RegExp) => void;
    toMatchSnapshot: () => void;
    not: any;
  });

  function describe(name: string, fn: () => void): void;
  function test(name: string, fn: () => void | Promise<void>): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  function beforeAll(fn: () => void | Promise<void>): void;
  function afterAll(fn: () => void | Promise<void>): void;
  function beforeEach(fn: () => void | Promise<void>): void;
  function afterEach(fn: () => void | Promise<void>): void;

  // DOM types for tests
  interface Window {
    location: Location;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    dispatchEvent: jest.Mock;
    ResizeObserver: typeof ResizeObserver;
    IntersectionObserver: typeof IntersectionObserver;
    innerWidth: number;
    innerHeight: number;
    matchMedia: jest.Mock;
    getComputedStyle: jest.Mock;
    requestAnimationFrame: jest.Mock;
    cancelAnimationFrame: jest.Mock;
  }

  interface DOMStringList {
    length: number;
    contains(str: string): boolean;
    item(index: number): string | null;
    [index: number]: string;
    [Symbol.iterator](): Iterator<string>;
  }

  interface TestLocation {
    href: string;
    pathname: string;
    search: string;
    hash: string;
    assign: jest.Mock;
    replace: jest.Mock;
    reload: jest.Mock;
    origin: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    ancestorOrigins: DOMStringList;
    toString(): string;
  }

  // Override the built-in Location interface for tests
  interface Location extends TestLocation {}

  interface Navigator {
    geolocation: {
      getCurrentPosition: jest.Mock;
      watchPosition: jest.Mock;
      clearWatch: jest.Mock;
      stopObserving: jest.Mock;
    };
  }

  interface Storage {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
    getAll?: () => Record<string, any>;
  }

  interface Global {
    window: Window;
    document: Document;
    navigator: Navigator;
    location: Location;
    localStorage: Storage;
    sessionStorage: Storage;
    ResizeObserver: {
      new(callback: (entries: any[]) => void): {
        observe: () => void;
        unobserve: () => void;
        disconnect: () => void;
        callback: (entries: any[]) => void;
      };
    };
    IntersectionObserver: {
      new(callback: (entries: any[]) => void): {
        observe: () => void;
        unobserve: () => void;
        disconnect: () => void;
        callback: (entries: any[]) => void;
      };
    };
    HTMLCanvasElement: {
      prototype: {
        getContext: jest.Mock;
      };
    };
    setWindowDimensions: (width: number, height: number) => void;
  }

  namespace NodeJS {
    interface Global extends Global {
      [key: string]: any;
    }
  }

  // Add util module declaration
  declare module 'util' {
    export function isDeepStrictEqual(val1: any, val2: any): boolean;
  }
}

// Export an empty object to make this a module
export {};
