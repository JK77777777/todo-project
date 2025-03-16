// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

// 1. Polyfill TransformStream if missing:
import { TransformStream } from 'web-streams-polyfill';
if (!(globalThis as any).TransformStream) {
  (globalThis as any).TransformStream = TransformStream;
}

// 2. Polyfill TextEncoder/TextDecoder:
import { TextEncoder, TextDecoder } from 'util';
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

// 3. Load jest-dom:
import '@testing-library/jest-dom';

// 4. Finally, require MSW AFTER all polyfills:
const { setupServer } = require('msw/node');
const { handlers } = require('./mocks/handlers');

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());