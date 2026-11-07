import {fireEvent,render,screen} from '@testing-library/react';
import {describe,it,expect,vi} from 'vitest';
import {useState} from 'react';
import {SearchBar,type SearchMode} from '@/components/marketplace/search';

const navigate=vi.hoisted(()=>vi.fn());
vi.mock('@tanstack/react-router',()=>({useNavigate:()=>navigate}));
function CategoryView(){
 const [mode,setMode]=useState<SearchMode>('companions');
 return <><SearchBar mode={mode} onModeChange={setMode}/><output data-testid="category">{mode}</output></>;
}
describe('homepage category selection',()=>{
 it('selects experiences exclusively and searches experiences',()=>{
  render(<CategoryView/>);
  fireEvent.click(screen.getByRole('button',{name:'Experiences'}));
  expect(screen.getByTestId('category').textContent).toBe('experiences');
  expect(screen.getByRole('button',{name:'Find a Travel Companion'}).getAttribute('aria-pressed')).toBe('false');
  fireEvent.click(screen.getByRole('button',{name:'Explore'}));
  expect(navigate).toHaveBeenLastCalledWith(expect.objectContaining({to:'/experiences'}));
 });
 it('switches back exclusively to companions and searches companions',()=>{
  render(<CategoryView/>);
  fireEvent.click(screen.getByRole('button',{name:'Experiences'}));
  fireEvent.click(screen.getByRole('button',{name:'Find a Travel Companion'}));
  expect(screen.getByTestId('category').textContent).toBe('companions');
  expect(screen.getByRole('button',{name:'Experiences'}).getAttribute('aria-pressed')).toBe('false');
  fireEvent.click(screen.getByRole('button',{name:'Explore'}));
  expect(navigate).toHaveBeenLastCalledWith(expect.objectContaining({to:'/companions'}));
 });
});