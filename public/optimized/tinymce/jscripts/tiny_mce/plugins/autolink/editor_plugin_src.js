(function(){tinymce.create("tinymce.plugins.AutolinkPlugin",{init:function(a,b){var c=this;if(tinyMCE.isIE)return;a.onKeyDown.add(function(a,b){if(b.keyCode==13)return c.handleEnter(a)}),a.onKeyPress.add(function(a,b){if(b.which==41)return c.handleEclipse(a)}),a.onKeyUp.add(function(a,b){if(b.keyCode==32)return c.handleSpacebar(a)})},handleEclipse:function(a){this.parseCurrentLine(a,-1,"(",!0)},handleSpacebar:function(a){this.parseCurrentLine(a,0,"",!0)},handleEnter:function(a){this.parseCurrentLine(a,-1,"",!1)},parseCurrentLine:function(a,b,c,d){var e,f,g,h,i,j,k,l,m;e=a.selection.getRng().cloneRange();if(e.startOffset<5){l=e.endContainer.previousSibling;if(l==null){if(e.endContainer.firstChild==null||e.endContainer.firstChild.nextSibling==null)return;l=e.endContainer.firstChild.nextSibling}m=l.length,e.setStart(l,m),e.setEnd(l,m);if(e.endOffset<5)return;f=e.endOffset,h=l}else{h=e.endContainer;if(h.nodeType!=3&&h.firstChild){while(h.nodeType!=3&&h.firstChild)h=h.firstChild;e.setStart(h,0),e.setEnd(h,h.nodeValue.length)}e.endOffset==1?f=2:f=e.endOffset-1-b}g=f;do e.setStart(h,f-2),e.setEnd(h,f-1),f-=1;while(e.toString()!=" "&&e.toString()!=""&&e.toString().charCodeAt(0)!=160&&f-2>=0&&e.toString()!=c);e.toString()==c||e.toString().charCodeAt(0)==160?(e.setStart(h,f),e.setEnd(h,g),f+=1):e.startOffset==0?(e.setStart(h,0),e.setEnd(h,g)):(e.setStart(h,f),e.setEnd(h,g)),j=e.toString(),k=j.match(/^(https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.)(.+)$/i);if(k){k[1]=="www."&&(k[1]="http://www."),i=a.selection.getBookmark(),a.selection.setRng(e),tinyMCE.execCommand("createlink",!1,k[1]+k[2]),a.selection.moveToBookmark(i);if(tinyMCE.isWebKit){a.selection.collapse(!1);var n=Math.min(h.length,g+1);e.setStart(h,n),e.setEnd(h,n),a.selection.setRng(e)}}},getInfo:function(){return{longname:"Autolink",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/autolink",version:tinymce.majorVersion+"."+tinymce.minorVersion}}}),tinymce.PluginManager.add("autolink",tinymce.plugins.AutolinkPlugin)})()