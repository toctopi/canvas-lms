var ImageDialog={preInit:function(){var a;tinyMCEPopup.requireLangPack(),(a=tinyMCEPopup.getParam("external_image_list_url"))&&document.write('<script language="javascript" type="text/javascript" src="'+tinyMCEPopup.editor.documentBaseURI.toAbsolute(a)+'"></script>')},init:function(){var a=document.forms[0],b=tinyMCEPopup.editor;document.getElementById("srcbrowsercontainer").innerHTML=getBrowserHTML("srcbrowser","src","image","theme_advanced_image"),isVisible("srcbrowser")&&(document.getElementById("src").style.width="180px"),e=b.selection.getNode(),this.fillFileList("image_list",tinyMCEPopup.getParam("external_image_list","tinyMCEImageList")),e.nodeName=="IMG"&&(a.src.value=b.dom.getAttrib(e,"src"),a.alt.value=b.dom.getAttrib(e,"alt"),a.border.value=this.getAttrib(e,"border"),a.vspace.value=this.getAttrib(e,"vspace"),a.hspace.value=this.getAttrib(e,"hspace"),a.width.value=b.dom.getAttrib(e,"width"),a.height.value=b.dom.getAttrib(e,"height"),a.insert.value=b.getLang("update"),this.styleVal=b.dom.getAttrib(e,"style"),selectByValue(a,"image_list",a.src.value),selectByValue(a,"align",this.getAttrib(e,"align")),this.updateStyle())},fillFileList:function(a,b){var c=tinyMCEPopup.dom,d=c.get(a),e,f;b=typeof b=="function"?b():window[b],b&&b.length>0?(d.options[d.options.length]=new Option("",""),tinymce.each(b,function(a){d.options[d.options.length]=new Option(a[0],a[1])})):c.remove(c.getParent(a,"tr"))},update:function(){var a=document.forms[0],b=a.elements,c=tinyMCEPopup.editor,d={},e;tinyMCEPopup.restoreSelection();if(a.src.value===""){c.selection.getNode().nodeName=="IMG"&&(c.dom.remove(c.selection.getNode()),c.execCommand("mceRepaint")),tinyMCEPopup.close();return}c.settings.inline_styles?d.style=this.styleVal:d=tinymce.extend(d,{vspace:b.vspace.value,hspace:b.hspace.value,border:b.border.value,align:getSelectValue(a,"align")}),tinymce.extend(d,{src:a.src.value.replace(/ /g,"%20"),alt:a.alt.value,width:a.width.value,height:a.height.value}),e=c.selection.getNode(),e&&e.nodeName=="IMG"?(c.dom.setAttribs(e,d),tinyMCEPopup.editor.execCommand("mceRepaint"),tinyMCEPopup.editor.focus()):(tinymce.each(d,function(a,b){a===""&&delete d[b]}),c.execCommand("mceInsertContent",!1,tinyMCEPopup.editor.dom.createHTML("img",d),{skip_undo:1}),c.undoManager.add()),tinyMCEPopup.close()},updateStyle:function(){var a=tinyMCEPopup.dom,b,c,d=document.forms[0];tinyMCEPopup.editor.settings.inline_styles&&(b=tinyMCEPopup.dom.parseStyle(this.styleVal),c=getSelectValue(d,"align"),c?c=="left"||c=="right"?(b["float"]=c,delete b["vertical-align"]):(b["vertical-align"]=c,delete b["float"]):(delete b["float"],delete b["vertical-align"]),c=d.border.value,c||c=="0"?c=="0"?b.border="0":b.border=c+"px solid black":delete b.border,c=d.hspace.value,c?(delete b.margin,b["margin-left"]=c+"px",b["margin-right"]=c+"px"):(delete b["margin-left"],delete b["margin-right"]),c=d.vspace.value,c?(delete b.margin,b["margin-top"]=c+"px",b["margin-bottom"]=c+"px"):(delete b["margin-top"],delete b["margin-bottom"]),b=tinyMCEPopup.dom.parseStyle(a.serializeStyle(b),"img"),this.styleVal=a.serializeStyle(b,"img"))},getAttrib:function(a,b){var c=tinyMCEPopup.editor,d=c.dom,e,f;if(c.settings.inline_styles)switch(b){case"align":if(e=d.getStyle(a,"float"))return e;if(e=d.getStyle(a,"vertical-align"))return e;break;case"hspace":e=d.getStyle(a,"margin-left"),f=d.getStyle(a,"margin-right");if(e&&e==f)return parseInt(e.replace(/[^0-9]/g,""));break;case"vspace":e=d.getStyle(a,"margin-top"),f=d.getStyle(a,"margin-bottom");if(e&&e==f)return parseInt(e.replace(/[^0-9]/g,""));break;case"border":e=0,tinymce.each(["top","right","bottom","left"],function(b){b=d.getStyle(a,"border-"+b+"-width");if(!b||b!=e&&e!==0)return e=0,!1;b&&(e=b)});if(e)return parseInt(e.replace(/[^0-9]/g,""))}return(e=d.getAttrib(a,b))?e:""},resetImageData:function(){var a=document.forms[0];a.width.value=a.height.value=""},updateImageData:function(){var a=document.forms[0],b=ImageDialog;a.width.value==""&&(a.width.value=b.preloadImg.width),a.height.value==""&&(a.height.value=b.preloadImg.height)},getImageData:function(){var a=document.forms[0];this.preloadImg=new Image,this.preloadImg.onload=this.updateImageData,this.preloadImg.onerror=this.resetImageData,this.preloadImg.src=tinyMCEPopup.editor.documentBaseURI.toAbsolute(a.src.value)}};ImageDialog.preInit(),tinyMCEPopup.onInit.add(ImageDialog.init,ImageDialog)