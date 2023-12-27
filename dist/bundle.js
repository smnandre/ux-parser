const n=/^("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/,t=/^([-+]?(?:\d+\.\d*|\.\d+|\d+))/,e=/^[\(\)\[\]\{\}]/,r=/^[.,;:?!|]/,o=/^[a-zA-Z0-9_]+/,u=/^\s+/;function i(i){if(!i)return[];const f=function(i){i=i.replace(/[\r\n\t]/," ");const f=[["STR",n],["WSP",u],["BRA",e],["NUM",t],["PUN",r],["SYM",o]];let l=[],c=0;for(;""!==i;){let n=null;for(let[t,e]of f)if(n=i.match(e),n){let e=n[0];l.push([t,e,c]),c+=e.length,i=i.slice(e.length);break}if(!n)throw new Error(`Unexpected token ${i[0]} at position ${c}`)}return l}(i);let l=0;const c=[];for(d();!h();){let n=s();if(null===n)break;c.push(n),d()}return c;function s(){const n=[];let t=a();if(null===t)return null;if(h())return{action:t,modifiers:n};if(g("PUN","|")){if(l++,n.push(t),h())throw new Error("Unexpected end of string");if(t=a(),null===t)throw new Error(`Unexpected token ${U()}`)}return{action:t,modifiers:n}}function h(){return l>=f.length}function a(){if(!w("SYM"))return null;const n=p();if(null===n)return null;l++;return{name:n,args:h()?[]:function(){let n=[];if(!g("BRA","("))return n;l++;for(;!g("BRA",")");){if(d(),!w("STR")&&!w("SYM")&&!w("NUM"))throw new Error(`Unexpected token ${U()}`);let t={value:p(),type:w("NUM")?"number":"string"};if(l++,d(),g("PUN",":")){if(l++,d(),!w("STR")&&!w("SYM")&&!w("NUM"))throw new Error(`Unexpected token ${U()}`);t=Object.assign(t,{name:t.value,value:p(),type:w("NUM")?"number":"string"}),l++}n.push(t),g("PUN",",")&&l++}return l++,n}()}}function d(){for(;!h()&&w("WSP");)l++}function p(){let n=f[l][1];return(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))&&(n=n.slice(1,n.length-1)),n}function U(){return f[l][0]}function w(n){return n===U()}function g(n,t){return w(n)&&function(n){return n===p()}(t)}}export{i as parseDirectives};
