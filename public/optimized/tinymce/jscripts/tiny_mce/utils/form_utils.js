function getColorPickerHTML(a,b){var c="",d=tinyMCEPopup.dom;if(label=d.select("label[for="+b+"]")[0])label.id=label.id||d.uniqueId();return c+='<a role="button" aria-labelledby="'+a+'_label" id="'+a+'_link" href="javascript:;" onclick="tinyMCEPopup.pickColor(event,\''+b+'\');" onmousedown="return false;" class="pickcolor">',c+='<span id="'+a+'" title="'+tinyMCEPopup.getLang("browse")+'">&nbsp;<span id="'+a+'_label" class="mceVoiceLabel mceIconOnly" style="display:none;">'+tinyMCEPopup.getLang("browse")+"</span></span></a>",c}function updateColor(a,b){document.getElementById(a).style.backgroundColor=document.forms[0].elements[b].value}function setBrowserDisabled(a,b){var c=document.getElementById(a),d=document.getElementById(a+"_link");d&&(b?(d.setAttribute("realhref",d.getAttribute("href")),d.removeAttribute("href"),tinyMCEPopup.dom.addClass(c,"disabled")):(d.getAttribute("realhref")&&d.setAttribute("href",d.getAttribute("realhref")),tinyMCEPopup.dom.removeClass(c,"disabled")))}function getBrowserHTML(a,b,c,d){var e=d+"_"+c+"_browser_callback",f,g;return f=tinyMCEPopup.getParam(e,tinyMCEPopup.getParam("file_browser_callback")),f?(g="",g+='<a id="'+a+'_link" href="javascript:openBrowser(\''+a+"','"+b+"', '"+c+"','"+e+'\');" onmousedown="return false;" class="browse">',g+='<span id="'+a+'" title="'+tinyMCEPopup.getLang("browse")+'">&nbsp;</span></a>',g):""}function openBrowser(a,b,c,d){var e=document.getElementById(a);e.className!="mceButtonDisabled"&&tinyMCEPopup.openBrowser(b,c,d)}function selectByValue(a,b,c,d,e){if(!a||!a.elements[b])return;c||(c="");var f=a.elements[b],g=!1;for(var h=0;h<f.options.length;h++){var i=f.options[h];i.value==c||e&&i.value.toLowerCase()==c.toLowerCase()?(i.selected=!0,g=!0):i.selected=!1}if(!g&&d&&c!=""){var i=new Option(c,c);i.selected=!0,f.options[f.options.length]=i,f.selectedIndex=f.options.length-1}return g}function getSelectValue(a,b){var c=a.elements[b];return c==null||c.options==null||c.selectedIndex===-1?"":c.options[c.selectedIndex].value}function addSelectValue(a,b,c,d){var e=a.elements[b],f=new Option(c,d);e.options[e.options.length]=f}function addClassesToList(a,b){var c=document.getElementById(a),d=tinyMCEPopup.getParam("theme_advanced_styles",!1);d=tinyMCEPopup.getParam(b,d);if(d){var e=d.split(";");for(var f=0;f<e.length;f++)if(e!=""){var g,h;g=e[f].split("=")[0],h=e[f].split("=")[1],c.options[c.length]=new Option(g,h)}}else tinymce.each(tinyMCEPopup.editor.dom.getClasses(),function(a){c.options[c.length]=new Option(a.title||a["class"],a["class"])})}function isVisible(a){var b=document.getElementById(a);return b&&b.style.display!="none"}function convertRGBToHex(a){var c=new RegExp("rgb\\s*\\(\\s*([0-9]+).*,\\s*([0-9]+).*,\\s*([0-9]+).*\\)","gi"),d=a.replace(c,"$1,$2,$3").split(",");return d.length==3?(r=parseInt(d[0]).toString(16),g=parseInt(d[1]).toString(16),b=parseInt(d[2]).toString(16),r=r.length==1?"0"+r:r,g=g.length==1?"0"+g:g,b=b.length==1?"0"+b:b,"#"+r+g+b):a}function convertHexToRGB(a){return a.indexOf("#")!=-1?(a=a.replace(new RegExp("[^0-9A-F]","gi"),""),r=parseInt(a.substring(0,2),16),g=parseInt(a.substring(2,4),16),b=parseInt(a.substring(4,6),16),"rgb("+r+","+g+","+b+")"):a}function trimSize(a){return a.replace(/([0-9\.]+)(px|%|in|cm|mm|em|ex|pt|pc)/i,"$1$2")}function getCSSSize(a){a=trimSize(a);if(a=="")return"";if(/^[0-9]+$/.test(a))a+="px";else if(!/^[0-9\.]+(px|%|in|cm|mm|em|ex|pt|pc)$/i.test(a))return"";return a}function getStyle(a,b,c){var d=tinyMCEPopup.dom.getAttrib(a,b);return d!=""?""+d:(typeof c=="undefined"&&(c=b),tinyMCEPopup.dom.getStyle(a,c))}var themeBaseURL=tinyMCEPopup.editor.baseURI.toAbsolute("themes/"+tinyMCEPopup.getParam("theme"))