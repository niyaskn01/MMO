import {describe,it,expect} from 'vitest';
import {isPublicCompanion,requestSchema} from '@/lib/marketplace/rules';
describe('Marketplace rules',()=>{
 it('allows adults 18+ only',()=>{expect(isPublicCompanion({age:17,verification:'Verified'})).toBe(false);expect(isPublicCompanion({age:18,verification:'Verified'})).toBe(true);});
 it('publishes only admin-verified companions',()=>{for(const verification of ['Pending Verification','Rejected','Inactive'])expect(isPublicCompanion({age:27,verification})).toBe(false);expect(isPublicCompanion({age:27,verification:'Verified'})).toBe(true);});
 it('requires travel date for booking enquiries',()=>{expect(requestSchema.safeParse({kind:'stay',name:'Test Traveler',email:'traveler@example.com',phone:'9876543210'}).success).toBe(false);});
});
