import {createFileRoute,redirect} from '@tanstack/react-router';import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/list-property')({staticData:{sitemap:false},head:()=>meta('Explore outdoor experiences','Discover outdoor experiences with meetmeoutside.'),beforeLoad:()=>{throw redirect({to:'/experiences',statusCode:302})}});
