/**
 * @jest-environment node
 */

jest.mock('@/db/index', () => ({
  db: {
    select: jest.fn(),
  },
}));

import { latestPingsForUser, getLatestTrailForUser } from '@/db/pings';

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

const ping1 = {
  id: 1,
  userId: 'u1',
  latitude: 10,
  longitude: 20,
  parentId: null,
  createdAt: new Date('2024-01-01'),
};
const ping2 = {
  id: 2,
  userId: 'u1',
  latitude: 30,
  longitude: 40,
  parentId: 1,
  createdAt: new Date('2024-01-02'),
};
const ping3 = {
  id: 3,
  userId: 'u1',
  latitude: 50,
  longitude: 60,
  parentId: 2,
  createdAt: new Date('2024-01-03'),
};

function makeLatestPingChain(result: object[]) {
  return {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(result),
  };
}
function makeParentFetchChain(result: object[]) {
  return {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(result),
  };
}
function makeAllIdsChain(result: object[]) {
  return {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockResolvedValue(result),
  };
}

describe('getLatestTrailForUser', () => {
  let db: { select: jest.Mock };

  beforeEach(() => {
    db = jest.requireMock('@/db/index').db;
    jest.clearAllMocks();
  });

  it('returns empty array when user has no pings', async () => {
    db.select.mockReturnValueOnce(makeLatestPingChain([]));
    const result = await getLatestTrailForUser('u1');
    expect(result).toEqual([]);
  });

  it('returns single-ping trail with correct seqNum', async () => {
    db.select
      .mockReturnValueOnce(makeLatestPingChain([ping1]))
      .mockReturnValueOnce(makeAllIdsChain([{ id: 1 }]));
    const result = await getLatestTrailForUser('u1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].seqNum).toBe(1);
  });

  it('walks parentId chain and returns ordered oldest → newest', async () => {
    db.select
      .mockReturnValueOnce(makeLatestPingChain([ping3]))
      .mockReturnValueOnce(makeParentFetchChain([ping2]))
      .mockReturnValueOnce(makeParentFetchChain([ping1]))
      .mockReturnValueOnce(makeAllIdsChain([{ id: 1 }, { id: 2 }, { id: 3 }]));
    const result = await getLatestTrailForUser('u1');
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1);
    expect(result[0].seqNum).toBe(1);
    expect(result[2].id).toBe(3);
    expect(result[2].seqNum).toBe(3);
  });

  it('caps at limit even if more parents exist', async () => {
    db.select
      .mockReturnValueOnce(makeLatestPingChain([ping3]))
      .mockReturnValueOnce(makeParentFetchChain([ping2]))
      .mockReturnValueOnce(makeAllIdsChain([{ id: 1 }, { id: 2 }, { id: 3 }]));
    const result = await getLatestTrailForUser('u1', 2);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(3);
  });
});
