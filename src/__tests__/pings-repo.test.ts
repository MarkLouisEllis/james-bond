/**
 * @jest-environment node
 */

jest.mock('@/db/index', () => ({
  db: {
    select: jest.fn(),
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
  let db: { select: jest.Mock };

  beforeEach(() => {
    db = jest.requireMock('@/db/index').db;
    jest.clearAllMocks();

    // First select: count query — chain ends at .where()
    const countChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([{ total: 3 }]),
    };

    // Second select: data query — chain ends at .limit()
    const dataChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockPings),
    };

    db.select.mockReturnValueOnce(countChain).mockReturnValueOnce(dataChain);
  });

  it('returns the 3 most recent pings with seqNum for a user', async () => {
    const result = await latestPingsForUser('u1');
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(3);
    expect(result[0].seqNum).toBe(3); // total=3, index=0 → 3-0=3
    expect(result[2].seqNum).toBe(1); // total=3, index=2 → 3-2=1
  });

  it('passes limit to query', async () => {
    const result = await latestPingsForUser('u1', 3);
    // Grab the data chain's limit mock via the second select call
    const dataChain = db.select.mock.results[1].value;
    expect(dataChain.limit).toHaveBeenCalledWith(3);
    expect(result).toHaveLength(3);
  });
});
