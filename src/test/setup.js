import { expect, afterEach, beforeEach, afterAll, beforeAll, describe, test, it, skip, only, todo } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Make vitest globals available without explicit import
// This is handled by globals: true in vite.config.js

// Global beforeAll/afterAll hooks can be added here if needed
beforeAll(() => {
  // Global setup
});

afterAll(() => {
  // Global teardown
});
