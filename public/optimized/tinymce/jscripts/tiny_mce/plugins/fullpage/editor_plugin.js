(function(){var a=tinymce.each,b=tinymce.html.Node;tinymce.create("tinymce.plugins.FullPagePlugin",{init:function(a,b){var c=this;c.editor=a,a.addCommand("mceFullPageProperties",function(){a.windowManager.open({file:b+"/fullpage.htm",width:430+parseInt(a.getLang("fullpage.delta_width",0)),height:495+parseInt(a.getLang("fullpage.delta_height",0)),inline:1},{plugin_url:b,data:c._htmlToData()})}),a.addButton("fullpage",{title:"fullpage.desc",cmd:"mceFullPageProperties"}),a.onBeforeSetContent.add(c._setContent,c),a.onGetContent.add(c._getContent,c)},getInfo:function(){return{longname:"Fullpage",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/fullpage",version:tinymce.majorVersion+"."+tinymce.minorVersion}},_htmlToData:function(){function b(a,b){var c=a.attr(b);return c||""}var c=this._parseHeader(),d={},e,f,g,h=this.editor;return d.fontface=h.getParam("fullpage_default_fontface",""),d.fontsize=h.getParam("fullpage_default_fontsize",""),f=c.firstChild,f.type==7&&(d.xml_pi=!0,g=/encoding="([^"]+)"/.exec(f.value),g&&(d.docencoding=g[1])),f=c.getAll("#doctype")[0],f&&(d.doctype="<!DOCTYPE"+f.value+">"),f=c.getAll("title")[0],f&&f.firstChild&&(d.metatitle=f.firstChild.value),a(c.getAll("meta"),function(a){var b=a.attr("name"),c=a.attr("http-equiv"),e;b?d["meta"+b.toLowerCase()]=a.attr("content"):c=="Content-Type"&&(e=/charset\s*=\s*(.*)\s*/gi.exec(a.attr("content")),e&&(d.docencoding=e[1]))}),f=c.getAll("html")[0],f&&(d.langcode=b(f,"lang")||b(f,"xml:lang")),f=c.getAll("link")[0],f&&f.attr("rel")=="stylesheet"&&(d.stylesheet=f.attr("href")),f=c.getAll("body")[0],f&&(d.langdir=b(f,"dir"),d.style=b(f,"style"),d.visited_color=b(f,"vlink"),d.link_color=b(f,"link"),d.active_color=b(f,"alink")),d},_dataToHtml:function(c){function d(a,b,c){a.attr(b,c?c:undefined)}function e(a){g.firstChild?g.insert(a,g.firstChild):g.append(a)}var f,g,h,i,j,k=this.editor.dom;f=this._parseHeader(),g=f.getAll("head")[0],g||(i=f.getAll("html")[0],g=new b("head",1),i.firstChild?i.insert(g,i.firstChild,!0):i.append(g)),i=f.firstChild,c.xml_pi?(j='version="1.0"',c.docencoding&&(j+=' encoding="'+c.docencoding+'"'),i.type!=7&&(i=new b("xml",7),f.insert(i,f.firstChild,!0)),i.value=j):i&&i.type==7&&i.remove(),i=f.getAll("#doctype")[0],c.doctype?(i||(i=new b("#doctype",10),c.xml_pi?f.insert(i,f.firstChild):e(i)),i.value=c.doctype.substring(9,c.doctype.length-1)):i&&i.remove(),i=f.getAll("title")[0],c.metatitle&&(i||(i=new b("title",1),i.append(new b("#text",3)).value=c.metatitle,e(i))),c.docencoding&&(i=null,a(f.getAll("meta"),function(a){a.attr("http-equiv")=="Content-Type"&&(i=a)}),i||(i=new b("meta",1),i.attr("http-equiv","Content-Type"),i.shortEnded=!0,e(i)),i.attr("content","text/html; charset="+c.docencoding)),a("keywords,description,author,copyright,robots".split(","),function(a){var d=f.getAll("meta"),g,h,j=c["meta"+a];for(g=0;g<d.length;g++){h=d[g];if(h.attr("name")==a){j?h.attr("content",j):h.remove();return}}j&&(i=new b("meta",1),i.attr("name",a),i.attr("content",j),i.shortEnded=!0,e(i))}),i=f.getAll("link")[0],i&&i.attr("rel")=="stylesheet"?c.stylesheet?i.attr("href",c.stylesheet):i.remove():c.stylesheet&&(i=new b("link",1),i.attr({rel:"stylesheet",text:"text/css",href:c.stylesheet}),i.shortEnded=!0,e(i)),i=f.getAll("body")[0],i&&(d(i,"dir",c.langdir),d(i,"style",c.style),d(i,"vlink",c.visited_color),d(i,"link",c.link_color),d(i,"alink",c.active_color),k.setAttribs(this.editor.getBody(),{style:c.style,dir:c.dir,vLink:c.visited_color,link:c.link_color,aLink:c.active_color})),i=f.getAll("html")[0],i&&(d(i,"lang",c.langcode),d(i,"xml:lang",c.langcode)),h=(new tinymce.html.Serializer({validate:!1,indent:!0,apply_source_formatting:!0,indent_before:"head,html,body,meta,title,script,link,style",indent_after:"head,html,body,meta,title,script,link,style"})).serialize(f),this.head=h.substring(0,h.indexOf("</body>"))},_parseHeader:function(){return(new tinymce.html.DomParser({validate:!1,root_name:"#document"})).parse(this.head)},_setContent:function(b,c){function d(a){return a.replace(/<\/?[A-Z]+/g,function(a){return a.toLowerCase()})}var e=this,f,g,h=c.content,i,j="",k=e.editor.dom,l;if(c.format=="raw"&&e.head)return;if(c.source_view&&b.getParam("fullpage_hide_in_source_view"))return;h=h.replace(/<(\/?)BODY/gi,"<$1body"),f=h.indexOf("<body"),f!=-1?(f=h.indexOf(">",f),e.head=d(h.substring(0,f+1)),g=h.indexOf("</body",f),g==-1&&(g=h.length),c.content=h.substring(f+1,g),e.foot=d(h.substring(g))):(e.head=this._getDefaultHeader(),e.foot="\n</body>\n</html>"),i=e._parseHeader(),a(i.getAll("style"),function(a){a.firstChild&&(j+=a.firstChild.value)}),l=i.getAll("body")[0],l&&k.setAttribs(e.editor.getBody(),{style:l.attr("style")||"",dir:l.attr("dir")||"",vLink:l.attr("vlink")||"",link:l.attr("link")||"",aLink:l.attr("alink")||""}),k.remove("fullpage_styles"),j&&(k.add(e.editor.getDoc().getElementsByTagName("head")[0],"style",{id:"fullpage_styles"},j),l=k.get("fullpage_styles"),l.styleSheet&&(l.styleSheet.cssText=j))},_getDefaultHeader:function(){var a="",b=this.editor,c,d="";b.getParam("fullpage_default_xml_pi")&&(a+='<?xml version="1.0" encoding="'+b.getParam("fullpage_default_encoding","ISO-8859-1")+'" ?>\n'),a+=b.getParam("fullpage_default_doctype",'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'),a+="\n<html>\n<head>\n";if(c=b.getParam("fullpage_default_title"))a+="<title>"+c+"</title>\n";if(c=b.getParam("fullpage_default_encoding"))a+='<meta http-equiv="Content-Type" content="text/html; charset='+c+'" />\n';if(c=b.getParam("fullpage_default_font_family"))d+="font-family: "+c+";";if(c=b.getParam("fullpage_default_font_size"))d+="font-size: "+c+";";if(c=b.getParam("fullpage_default_text_color"))d+="color: "+c+";";return a+="</head>\n<body"+(d?' style="'+d+'"':"")+">\n",a},_getContent:function(a,b){var c=this;if(!b.source_view||!a.getParam("fullpage_hide_in_source_view"))b.content=tinymce.trim(c.head)+"\n"+tinymce.trim(b.content)+"\n"+tinymce.trim(c.foot)}}),tinymce.PluginManager.add("fullpage",tinymce.plugins.FullPagePlugin)})()