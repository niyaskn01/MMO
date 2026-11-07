import {queryOptions} from '@tanstack/react-query';
import {getCatalog,getAdmin} from './data.functions';
export const catalogQuery=queryOptions({queryKey:['catalog'],queryFn:()=>getCatalog(),staleTime:60000});
export const adminQuery=queryOptions({queryKey:['admin'],queryFn:()=>getAdmin()});
export type Catalog=Awaited<ReturnType<typeof getCatalog>>;
export type Stay=Catalog['stays'][number];
export type Companion=Catalog['companions'][number];
export type Destination=Catalog['destinations'][number];
