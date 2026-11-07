import {createFileRoute,redirect} from '@tanstack/react-router';import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/destinations/')({staticData:{sitemap:false},head:()=>meta('Discover local companions','Explore Kerala with verified local travel companions.'),beforeLoad:()=>{throw redirect({to:'/companions',statusCode:302})}});
