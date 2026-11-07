import {useEffect, useRef, useState} from 'react';
import {Upload, X, ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {validatePhotos} from '@/lib/marketplace/photos';

export function PhotoUpload({files,onChange,disabled}:{files:File[];onChange:(files:File[])=>void;disabled:boolean}) {
 const input=useRef<HTMLInputElement>(null);
 const [previews,setPreviews]=useState<string[]>([]);
 const [error,setError]=useState('');
 useEffect(()=>{const urls=files.map(f=>URL.createObjectURL(f));setPreviews(urls);return()=>urls.forEach(url=>URL.revokeObjectURL(url));},[files]);
 return <fieldset className="form-wide min-w-0"><legend className="mb-2 text-xs">Photos</legend>
 <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" aria-label="Upload listing photos" disabled={disabled} onChange={e=>{const next=[...files,...Array.from(e.target.files??[])];try{validatePhotos(next);onChange(next);setError('');}catch(err){setError(err instanceof Error?err.message:'Unable to select photos');}e.target.value='';}}/>
 <Button type="button" variant="outline" disabled={disabled} onClick={()=>input.current?.click()}><Upload/>Upload photos</Button>
 <div className="grid grid-cols-3 gap-3 mt-3">{previews.map((url,i)=><div key={url} className="relative min-w-0"><img src={url} alt={`Listing photo ${i+1}`} className="aspect-square w-full object-cover rounded-md"/>{i===0&&<span className="absolute top-1 left-1 bg-card text-foreground text-xs px-2 py-1 rounded-sm">Cover</span>}<div className="flex justify-between mt-1">{i>0?<Button size="icon" variant="ghost" type="button" title="Make cover photo" aria-label={`Make photo ${i+1} cover`} disabled={disabled} onClick={()=>onChange([files[i],...files.filter((_,index)=>index!==i)].filter((f):f is File=>Boolean(f)))}><ArrowLeft/></Button>:<span/>}<Button size="icon" variant="ghost" type="button" title="Remove photo" aria-label={`Remove photo ${i+1}`} disabled={disabled} onClick={()=>onChange(files.filter((_,index)=>index!==i))}><X/></Button></div></div>)}</div>{error&&<p role="alert" className="error-text">{error}</p>}</fieldset>;
}