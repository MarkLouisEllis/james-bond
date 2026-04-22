/**
 * @jest-environment node
 */
import { POST } from '@/app/api/pings/route';

jest.mock('@/lib/auth', () => ({
  requireUserId: jest.fn(),
}));

jest.mock('@/db/pings', () => ({
  createPing: jest.fn(),
}));

jest.mock('@/lib/coords', () => ({
  randomCoords: jest.fn(() => ({ latitude: 51.5, longitude: -0.12 })),
}));

const { requireUserId } = jest.requireMock('@/lib/auth');
const { createPing } = jest.requireMock('@/db/pings');

describe('POST /api/pings', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a ping and returns 201 with seqNum when authenticated', async () => {
    requireUserId.mockResolvedValue('user-123');
    createPing.mockResolvedValue({
      id: 1,
      seqNum: 1,
      userId: 'user-123',
      latitude: 51.5,
      longitude: -0.12,
      parentId: null,
      createdAt: new Date(),
    });

    const res = await POST(new Request('http://localhost/api/pings'));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.userId).toBe('user-123');
    expect(body.latitude).toBe(51.5);
    expect(body.seqNum).toBe(1);
  });

  it('returns 401 when not authenticated', async () => {
    requireUserId.mockRejectedValue(new Error('Unauthorized'));

    const res = await POST(new Request('http://localhost/api/pings'));
    expect(res.status).toBe(401);
  });
});
