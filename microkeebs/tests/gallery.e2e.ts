import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

for (const width of [1280, 390]) {
 test(`gallery controls and theme persistence at ${width}px`, async ({app, browser, screen}) => {
  await browser.setViewport({width,height:900});
  await app.open('/microkeebs/');
  if(width===390) await screen.getByRole('button','I Understand').click();
  await expect(screen.getByRole('button',{name:'MX',exact:true})).toBeVisible();
  await screen.getByRole('button',{name:'EC',exact:true}).click();
  await screen.getByRole('button',{name:'All',exact:true}).click();
  await screen.getByRole('button','Open keyboard search').click();
  await screen.getByRole('textbox','Search keyboards').fill('definitely-no-keyboard-matches-92834');
  expect(await browser.evaluate(()=>document.querySelectorAll('.card-title').length)).toBe(0);
  await screen.getByRole('textbox','Search keyboards').fill('');
  expect(await browser.evaluate(()=>document.querySelectorAll('.card-title').length>0)).toBe(true);
  await screen.getByRole('button','Toggle theme').click();
  await app.open('/microkeebs/');
  await expect(screen.getByRole('button','Toggle theme')).toBeVisible();
  expect(await browser.evaluate(()=>localStorage.getItem('theme'))).toBe('dark');
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
