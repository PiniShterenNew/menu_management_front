if(!self.define){let s,l={};const e=(e,r)=>(e=new URL(e+".js",r).href,l[e]||new Promise((l=>{if("document"in self){const s=document.createElement("script");s.src=e,s.onload=l,document.head.appendChild(s)}else s=e,importScripts(e),l()})).then((()=>{let s=l[e];if(!s)throw new Error(`Module ${e} didn’t register its module`);return s})));self.define=(r,i)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(l[n])return;let u={};const t=s=>e(s,n),o={module:{uri:n},exports:u,require:t};l[n]=Promise.all(r.map((s=>o[s]||t(s)))).then((s=>(i(...s),u)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/@ant-design-DbJKpMgD.js",revision:null},{url:"assets/@babel-D3CJPhrF.js",revision:null},{url:"assets/@ctrl-DOFZgDuz.js",revision:null},{url:"assets/@emotion-CW87jbl0.js",revision:null},{url:"assets/@floating-ui-CyZwn0-1.js",revision:null},{url:"assets/@fortawesome-iG2bi8FM.js",revision:null},{url:"assets/@kurkle-BZxJdD1U.js",revision:null},{url:"assets/@radix-ui-CBgnhGTJ.js",revision:null},{url:"assets/@rc-component-DPyZj6wr.js",revision:null},{url:"assets/@reduxjs-DkgbS889.js",revision:null},{url:"assets/@remix-run-Br25Cn4W.js",revision:null},{url:"assets/@socket.io-Dkula2eQ.js",revision:null},{url:"assets/antd-DjcCNDy_.js",revision:null},{url:"assets/axios-CCb-kr4I.js",revision:null},{url:"assets/chart.js-BkMDj0WH.js",revision:null},{url:"assets/classnames-CAxFPVRb.js",revision:null},{url:"assets/clsx-l0sNRNKZ.js",revision:null},{url:"assets/compute-scroll-into-view-DWa9QgjM.js",revision:null},{url:"assets/copy-to-clipboard-DN2oU9Yq.js",revision:null},{url:"assets/css-mediaquery-DcYbJrVh.js",revision:null},{url:"assets/d3-array-l0sNRNKZ.js",revision:null},{url:"assets/d3-color-l0sNRNKZ.js",revision:null},{url:"assets/d3-format-l0sNRNKZ.js",revision:null},{url:"assets/d3-interpolate-l0sNRNKZ.js",revision:null},{url:"assets/d3-path-l0sNRNKZ.js",revision:null},{url:"assets/d3-scale-l0sNRNKZ.js",revision:null},{url:"assets/d3-shape-l0sNRNKZ.js",revision:null},{url:"assets/d3-time-format-l0sNRNKZ.js",revision:null},{url:"assets/d3-time-l0sNRNKZ.js",revision:null},{url:"assets/dayjs-DMN7meC7.js",revision:null},{url:"assets/decimal.js-light-l0sNRNKZ.js",revision:null},{url:"assets/dom-helpers-l0sNRNKZ.js",revision:null},{url:"assets/engine.io-client-C44f3zIw.js",revision:null},{url:"assets/engine.io-parser-BiEtp6m2.js",revision:null},{url:"assets/eventemitter3-l0sNRNKZ.js",revision:null},{url:"assets/fast-equals-l0sNRNKZ.js",revision:null},{url:"assets/hyphenate-style-name-HOLnhz8K.js",revision:null},{url:"assets/immer-DqxjFn0G.js",revision:null},{url:"assets/index-CxvVh3w4.js",revision:null},{url:"assets/index-HYN1vrHO.css",revision:null},{url:"assets/internmap-l0sNRNKZ.js",revision:null},{url:"assets/json2mq-l0sNRNKZ.js",revision:null},{url:"assets/lodash-l0sNRNKZ.js",revision:null},{url:"assets/matchmediaquery-9DU1HNkU.js",revision:null},{url:"assets/moment-BAfwh5x7.js",revision:null},{url:"assets/prop-types-Bq5K3Feg.js",revision:null},{url:"assets/rc-cascader-BQNHmctl.js",revision:null},{url:"assets/rc-checkbox-XvbJzSrO.js",revision:null},{url:"assets/rc-collapse-7fzksgK-.js",revision:null},{url:"assets/rc-dialog-B4yQaf15.js",revision:null},{url:"assets/rc-drawer-DjgcoIVX.js",revision:null},{url:"assets/rc-dropdown-DBn3Vn4f.js",revision:null},{url:"assets/rc-field-form-DdGYHmQ7.js",revision:null},{url:"assets/rc-image-CQiP7trl.js",revision:null},{url:"assets/rc-input-DGbryaDy.js",revision:null},{url:"assets/rc-input-number-Do8zGlOB.js",revision:null},{url:"assets/rc-mentions-bHJaRkHB.js",revision:null},{url:"assets/rc-menu-CXhGSgjF.js",revision:null},{url:"assets/rc-motion-DZL9tseL.js",revision:null},{url:"assets/rc-notification-m3oA-fH0.js",revision:null},{url:"assets/rc-overflow-BihHMfjR.js",revision:null},{url:"assets/rc-pagination-CZPuIcur.js",revision:null},{url:"assets/rc-picker-C6pnqAVS.js",revision:null},{url:"assets/rc-progress-BECVEO62.js",revision:null},{url:"assets/rc-rate-DZJGunt9.js",revision:null},{url:"assets/rc-resize-observer-DAFDewDD.js",revision:null},{url:"assets/rc-segmented-DWUgWqHo.js",revision:null},{url:"assets/rc-select-Enbnx8e0.js",revision:null},{url:"assets/rc-slider-DD_nx1-o.js",revision:null},{url:"assets/rc-steps-jTTkhuna.js",revision:null},{url:"assets/rc-switch-B_QRjvBh.js",revision:null},{url:"assets/rc-table-rj7zZJss.js",revision:null},{url:"assets/rc-tabs-BUPz9aOH.js",revision:null},{url:"assets/rc-textarea-BF1YsysJ.js",revision:null},{url:"assets/rc-tooltip-BAFIWTUD.js",revision:null},{url:"assets/rc-tree-BDK0sBoh.js",revision:null},{url:"assets/rc-tree-select-CIFjXQU7.js",revision:null},{url:"assets/rc-upload-Qr6rbM7J.js",revision:null},{url:"assets/rc-util-CNJZKBfo.js",revision:null},{url:"assets/rc-virtual-list-D8xMsbcw.js",revision:null},{url:"assets/react-BoqISt01.js",revision:null},{url:"assets/react-chartjs-2-0Z_sSmBf.js",revision:null},{url:"assets/react-colorful-BRztN3dn.js",revision:null},{url:"assets/react-dom-Bk743r0W.js",revision:null},{url:"assets/react-hook-form-D6UMUFDh.js",revision:null},{url:"assets/react-redux-D3oi59tp.js",revision:null},{url:"assets/react-responsive-B9DcSnuZ.js",revision:null},{url:"assets/react-router-CBguhhk8.js",revision:null},{url:"assets/react-router-dom-UU0TJEQ6.js",revision:null},{url:"assets/react-smooth-D6UMUFDh.js",revision:null},{url:"assets/react-transition-group-7G3nM69O.js",revision:null},{url:"assets/recharts-D6UMUFDh.js",revision:null},{url:"assets/recharts-scale-l0sNRNKZ.js",revision:null},{url:"assets/redux-DITMfSWq.js",revision:null},{url:"assets/redux-thunk-ClJT1hhx.js",revision:null},{url:"assets/reselect-CAnb5Hs8.js",revision:null},{url:"assets/resize-observer-polyfill-B1PUzC5B.js",revision:null},{url:"assets/scheduler-CzFDRTuY.js",revision:null},{url:"assets/scroll-into-view-if-needed-BZeNfFF0.js",revision:null},{url:"assets/shallow-equal-BQUY1Bas.js",revision:null},{url:"assets/socket.io-client-CDVIIGn8.js",revision:null},{url:"assets/socket.io-parser-BBkuslX-.js",revision:null},{url:"assets/string-convert-l0sNRNKZ.js",revision:null},{url:"assets/stylis-OW4gUFyn.js",revision:null},{url:"assets/throttle-debounce-CUWDS_la.js",revision:null},{url:"assets/tiny-invariant-l0sNRNKZ.js",revision:null},{url:"assets/toggle-selection-BHUZwh74.js",revision:null},{url:"assets/use-sync-external-store-BQxMxw6g.js",revision:null},{url:"assets/uuid-l0sNRNKZ.js",revision:null},{url:"assets/victory-vendor-l0sNRNKZ.js",revision:null},{url:"index.html",revision:"5314b8ebb1a77af0bead83ae579232a5"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/icon-192x192.png",revision:"17e8f6320867eae727ab2daaea5cef7e"},{url:"icons/icon-512x512.png",revision:"17e8f6320867eae727ab2daaea5cef7e"},{url:"manifest.webmanifest",revision:"1201d173d8ad58da46795d0b6f5cd312"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
