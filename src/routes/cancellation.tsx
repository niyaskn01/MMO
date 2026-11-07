import {createFileRoute} from '@tanstack/react-router';import {InfoPage} from '@/components/marketplace/info';import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/cancellation')({staticData:{sitemap:true},head:()=>meta('Cancellation policy','Enquiry changes and cancellation expectations for your travel plans.'),component:()=> <InfoPage page="cancellation"/>});
