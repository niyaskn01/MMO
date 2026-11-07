export const coverPhoto = (photos: string[], fallback: string) => photos[0] ?? fallback;
export const listingPhotos = (item: {images?: string[]; image: string}) => item.images?.length ? item.images : [item.image];
export const photoTypes = ['image/jpeg', 'image/png', 'image/webp'];
export function validatePhotos(files: File[]) {
  if (!files.length) throw new Error('Choose at least one photo.');
  if (files.some(file => !photoTypes.includes(file.type))) throw new Error('Choose JPG, PNG or WebP photos.');
  if (files.some(file => file.size > 10 * 1024 * 1024)) throw new Error('Each photo must be 10 MB or smaller.');
}