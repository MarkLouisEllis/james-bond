// We could consider moving this to a seperate utils folder if we had more utility functions, but for now it is small enough to stay here.
export function randomCoords() {
  return {
    latitude: Math.random() * 180 - 90,
    longitude: Math.random() * 360 - 180,
  };
}
