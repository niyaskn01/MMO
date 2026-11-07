import {createFileRoute} from '@tanstack/react-router';
import {ExperienceDetail} from '@/components/marketplace/experiences';
import {catalogQuery} from '@/lib/marketplace/queries';
import {meta} from '@/lib/marketplace/assets';
export const Route=createFileRoute('/experiences/$id')({staticData:{sitemap:true},loader:({context})=>context.queryClient.ensureQueryData(catalogQuery),head:({loaderData,params})=>meta(loaderData?.experiences.find(e=>e.id===params.id)?.name??'Experience details','Explore activity photos, inclusions and safety details, and request an outdoor experience with meetmeoutside.'),component:Experience});
function Experience(){return <ExperienceDetail id={Route.useParams().id}/>}