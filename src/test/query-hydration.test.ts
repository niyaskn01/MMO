import {QueryClient, dehydrate, hydrate} from '@tanstack/react-query';
import {describe, expect, it, vi} from 'vitest';

describe('Marketplace page cache hydration',()=>{
  it('reuses the server-loaded catalog instead of requesting it again',async()=>{
    const server=new QueryClient();
    const catalog={stays:[{id:'cliffside'}],companions:[],destinations:[],reviews:[],reservations:[]};
    server.setQueryData(['catalog'],catalog);
    const browser=new QueryClient();
    hydrate(browser,JSON.parse(JSON.stringify(dehydrate(server))));
    const fetchCatalog=vi.fn(async()=>({...catalog,stays:[]}));
    const result=await browser.ensureQueryData({queryKey:['catalog'],queryFn:fetchCatalog,staleTime:60000});
    expect(result.stays).toEqual([{id:'cliffside'}]);
    expect(fetchCatalog).not.toHaveBeenCalled();
    server.clear();browser.clear();
  });
});