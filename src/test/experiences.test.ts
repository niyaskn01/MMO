import {describe,it,expect} from 'vitest';
import {activityOptions,isExperience,experienceCategories} from '@/lib/marketplace/options';
describe('Experience categories',()=>{
 it('includes the five requested activity choices',()=>{expect(activityOptions).toEqual(['Kayaking','Boating','Go Karting','Hiking','Slack Lines']);});
 it('does not convert historical stays into experiences',()=>{expect(isExperience({property_type:'Homestay'})).toBe(false);expect(isExperience({property_type:'Kayaking'})).toBe(true);});
 it('accepts a manually entered activity category',()=>{expect(isExperience({property_type:'Rock Climbing'})).toBe(true);expect(isExperience({property_type:'  '})).toBe(false);});
 it('uses only categories from listings rather than preset categories',()=>{expect(experienceCategories([{property_type:'Rock Climbing'},{property_type:'Rock Climbing'},{property_type:'Ziplining'},{property_type:'Homestay'}])).toEqual(['Rock Climbing','Ziplining']);});
});