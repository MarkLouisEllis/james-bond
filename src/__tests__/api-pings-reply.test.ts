/**
 * @jest-environment node
 */
import { POST } from '@/app/api/pings/[id]/route';

jest.mock('@/lib/auth', () => ({ requireUserId: jest.fn() }));
jest.mock('@/db/pings', () => ({ getPingById: jest.fn(), createPing: jest.fn() }));
jest.mock('@/lib/coords', () => ({
  randomCoords: jest.fn(() => ({ latitude: 51.5, longitude: -0.12 })),
}));

const { requireUserId } = jest.requireMock('@/lib/auth');
const { getPingById, createPing } = jest.requireMock('@/db/pings');

const ownPing = {
  id: 1,
  seqNum: 1,
  userId: 'u1',
  latitude: 10,
  longitude: 20,
  parentId: null,
  createdAt: new Date(),
};

function makeRequest(id: string) {
  return new Request(`http://localhost/api/pings/${id}`, { method: 'POST' });
}

describe('POST /api/pings/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a child ping with parentId and seqNum when replying to own ping', async () => {
    requireUserId.mockResolvedValue('u1');
    getPingById.mockResolvedValue(ownPing);
    createPing.mockResolvedValue({
      id: 2,
      seqNum: 2,
      userId: 'u1',
      latitude: 51.5,
      longitude: -0.12,
      parentId: 1,
      createdAt: new Date(),
    });

    const res = await POST(makeRequest('1'), { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.parentId).toBe(1);
    expect(body.seqNum).toBe(2);
    expect(createPing).toHaveBeenCalledWith(expect.objectContaining({ parentId: 1 }));
  });

  it('returns 404 when ping belongs to another user', async () => {
    requireUserId.mockResolvedValue('u1');
    getPingById.mockResolvedValue(null);

    const res = await POST(makeRequest('99'), { params: Promise.resolve({ id: '99' }) });
    expect(res.status).toBe(404);
  });

  it('returns 401 when not authenticated', async () => {
    requireUserId.mockRejectedValue(new Error('Unauthorized'));

    const res = await POST(makeRequest('1'), { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(401);
  });
});
