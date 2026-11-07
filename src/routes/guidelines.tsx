import {createFileRoute} from '@tanstack/react-router';import {InfoPage} from '@/components/marketplace/info';import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/guidelines')({staticData:{sitemap:true},head:()=>meta('Community guidelines','Professional travel standards for hosts, local guides and travelers.'),component:()=> <InfoPage page="guidelines"/>});
