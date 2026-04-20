import { requireUserId } from '@/lib/auth';
import { auth } from '@clerk/nextjs/server';

const mockAuth = auth as unknown as jest.Mock;

describe('requireUserId', () => {
  it('returns userId when authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: 'user-123' });
    const userId = await requireUserId();
    expect(userId).toBe('user-123');
  });

  it('throws when not authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });
    await expect(requireUserId()).rejects.toThrow('Unauthorized');
  });
});
