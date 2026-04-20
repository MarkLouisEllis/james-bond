import '@testing-library/jest-dom';

// Mock Clerk (client)
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(() => ({
    userId: 'test-user-123',
    sessionId: 'test-session-123',
  })),
  clerkMiddleware: jest.fn((fn) => fn),
  requireAuth: jest.fn(),
}));

// Mock Clerk (server)
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => ({
    userId: 'test-user-123',
    sessionId: 'test-session-123',
  })),
}));
