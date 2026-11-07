export type Reservation = {kind:string;listing_id:string;start_date:string;end_date:string};
export const accountDestination = (admin:boolean): '/' | '/admin' => admin ? '/admin' : '/';
export function bookingEnd(start:string,duration:number,unit='days',kind='stay') {
 const date=new Date(`${start}T00:00:00Z`);
 date.setUTCDate(date.getUTCDate()+(kind==='companion'&&unit==='hours'?Math.max(1,Math.ceil(duration/24)):duration));
 return date.toISOString().slice(0,10);
}
export const overlaps = (a:string,b:string,c:string,d:string) => a<d&&b>c;
export function reservedOn(reservations:Reservation[],kind:string,id:string,date:string,end=bookingEnd(date,1)) {
 return reservations.some(r=>r.kind===kind&&r.listing_id===id&&overlaps(date,end,r.start_date,r.end_date));
}
export function availabilityLabel(reservations:Reservation[],kind:string,id:string,fallback='Available',date=new Date().toISOString().slice(0,10)) {
 const upcoming=reservations.filter(r=>r.kind===kind&&r.listing_id===id&&r.end_date>date).sort((a,b)=>a.start_date.localeCompare(b.start_date));
 const current=upcoming.find(r=>r.start_date<=date);
 if(current)return `Assigned until ${current.end_date}`;
 if(upcoming[0])return `${fallback} · Assigned ${upcoming[0].start_date} – ${upcoming[0].end_date} (end exclusive)`;
 return fallback;
}