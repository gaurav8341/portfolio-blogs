// CRA only picks up a setup file at exactly src/setupTests.js — the copy under
// src/js/ was never being loaded, so the jest-dom matchers were missing.

// jest-dom adds custom jest matchers for asserting on DOM nodes, e.g.
// expect(element).toHaveTextContent(/react/i)
// https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';

// The jsdom bundled with CRA's jest predates TextEncoder/TextDecoder, which
// react-router 7 requires at import time.
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
