(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{109:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return m}));var i=n(0),r=n.n(i);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,r=function(e,t){if(null==e)return{};var n,i,r={},o=Object.keys(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=r.a.createContext({}),b=function(e){var t=r.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},d=function(e){var t=b(e.components);return r.a.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},u=r.a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=b(n),u=i,m=d["".concat(a,".").concat(u)]||d[u]||p[u]||o;return n?r.a.createElement(m,l(l({ref:t},c),{},{components:n})):r.a.createElement(m,l({ref:t},c))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var c=2;c<o;c++)a[c]=n[c];return r.a.createElement.apply(null,a)}return r.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},87:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return b}));var i=n(3),r=n(7),o=(n(0),n(109)),a={id:"node_options",title:"Node Options",sidebar_label:"Node Options"},l={unversionedId:"node_options",id:"node_options",isDocsHomePage:!1,title:"Node Options",description:"Introduction",source:"@site/docs/node_options.md",slug:"/node_options",permalink:"/docs/node_options",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/node_options.md",version:"current",sidebar_label:"Node Options",sidebar:"docs",previous:{title:"Contexts",permalink:"/docs/contexts"},next:{title:"Timing",permalink:"/docs/timing"}},s=[{value:"Introduction",id:"introduction",children:[]},{value:"Visibility thresholds",id:"visibility-thresholds",children:[]},{value:"Folder creation",id:"folder-creation",children:[]}],c={toc:s};function b(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(i.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"introduction"},"Introduction"),Object(o.b)("p",null,"The basic functions like ",Object(o.b)("inlineCode",{parentName:"p"},"describe"),", ",Object(o.b)("inlineCode",{parentName:"p"},"it"),", etc. are aliases to lower-level functions called ",Object(o.b)("inlineCode",{parentName:"p"},"describe'"),", ",Object(o.b)("inlineCode",{parentName:"p"},"it'"),", etc. The lower-level versions accept ",Object(o.b)("strong",{parentName:"p"},"node options")," which you can use to fine-tune how each node behaves."),Object(o.b)("h2",{id:"visibility-thresholds"},"Visibility thresholds"),Object(o.b)("p",null,'In a given test tree, some nodes are usually more "interesting" for reporting purposes than others. Nodes like ',Object(o.b)("inlineCode",{parentName:"p"},"before")," and ",Object(o.b)("inlineCode",{parentName:"p"},"parallel")," are more about controlling setup and semantics, so you may not care about them as much as ",Object(o.b)("inlineCode",{parentName:"p"},"describe")," and ",Object(o.b)("inlineCode",{parentName:"p"},"it")," nodes. (Which is not to say these nodes are never interesting; if a ",Object(o.b)("inlineCode",{parentName:"p"},"before")," node throws an exception, you still want the ability to examine it.)"),Object(o.b)("p",null,"For example, consider some tests that initialize a server and a database, then run some tests in parallel. Which of the following failure reports is more useful?"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},'before (set up server), before (initialize database), describe "server database", parallel, it "tests table 1"'),Object(o.b)("li",{parentName:"ul"},'describe "server database tests", it "tests table 1"')),Object(o.b)("p",null,"The latter makes it easier to quickly pick out which test failed."),Object(o.b)("p",null,"To allow this kind of filtering, every test node has a number associated with it called its ",Object(o.b)("em",{parentName:"p"},"visibility threshold"),". This is a number from ",Object(o.b)("inlineCode",{parentName:"p"},"0")," to ",Object(o.b)("inlineCode",{parentName:"p"},"Infinity"),' representing the visual "priority" of a node. Sandwich formatters are designed so that you can set or toggle a threshold such that only nodes whose value falls under the threshold are displayed. This gives us the ability to have deeply nested and complex test trees, but prune away the complexity when desired.'),Object(o.b)("p",null,"The default visibility thresholds for each node is as follows:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"0"),": ",Object(o.b)("inlineCode",{parentName:"li"},"it")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"50"),": ",Object(o.b)("inlineCode",{parentName:"li"},"describe")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"70"),": ",Object(o.b)("inlineCode",{parentName:"li"},"parallel")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"100"),": ",Object(o.b)("inlineCode",{parentName:"li"},"introduce"),", ",Object(o.b)("inlineCode",{parentName:"li"},"before"),", ",Object(o.b)("inlineCode",{parentName:"li"},"after"),", ",Object(o.b)("inlineCode",{parentName:"li"},"around")," (and their ",Object(o.b)("inlineCode",{parentName:"li"},"*each")," and ",Object(o.b)("inlineCode",{parentName:"li"},"*with")," versions)")),Object(o.b)("p",null,"If you want to set ",Object(o.b)("em",{parentName:"p"},"custom")," visibility thresholds, you can use the primed versions of the node functions to do it. For example:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-haskell"},"-- | A version of 'before' that has a lower visibility threshold\nmyBefore = before' (defaultNodeOptions { nodeOptionsVisibilityThreshold = 50 })\n")),Object(o.b)("h2",{id:"folder-creation"},"Folder creation"),Object(o.b)("p",null,"By default, every node in the test tree will get an associated folder in the ",Object(o.b)("a",{parentName:"p",href:"/docs#on-disk-results"},"on-disk results"),"."))}b.isMDXComponent=!0}}]);