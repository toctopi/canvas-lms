/*!	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
define(function(){function a(){if(P)return;try{var a=E.getElementsByTagName("body")[0].appendChild(q("span"));a.parentNode.removeChild(a)}catch(b){return}P=!0;var c=H.length;for(var d=0;d<c;d++)H[d]()}function b(a){P?a():H[H.length]=a}function c(a){if(typeof D.addEventListener!=w)D.addEventListener("load",a,!1);else if(typeof E.addEventListener!=w)E.addEventListener("load",a,!1);else if(typeof D.attachEvent!=w)r(D,"onload",a);else if(typeof D.onload=="function"){var b=D.onload;D.onload=function(){b(),a()}}else D.onload=a}function d(){G?e():f()}function e(){if(U){storedVersion=localStorage.getItem("flashversion");if(storedVersion){ua.pv=JSON.parse(storedVersion),f();return}}var a=E.getElementsByTagName("body")[0],b=q(x);b.setAttribute("type",A);var c=a.appendChild(b);if(c){var d=0;(function(){if(typeof c.GetVariable!=w){var e=c.GetVariable("$version");e&&(e=e.split(" ")[1].split(","),ua.pv=[parseInt(e[0],10),parseInt(e[1],10),parseInt(e[2],10)],U&&localStorage.setItem("flashversion",JSON.stringify(ua.pv)))}else if(d<10){d++,setTimeout(arguments.callee,10);return}a.removeChild(b),c=null,f()})()}else f()}function f(){var a=I.length;if(a>0)for(var b=0;b<a;b++){var c=I[b].id,d=I[b].callbackFn,e={success:!1,id:c};if(ua.pv[0]>0){var f=p(c);if(f)if(!s(I[b].swfVersion)||!!ua.wk&&ua.wk<312)if(I[b].expressInstall&&h()){var k={};k.data=I[b].expressInstall,k.width=f.getAttribute("width")||"0",k.height=f.getAttribute("height")||"0",f.getAttribute("class")&&(k.styleclass=f.getAttribute("class")),f.getAttribute("align")&&(k.align=f.getAttribute("align"));var l={},m=f.getElementsByTagName("param"),n=m.length;for(var o=0;o<n;o++)m[o].getAttribute("name").toLowerCase()!="movie"&&(l[m[o].getAttribute("name")]=m[o].getAttribute("value"));i(k,l,c,d)}else j(f),d&&d(e);else u(c,!0),d&&(e.success=!0,e.ref=g(c),d(e))}else{u(c,!0);if(d){var q=g(c);q&&typeof q.SetVariable!=w&&(e.success=!0,e.ref=q),d(e)}}}}function g(a){var b=null,c=p(a);if(c&&c.nodeName=="OBJECT")if(typeof c.SetVariable!=w)b=c;else{var d=c.getElementsByTagName(x)[0];d&&(b=d)}return b}function h(){return!Q&&s("6.0.65")&&(ua.win||ua.mac)&&(!ua.wk||ua.wk>=312)}function i(a,b,c,d){Q=!0,N=d||null,O={success:!1,id:c};var e=p(c);if(e){e.nodeName=="OBJECT"?(L=k(e),M=null):(L=e,M=c),a.id=B;if(typeof a.width==w||!/%$/.test(a.width)&&parseInt(a.width,10)<310)a.width="310";if(typeof a.height==w||!/%$/.test(a.height)&&parseInt(a.height,10)<137)a.height="137";E.title=E.title.slice(0,47)+" - Flash Player Installation";var f=ua.ie&&ua.win?"ActiveX":"PlugIn",g="MMredirectURL="+D.location.toString().replace(/&/g,"%26")+"&MMplayerType="+f+"&MMdoctitle="+E.title;typeof b.flashvars!=w?b.flashvars+="&"+g:b.flashvars=g;if(ua.ie&&ua.win&&e.readyState!=4){var h=q("div");c+="SWFObjectNew",h.setAttribute("id",c),e.parentNode.insertBefore(h,e),e.style.display="none",function(){e.readyState==4?e.parentNode.removeChild(e):setTimeout(arguments.callee,10)}()}l(a,b,c)}}function j(a){if(ua.ie&&ua.win&&a.readyState!=4){var b=q("div");a.parentNode.insertBefore(b,a),b.parentNode.replaceChild(k(a),b),a.style.display="none",function(){a.readyState==4?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)}()}else a.parentNode.replaceChild(k(a),a)}function k(a){var b=q("div");if(ua.win&&ua.ie)b.innerHTML=a.innerHTML;else{var c=a.getElementsByTagName(x)[0];if(c){var d=c.childNodes;if(d){var e=d.length;for(var f=0;f<e;f++)(d[f].nodeType!=1||d[f].nodeName!="PARAM")&&d[f].nodeType!=8&&b.appendChild(d[f].cloneNode(!0))}}}return b}function l(a,b,c){var d,e=p(c);if(ua.wk&&ua.wk<312)return d;if(e){typeof a.id==w&&(a.id=c);if(ua.ie&&ua.win){var f="";for(var g in a)a[g]!=Object.prototype[g]&&(g.toLowerCase()=="data"?b.movie=a[g]:g.toLowerCase()=="styleclass"?f+=' class="'+a[g]+'"':g.toLowerCase()!="classid"&&(f+=" "+g+'="'+a[g]+'"'));var h="";for(var i in b)b[i]!=Object.prototype[i]&&(h+='<param name="'+i+'" value="'+b[i]+'" />');e.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+f+">"+h+"</object>",J[J.length]=a.id,d=p(a.id)}else{var j=q(x);j.setAttribute("type",A);for(var k in a)a[k]!=Object.prototype[k]&&(k.toLowerCase()=="styleclass"?j.setAttribute("class",a[k]):k.toLowerCase()!="classid"&&j.setAttribute(k,a[k]));for(var l in b)b[l]!=Object.prototype[l]&&l.toLowerCase()!="movie"&&m(j,l,b[l]);e.parentNode.replaceChild(j,e),d=j}}return d}function m(a,b,c){var d=q("param");d.setAttribute("name",b),d.setAttribute("value",c),a.appendChild(d)}function n(a){var b=p(a);b&&b.nodeName=="OBJECT"&&(ua.ie&&ua.win?(b.style.display="none",function(){b.readyState==4?o(a):setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b))}function o(a){var b=p(a);if(b){for(var c in b)typeof b[c]=="function"&&(b[c]=null);b.parentNode.removeChild(b)}}function p(a){var b=null;try{b=E.getElementById(a)}catch(c){}return b}function q(a){return E.createElement(a)}function r(a,b,c){a.attachEvent(b,c),K[K.length]=[a,b,c]}function s(a){var b=ua.pv,c=a.split(".");return c[0]=parseInt(c[0],10),c[1]=parseInt(c[1],10)||0,c[2]=parseInt(c[2],10)||0,b[0]>c[0]||b[0]==c[0]&&b[1]>c[1]||b[0]==c[0]&&b[1]==c[1]&&b[2]>=c[2]?!0:!1}function t(a,b,c,d){if(ua.ie&&ua.mac)return;var e=E.getElementsByTagName("head")[0];if(!e)return;var f=c&&typeof c=="string"?c:"screen";d&&(R=null,S=null);if(!R||S!=f){var g=q("style");g.setAttribute("type","text/css"),g.setAttribute("media",f),R=e.appendChild(g),ua.ie&&ua.win&&typeof E.styleSheets!=w&&E.styleSheets.length>0&&(R=E.styleSheets[E.styleSheets.length-1]),S=f}ua.ie&&ua.win?R&&typeof R.addRule==x&&R.addRule(a,b):R&&typeof E.createTextNode!=w&&R.appendChild(E.createTextNode(a+" {"+b+"}"))}function u(a,b){if(!T)return;var c=b?"visible":"hidden";P&&p(a)?p(a).style.visibility=c:t("#"+a,"visibility:"+c)}function v(a){var b=/[\\\"<>\.;]/,c=b.exec(a)!=null;return c&&typeof encodeURIComponent!=w?encodeURIComponent(a):a}var w="undefined",x="object",y="Shockwave Flash",z="ShockwaveFlash.ShockwaveFlash",A="application/x-shockwave-flash",B="SWFObjectExprInst",C="onreadystatechange",D=window,E=document,F=navigator,G=!1,H=[d],I=[],J=[],K=[],L,M,N,O,P=!1,Q=!1,R,S,T=!0,U=!!window.localStorage;ua=function(){var a=typeof E.getElementById!=w&&typeof E.getElementsByTagName!=w&&typeof E.createElement!=w,b=F.userAgent.toLowerCase(),c=F.platform.toLowerCase(),d=c?/win/.test(c):/win/.test(b),e=c?/mac/.test(c):/mac/.test(b),f=/webkit/.test(b)?parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,g=!1,h=[0,0,0],i=null;if(typeof F.plugins!=w&&typeof F.plugins[y]==x)i=F.plugins[y].description,i&&(typeof F.mimeTypes==w||!F.mimeTypes[A]||!!F.mimeTypes[A].enabledPlugin)&&(G=!0,g=!1,i=i.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),h[0]=parseInt(i.replace(/^(.*)\..*$/,"$1"),10),h[1]=parseInt(i.replace(/^.*\.(.*)\s.*$/,"$1"),10),h[2]=/[a-zA-Z]/.test(i)?parseInt(i.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0);else if(typeof D.ActiveXObject!=w)try{var j=new ActiveXObject(z);j&&(i=j.GetVariable("$version"),i&&(g=!0,i=i.split(" ")[1].split(","),h=[parseInt(i[0],10),parseInt(i[1],10),parseInt(i[2],10)]))}catch(k){}return{w3:a,pv:h,wk:f,ie:g,win:d,mac:e}}(),onDomLoad=function(){if(!ua.w3)return;(typeof E.readyState!=w&&E.readyState=="complete"||typeof E.readyState==w&&(E.getElementsByTagName("body")[0]||E.body))&&a(),P||(typeof E.addEventListener!=w&&E.addEventListener("DOMContentLoaded",a,!1),ua.ie&&ua.win&&(E.attachEvent(C,function(){E.readyState=="complete"&&(E.detachEvent(C,arguments.callee),a())}),D==top&&function(){if(P)return;try{E.documentElement.doScroll("left")}catch(b){setTimeout(arguments.callee,0);return}a()}()),ua.wk&&function(){if(P)return;if(!/loaded|complete/.test(E.readyState)){setTimeout(arguments.callee,0);return}a()}(),c(a))}();var V=function(){ua.ie&&ua.win&&window.attachEvent("onunload",function(){var a=K.length;for(var b=0;b<a;b++)K[b][0].detachEvent(K[b][1],K[b][2]);var c=J.length;for(var d=0;d<c;d++)n(J[d]);for(var e in ua)ua[e]=null;ua=null;for(var f in W)W[f]=null;W=null})}(),W={registerObject:function(a,b,c,d){if(ua.w3&&a&&b){var e={};e.id=a,e.swfVersion=b,e.expressInstall=c,e.callbackFn=d,I[I.length]=e,u(a,!1)}else d&&d({success:!1,id:a})},getObjectById:function(a){if(ua.w3)return g(a)},embedSWF:function(a,c,d,e,f,g,j,k,m,n){var o={success:!1,id:c};ua.w3&&(!ua.wk||ua.wk>=312)&&a&&c&&d&&e&&f?(u(c,!1),b(function(){d+="",e+="";var b={};if(m&&typeof m===x)for(var p in m)b[p]=m[p];b.data=a,b.width=d,b.height=e;var q={};if(k&&typeof k===x)for(var r in k)q[r]=k[r];if(j&&typeof j===x)for(var t in j)typeof q.flashvars!=w?q.flashvars+="&"+t+"="+j[t]:q.flashvars=t+"="+j[t];if(s(f)){var v=l(b,q,c);b.id==c&&u(c,!0),o.success=!0,o.ref=v}else{if(g&&h()){b.data=g,i(b,q,c,n);return}u(c,!0)}n&&n(o)})):n&&n(o)},switchOffAutoHideShow:function(){T=!1},ua:ua,getFlashPlayerVersion:function(){return{major:ua.pv[0],minor:ua.pv[1],release:ua.pv[2]}},hasFlashPlayerVersion:s,createSWF:function(a,b,c){return ua.w3?l(a,b,c):undefined},showExpressInstall:function(a,b,c,d){ua.w3&&h()&&i(a,b,c,d)},removeSWF:function(a){ua.w3&&n(a)},createCSS:function(a,b,c,d){ua.w3&&t(a,b,c,d)},addDomLoadEvent:b,addLoadEvent:c,getQueryParamValue:function(a){var b=E.location.search||E.location.hash;if(b){/\?/.test(b)&&(b=b.split("?")[1]);if(a==null)return v(b);var c=b.split("&");for(var d=0;d<c.length;d++)if(c[d].substring(0,c[d].indexOf("="))==a)return v(c[d].substring(c[d].indexOf("=")+1))}return""},expressInstallCallback:function(){if(Q){var a=p(B);a&&L&&(a.parentNode.replaceChild(L,a),M&&(u(M,!0),ua.ie&&ua.win&&(L.style.display="block")),N&&N(O)),Q=!1}}};return window.swfobject=W,W})