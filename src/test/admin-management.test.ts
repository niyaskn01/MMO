import {beforeEach,describe,it,expect,vi} from 'vitest';
const state=vi.hoisted(()=>({context:{supabase:{rpc:vi.fn(),from:vi.fn()},userId:'caller'}}));
vi.mock('@tanstack/react-start',()=>({createServerFn:()=>{const builder={middleware:()=>builder,inputValidator:()=>builder,handler:(fn:(args:unknown)=>unknown)=>(args:{data:unknown})=>fn({...args,context:state.context})};return builder;}}));
vi.mock('@/integrations/supabase/auth-middleware',()=>({requireSupabaseAuth:{}}));
import {editListing,deleteListing,setAccountRole} from '@/lib/marketplace/admin-management.functions';
describe('Administrator management authorization',()=>{
 beforeEach(()=>vi.clearAllMocks());
 it('does not update listings for customer accounts',async()=>{state.context.supabase.rpc.mockResolvedValue({data:false,error:null});await expect(editListing({data:{kind:'stay',id:'s1',name:'Stay',city:'kochi',price:2000,description:'',images:[],rating:0}})).rejects.toThrow('Administrator access required');expect(state.context.supabase.from).not.toHaveBeenCalled();});
 it('passes user promotions to the protected database operation',async()=>{state.context.supabase.rpc.mockResolvedValue({error:null});await setAccountRole({data:{id:'e3c60d18-9242-476a-9127-66ecc0b5d596',admin:true}});expect(state.context.supabase.rpc).toHaveBeenCalledWith('admin_set_account_role',{target_user:'e3c60d18-9242-476a-9127-66ecc0b5d596',make_admin:true});});
 it('reports deletion blocked by existing assignments',async()=>{state.context.supabase.rpc.mockResolvedValue({error:{message:'Cancel current or upcoming assignments before deleting this listing, or mark it inactive'}});await expect(deleteListing({data:{kind:'stay',id:'s1'}})).rejects.toThrow('Cancel current or upcoming assignments');});
});
