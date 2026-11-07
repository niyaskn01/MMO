import {beforeEach,describe,it,expect,vi} from 'vitest';
const state=vi.hoisted(()=>({getUser:vi.fn(),from:vi.fn(),insert:vi.fn(),middleware:vi.fn(),authenticated:false}));
vi.mock('@tanstack/react-start',()=>({createServerFn:()=>{let protectedCall=false;const builder={middleware:(items:unknown[])=>{protectedCall=items.length>0;return builder;},inputValidator:()=>builder,handler:(fn:(args:unknown)=>unknown)=>(args:{data?:unknown})=>{if(protectedCall&&!state.authenticated)return Promise.reject(new Error('Unauthorized'));return fn({...args,context:{supabase:{auth:{getUser:state.getUser}}}});}};return builder;}}));
vi.mock('@/integrations/supabase/auth-middleware',()=>({requireSupabaseAuth:{}}));
vi.mock('@/integrations/supabase/client.server',()=>({supabaseAdmin:{from:state.from}}));
import {sendRequest} from '@/lib/marketplace/data.functions';
const input={kind:'contact' as const,name:'Fake Name',email:'spoofed@example.com',phone:'9876543210',message:'Request security check'};
describe('Authenticated request submissions',()=>{
 beforeEach(()=>{vi.clearAllMocks();state.authenticated=false;state.getUser.mockResolvedValue({data:{user:{id:'account',email:'athirapops12@gmail.com'}},error:null});const limit={eq:vi.fn().mockReturnThis(),gte:vi.fn().mockResolvedValue({count:0,error:null})};state.insert.mockReturnValue({select:()=>({single:async()=>({data:{id:'saved-reference'},error:null})})});state.from.mockReturnValue({select:()=>limit,insert:state.insert});});
 it('rejects unsigned requests before accessing the database',async()=>{await expect(sendRequest({data:{...input}})).rejects.toThrow('Unauthorized');expect(state.from).not.toHaveBeenCalled();});
 it('revalidates the user before saving even with a bearer token',async()=>{state.authenticated=true;state.getUser.mockResolvedValue({data:{user:null},error:{message:'expired'}});await expect(sendRequest({data:{...input}})).rejects.toThrow('Please sign in');expect(state.from).not.toHaveBeenCalled();});
 it('saves the authenticated email local part instead of submitted identity',async()=>{state.authenticated=true;await expect(sendRequest({data:{...input}})).resolves.toEqual({id:'saved-reference'});expect(state.insert).toHaveBeenCalledWith(expect.objectContaining({name:'athirapops12',email:'athirapops12@gmail.com'}));});
});