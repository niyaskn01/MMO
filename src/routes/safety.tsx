import {createFileRoute} from '@tanstack/react-router';import {InfoPage} from '@/components/marketplace/info';import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/safety')({staticData:{sitemap:true},head:()=>meta('Travel With Confidence','Adult-only professional guides, profile verification, reporting and travel safety.'),component:()=> <InfoPage page="safety"/>});
