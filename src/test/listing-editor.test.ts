import {describe,it,expect} from 'vitest';
import {listingEditSchema,listingUpdate} from '@/lib/marketplace/listing-editor';
const base={kind:'stay',id:'s1',name:'Edited stay',city:'kochi',price:2400,description:'Updated',rating:4.5,images:['folder/first.webp','folder/second.webp']};
describe('Administrator listing updates',()=>{
 it('saves edited listing values',()=>{const update=listingUpdate(listingEditSchema.parse({...base,amenities:['WiFi','Pool'],active:false}));expect(update.values).toMatchObject({name:'Edited stay',price:2400,amenities:['WiFi','Pool'],active:false});});
 it('uses the first replacement photo as the cover',()=>{expect(listingUpdate(listingEditSchema.parse(base)).values).toMatchObject({image:'folder/first.webp',images:base.images});});
 it('preserves checkbox selections for guides',()=>{expect(listingUpdate(listingEditSchema.parse({...base,kind:'companion',age:24,languages:['English','Hindi'],interests:['Food','Nature'],services:['Local Guide','Food Guide']})).values).toMatchObject({languages:['English','Hindi'],interests:['Food','Nature'],services:['Local Guide','Food Guide']});});
 it('rejects guides younger than eighteen on edit',()=>{expect(listingEditSchema.safeParse({...base,kind:'companion',age:17}).success).toBe(false);});
});
