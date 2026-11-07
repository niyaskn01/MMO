import {createFileRoute} from '@tanstack/react-router';
import {ExperienceBrowse} from '@/components/marketplace/experiences';
import {browseSearch} from '@/components/marketplace/browse';
import {catalogQuery} from '@/lib/marketplace/queries';
import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/experiences/')({staticData:{sitemap:true},head:()=>meta('Outdoor experiences','Explore kayaking, boating, go karting, hiking and slack lines with meetmeoutside.'),validateSearch:browseSearch,loader:({context})=>context.queryClient.ensureQueryData(catalogQuery),component:Experiences});
function Experiences(){return <ExperienceBrowse initialDestination={Route.useSearch().destination??''}/>}