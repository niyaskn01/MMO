import {createFileRoute} from '@tanstack/react-router';import {InfoPage} from '@/components/marketplace/info';import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/contact')({staticData:{sitemap:true},head:()=>meta('Contact our team','Send your Kerala travel questions to the meetmeoutside support team.'),component:()=> <InfoPage page="contact"/>});
