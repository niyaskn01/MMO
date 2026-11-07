import {describe,it,expect} from 'vitest';
import {coverPhoto,listingPhotos} from '@/lib/marketplace/photos';
describe('Listing photo rules',()=>{
 it('automatically uses the first photo for the card cover',()=>{expect(coverPhoto(['first.webp','second.webp'],'old.webp')).toBe('first.webp');});
 it('preserves multiple photos in their chosen order',()=>{expect(listingPhotos({images:['first.webp','second.webp'],image:'old.webp'})).toEqual(['first.webp','second.webp']);});
});