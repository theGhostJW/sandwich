(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{103:function(e,t,n){"use strict";n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return a}));var i=n(16),o=n(105);function r(){const{siteConfig:{baseUrl:e="/",url:t}={}}=Object(i.default)();return{withBaseUrl:(n,i)=>function(e,t,n,{forcePrependBaseUrl:i=!1,absolute:r=!1}={}){if(!n)return n;if(n.startsWith("#"))return n;if(Object(o.b)(n))return n;if(i)return t+n;const a=n.startsWith(t)?n:t+n.replace(/^\//,"");return r?e+a:a}(t,e,n,i)}}function a(e,t={}){const{withBaseUrl:n}=r();return n(e,t)}},105:function(e,t,n){"use strict";function i(e){return!0===/^(\w*:|\/\/)/.test(e)}function o(e){return void 0!==e&&!i(e)}n.d(t,"b",(function(){return i})),n.d(t,"a",(function(){return o}))},79:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return p}));var i=n(3),o=n(7),r=(n(0),n(99)),a=n(103),s={id:"timing",title:"Timing",sidebar_label:"Timing"},c={unversionedId:"timing",id:"timing",isDocsHomePage:!1,title:"Timing",description:"Sandwich has a built-in notion of test timing. Timing can be useful when you have a large test suite and want to understand where it is spending the most time.",source:"@site/docs/timing.md",slug:"/timing",permalink:"/sandwich/docs/timing",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/timing.md",version:"current",sidebar_label:"Timing",sidebar:"docs",previous:{title:"Node Options",permalink:"/sandwich/docs/node_options"},next:{title:"Terminal UI Formatter",permalink:"/sandwich/docs/formatters/tui"}},l=[{value:"Non-concurrent",id:"non-concurrent",children:[]},{value:"Dealing with concurrency",id:"dealing-with-concurrency",children:[]},{value:"Advanced configuration",id:"advanced-configuration",children:[]}],u={toc:l};function p(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(r.b)("wrapper",Object(i.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"Sandwich has a built-in notion of ",Object(r.b)("em",{parentName:"p"},"test timing"),". Timing can be useful when you have a large test suite and want to understand where it is spending the most time."),Object(r.b)("p",null,"The goal of the timing system is to create a nice summary report, ideally in the form of a ",Object(r.b)("a",{parentName:"p",href:"http://www.brendangregg.com/flamegraphs.html"},"flame graph"),"."),Object(r.b)("p",null,"You can select a test timer implementation you use in the Sandwich options. The default one targets ",Object(r.b)("a",{parentName:"p",href:"https://www.speedscope.app/"},"SpeedScope"),", a nice web-based tool for visualizing flame graphs."),Object(r.b)("h3",{id:"non-concurrent"},"Non-concurrent"),Object(r.b)("p",null,"The simplest use of timing occurs when we don't have any ",Object(r.b)("inlineCode",{parentName:"p"},"parallel")," stuff going on, so the tests all run in a single thread. To deal with multiple threads, see the ",Object(r.b)("a",{parentName:"p",href:"#dealing-with-concurrency"},"concurrency")," section."),Object(r.b)("p",null,"First of all, ",Object(r.b)("strong",{parentName:"p"},"every node in the test tree is timed by default"),'. Thus, the "describe" and "it" nodes in the example below will be timed automatically. You can prevent this by changing the ',Object(r.b)("a",{parentName:"p",href:"/docs/node_options"},"node options"),"."),Object(r.b)("p",null,"In addition, you can time arbitrary blocks of code using the ",Object(r.b)("inlineCode",{parentName:"p"},"timeAction")," function. This function is a ",Object(r.b)("inlineCode",{parentName:"p"},"bracket_")," style combinator that can be used to wrap an action. In the example below, we use it to wrap some sub-steps within a test."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-haskell",metastring:'title="https://github.com/thomasjm/sandwich/blob/master/sandwich-demos/demos/timing/Main.hs"',title:'"https://github.com/thomasjm/sandwich/blob/master/sandwich-demos/demos/timing/Main.hs"'},'timingDemo :: TopSpec\ntimingDemo = describe "Dinner tests" $ do\n  it "Makes dinner" $ do\n    pauseSeconds 1\n    timeAction "Makes pasta" $ do\n      timeAction "Heats water" $ pauseSeconds 1\n      timeAction "Boils noodles" $ pauseSeconds 0.8\n      timeAction "Decants noodles" $ pauseSeconds 0.7\n\n  it "Cleans up" $ do\n    pauseSeconds 1\n')),Object(r.b)("p",null,"When you run this code using the default implementation, it will output a file ",Object(r.b)("inlineCode",{parentName:"p"},"speedscope.json"),' in the root of the test results. If you drag and drop this file onto SpeedScope, you get a picture like the following. Note that the profile (in the center of the top bar) is "default." In the next section we\'ll explore using multiple threads (and thus multiple profiles).'),Object(r.b)("img",{alt:"Simple timing example",src:Object(a.a)("img/dinner_timing.png")}),Object(r.b)("h2",{id:"dealing-with-concurrency"},"Dealing with concurrency"),Object(r.b)("p",null,"Flame graphs need to be properly ",Object(r.b)("em",{parentName:"p"},"nested")," to be valid. If Frame A starts before Frame B, then Frame B must end before Frame A ends. When you run test subtrees in parallel, it's easy to violate this property and get stack frames that cross over each other. This will result in a malformed JSON file that makes the visualizer unhappy."),Object(r.b)("p",null,'The solution is to introduce "profiles" within the test timer to correspond to execution threads, and make sure you run in a single-threaded way ',Object(r.b)("em",{parentName:"p"},"within each profile"),". Below is a simple example of this in action. Note that we use the ",Object(r.b)("inlineCode",{parentName:"p"},"parallel")," keyword at the top level, to cause the two test trees underneath it to run in their own threads. Immediately underneath the ",Object(r.b)("inlineCode",{parentName:"p"},"parallel")," keyword, we use ",Object(r.b)("inlineCode",{parentName:"p"},"withTimingProfile")," to switch the profile for the rest of the sub-tree."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-haskell"},'timingParallelDemo :: TopSpec\ntimingParallelDemo = parallel $ do\n  withTimingProfile "italian" $\n    it "Makes Italian dinner" $ do\n      pauseSeconds 1\n      timeAction "Makes pasta" $ do\n        timeAction "Heats water" $ pauseSeconds 1\n        timeAction "Boils noodles" $ pauseSeconds 0.8\n        timeAction "Decants noodles" $ pauseSeconds 0.7\n\n  withTimingProfile "chinese" $\n    it "Makes Chinese dinner" $ do\n      pauseSeconds 0.1\n      timeAction "Makes rice" $ do\n        timeAction "Cooks rice" $ pauseSeconds 0.5\n        timeAction "Serves rice" $ pauseSeconds 0.2\n      pauseSeconds 0.3\n')),Object(r.b)("video",{width:"100%",controls:!0,autoplay:"true",muted:"true"},Object(r.b)("source",{src:Object(a.a)("img/timing_parallel.webm"),type:"video/webm"}),"Your browser does not support the video tag."),Object(r.b)("h2",{id:"advanced-configuration"},"Advanced configuration"),Object(r.b)("p",null,"You can configure some settings for the test timer as part of the normal ",Object(r.b)("inlineCode",{parentName:"p"},"Options")," object. To disable the test timer entirely, just switch to the ",Object(r.b)("inlineCode",{parentName:"p"},"NullTestTimer"),":"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-haskell"},"myOptions = defaultOptions { optionsTestTimerType = NullTestTimerType }\n")),Object(r.b)("p",null,"Every test timer implementation has some implementation-specific options. For example, you can pass an arg with ",Object(r.b)("inlineCode",{parentName:"p"},"SpeedScopeTestTimerType")," to cause it to emit a raw timing data file in addition to the JSON file. This is a simple event-based format with one timing event per line, and it can be useful to debug parallelism issues or convert to another format."),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},"If you'd like to support another timing format or visualizer, please open a PR! It should be easy to add more.")))}p.isMDXComponent=!0},99:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return b}));var i=n(0),o=n.n(i);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,i,o=function(e,t){if(null==e)return{};var n,i,o={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=o.a.createContext({}),u=function(e){var t=o.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=u(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},m=o.a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,a=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=u(n),m=i,b=p["".concat(a,".").concat(m)]||p[m]||d[m]||r;return n?o.a.createElement(b,s(s({ref:t},l),{},{components:n})):o.a.createElement(b,s({ref:t},l))}));function b(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,a=new Array(r);a[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:i,a[1]=s;for(var l=2;l<r;l++)a[l]=n[l];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);