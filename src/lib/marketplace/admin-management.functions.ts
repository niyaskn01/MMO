import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {listingEditSchema,listingUpdate} from './listing-editor';
export const editListing=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(listingEditSchema).handler(async({data,context})=>{
 const access=await context.supabase.rpc('is_admin');if(access.error||!access.data)throw new Error('Administrator access required');
 const table=data.kind==='stay'?'stays':'companions';
 const current=await context.supabase.from(table).select('images').eq('id',data.id).single();if(current.error)throw new Error('Listing not found');
 if(current.data.images.length&&!data.images.length)throw new Error('Keep at least one listing photo.');
 if(data.images.length){const photos=await context.supabase.storage.from('listing-images').createSignedUrls(data.images,60);if(photos.error||photos.data?.some(p=>p.error||!p.signedUrl))throw new Error('One or more listing photos are unavailable.');}
 const update=listingUpdate(data);
 const result=update.kind==='stay'?await context.supabase.from('stays').update(update.values).eq('id',data.id).select('id').single():await context.supabase.from('companions').update(update.values).eq('id',data.id).select('id').single();
 if(result.error)throw new Error('Unable to save listing changes.');return true;
});
export const deleteListing=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({kind:z.enum(['stay','companion']),id:z.string().min(1)})).handler(async({data,context})=>{
 const {error}=await context.supabase.rpc('admin_delete_listing',{listing_kind:data.kind,target_id:data.id});if(error)throw new Error(error.message);return true;
});
export const setAccountRole=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid(),admin:z.boolean()})).handler(async({data,context})=>{
 const {error}=await context.supabase.rpc('admin_set_account_role',{target_user:data.id,make_admin:data.admin});if(error)throw new Error(error.message);return true;
});
