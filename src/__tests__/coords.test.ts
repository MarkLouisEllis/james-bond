import { randomCoords } from '@/lib/coords';

describe('randomCoords', () => {
  it('returns latitude within [-90, 90]', () => {
    const { latitude } = randomCoords();
    expect(latitude).toBeGreaterThanOrEqual(-90);
    expect(latitude).toBeLessThanOrEqual(90);
  });

  it('returns longitude within [-180, 180]', () => {
    const { longitude } = randomCoords();
    expect(longitude).toBeGreaterThanOrEqual(-180);
    expect(longitude).toBeLessThanOrEqual(180);
  });

  it('returns different values on successive calls', () => {
    const a = randomCoords();
    const b = randomCoords();
    expect(a).not.toEqual(b);
  });
});
