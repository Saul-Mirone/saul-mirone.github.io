(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[989],{6114:function(t,e,n){var r=n(569),o=n(8948),i=n(8878),a=r.TypeError;t.exports=function(t){if(o(t))return t;throw a(i(t)+" is not a function")}},6327:function(t,e,n){var r=n(569),o=n(4115),i=r.String,a=r.TypeError;t.exports=function(t){if(o(t))return t;throw a(i(t)+" is not an object")}},8787:function(t,e,n){var r=n(2135),o=n(8126),i=n(3622),a=function(t){return function(e,n,a){var u,c=r(e),f=i(c),l=o(a,f);if(t&&n!=n){for(;f>l;)if((u=c[l++])!=u)return!0}else for(;f>l;l++)if((t||l in c)&&c[l]===n)return t||l||0;return!t&&-1}};t.exports={includes:a(!0),indexOf:a(!1)}},5719:function(t,e,n){var r=n(8976),o=r({}.toString),i=r("".slice);t.exports=function(t){return i(o(t),8,-1)}},7845:function(t,e,n){var r=n(569),o=n(2866),i=n(8948),a=n(5719),u=n(8269)("toStringTag"),c=r.Object,f="Arguments"==a(function(){return arguments}());t.exports=o?a:function(t){var e,n,r;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=function(t,e){try{return t[e]}catch(n){}}(e=c(t),u))?n:f?a(e):"Object"==(r=a(e))&&i(e.callee)?"Arguments":r}},8688:function(t,e,n){var r=n(6632),o=n(7824),i=n(8101),a=n(387);t.exports=function(t,e,n){for(var u=o(e),c=a.f,f=i.f,l=0;l<u.length;l++){var s=u[l];r(t,s)||n&&r(n,s)||c(t,s,f(e,s))}}},5969:function(t,e,n){var r=n(9125),o=n(387),i=n(8303);t.exports=r?function(t,e,n){return o.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t}},8303:function(t){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},9125:function(t,e,n){var r=n(973);t.exports=!r((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},2618:function(t,e,n){var r=n(569),o=n(4115),i=r.document,a=o(i)&&o(i.createElement);t.exports=function(t){return a?i.createElement(t):{}}},1596:function(t,e,n){var r=n(2683);t.exports=r("navigator","userAgent")||""},1647:function(t,e,n){var r,o,i=n(569),a=n(1596),u=i.process,c=i.Deno,f=u&&u.versions||c&&c.version,l=f&&f.v8;l&&(o=(r=l.split("."))[0]>0&&r[0]<4?1:+(r[0]+r[1])),!o&&a&&(!(r=a.match(/Edge\/(\d+)/))||r[1]>=74)&&(r=a.match(/Chrome\/(\d+)/))&&(o=+r[1]),t.exports=o},9158:function(t){t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},4506:function(t,e,n){var r=n(569),o=n(8101).f,i=n(5969),a=n(952),u=n(9413),c=n(8688),f=n(9861);t.exports=function(t,e){var n,l,s,p,v,m=t.target,g=t.global,y=t.stat;if(n=g?r:y?r[m]||u(m,{}):(r[m]||{}).prototype)for(l in e){if(p=e[l],s=t.noTargetGet?(v=o(n,l))&&v.value:n[l],!f(g?l:m+(y?".":"#")+l,t.forced)&&void 0!==s){if(typeof p==typeof s)continue;c(p,s)}(t.sham||s&&s.sham)&&i(p,"sham",!0),a(n,l,p,t)}}},973:function(t){t.exports=function(t){try{return!!t()}catch(e){return!0}}},6986:function(t,e,n){var r=n(973);t.exports=!r((function(){var t=function(){}.bind();return"function"!=typeof t||t.hasOwnProperty("prototype")}))},3405:function(t,e,n){var r=n(6986),o=Function.prototype.call;t.exports=r?o.bind(o):function(){return o.apply(o,arguments)}},6053:function(t,e,n){var r=n(9125),o=n(6632),i=Function.prototype,a=r&&Object.getOwnPropertyDescriptor,u=o(i,"name"),c=u&&"something"===function(){}.name,f=u&&(!r||r&&a(i,"name").configurable);t.exports={EXISTS:u,PROPER:c,CONFIGURABLE:f}},8976:function(t,e,n){var r=n(6986),o=Function.prototype,i=o.bind,a=o.call,u=r&&i.bind(a,a);t.exports=r?function(t){return t&&u(t)}:function(t){return t&&function(){return a.apply(t,arguments)}}},2683:function(t,e,n){var r=n(569),o=n(8948),i=function(t){return o(t)?t:void 0};t.exports=function(t,e){return arguments.length<2?i(r[t]):r[t]&&r[t][e]}},255:function(t,e,n){var r=n(6114);t.exports=function(t,e){var n=t[e];return null==n?void 0:r(n)}},2926:function(t,e,n){var r=n(8976),o=n(8162),i=Math.floor,a=r("".charAt),u=r("".replace),c=r("".slice),f=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,l=/\$([$&'`]|\d{1,2})/g;t.exports=function(t,e,n,r,s,p){var v=n+t.length,m=r.length,g=l;return void 0!==s&&(s=o(s),g=f),u(p,g,(function(o,u){var f;switch(a(u,0)){case"$":return"$";case"&":return t;case"`":return c(e,0,n);case"'":return c(e,v);case"<":f=s[c(u,1,-1)];break;default:var l=+u;if(0===l)return o;if(l>m){var p=i(l/10);return 0===p?o:p<=m?void 0===r[p-1]?a(u,1):r[p-1]+a(u,1):o}f=r[l-1]}return void 0===f?"":f}))}},569:function(t,e,n){var r=function(t){return t&&t.Math==Math&&t};t.exports=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof n.g&&n.g)||function(){return this}()||Function("return this")()},6632:function(t,e,n){var r=n(8976),o=n(8162),i=r({}.hasOwnProperty);t.exports=Object.hasOwn||function(t,e){return i(o(t),e)}},4801:function(t){t.exports={}},2478:function(t,e,n){var r=n(9125),o=n(973),i=n(2618);t.exports=!r&&!o((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},9126:function(t,e,n){var r=n(569),o=n(8976),i=n(973),a=n(5719),u=r.Object,c=o("".split);t.exports=i((function(){return!u("z").propertyIsEnumerable(0)}))?function(t){return"String"==a(t)?c(t,""):u(t)}:u},3140:function(t,e,n){var r=n(8976),o=n(8948),i=n(2581),a=r(Function.toString);o(i.inspectSource)||(i.inspectSource=function(t){return a(t)}),t.exports=i.inspectSource},1001:function(t,e,n){var r,o,i,a=n(1632),u=n(569),c=n(8976),f=n(4115),l=n(5969),s=n(6632),p=n(2581),v=n(5024),m=n(4801),g="Object already initialized",y=u.TypeError,b=u.WeakMap;if(a||p.state){var h=p.state||(p.state=new b),d=c(h.get),x=c(h.has),E=c(h.set);r=function(t,e){if(x(h,t))throw new y(g);return e.facade=t,E(h,t,e),e},o=function(t){return d(h,t)||{}},i=function(t){return x(h,t)}}else{var w=v("state");m[w]=!0,r=function(t,e){if(s(t,w))throw new y(g);return e.facade=t,l(t,w,e),e},o=function(t){return s(t,w)?t[w]:{}},i=function(t){return s(t,w)}}t.exports={set:r,get:o,has:i,enforce:function(t){return i(t)?o(t):r(t,{})},getterFor:function(t){return function(e){var n;if(!f(e)||(n=o(e)).type!==t)throw y("Incompatible receiver, "+t+" required");return n}}}},8948:function(t){t.exports=function(t){return"function"==typeof t}},9861:function(t,e,n){var r=n(973),o=n(8948),i=/#|\.prototype\./,a=function(t,e){var n=c[u(t)];return n==l||n!=f&&(o(e)?r(e):!!e)},u=a.normalize=function(t){return String(t).replace(i,".").toLowerCase()},c=a.data={},f=a.NATIVE="N",l=a.POLYFILL="P";t.exports=a},4115:function(t,e,n){var r=n(8948);t.exports=function(t){return"object"==typeof t?null!==t:r(t)}},9955:function(t){t.exports=!1},3333:function(t,e,n){var r=n(4115),o=n(5719),i=n(8269)("match");t.exports=function(t){var e;return r(t)&&(void 0!==(e=t[i])?!!e:"RegExp"==o(t))}},5912:function(t,e,n){var r=n(569),o=n(2683),i=n(8948),a=n(5317),u=n(7941),c=r.Object;t.exports=u?function(t){return"symbol"==typeof t}:function(t){var e=o("Symbol");return i(e)&&a(e.prototype,c(t))}},3622:function(t,e,n){var r=n(2032);t.exports=function(t){return r(t.length)}},8658:function(t,e,n){var r=n(1647),o=n(973);t.exports=!!Object.getOwnPropertySymbols&&!o((function(){var t=Symbol();return!String(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&r&&r<41}))},1632:function(t,e,n){var r=n(569),o=n(8948),i=n(3140),a=r.WeakMap;t.exports=o(a)&&/native code/.test(i(a))},387:function(t,e,n){var r=n(569),o=n(9125),i=n(2478),a=n(7996),u=n(6327),c=n(4582),f=r.TypeError,l=Object.defineProperty,s=Object.getOwnPropertyDescriptor,p="enumerable",v="configurable",m="writable";e.f=o?a?function(t,e,n){if(u(t),e=c(e),u(n),"function"==typeof t&&"prototype"===e&&"value"in n&&m in n&&!n.writable){var r=s(t,e);r&&r.writable&&(t[e]=n.value,n={configurable:v in n?n.configurable:r.configurable,enumerable:p in n?n.enumerable:r.enumerable,writable:!1})}return l(t,e,n)}:l:function(t,e,n){if(u(t),e=c(e),u(n),i)try{return l(t,e,n)}catch(r){}if("get"in n||"set"in n)throw f("Accessors not supported");return"value"in n&&(t[e]=n.value),t}},8101:function(t,e,n){var r=n(9125),o=n(3405),i=n(8046),a=n(8303),u=n(2135),c=n(4582),f=n(6632),l=n(2478),s=Object.getOwnPropertyDescriptor;e.f=r?s:function(t,e){if(t=u(t),e=c(e),l)try{return s(t,e)}catch(n){}if(f(t,e))return a(!o(i.f,t,e),t[e])}},1248:function(t,e,n){var r=n(6755),o=n(9158).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},2513:function(t,e){e.f=Object.getOwnPropertySymbols},5317:function(t,e,n){var r=n(8976);t.exports=r({}.isPrototypeOf)},6755:function(t,e,n){var r=n(8976),o=n(6632),i=n(2135),a=n(8787).indexOf,u=n(4801),c=r([].push);t.exports=function(t,e){var n,r=i(t),f=0,l=[];for(n in r)!o(u,n)&&o(r,n)&&c(l,n);for(;e.length>f;)o(r,n=e[f++])&&(~a(l,n)||c(l,n));return l}},8046:function(t,e){"use strict";var n={}.propertyIsEnumerable,r=Object.getOwnPropertyDescriptor,o=r&&!n.call({1:2},1);e.f=o?function(t){var e=r(this,t);return!!e&&e.enumerable}:n},4473:function(t,e,n){var r=n(569),o=n(3405),i=n(8948),a=n(4115),u=r.TypeError;t.exports=function(t,e){var n,r;if("string"===e&&i(n=t.toString)&&!a(r=o(n,t)))return r;if(i(n=t.valueOf)&&!a(r=o(n,t)))return r;if("string"!==e&&i(n=t.toString)&&!a(r=o(n,t)))return r;throw u("Can't convert object to primitive value")}},7824:function(t,e,n){var r=n(2683),o=n(8976),i=n(1248),a=n(2513),u=n(6327),c=o([].concat);t.exports=r("Reflect","ownKeys")||function(t){var e=i.f(u(t)),n=a.f;return n?c(e,n(t)):e}},952:function(t,e,n){var r=n(569),o=n(8948),i=n(6632),a=n(5969),u=n(9413),c=n(3140),f=n(1001),l=n(6053).CONFIGURABLE,s=f.get,p=f.enforce,v=String(String).split("String");(t.exports=function(t,e,n,c){var f,s=!!c&&!!c.unsafe,m=!!c&&!!c.enumerable,g=!!c&&!!c.noTargetGet,y=c&&void 0!==c.name?c.name:e;o(n)&&("Symbol("===String(y).slice(0,7)&&(y="["+String(y).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),(!i(n,"name")||l&&n.name!==y)&&a(n,"name",y),(f=p(n)).source||(f.source=v.join("string"==typeof y?y:""))),t!==r?(s?!g&&t[e]&&(m=!0):delete t[e],m?t[e]=n:a(t,e,n)):m?t[e]=n:u(e,n)})(Function.prototype,"toString",(function(){return o(this)&&s(this).source||c(this)}))},3343:function(t,e,n){"use strict";var r=n(6327);t.exports=function(){var t=r(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},5173:function(t,e,n){var r=n(569).TypeError;t.exports=function(t){if(null==t)throw r("Can't call method on "+t);return t}},9413:function(t,e,n){var r=n(569),o=Object.defineProperty;t.exports=function(t,e){try{o(r,t,{value:e,configurable:!0,writable:!0})}catch(n){r[t]=e}return e}},5024:function(t,e,n){var r=n(300),o=n(454),i=r("keys");t.exports=function(t){return i[t]||(i[t]=o(t))}},2581:function(t,e,n){var r=n(569),o=n(9413),i="__core-js_shared__",a=r[i]||o(i,{});t.exports=a},300:function(t,e,n){var r=n(9955),o=n(2581);(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.21.0",mode:r?"pure":"global",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.21.0/LICENSE",source:"https://github.com/zloirock/core-js"})},8126:function(t,e,n){var r=n(1098),o=Math.max,i=Math.min;t.exports=function(t,e){var n=r(t);return n<0?o(n+e,0):i(n,e)}},2135:function(t,e,n){var r=n(9126),o=n(5173);t.exports=function(t){return r(o(t))}},1098:function(t){var e=Math.ceil,n=Math.floor;t.exports=function(t){var r=+t;return r!=r||0===r?0:(r>0?n:e)(r)}},2032:function(t,e,n){var r=n(1098),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},8162:function(t,e,n){var r=n(569),o=n(5173),i=r.Object;t.exports=function(t){return i(o(t))}},8192:function(t,e,n){var r=n(569),o=n(3405),i=n(4115),a=n(5912),u=n(255),c=n(4473),f=n(8269),l=r.TypeError,s=f("toPrimitive");t.exports=function(t,e){if(!i(t)||a(t))return t;var n,r=u(t,s);if(r){if(void 0===e&&(e="default"),n=o(r,t,e),!i(n)||a(n))return n;throw l("Can't convert object to primitive value")}return void 0===e&&(e="number"),c(t,e)}},4582:function(t,e,n){var r=n(8192),o=n(5912);t.exports=function(t){var e=r(t,"string");return o(e)?e:e+""}},2866:function(t,e,n){var r={};r[n(8269)("toStringTag")]="z",t.exports="[object z]"===String(r)},7080:function(t,e,n){var r=n(569),o=n(7845),i=r.String;t.exports=function(t){if("Symbol"===o(t))throw TypeError("Cannot convert a Symbol value to a string");return i(t)}},8878:function(t,e,n){var r=n(569).String;t.exports=function(t){try{return r(t)}catch(e){return"Object"}}},454:function(t,e,n){var r=n(8976),o=0,i=Math.random(),a=r(1..toString);t.exports=function(t){return"Symbol("+(void 0===t?"":t)+")_"+a(++o+i,36)}},7941:function(t,e,n){var r=n(8658);t.exports=r&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},7996:function(t,e,n){var r=n(9125),o=n(973);t.exports=r&&o((function(){return 42!=Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype}))},8269:function(t,e,n){var r=n(569),o=n(300),i=n(6632),a=n(454),u=n(8658),c=n(7941),f=o("wks"),l=r.Symbol,s=l&&l.for,p=c?l:l&&l.withoutSetter||a;t.exports=function(t){if(!i(f,t)||!u&&"string"!=typeof f[t]){var e="Symbol."+t;u&&i(l,t)?f[t]=l[t]:f[t]=c&&s?s(e):p(e)}return f[t]}},2367:function(t,e,n){"use strict";var r=n(4506),o=n(569),i=n(3405),a=n(8976),u=n(5173),c=n(8948),f=n(3333),l=n(7080),s=n(255),p=n(3343),v=n(2926),m=n(8269),g=n(9955),y=m("replace"),b=RegExp.prototype,h=o.TypeError,d=a(p),x=a("".indexOf),E=a("".replace),w=a("".slice),S=Math.max,O=function(t,e,n){return n>t.length?-1:""===e?n:x(t,e,n)};r({target:"String",proto:!0},{replaceAll:function(t,e){var n,r,o,a,p,m,j,k,P,T=u(this),C=0,M=0,L="";if(null!=t){if((n=f(t))&&(r=l(u("flags"in b?t.flags:d(t))),!~x(r,"g")))throw h("`.replaceAll` does not allow non-global regexes");if(o=s(t,y))return i(o,t,T,e);if(g&&n)return E(l(T),t,e)}for(a=l(T),p=l(t),(m=c(e))||(e=l(e)),j=p.length,k=S(1,j),C=O(a,p,0);-1!==C;)P=m?l(e(p,C,a)):v(p,a,C,[],void 0,e),L+=w(a,M,C)+P,M=C+j,C=O(a,p,C+k);return M<a.length&&(L+=w(a,M)),L}})},7655:function(t,e,n){n(2367)},9613:function(t,e){e.J={en:"English","zh-hans":"简体中文"}},3547:function(t,e,n){"use strict";n.d(e,{Z:function(){return u}});var r=n(9496),o=n(3438),i=n.p+"static/profile-pic-55a2d32cdfdd9bece5c55a32e5560748.jpg",a=n(3699),u=function(){var t=(0,o.useStaticQuery)("426816048").site.siteMetadata,e=t.author,n=t.social;return r.createElement("div",{style:{display:"flex",marginBottom:(0,a.qZ)(2.5)}},r.createElement("img",{alt:e,style:{marginRight:(0,a.qZ)(.5),marginBottom:0,minWidth:50,borderRadius:"100%",width:(0,a.qZ)(2),height:(0,a.qZ)(2)},src:i}),r.createElement("p",{style:{whiteSpace:"pre-wrap"}},"Personal blog by"," ",r.createElement("a",{href:"https://twitter.com/"+n.twitter},e),".","\n","Kiss the demons out of my dreams."))}},9471:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return v}});var r=n(9496),o=n(3438),i=n(3547),a=n(2779),u=n(3896),c=(n(7655),n(9613)),f=function(t){var e=t.children,n=t.style,o=void 0===n?{}:n;return r.createElement("p",{style:Object.assign({fontSize:"0.9em",border:"1px solid var(--hr)",borderRadius:"0.75em",padding:"0.75em",background:"var(--inlineCode-bg)",wordBreak:"keep-all"},o)},e)},l=/\/(\w|-)+|-+/g,s=function(t){var e=t.translations,n=t.location;if(!e){var i=n.pathname.match(l),a=i[0],u=i[1];return r.createElement("div",{className:"translations"},r.createElement(f,null,r.createElement(o.Link,{to:u},"Read the original")," • ",r.createElement(o.Link,{to:a},"View all translated posts")))}return e.length?r.createElement("div",{className:"translations"},r.createElement(f,null,r.createElement("span",null,"Translated into: "),r.createElement(r.Fragment,null,e.map((function(t){return console.log(n.pathname),r.createElement(o.Link,{key:t,to:"/"+t+"/"+n.pathname.replaceAll("/","")},function(t){return c.J[t]}(t))}))))):null},p=n(3699),v=function(t){var e=t.data,n=t.pageContext,c=t.location,f=e.markdownRemark,l=e.site.siteMetadata.title,v=n.previous,m=n.next,g=n.translations,y=n.langKey;return console.log(y),r.createElement(a.Z,{location:c,title:l},r.createElement(u.Z,{lang:y,title:f.frontmatter.title,description:f.frontmatter.description||f.excerpt}),r.createElement("article",null,r.createElement("header",null,r.createElement("h1",{style:{marginTop:(0,p.qZ)(1),marginBottom:0,color:"var(--textTitle)"}},f.frontmatter.title),r.createElement("p",{style:Object.assign({},(0,p.bA)(-.2),{display:"block",marginBottom:(0,p.qZ)(1)})},f.frontmatter.date),r.createElement(s,{location:c,translations:g})),r.createElement("section",{dangerouslySetInnerHTML:{__html:f.html}}),r.createElement("hr",{style:{marginBottom:(0,p.qZ)(1)}}),r.createElement("footer",null,r.createElement(i.Z,null))),r.createElement("nav",null,r.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",listStyle:"none",padding:0}},r.createElement("li",null,v&&r.createElement(o.Link,{to:v.fields.slug,rel:"prev"},"← ",v.frontmatter.title)),r.createElement("li",null,m&&r.createElement(o.Link,{to:m.fields.slug,rel:"next"},m.frontmatter.title," →")))))}}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-c15be9c401bf3582888f.js.map