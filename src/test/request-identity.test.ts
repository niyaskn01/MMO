import {describe,it,expect} from 'vitest';
import {requestIdentity} from '@/lib/marketplace/request-identity';
describe('Request account identity',()=>{
 it('requires a signed-in email account',()=>{expect(()=>requestIdentity(null)).toThrow('Please sign in');expect(()=>requestIdentity({})).toThrow('Please sign in');});
 it('uses everything before @ as the uneditable request name',()=>{expect(requestIdentity({email:'athirapops12@gmail.com'})).toEqual({name:'athirapops12',email:'athirapops12@gmail.com'});});
});