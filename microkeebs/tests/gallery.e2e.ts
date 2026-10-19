import { readFileSync } from 'node:fs';
import type { KeyboardBuild } from '../src/types/Build';
const builds = [...JSON.parse(readFileSync(new URL('../src/data/builds.json', import.meta.url), 'utf8')), ...JSON.parse(readFileSync(new URL('./builds.fixture.json', import.meta.url), 'utf8'))] as KeyboardBuild[];
import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

for (const width of [1280, 390]) {
 test(`gallery controls and theme persistence at ${width}px`, async ({app, browser, screen}) => {
  await browser.setViewport({width,height:900});
  await app.open('/microkeebs/');
  if(width===390) await screen.getByRole('button','I Understand').click();
  await expect(screen.getByRole('button',{name:'MX',exact:true})).toBeVisible();
  await screen.getByRole('button',{name:'EC',exact:true}).click();
  expect(await browser.evaluate(() => Array.from(document.querySelectorAll('[data-build-id]'), node => node.getAttribute('data-build-id')).sort())).toEqual(builds.filter(build => build.category === 'EC').map(build => build.id).sort());
  await screen.getByRole('button',{name:'All',exact:true}).click();
  expect(await browser.evaluate(() => document.querySelectorAll('[data-build-id]').length)).toBe(builds.length);
  await screen.getByRole('button','Open keyboard search').click();
  await screen.getByRole('textbox','Search keyboards').fill('definitely-no-keyboard-matches-92834');
  expect(await browser.evaluate(()=>document.querySelectorAll('.card-title').length)).toBe(0);
  await screen.getByRole('textbox','Search keyboards').fill('');
  expect(await browser.evaluate(()=>document.querySelectorAll('.card-title').length>0)).toBe(true);
  await screen.getByRole('button','Toggle theme').click();
  await app.open('/microkeebs/');
  await expect(screen.getByRole('button','Toggle theme')).toBeVisible();
  expect(await browser.evaluate(()=>localStorage.getItem('theme'))).toBe('dark');
  expect(await browser.evaluate(()=>document.body.dataset.theme)).toBe('dark');
 });
}

test('navigation and unknown build recovery',async({app,screen,browser})=>{
 await app.open('/microkeebs/#/builds/not-a-real-build');
 await expect(screen.getByRole('button','Open keyboard search')).toBeVisible();
 for(const label of ['Ranking','Blog','Commissions','Contact','Builds']) {
  await screen.getByRole('button',{name:label,exact:true}).click();
  expect(await browser.evaluate(()=>location.hash)).toBe('#/'+(label==='Ranking'?'rankings':label.toLowerCase()));
 }
 await expect(screen.getByRole('button','Open keyboard search')).toBeVisible();
});

test('duplicate-title build clicks open the canonical detail route', async ({app,screen,browser}) => {
 const build = builds.find(candidate => candidate.id === 'e2e-punctuation-2')!;
 await app.open('/microkeebs/');
 await screen.getByRole('button', {name:`Open ${build.title} (${build.timestamp.slice(0,10)})`,exact:true}).click();
 await expect(screen.getByRole('button','Back to Gallery')).toBeVisible();
 expect(await browser.evaluate(()=>location.hash)).toBe('#/builds/qa-keyboard/2');
 const images = await browser.evaluate(()=>Array.from(document.querySelectorAll('img'),image=>image.getAttribute('src')));
 expect(images.some(src => src?.includes(build.images[0]))).toBe(true);
});
