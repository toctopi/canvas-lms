var ImageDialog={preInit:function(){var a;tinyMCEPopup.requireLangPack(),(a=tinyMCEPopup.getParam("external_image_list_url"))&&document.write('<script language="javascript" type="text/javascript" src="'+tinyMCEPopup.editor.documentBaseURI.toAbsolute(a)+'"></script>')},init:function(a){var b=document.forms[0],c=b.elements,a=tinyMCEPopup.editor,d=a.dom,e=a.selection.getNode(),f=tinyMCEPopup.getParam("external_image_list","tinyMCEImageList");tinyMCEPopup.resizeToInnerSize(),this.fillClassList("class_list"),this.fillFileList("src_list",f),this.fillFileList("over_list",f),this.fillFileList("out_list",f),TinyMCE_EditableSelects.init(),e.nodeName=="IMG"&&(c.src.value=d.getAttrib(e,"src"),c.width.value=d.getAttrib(e,"width"),c.height.value=d.getAttrib(e,"height"),c.alt.value=d.getAttrib(e,"alt"),c.title.value=d.getAttrib(e,"title"),c.vspace.value=this.getAttrib(e,"vspace"),c.hspace.value=this.getAttrib(e,"hspace"),c.border.value=this.getAttrib(e,"border"),selectByValue(b,"align",this.getAttrib(e,"align")),selectByValue(b,"class_list",d.getAttrib(e,"class"),!0,!0),c.style.value=d.getAttrib(e,"style"),c.id.value=d.getAttrib(e,"id"),c.dir.value=d.getAttrib(e,"dir"),c.lang.value=d.getAttrib(e,"lang"),c.usemap.value=d.getAttrib(e,"usemap"),c.longdesc.value=d.getAttrib(e,"longdesc"),c.insert.value=a.getLang("update"),/^\s*this.src\s*=\s*\'([^\']+)\';?\s*$/.test(d.getAttrib(e,"onmouseover"))&&(c.onmouseoversrc.value=d.getAttrib(e,"onmouseover").replace(/^\s*this.src\s*=\s*\'([^\']+)\';?\s*$/,"$1")),/^\s*this.src\s*=\s*\'([^\']+)\';?\s*$/.test(d.getAttrib(e,"onmouseout"))&&(c.onmouseoutsrc.value=d.getAttrib(e,"onmouseout").replace(/^\s*this.src\s*=\s*\'([^\']+)\';?\s*$/,"$1")),a.settings.inline_styles&&(d.getAttrib(e,"align")&&this.updateStyle("align"),d.getAttrib(e,"hspace")&&this.updateStyle("hspace"),d.getAttrib(e,"border")&&this.updateStyle("border"),d.getAttrib(e,"vspace")&&this.updateStyle("vspace"))),document.getElementById("srcbrowsercontainer").innerHTML=getBrowserHTML("srcbrowser","src","image","theme_advanced_image"),isVisible("srcbrowser")&&(document.getElementById("src").style.width="260px"),document.getElementById("onmouseoversrccontainer").innerHTML=getBrowserHTML("overbrowser","onmouseoversrc","image","theme_advanced_image"),isVisible("overbrowser")&&(document.getElementById("onmouseoversrc").style.width="260px"),document.getElementById("onmouseoutsrccontainer").innerHTML=getBrowserHTML("outbrowser","onmouseoutsrc","image","theme_advanced_image"),isVisible("outbrowser")&&(document.getElementById("onmouseoutsrc").style.width="260px"),a.getParam("advimage_constrain_proportions",!0)&&(b.constrain.checked=!0),c.onmouseoversrc.value||c.onmouseoutsrc.value?this.setSwapImage(!0):this.setSwapImage(!1),this.changeAppearance(),this.showPreviewImage(c.src.value,1)},insert:function(a,b){var c=tinyMCEPopup.editor,d=this,e=document.forms[0];if(e.src.value===""){c.selection.getNode().nodeName=="IMG"&&(c.dom.remove(c.selection.getNode()),c.execCommand("mceRepaint")),tinyMCEPopup.close();return}if(tinyMCEPopup.getParam("accessibility_warnings",1)&&!e.alt.value){tinyMCEPopup.confirm(tinyMCEPopup.getLang("advimage_dlg.missing_alt"),function(a){a&&d.insertAndClose()});return}d.insertAndClose()},insertAndClose:function(){var a=tinyMCEPopup.editor,b=document.forms[0],c=b.elements,d,e={},f;tinyMCEPopup.restoreSelection(),tinymce.isWebKit&&a.getWin().focus(),a.settings.inline_styles?e={vspace:"",hspace:"",border:"",align:""}:e={vspace:c.vspace.value,hspace:c.hspace.value,border:c.border.value,align:getSelectValue(b,"align")},tinymce.extend(e,{src:c.src.value.replace(/ /g,"%20"),width:c.width.value,height:c.height.value,alt:c.alt.value,title:c.title.value,"class":getSelectValue(b,"class_list"),style:c.style.value,id:c.id.value,dir:c.dir.value,lang:c.lang.value,usemap:c.usemap.value,longdesc:c.longdesc.value}),e.onmouseover=e.onmouseout="",b.onmousemovecheck.checked&&(c.onmouseoversrc.value&&(e.onmouseover="this.src='"+c.onmouseoversrc.value+"';"),c.onmouseoutsrc.value&&(e.onmouseout="this.src='"+c.onmouseoutsrc.value+"';")),f=a.selection.getNode(),f&&f.nodeName=="IMG"?a.dom.setAttribs(f,e):(tinymce.each(e,function(a,b){a===""&&delete e[b]}),a.execCommand("mceInsertContent",!1,tinyMCEPopup.editor.dom.createHTML("img",e),{skip_undo:1}),a.undoManager.add()),tinyMCEPopup.editor.execCommand("mceRepaint"),tinyMCEPopup.editor.focus(),tinyMCEPopup.close()},getAttrib:function(a,b){var c=tinyMCEPopup.editor,d=c.dom,e,f;if(c.settings.inline_styles)switch(b){case"align":if(e=d.getStyle(a,"float"))return e;if(e=d.getStyle(a,"vertical-align"))return e;break;case"hspace":e=d.getStyle(a,"margin-left"),f=d.getStyle(a,"margin-right");if(e&&e==f)return parseInt(e.replace(/[^0-9]/g,""));break;case"vspace":e=d.getStyle(a,"margin-top"),f=d.getStyle(a,"margin-bottom");if(e&&e==f)return parseInt(e.replace(/[^0-9]/g,""));break;case"border":e=0,tinymce.each(["top","right","bottom","left"],function(b){b=d.getStyle(a,"border-"+b+"-width");if(!b||b!=e&&e!==0)return e=0,!1;b&&(e=b)});if(e)return parseInt(e.replace(/[^0-9]/g,""))}return(e=d.getAttrib(a,b))?e:""},setSwapImage:function(a){var b=document.forms[0];b.onmousemovecheck.checked=a,setBrowserDisabled("overbrowser",!a),setBrowserDisabled("outbrowser",!a),b.over_list&&(b.over_list.disabled=!a),b.out_list&&(b.out_list.disabled=!a),b.onmouseoversrc.disabled=!a,b.onmouseoutsrc.disabled=!a},fillClassList:function(a){var b=tinyMCEPopup.dom,c=b.get(a),d,e;(d=tinyMCEPopup.getParam("theme_advanced_styles"))?(e=[],tinymce.each(d.split(";"),function(a){var b=a.split("=");e.push({title:b[0],"class":b[1]})})):e=tinyMCEPopup.editor.dom.getClasses(),e.length>0?(c.options.length=0,c.options[c.options.length]=new Option(tinyMCEPopup.getLang("not_set"),""),tinymce.each(e,function(a){c.options[c.options.length]=new Option(a.title||a["class"],a["class"])})):b.remove(b.getParent(a,"tr"))},fillFileList:function(a,b){var c=tinyMCEPopup.dom,d=c.get(a),e,f;b=typeof b=="function"?b():window[b],d.options.length=0,b&&b.length>0?(d.options[d.options.length]=new Option("",""),tinymce.each(b,function(a){d.options[d.options.length]=new Option(a[0],a[1])})):c.remove(c.getParent(a,"tr"))},resetImageData:function(){var a=document.forms[0];a.elements.width.value=a.elements.height.value=""},updateImageData:function(a,b){var c=document.forms[0];b||(c.elements.width.value=a.width,c.elements.height.value=a.height),this.preloadImg=a},changeAppearance:function(){var a=tinyMCEPopup.editor,b=document.forms[0],c=document.getElementById("alignSampleImg");c&&(a.getParam("inline_styles")?a.dom.setAttrib(c,"style",b.style.value):(c.align=b.align.value,c.border=b.border.value,c.hspace=b.hspace.value,c.vspace=b.vspace.value))},changeHeight:function(){var a=document.forms[0],b,c=this;if(!a.constrain.checked||!c.preloadImg)return;if(a.width.value==""||a.height.value=="")return;b=parseInt(a.width.value)/parseInt(c.preloadImg.width)*c.preloadImg.height,a.height.value=b.toFixed(0)},changeWidth:function(){var a=document.forms[0],b,c=this;if(!a.constrain.checked||!c.preloadImg)return;if(a.width.value==""||a.height.value=="")return;b=parseInt(a.height.value)/parseInt(c.preloadImg.height)*c.preloadImg.width,a.width.value=b.toFixed(0)},updateStyle:function(a){var b=tinyMCEPopup.dom,c,d,e,f,g=tinymce.isIE,h=document.forms[0],i=b.create("img",{style:b.get("style").value});if(tinyMCEPopup.editor.settings.inline_styles){a=="align"&&(b.setStyle(i,"float",""),b.setStyle(i,"vertical-align",""),f=getSelectValue(h,"align"),f&&(f=="left"||f=="right"?b.setStyle(i,"float",f):i.style.verticalAlign=f));if(a=="border"){c=i.style.border?i.style.border.split(" "):[],d=b.getStyle(i,"border-style"),e=b.getStyle(i,"border-color"),b.setStyle(i,"border",""),f=h.border.value;if(f||f=="0")if(f=="0")i.style.border=g?"0":"0 none none";else{if(c.length==3&&c[g?2:1])d=c[g?2:1];else if(!d||d=="none")d="solid";if(c.length==3&&c[g?0:2])e=c[g?0:2];else if(!e||e=="none")e="black";i.style.border=f+"px "+d+" "+e}}a=="hspace"&&(b.setStyle(i,"marginLeft",""),b.setStyle(i,"marginRight",""),f=h.hspace.value,f&&(i.style.marginLeft=f+"px",i.style.marginRight=f+"px")),a=="vspace"&&(b.setStyle(i,"marginTop",""),b.setStyle(i,"marginBottom",""),f=h.vspace.value,f&&(i.style.marginTop=f+"px",i.style.marginBottom=f+"px")),b.get("style").value=b.serializeStyle(b.parseStyle(i.style.cssText),"img")}},changeMouseMove:function(){},showPreviewImage:function(a,b){if(!a){tinyMCEPopup.dom.setHTML("prev","");return}!b&&tinyMCEPopup.getParam("advimage_update_dimensions_onchange",!0)&&this.resetImageData(),a=tinyMCEPopup.editor.documentBaseURI.toAbsolute(a),b?tinyMCEPopup.dom.setHTML("prev",'<img id="previewImg" src="'+a+'" border="0" onload="ImageDialog.updateImageData(this, 1);" />'):tinyMCEPopup.dom.setHTML("prev",'<img id="previewImg" src="'+a+'" border="0" onload="ImageDialog.updateImageData(this);" onerror="ImageDialog.resetImageData();" />')}};ImageDialog.preInit(),tinyMCEPopup.onInit.add(ImageDialog.init,ImageDialog)