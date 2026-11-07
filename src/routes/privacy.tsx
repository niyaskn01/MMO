import {createFileRoute} from '@tanstack/react-router';import {InfoPage} from '@/components/marketplace/info';import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/privacy')({staticData:{sitemap:true},head:()=>meta('Privacy policy','How meetmeoutside uses and protects enquiry and account information.'),component:()=> <InfoPage page="privacy"/>});
