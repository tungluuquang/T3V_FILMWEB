import { vi } from 'vitest';
import '@testing-library/jest-dom';
console.log('>>> vitest.setup.js loaded!')
global.localStorage = {
    getItem: vi.fn(() => JSON.stringify({ accessToken: 'fake-token' })),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()

};
