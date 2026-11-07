import {z} from 'zod';
export const listingEditSchema=z.object({
 kind:z.enum(['stay','companion']),id:z.string().min(1),name:z.string().trim().min(2),city:z.string().min(1),price:z.coerce.number().int().positive(),description:z.string(),
 images:z.array(z.string().regex(/^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/)),
 property_type:z.string().default('Homestay'),amenities:z.array(z.string()).default([]),rooms:z.string().default(''),house_rules:z.string().default(''),host:z.string().default('Local host'),contact:z.string().default(''),active:z.boolean().default(true),
 age:z.coerce.number().int().min(18).max(100).default(18),gender:z.string().default(''),languages:z.array(z.string()).default([]),interests:z.array(z.string()).default([]),services:z.array(z.string()).default([]),experience:z.coerce.number().int().min(0).default(0),hourly_price:z.coerce.number().int().min(0).default(300),availability:z.string().default('Available on selected dates'),verification:z.enum(['Pending Verification','Verified','Rejected','Inactive']).default('Pending Verification'),rating:z.coerce.number().min(0).max(5),review_count:z.coerce.number().int().min(0).default(0),trips:z.coerce.number().int().min(0).default(0)
});
export function listingUpdate(input:z.infer<typeof listingEditSchema>){
 const common={name:input.name,city:input.city,price:input.price,images:input.images,rating:input.rating,...(input.images.length?{image:input.images[0]}:{})};
 if(input.kind==='stay')return {kind:'stay' as const,values:{...common,description:input.description,property_type:input.property_type,amenities:input.amenities,rooms:input.rooms,house_rules:input.house_rules,host:input.host,contact:input.contact,active:input.active,review_count:input.review_count}};
 return {kind:'companion' as const,values:{...common,about:input.description,age:input.age,gender:input.gender,languages:input.languages,interests:input.interests,services:input.services,experience:input.experience,hourly_price:input.hourly_price,availability:input.availability,verification:input.verification,trips:input.trips}};
}
