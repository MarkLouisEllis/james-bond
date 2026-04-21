/**
 * @jest-environment node
 */
import { GET } from '@/app/api/pings/route';

jest.mock('@/lib/auth', () => ({ requireUserId: jest.fn() }));
jest.mock('@/db/pings', () => ({ listPingsForUser: jest.fn() }));

const { requireUserId } = jest.requireMock('@/lib/auth');
const { listPingsForUser } = jest.requireMock('@/db/pings');

const mockPings = [
  { id: 5, userId: 'u1', latitude: 10, longitude: 20, parentId: null, createdAt: new Date() },
  { id: 4, userId: 'u1', latitude: 30, longitude: 40, parentId: null, createdAt: new Date() },
];

describe('GET /api/pings', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns all pings for the authenticated user', async () => {
    requireUserId.mockResolvedValue('u1');
    listPingsForUser.mockResolvedValue(mockPings);

    const res = await GET(new Request('http://localhost/api/pings'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0].id).toBe(5);
  });

  it('returns 401 when not authenticated', async () => {
    requireUserId.mockRejectedValue(new Error('Unauthorized'));

    const res = await GET(new Request('http://localhost/api/pings'));
    expect(res.status).toBe(401);
  });
});
