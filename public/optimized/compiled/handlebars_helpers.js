(function(){var a=[].slice;define(["vendor/handlebars.vm","i18nObj","jquery","underscore","str/htmlEscape","compiled/util/semanticDateRange","jquery.instructure_date_and_time","jquery.instructure_misc_helpers","jquery.instructure_misc_plugins"],function(b,c,d,e,f,g){var h,i,j;j={t:function(a,b,e){var f,g,h;g={},e=(h=e!=null?e.hash:void 0)!=null?h:{};for(a in e){f=e[a];if(!a.match(/^w\d+$/))continue;g[(new Array(parseInt(a.replace("w",""))+2)).join("*")]=f,delete e[a]}return g["*"]&&(e.wrapper=g),this instanceof String||typeof this=="string"||(e=d.extend(e,this)),c.scoped(e.scope).t(a,b,e)},hiddenIf:function(a){if(a)return" display:none; "},hiddenUnless:function(a){if(!a)return" display:none; "},semanticDateRange:function(){return new b.SafeString(g.apply(null,arguments))},friendlyDatetime:function(a,c){var e,f;return f=c.hash.pubdate,e=d.parseFromISO(a),new b.SafeString("<time title='"+e.datetime_formatted+"' datetime='"+e.datetime.toISOString()+"' "+(f?"pubdate":void 0)+">"+d.friendlyDatetime(e.datetime)+"</time>")},datetimeFormatted:function(a){return a.datetime||(a=d.parseFromISO(a)),a.datetime_formatted},dateToString:function(a,b){return a==null&&(a=""),a.toString(b)},mimeClass:function(a){return d.mimeClass(a)},convertNativeToMediaCommentThumnail:function(a){var c;return c=d("<div />").html(a),c.find("video.instructure_inline_media_comment,audio.instructure_inline_media_comment").replaceWith(function(){return d("<a id='media_comment_"+d(this).data("media_comment_id")+"'              data-media_comment_type='"+d(this).data("media_comment_type")+"'              class='instructure_inline_media_comment' />")}),new b.SafeString(c.html())},newlinesToBreak:function(a){return new b.SafeString(f(a).replace(/\n/g,"<br />"))},ifEqual:function(){var b,c,d,e,f,g,i,j;e=arguments[0],c=3>arguments.length?(f=1,[]):a.call(arguments,1,f=arguments.length-1),j=arguments[f++],h=j.fn,d=j.inverse;for(g=0,i=c.length;g<i;g++){b=c[g];if(b!==e)return d(this);e=b}return h(this)},ifAll:function(){var b,c,d,e,f,g,i;c=2>arguments.length?(e=0,[]):a.call(arguments,0,e=arguments.length-1),i=arguments[e++],h=i.fn,d=i.inverse;for(f=0,g=c.length;f<g;f++){b=c[f];if(!b)return d(this)}return h(this)},eachWithIndex:function(a,b){var c,d,e,f;h=b.fn,e=b.inverse,f="";if(a&&a.length>0)for(d in a)c=a[d],c._index=d,f+=h(c);else f=e(this);return f},eachProp:function(a,b){var c;return function(){var d;d=[];for(c in a)d.push(b.fn({property:c,value:a[c]}));return d}().join("")},toSentence:function(a,b){var c;return c=e.map(a,function(a){return b.fn(a)}),d.toSentence(c)}};for(i in j)h=j[i],b.registerHelper(i,h);return b})}).call(this)