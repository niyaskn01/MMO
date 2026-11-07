import {createFileRoute} from '@tanstack/react-router';import {InfoPage} from '@/components/marketplace/info';import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/terms')({staticData:{sitemap:true},head:()=>meta('Terms of use','Terms for the meetmeoutside demonstration travel marketplace.'),component:()=> <InfoPage page="terms"/>});
