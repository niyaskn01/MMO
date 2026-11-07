import {describe,it,expect} from 'vitest';
import {accountDestination,bookingEnd,reservedOn} from '@/lib/marketplace/availability';
describe('Account destinations',()=>{
 it('sends customers home',()=>expect(accountDestination(false)).toBe('/'));
 it('sends admins to the dashboard',()=>expect(accountDestination(true)).toBe('/admin'));
});
describe('Fixed date assignments',()=>{
 const assigned=[{kind:'companion',listing_id:'guide-1',start_date:'2026-10-10',end_date:'2026-10-12'}];
 it('reserves the requested dates, not the end date',()=>{expect(reservedOn(assigned,'companion','guide-1','2026-10-10')).toBe(true);expect(reservedOn(assigned,'companion','guide-1','2026-10-11')).toBe(true);expect(reservedOn(assigned,'companion','guide-1','2026-10-12')).toBe(false)});
 it('releases cancelled assignments when removed',()=>expect(reservedOn([],'companion','guide-1','2026-10-10')).toBe(false));
 it('only reserves the selected listing',()=>expect(reservedOn(assigned,'companion','guide-2','2026-10-10')).toBe(false));
 it('uses nights for stays',()=>expect(bookingEnd('2026-10-10',3,'days','stay')).toBe('2026-10-13'));
 it('reserves a full date for an hourly guide assignment',()=>expect(bookingEnd('2026-10-10',4,'hours','companion')).toBe('2026-10-11'));
});