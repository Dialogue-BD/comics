const fs=require('fs');
const assert=require('node:assert/strict');
const {chromium}=require('/Users/timothyhall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='http://127.0.0.1:8766/graphic-design-module.html';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 async function goLab(id){await page.goto(base+'#library/'+id)}
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const errors=[];const network=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>network.push(r.url()));
 assert.equal((await page.goto(base+'#library/hub')).status(),200);
 await page.locator('.logo-grid').scrollIntoViewIfNeeded(); await page.locator('.logo-card img').evaluateAll(async es=>{await Promise.all(es.map(e=>e.decode().catch(()=>{})))}); await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'graphic-design-module/qa/desktop-hub.png',fullPage:true});
 assert.equal(await page.locator('.lab-card').count(),7);
 assert.equal(await page.locator('#join, #join-dialog, .tags, .tag').count(),0);
 assert.equal(await page.evaluate(()=>typeof window.QRCode),'undefined');
 assert.equal(await page.locator('.logo-card img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)),true);
 await goLab('typography');await page.locator('.design-explorer > summary').click();
 await page.locator('[data-reveal="serif"]').click();assert.match(await page.locator('[data-reveal="serif"]').innerText(),/finishing stroke/);
 await page.locator('[data-anatomy="counter"]').click();assert.match(await page.locator('#anatomy-highlight').innerHTML(),/ellipse/);
 await page.locator('#tracking').fill('9');assert.match(await page.locator('#spacing-preview').getAttribute('style'),/9px/);
 await page.locator('#leading').fill('210');assert.match(await page.locator('#leading-preview').getAttribute('style'),/2.1/);
 await page.locator('[data-pair="2"]').click();assert.match(await page.locator('#pair-explain').innerText(),/compete/);
 await page.locator('.practice-notebook>summary').click();await page.locator('#note-message').fill('I chose a calm serif headline for the café.');await page.locator('#mark-done').click();
 await goLab('color');await page.locator('.design-explorer > summary').click();
 await page.locator('#fg').fill('#000000');await page.locator('#bg').fill('#FFFFFF');assert.equal(await page.locator('#ratio').innerText(),'21.00:1');
 await page.locator('#fg').fill('#FFFFFF');assert.equal(await page.locator('#ratio').innerText(),'1.00:1');assert.equal(await page.locator('.status.fail').count(),3);
 await page.locator('#fg').fill('BAD');assert.match(await page.locator('#color-error').innerText(),/six-digit/);assert.equal(await page.locator('#ratio').innerText(),'—');
 await page.locator('#accessible-preset').click();assert.match(await page.locator('#contrast-results').innerText(),/Pass · AA normal/);
 await page.locator('#harmony').selectOption('complement');await page.locator('#hue').fill('30');assert.equal(await page.locator('.swatch').count(),5);await page.locator('#save-palette').click();
 await goLab('layout');await page.locator('.design-explorer > summary').click();await page.locator('#layout-slider').fill('0');assert.match(await page.locator('#good-poster').getAttribute('style'),/0%/);await page.locator('#layout-slider').fill('100');assert.match(await page.locator('#layout-value').innerText(),/100% before/);await page.locator('[data-principle="proximity"]').click();assert.match(await page.locator('#principle-result').innerText(),/related/);
 await goLab('clients');await page.locator('.design-explorer > summary').click();await page.locator('#scenario-reply').fill('I can add this for an extra fee.');
 for(let i=0;i<8;i++){await page.locator(`[data-scenario="${i}"]`).click();assert.ok((await page.locator('.client-chat').innerText()).length>40)}
 await page.locator('[data-scenario="0"]').click();assert.equal(await page.locator('#scenario-reply').inputValue(),'I can add this for an extra fee.');
 await goLab('toolkit');await page.locator('.design-explorer > summary').click();for(let i=0;i<9;i++){await page.locator(`[data-tool="${i}"]`).click();assert.equal(await page.locator('.tool-card').count(),3)}
 await goLab('visual');await page.locator('.design-explorer > summary').click();await page.locator('[data-light="2"]').click();await page.locator('[data-view="2"]').click();assert.match(await page.locator('#scene-label').innerText(),/Dramatic shadow · High/);await page.locator('[data-direction="rtl"]').click();assert.equal(await page.locator('#direction-demo').getAttribute('dir'),'rtl');
 await page.screenshot({path:'graphic-design-module/qa/desktop-visual.png',fullPage:true});
 await goLab('judgment');await page.locator('.design-explorer > summary').click();
 const answers=[0,1,2,0];for(let i=0;i<4;i++){await page.locator(`[data-quiz="${i}"]`).click();await page.locator(`[data-answer="${(answers[i]+1)%3}"]`).click();assert.equal(await page.locator('.feedback.wrong').count(),1);await page.locator(`[data-answer="${answers[i]}"]`).click();await page.locator('#show-fix').click();assert.equal(await page.locator('#show-fix').isDisabled(),true)}
 await page.locator('#theme').click();await page.waitForTimeout(350);assert.equal(await page.locator('body.stage-mode').count(),1);const stageColors=await page.locator('.language-panel').evaluate(e=>({bg:getComputedStyle(e).backgroundColor,fg:getComputedStyle(e).color}));assert.equal(stageColors.fg,'rgb(244, 241, 230)');await page.screenshot({path:'graphic-design-module/qa/stage-judgment.png',fullPage:true});await page.locator('#theme').click();
 await page.goto(base+'#library/typography');assert.equal(await page.locator('#note-message').inputValue(),'I chose a calm serif headline for the café.');assert.match(await page.locator('#mark-done').innerText(),/Completed/);
 await page.locator('.practice-notebook>summary').click();const download=page.waitForEvent('download');await page.locator('[data-action="export"]').click();const d=await download;await d.saveAs('graphic-design-module/qa/notebook-test.txt');const notes=fs.readFileSync('graphic-design-module/qa/notebook-test.txt','utf8');assert.match(notes,/calm serif/);assert.match(notes,/extra fee/);assert.match(notes,/color \/ palette/);
 // The learning app must keep working after all network access disappears.
 await context.setOffline(true);await goLab('color');await page.locator('.design-explorer > summary').click();await page.locator('#accessible-preset').click();assert.match(await page.locator('#ratio').innerText(),/:1/);await goLab('toolkit');await page.locator('.design-explorer > summary').click();await page.locator('[data-tool="5"]').click();assert.equal(await page.locator('.tool-card').count(),3);await context.setOffline(false);
 // No viewport overflow in any section at a narrow phone width.
 await page.setViewportSize({width:390,height:844});
 const views=['hub','typography','color','layout','clients','toolkit','visual','judgment'];
 for(const v of views){await page.goto(base+'#library/'+v);const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));assert.ok(dimensions.scroll<=dimensions.view,`${v}: horizontal overflow ${JSON.stringify(dimensions)}`);if(['hub','color','clients'].includes(v))await page.screenshot({path:`graphic-design-module/qa/mobile-${v}.png`,fullPage:true})}
 assert.deepEqual(errors,[]);assert.deepEqual([...new Set(network.filter(x=>!x.startsWith('data:')&&!x.startsWith('blob:')&&!x.startsWith('http://127.0.0.1:8766/')))],[]);
 await browser.close();console.log('PASS: seven labs, 12 logos, color math, sliders, phrase scenarios, nine toolkit categories, quiz feedback/refinements, note persistence/export, activity-only header, offline interactions, phone overflow, and no runtime errors or external requests.');
})().catch(e=>{console.error(e);process.exit(1)});
