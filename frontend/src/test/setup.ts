import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill ResizeObserver for JSDOM (required by R3F Canvas / react-use-measure)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = window.ResizeObserver || ResizeObserverMock;

// Polyfill window.scrollTo for JSDOM
window.scrollTo = vi.fn() as any;

// Polyfill HTMLCanvasElement.prototype.getContext for JSDOM without canvas npm pkg
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as any;
}

// Polyfill matchMedia for JSDOM
window.matchMedia =
  window.matchMedia ||
  function (query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
    };
  };
