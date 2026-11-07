import {createServerFn} from '@tanstack/react-start';
import {createClient} from '@supabase/supabase-js';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import type {Database} from '@/integrations/supabase/types';
import {requestSchema} from './rules';
import {bookingEnd} from './availability';
import {isExperience} from './options';
import {requestIdentity} from './request-identity';
export const getAccountAccess=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.rpc('is_admin');if(error)throw new Error('Unable to check account access. Please try again.');return {admin:Boolean(data)};
});

export const getCatalog = createServerFn({method:'GET'}).handler(async()=>{

//   console.log(
//   '[DATABASE CONNECTION]',
//   new URL(process.env['SUPABASE_URL']!).hostname
// );
 const key=process.env['SUPABASE_PUBLISHABLE_KEY']!;
 const db=createClient<Database>(process.env['SUPABASE_URL']!,key,{auth:{persistSession:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_')&&h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
  const [stays,companions,destinations,reviews,reservations]=await Promise.all([db.from('stays').select('id,name,city,description,property_type,price,rating,review_count,image,amenities,rooms,house_rules,host,active,is_demo,images'),db.from('companions').select('*'),db.from('destinations').select('*'),db.from('reviews').select('*'),db.from('listing_reservations').select('kind,listing_id,start_date,end_date').gte('end_date',new Date().toISOString().slice(0,10))]);
  for(const r of [stays,companions,destinations,reviews,reservations])if(r.error)throw new Error(r.error.message);
  const rows=[...(stays.data??[]),...(companions.data??[])];
  const paths=[...new Set(rows.flatMap(row=>row.images??[]))];
  const signed=paths.length?await db.storage.from('listing-images').createSignedUrls(paths,86400):null;
  if(signed?.error)throw new Error('Unable to load listing photos.');
  const urls=new Map((signed?.data??[]).map(row=>[row.path,row.signedUrl]));
  const resolve=<T extends {image:string;images:string[]}>(row:T)=>{const photos=row.images.map(path=>urls.get(path)).filter((url):url is string=>Boolean(url));return {...row,images:photos,image:photos[0]??row.image};};
  return {experiences:(stays.data??[]).filter(isExperience).map(resolve),stays:(stays.data??[]).filter(row=>!isExperience(row)).map(resolve),companions:(companions.data??[]).map(resolve),destinations:destinations.data??[],reviews:reviews.data??[],reservations:reservations.data??[]};
});
export const sendRequest=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(requestSchema).handler(async({data,context})=>{
 const {data:account,error:accountError}=await context.supabase.auth.getUser();
 if(accountError||!account.user)throw new Error('Please sign in to submit a request.');
 const identity=requestIdentity(account.user);
 data.name=identity.name;data.email=identity.email;
 const {supabaseAdmin:db}=await import('@/integrations/supabase/client.server');
 if(data.kind==='stay'||data.kind==='companion'){
  if(!data.listing_id)throw new Error('Please select a listing.');
  const result=data.kind==='stay'?await db.from('stays').select('id,name,city,active').eq('id',data.listing_id).eq('active',true).maybeSingle():await db.from('companions').select('id,name,city').eq('id',data.listing_id).eq('verification','Verified').gte('age',18).maybeSingle();
  if(!result.data)throw new Error('This listing is no longer available.');
  data.listing_name=result.data.name;data.destination=result.data.city;
  if((data.travel_date??'')<new Date().toISOString().slice(0,10))throw new Error('Please choose a current or future travel date.');
   if(data.travel_date){const {data:conflicts,error}=await db.from('listing_reservations').select('start_date').eq('kind',data.kind).eq('listing_id',data.listing_id).lt('start_date',bookingEnd(data.travel_date,data.duration,data.duration_unit,data.kind)).gt('end_date',data.travel_date);if(error)throw new Error('Unable to check availability.');if(conflicts?.length)throw new Error('This listing is assigned for those dates. Please choose different dates.');}
 }
 const {count,error:limitError}=await db.from('booking_requests').select('id',{count:'exact',head:true}).eq('email',data.email).gte('created_at',new Date(Date.now()-3600000).toISOString());
 if(limitError)throw new Error('Unable to check request limit. Please try again.');
 if((count??0)>=5)throw new Error('You have sent several requests. Please try again in an hour.');
 const {data:row,error}=await db.from('booking_requests').insert({...data,listing_id:data.listing_id??null,travel_date:data.travel_date||null}).select('id').single();if(error)throw new Error('Your request could not be saved. Please try again.');return {id:row.id};
});
export const getAdmin=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data:allowed}=await context.supabase.rpc('is_admin');if(!allowed)return {allowed:false,stays:[],companions:[],requests:[],users:[],photoUrls:{} as Record<string,string>,userId:context.userId};
 const [s,c,r,u]=await Promise.all([context.supabase.from('stays').select('*'),context.supabase.from('companions').select('*'),context.supabase.from('booking_requests').select('*').order('created_at',{ascending:false}),context.supabase.rpc('admin_account_directory')]);
 for(const v of [s,c,r,u])if(v.error)throw new Error(v.error.message);const paths=[...new Set([...(s.data??[]),...(c.data??[])].flatMap(row=>row.images))];const signed=paths.length?await context.supabase.storage.from('listing-images').createSignedUrls(paths,3600):null;const photoUrls:Record<string,string>={};for(const photo of signed?.data??[])if(photo.path&&photo.signedUrl)photoUrls[photo.path]=photo.signedUrl;return {allowed:true,stays:s.data??[],companions:c.data??[],requests:r.data??[],users:u.data??[],photoUrls,userId:context.userId};
});
export const adminUpdate=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({table:z.enum(['stays','companions','booking_requests']),id:z.string(),value:z.string()})).handler(async({data,context})=>{
 const {data:allowed}=await context.supabase.rpc('is_admin');if(!allowed)throw new Error('Admin access required');
 let error;
 if(data.table==='stays')({error}=await context.supabase.from('stays').update({active:data.value==='true'}).eq('id',data.id));
 else if(data.table==='companions')({error}=await context.supabase.from('companions').update({verification:z.enum(['Pending Verification','Verified','Rejected','Inactive']).parse(data.value)}).eq('id',data.id));
 else ({error}=await context.supabase.from('booking_requests').update({status:z.enum(['New','Contacted','Confirmed','Cancelled','Completed']).parse(data.value)}).eq('id',data.id));
 if(error)throw new Error(error.message);return true;
});
export const addListing=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({kind:z.enum(['stay','companion']),name:z.string().min(2),city:z.string(),price:z.coerce.number().int().positive(),description:z.string(),images:z.array(z.string().regex(/^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/)).min(1),property_type:z.string().default('Homestay'),amenities:z.string().default(''),rooms:z.string().default(''),house_rules:z.string().default(''),contact:z.string().default(''),age:z.coerce.number().int().min(18).default(18),gender:z.string().default(''),languages:z.string().default(''),interests:z.string().default(''),services:z.string().default(''),experience:z.coerce.number().int().min(0).default(0),hourly_price:z.coerce.number().int().min(0).default(300),availability:z.string().default('Available on selected dates')})).handler(async({data,context})=>{
 const {data:allowed}=await context.supabase.rpc('is_admin');if(!allowed)throw new Error('Admin access required');const split=(s:string)=>s.split(',').map(x=>x.trim()).filter(Boolean);
 const place=data.city.trim();if(place.length<2)throw new Error('Please enter a place name.');
 const cityId=place.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');if(!cityId)throw new Error('Please enter a place name.');
 const existing=await context.supabase.from('destinations').select('id').eq('id',cityId).maybeSingle();if(existing.error)throw new Error('Unable to check destinations.');
 if(!existing.data){const created=await context.supabase.from('destinations').insert({id:cityId,name:place,image:'kerala',description:`Discover stays and local travel companions in ${place}.`});if(created.error)throw new Error('Unable to create the new place.');}
 const r=data.kind==='stay'?await context.supabase.from('stays').insert({name:data.name,city:cityId,price:data.price,description:data.description,image:data.images[0]??'',images:data.images,property_type:data.property_type,amenities:split(data.amenities),rooms:data.rooms,house_rules:data.house_rules,contact:data.contact}):await context.supabase.from('companions').insert({name:data.name,city:cityId,price:data.price,about:data.description,image:data.images[0]??'',images:data.images,age:data.age,gender:data.gender,languages:split(data.languages),interests:split(data.interests),services:split(data.services),experience:data.experience,hourly_price:data.hourly_price,availability:data.availability});if(r.error)throw new Error(r.error.message);return true;
});
