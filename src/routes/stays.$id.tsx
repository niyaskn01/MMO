import {createFileRoute,redirect} from '@tanstack/react-router';import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/stays/$id')({staticData:{sitemap:false},head:()=>meta('Experience discovery','Find outdoor adventures with meetmeoutside.'),beforeLoad:()=>{throw redirect({to:'/experiences',statusCode:301})}});
