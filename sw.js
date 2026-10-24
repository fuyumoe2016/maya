/* Generated for a single Maya release. Activation is always user initiated. */
const CONFIG={"build":"8cc3695a5b57","shell":"shell-8cc3695a5b57.html","assets":["./maya-icon-192.png?v=rc4","./maya-icon.svg","./assets/index-ClG1xa9i.js","./assets/index-DGvaouKq.css","./maya-wordmark.svg","./manifest.webmanifest","./maya-icon-192.png","./maya-icon-512.png"]};
const ROOT=new URL('./',self.registration.scope);
const PREFIX='maya-offline:'+ROOT.pathname+':';
const CACHE=PREFIX+CONFIG.build;
const url=path=>new URL(path,ROOT).href;
self.addEventListener('install',event=>{event.waitUntil((async()=>{
 const response=await fetch(url(CONFIG.shell),{cache:'reload',credentials:'omit',redirect:'error'});
 if(!response.ok)throw Error('Maya shell unavailable');
 const html=await response.clone().text();if(!html.includes('id="editor"')||!html.includes(CONFIG.build))throw Error('Mismatched app build');
 const cache=await caches.open(CACHE);await cache.put(url('./'),response);
 await cache.addAll(CONFIG.assets.map(p=>new Request(url(p),{cache:'reload',credentials:'omit',redirect:'error'})));
 // No skipWaiting here: an open editor must keep its current release.
})());});
self.addEventListener('message',event=>{if(event.data?.type!=='ACTIVATE_UPDATE')return;event.waitUntil((async()=>{
 const port=event.ports?.[0];if(!port)return;
 const clients=(await self.clients.matchAll({type:'window',includeUncontrolled:true})).filter(c=>c.url.startsWith(ROOT.href));
 if(clients.length!==1||!clients.some(c=>c.id===event.source?.id)){port.postMessage({ok:false,reason:'ほかのMayaのタブ・画面を閉じてから更新してください。'});return;}
 port.postMessage({ok:true});await self.skipWaiting();
})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{
 // Retain one prior release as a fallback. Never touch another application's cache.
 const keys=(await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE);for(const key of keys.slice(0,-1))await caches.delete(key);
 await self.clients.claim();
})());});
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;const target=new URL(req.url);if(target.origin!==ROOT.origin||!target.href.startsWith(ROOT.href))return;
 const relative=target.pathname.slice(ROOT.pathname.length);
 if(relative==='release.json'){event.respondWith(fetch(req,{cache:'no-store',credentials:'omit',redirect:'error'}));return;}
 if(req.mode==='navigate'&&(relative===''||relative==='index.html')){event.respondWith((async()=>{const cached=await (await caches.open(CACHE)).match(url('./'));return cached||fetch(url(CONFIG.shell),{credentials:'omit'});})());return;}
 const allowed=CONFIG.assets.some(p=>new URL(p,ROOT).pathname===target.pathname);if(!allowed)return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req,{ignoreSearch:true});if(cached)return cached;return fetch(req,{credentials:'omit'});})());
});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{const id=event.notification.data?.noteId;const clients=(await self.clients.matchAll({type:'window',includeUncontrolled:true})).filter(c=>c.url.startsWith(ROOT.href));if(clients[0]){await clients[0].focus();clients[0].postMessage({type:'open-note',noteId:id});}else await self.clients.openWindow(url('./')+'#note='+encodeURIComponent(id||''));})());});
