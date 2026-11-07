import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {imageFor} from '@/lib/marketplace/assets';
import {listingPhotos} from '@/lib/marketplace/photos';
export function PhotoGallery({item}:{item:{name:string;image:string;images?:string[]}}){
 const photos=listingPhotos(item);const [selected,setSelected]=useState(0);
 return <section aria-label={`${item.name} photos`}><img className="detail-photo" src={imageFor(photos[selected]??item.image)} alt={`${item.name}, photo ${selected+1}`} width={1024} height={1024}/>{photos.length>1&&<div className="flex gap-3 overflow-x-auto py-3">{photos.map((photo,i)=><Button type="button" variant={selected===i?'default':'outline'} className="h-20 w-24 p-1 shrink-0" key={`${photo}-${i}`} aria-label={`View photo ${i+1}`} aria-pressed={selected===i} onClick={()=>setSelected(i)}><img className="h-full w-full object-cover rounded-sm" src={imageFor(photo)} alt=""/></Button>)}</div>}</section>
}