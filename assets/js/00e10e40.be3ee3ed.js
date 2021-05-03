(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{103:function(e,t,c){"use strict";c.d(t,"a",(function(){return p})),c.d(t,"b",(function(){return k}));var n=c(0),a=c.n(n);function r(e,t,c){return t in e?Object.defineProperty(e,t,{value:c,enumerable:!0,configurable:!0,writable:!0}):e[t]=c,e}function i(e,t){var c=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),c.push.apply(c,n)}return c}function o(e){for(var t=1;t<arguments.length;t++){var c=null!=arguments[t]?arguments[t]:{};t%2?i(Object(c),!0).forEach((function(t){r(e,t,c[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(c)):i(Object(c)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(c,t))}))}return e}function s(e,t){if(null==e)return{};var c,n,a=function(e,t){if(null==e)return{};var c,n,a={},r=Object.keys(e);for(n=0;n<r.length;n++)c=r[n],t.indexOf(c)>=0||(a[c]=e[c]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)c=r[n],t.indexOf(c)>=0||Object.prototype.propertyIsEnumerable.call(e,c)&&(a[c]=e[c])}return a}var h=a.a.createContext({}),u=function(e){var t=a.a.useContext(h),c=t;return e&&(c="function"==typeof e?e(t):o(o({},t),e)),c},p=function(e){var t=u(e.components);return a.a.createElement(h.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},d=a.a.forwardRef((function(e,t){var c=e.components,n=e.mdxType,r=e.originalType,i=e.parentName,h=s(e,["components","mdxType","originalType","parentName"]),p=u(c),d=n,k=p["".concat(i,".").concat(d)]||p[d]||l[d]||r;return c?a.a.createElement(k,o(o({ref:t},h),{},{components:c})):a.a.createElement(k,o({ref:t},h))}));function k(e,t){var c=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=c.length,i=new Array(r);i[0]=d;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:n,i[1]=o;for(var h=2;h<r;h++)i[h]=c[h];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,c)}d.displayName="MDXCreateElement"},68:function(e,t,c){"use strict";c.r(t),c.d(t,"frontMatter",(function(){return i})),c.d(t,"metadata",(function(){return o})),c.d(t,"toc",(function(){return s})),c.d(t,"default",(function(){return u}));var n=c(3),a=c(7),r=(c(0),c(103)),i={id:"sandwich-quickcheck",title:"QuickCheck integration"},o={unversionedId:"extensions/sandwich-quickcheck",id:"extensions/sandwich-quickcheck",isDocsHomePage:!1,title:"QuickCheck integration",description:"You can use sandwich-quickcheck (provided as a separate package) to easily integrate integrate QuickCheck tests into the test tree.",source:"@site/docs/extensions/sandwich-quickcheck.md",slug:"/extensions/sandwich-quickcheck",permalink:"/sandwich/docs/extensions/sandwich-quickcheck",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/extensions/sandwich-quickcheck.md",version:"current",sidebar:"docs",previous:{title:"Selenium integration",permalink:"/sandwich/docs/extensions/sandwich-webdriver"},next:{title:"Advanced",permalink:"/sandwich/docs/extensions/advanced"}},s=[{value:"Usage",id:"usage",children:[]},{value:"Modifying the args",id:"modifying-the-args",children:[]},{value:"Controlling QuickCheck parameters with command line args",id:"controlling-quickcheck-parameters-with-command-line-args",children:[]}],h={toc:s};function u(e){var t=e.components,c=Object(a.a)(e,["components"]);return Object(r.b)("wrapper",Object(n.a)({},h,c,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"You can use ",Object(r.b)("inlineCode",{parentName:"p"},"sandwich-quickcheck")," (provided as a separate package) to easily integrate integrate ",Object(r.b)("a",{parentName:"p",href:"http://www.cse.chalmers.se/~rjmh/QuickCheck/manual.html"},"QuickCheck")," tests into the test tree."),Object(r.b)("p",null,"Haddocks can be found ",Object(r.b)("a",{parentName:"p",href:"http://hackage.haskell.org/package/sandwich-quickcheck/docs/Test-Sandwich-QuickCheck.html"},"here"),"."),Object(r.b)("h2",{id:"usage"},"Usage"),Object(r.b)("p",null,"To use ",Object(r.b)("inlineCode",{parentName:"p"},"sandwich-quickcheck"),", just add the package to your project. Then, introduce a QuickCheck argument context using ",Object(r.b)("a",{parentName:"p",href:"http://hackage.haskell.org/package/sandwich-quickcheck/docs/Test-Sandwich-QuickCheck.html#v:introduceQuickCheck"},"introduceQuickCheck")," (or one of the primed versions). Now you can start writing props as test nodes using the ",Object(r.b)("a",{parentName:"p",href:"http://hackage.haskell.org/package/sandwich-quickcheck/docs/Test-Sandwich-QuickCheck.html#v:prop"},"prop")," function. For example:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-haskell",metastring:'title="https://github.com/thomasjm/sandwich/blob/master/sandwich-demos/demos/quickcheck/Main.hs"',title:'"https://github.com/thomasjm/sandwich/blob/master/sandwich-demos/demos/quickcheck/Main.hs"'},'quickCheckDemo :: TopSpec\nquickCheckDemo = describe "QuickCheck tests" $ introduceQuickCheck $ do\n  prop "List reversal" $ \\(xs :: [Int]) -> reverse (reverse xs) == xs\n  prop "Failing list reversal" $ \\(xs :: [Int]) -> (reverse xs) == xs\n')),Object(r.b)("h2",{id:"modifying-the-args"},"Modifying the args"),Object(r.b)("p",null,"If you use ",Object(r.b)("a",{parentName:"p",href:"http://hackage.haskell.org/package/sandwich-quickcheck/docs/Test-Sandwich-QuickCheck.html#v:introduceQuickCheck'"},"introduceQuickCheck'"),", you can pass your own value for the QuickCheck ",Object(r.b)("a",{parentName:"p",href:"https://hackage.haskell.org/package/QuickCheck/docs/Test-QuickCheck.html#t:Args"},"Args"),". (The default version uses ",Object(r.b)("a",{parentName:"p",href:"https://hackage.haskell.org/package/QuickCheck/docs/Test-QuickCheck.html#v:stdArgs"},"stdArgs"),")."),Object(r.b)("p",null,"If you want to modify the already-introduced arguments in a test tree, we provide the ",Object(r.b)("a",{parentName:"p",href:"http://hackage.haskell.org/package/sandwich-quickcheck/docs/Test-Sandwich-QuickCheck.html#v:modifyArgs"},"modifyArgs")," function, as well as helpers like ",Object(r.b)("inlineCode",{parentName:"p"},"modifyMaxSize"),", ",Object(r.b)("inlineCode",{parentName:"p"},"modifyMaxDiscardRatio"),", etc. These are modelled directly after HSpec's ",Object(r.b)("a",{parentName:"p",href:"https://hackage.haskell.org/package/hspec/docs/Test-Hspec-QuickCheck.html"},"Test.Hspec.QuickCheck"),"."),Object(r.b)("h2",{id:"controlling-quickcheck-parameters-with-command-line-args"},"Controlling QuickCheck parameters with command line args"),Object(r.b)("p",null,"There are not (yet) any built-in command line arguments for controlling QuickCheck parameters such as ",Object(r.b)("inlineCode",{parentName:"p"},"maxSize"),". However, you can add ",Object(r.b)("a",{parentName:"p",href:"../command_line"},"custom command line options")," to control any parameters you like."))}u.isMDXComponent=!0}}]);