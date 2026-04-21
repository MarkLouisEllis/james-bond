/**
 * @jest-environment node
 */

jest.mock('@/db/index', () => ({
  db: {
    select: jest.fn(),
    from: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
  },
}));

import { latestPingsForUser } from '@/db/pings';

const mockPings = [
  {
    id: 3,
    userId: 'u1',
    latitude: 10,
    longitude: 20,
    parentId: null,
    createdAt: new Date('2024-01-03'),
  },
  {
    id: 2,
    userId: 'u1',
    latitude: 30,
    longitude: 40,
    parentId: null,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 1,
    userId: 'u1',
    latitude: 50,
    longitude: 60,
    parentId: null,
    createdAt: new Date('2024-01-01'),
  },
];

describe('latestPingsForUser', () => {
  let db: Record<string, jest.Mock>;

  beforeEach(() => {
    db = jest.requireMock('@/db/index').db;
    jest.clearAllMocks();
    db.select.mockReturnValue(db);
    db.from.mockReturnValue(db);
    db.where.mockReturnValue(db);
    db.orderBy.mockReturnValue(db);
    db.limit.mockResolvedValue(mockPings);
  });

  it('returns the 3 most recent pings for a user', async () => {
    const result = await latestPingsForUser('u1');
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(3);
  });

  it('passes limit to query', async () => {
    await latestPingsForUser('u1', 3);
    expect(db.limit).toHaveBeenCalledWith(3);
  });
});
