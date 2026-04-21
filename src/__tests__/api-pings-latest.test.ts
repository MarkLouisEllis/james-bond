/**
 * @jest-environment node
 */
import { GET } from '@/app/api/pings/latest/route';

jest.mock('@/lib/auth', () => ({ requireUserId: jest.fn() }));
jest.mock('@/db/pings', () => ({ latestPingsForUser: jest.fn() }));

const { requireUserId } = jest.requireMock('@/lib/auth');
const { latestPingsForUser } = jest.requireMock('@/db/pings');

const mockPings = [
  { id: 3, userId: 'u1', latitude: 10, longitude: 20, parentId: null, createdAt: new Date() },
  { id: 2, userId: 'u1', latitude: 30, longitude: 40, parentId: null, createdAt: new Date() },
  { id: 1, userId: 'u1', latitude: 50, longitude: 60, parentId: null, createdAt: new Date() },
];

describe('GET /api/pings/latest', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 3 latest pings when authenticated', async () => {
    requireUserId.mockResolvedValue('u1');
    latestPingsForUser.mockResolvedValue(mockPings);

    const res = await GET(new Request('http://localhost/api/pings/latest'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(3);
  });

  it('returns 401 when not authenticated', async () => {
    requireUserId.mockRejectedValue(new Error('Unauthorized'));

    const res = await GET(new Request('http://localhost/api/pings/latest'));
    expect(res.status).toBe(401);
  });
});
