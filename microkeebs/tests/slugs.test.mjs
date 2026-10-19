import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';
const source=readFileSync(new URL('../src/utils/slugUtils.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {generateSlugInfo,findBuildBySlug}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
test('punctuation and duplicate titles round-trip without mutating input',()=>{
 const builds=[{id:'later',title:'! Board !',timestamp:'2025-02-01'},{id:'early',title:'! Board !',timestamp:'2025-01-01'}];
 const original=JSON.stringify(builds);
 for(const build of builds){const info=generateSlugInfo(build,builds);assert.equal(info.baseSlug,'board');assert.equal(findBuildBySlug(info.baseSlug,String(info.counter),builds),build);}
 assert.equal(JSON.stringify(builds),original);
});
test('invalid or missing build routes return null',()=>{
 assert.equal(findBuildBySlug('missing',undefined,[]),null);
 assert.equal(findBuildBySlug('board','0',[{id:'a',title:'Board',timestamp:'2025-01-01'}]),null);
});
test('source delegates click encoding to the canonical slug helper',()=>{
 const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
 assert.match(app,/generateSlugInfo\(build,/);
 assert.doesNotMatch(app,/const baseSlug = build.title/);
});
