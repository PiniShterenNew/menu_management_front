if(!self.define){let s,e={};const l=(l,r)=>(l=new URL(l+".js",r).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(r,i)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let u={};const t=s=>l(s,n),o={module:{uri:n},exports:u,require:t};e[n]=Promise.all(r.map((s=>o[s]||t(s)))).then((s=>(i(...s),u)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/@ant-design-DdFivUGV.js",revision:null},{url:"assets/@babel-BZ1DyXOP.js",revision:null},{url:"assets/@ctrl-DOFZgDuz.js",revision:null},{url:"assets/@emotion-CW87jbl0.js",revision:null},{url:"assets/@fortawesome-C0L5sp0l.js",revision:null},{url:"assets/@kurkle-BZxJdD1U.js",revision:null},{url:"assets/@rc-component-BD1ecEfG.js",revision:null},{url:"assets/@reduxjs-DkgbS889.js",revision:null},{url:"assets/@remix-run-Br25Cn4W.js",revision:null},{url:"assets/@socket.io-Dkula2eQ.js",revision:null},{url:"assets/antd-DlnLO6_M.js",revision:null},{url:"assets/axios-CCb-kr4I.js",revision:null},{url:"assets/chart.js-BkMDj0WH.js",revision:null},{url:"assets/classnames-BK5ccKcQ.js",revision:null},{url:"assets/compute-scroll-into-view-DWa9QgjM.js",revision:null},{url:"assets/copy-to-clipboard-iuHVwNMD.js",revision:null},{url:"assets/css-mediaquery-DcYbJrVh.js",revision:null},{url:"assets/dayjs-Cjk_ngT2.js",revision:null},{url:"assets/engine.io-client-C44f3zIw.js",revision:null},{url:"assets/engine.io-parser-BiEtp6m2.js",revision:null},{url:"assets/hyphenate-style-name-HOLnhz8K.js",revision:null},{url:"assets/immer-DqxjFn0G.js",revision:null},{url:"assets/index-DqDBY8RQ.css",revision:null},{url:"assets/index-UTe2QBwc.js",revision:null},{url:"assets/json2mq-l0sNRNKZ.js",revision:null},{url:"assets/lodash-c2uuq3A4.js",revision:null},{url:"assets/matchmediaquery-sVpnrumr.js",revision:null},{url:"assets/moment-DAXtSDIU.js",revision:null},{url:"assets/prop-types-CGJacfSb.js",revision:null},{url:"assets/rc-cascader-Dsdn8jK4.js",revision:null},{url:"assets/rc-checkbox-ae98rr8G.js",revision:null},{url:"assets/rc-collapse-Sa2qEOEN.js",revision:null},{url:"assets/rc-dialog-BJ6kepq5.js",revision:null},{url:"assets/rc-drawer-C8quB5B7.js",revision:null},{url:"assets/rc-dropdown-Da3MgyDj.js",revision:null},{url:"assets/rc-field-form-PoB2IUsc.js",revision:null},{url:"assets/rc-image-r5lEuzw7.js",revision:null},{url:"assets/rc-input-BRLy7sut.js",revision:null},{url:"assets/rc-input-number-BwB4iNCr.js",revision:null},{url:"assets/rc-mentions-CYOiYjy4.js",revision:null},{url:"assets/rc-menu-e0_DzC_N.js",revision:null},{url:"assets/rc-motion-BzJF__u1.js",revision:null},{url:"assets/rc-notification-BNK1IKot.js",revision:null},{url:"assets/rc-overflow-9-dkHgxx.js",revision:null},{url:"assets/rc-pagination-A9xLk7rH.js",revision:null},{url:"assets/rc-picker-DbUcv_uP.js",revision:null},{url:"assets/rc-progress-OqnQ2e-B.js",revision:null},{url:"assets/rc-rate-OqnQ2e-B.js",revision:null},{url:"assets/rc-resize-observer-DeFxiL4a.js",revision:null},{url:"assets/rc-segmented-DzhW_wAa.js",revision:null},{url:"assets/rc-select-DpePyUm5.js",revision:null},{url:"assets/rc-slider-CeC1CEWW.js",revision:null},{url:"assets/rc-steps-OqnQ2e-B.js",revision:null},{url:"assets/rc-switch-paHhadbx.js",revision:null},{url:"assets/rc-table-DhOsINyF.js",revision:null},{url:"assets/rc-tabs-Dc3LrWqC.js",revision:null},{url:"assets/rc-textarea-DxqSq3sC.js",revision:null},{url:"assets/rc-tooltip-0PE3otFq.js",revision:null},{url:"assets/rc-tree-CfIotKiT.js",revision:null},{url:"assets/rc-tree-select-C_HLsqOa.js",revision:null},{url:"assets/rc-upload-9z-1Ov6Z.js",revision:null},{url:"assets/rc-util-Dfq69fzz.js",revision:null},{url:"assets/rc-virtual-list-C7_giQpG.js",revision:null},{url:"assets/react-CeYxiRmC.js",revision:null},{url:"assets/react-chartjs-2-_DSQRZ-q.js",revision:null},{url:"assets/react-dom-Bwn-WS6j.js",revision:null},{url:"assets/react-redux-BueUvsQ2.js",revision:null},{url:"assets/react-responsive-BvfnkcyR.js",revision:null},{url:"assets/react-router-dom-wwaf5TwT.js",revision:null},{url:"assets/react-router-LxoAU2QN.js",revision:null},{url:"assets/redux-DITMfSWq.js",revision:null},{url:"assets/redux-thunk-ClJT1hhx.js",revision:null},{url:"assets/reselect-CAnb5Hs8.js",revision:null},{url:"assets/resize-observer-polyfill-B1PUzC5B.js",revision:null},{url:"assets/scheduler-CzFDRTuY.js",revision:null},{url:"assets/scroll-into-view-if-needed-BZeNfFF0.js",revision:null},{url:"assets/shallow-equal-BQUY1Bas.js",revision:null},{url:"assets/socket.io-client-CDVIIGn8.js",revision:null},{url:"assets/socket.io-parser-BBkuslX-.js",revision:null},{url:"assets/string-convert-l0sNRNKZ.js",revision:null},{url:"assets/stylis-OW4gUFyn.js",revision:null},{url:"assets/throttle-debounce-CUWDS_la.js",revision:null},{url:"assets/toggle-selection-BHUZwh74.js",revision:null},{url:"assets/use-sync-external-store-DVf9xoj9.js",revision:null},{url:"assets/uuid-l0sNRNKZ.js",revision:null},{url:"index.html",revision:"937e0805e1517ec285b718a09580c3d2"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/icon-192x192.png",revision:"17e8f6320867eae727ab2daaea5cef7e"},{url:"icons/icon-512x512.png",revision:"17e8f6320867eae727ab2daaea5cef7e"},{url:"manifest.webmanifest",revision:"1201d173d8ad58da46795d0b6f5cd312"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
