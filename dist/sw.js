if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const c=e=>n(e,t),d={module:{uri:t},exports:o,require:c};i[t]=Promise.all(s.map((e=>d[e]||c(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CtAxZ7yW.css",revision:null},{url:"assets/index-DIjv_2CN.js",revision:null},{url:"index.html",revision:"2cb9e62dc4a7110f1b81caf3baaeaf77"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icon-192x192.png",revision:"960bcb4449c0f8e4be742e1dfcb76bd2"},{url:"icon-512x512.png",revision:"35fb82b8f338ae854dd4667340ec6dba"},{url:"manifest.webmanifest",revision:"056a082fe831ef8d01009251c15610ab"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
