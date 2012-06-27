define(["INST","i18n!instructure","jquery","underscore","str/htmlEscape","jquery.ajaxJSON","jquery.instructure_forms","jqueryui/dialog","vendor/jquery.scrollTo"],function(a,b,c,d,e){c.detect=function(a,b){var d;return c.each(a,function(c,e){if(b.call(e,e,c,a))return d=e,!1}),d},c.mimeClass=function(a){return{"video/mp4":"video","application/x-rar-compressed":"zip","application/vnd.oasis.opendocument.spreadsheet":"xls","application/x-docx":"doc","application/x-shockwave-flash":"flash","audio/x-mpegurl":"audio","image/png":"image","text/xml":"code","video/x-ms-asf":"video","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"xls","text/html":"html","video/x-msvideo":"video","audio/x-pn-realaudio":"audio","application/x-zip-compressed":"zip","text/css":"code","video/x-sgi-movie":"video","audio/x-aiff":"audio","application/zip":"zip","application/xml":"code","application/x-zip":"zip","text/rtf":"doc",text:"text","video/mpeg":"video","video/quicktime":"video","audio/3gpp":"audio","audio/mid":"audio","application/x-rar":"zip","image/x-psd":"image","application/vnd.ms-excel":"xls","application/msword":"doc","video/x-la-asf":"video","image/gif":"image","application/rtf":"doc","video/3gpp":"video","image/pjpeg":"image","image/jpeg":"image","application/vnd.oasis.opendocument.text":"doc","audio/x-wav":"audio","audio/basic":"audio","audio/mpeg":"audio","application/vnd.openxmlformats-officedocument.presentationml.presentation":"ppt","application/vnd.ms-powerpoint":"ppt","application/vnd.openxmlformats-officedocument.wordprocessingml.document":"doc","application/pdf":"pdf","text/plain":"text","text/x-csharp":"code"}[a]||"file"},c.encodeToHex=function(a){var b="",c=a.length,d=0,e;for(var f=0;f<a.length;f++){part=a.charCodeAt(f).toString(16);while(part.length<2)part="0"+part;b+=part}return b},c.decodeFromHex=function(a){var b="",c=0;while(c<a.length)b+=unescape("%"+a.substring(c,c+2)),c+=2;return b},c.raw=function(a){return a=new String(a),a.htmlSafe=!0,a},c.replaceOneTag=function(a,b,c){if(!a)return a;b=(b||"").toString(),c=(c||"").toString().replace(/\s/g,"+");var d=new RegExp("(%7B|{){2}[\\s|%20|+]*"+b+"[\\s|%20|+]*(%7D|}){2}","g");return a.replace(d,c)},c.replaceTags=function(a,b,d){if(typeof b=="object"){for(var e in b)a=c.replaceOneTag(a,e,b[e]);return a}return c.replaceOneTag(a,b,d)};var f=!1;c.scrollSidebar=function(){if(!f){var a=c("#right-side"),b=c("body"),e=c("#main"),g=c("#not_right_side"),h=c(window),i=a.offset().top,j=c("#right-side-wrapper").height()-a.outerHeight();function k(){var c=h.scrollTop(),d=c>i;if(d)var f=g.height(),k=a.height(),l=f>k,m=i+e.height()-c<=k+j;(d&&l&&!m)^b.hasClass("with-scrolling-right-side")&&b.toggleClass("with-scrolling-right-side"),(d&&l&&m)^b.hasClass("with-sidebar-pinned-to-bottom")&&b.toggleClass("with-sidebar-pinned-to-bottom")}var l=d.throttle(k,50);l(),h.scroll(l),setInterval(l,1e3),f=!0}},c.underscore=function(a){return(a||"").replace(/([A-Z])/g,"_$1").replace(/^_/,"").toLowerCase()},c.titleize=function(a){var b=(a||"").replace(/([A-Z])/g," $1").replace(/_/g," ").replace(/\s+/," ").replace(/^\s/,"");return c.map(b.split(/\s/),function(a){return(a[0]||"").toUpperCase()+a.substring(1)}).join(" ")},c.parseUserAgentString=function(a){a=(a||"").toLowerCase();var c={version:(a.match(/.+(?:me|ox|it|ra|ie|er)[\/: ]([\d.]+)/)||[0,null])[1],chrome:/chrome/.test(a),safari:/webkit/.test(a),opera:/opera/.test(a),msie:/msie/.test(a)&&!/opera/.test(a),firefox:/firefox/.test(a),mozilla:/mozilla/.test(a)&&!/(compatible|webkit)/.test(a),speedgrader:/speedgrader/.test(a)},d=null;return c.chrome?d="Chrome":c.safari?d="Safari":c.opera?d="Opera":c.msie?d="Internet Explorer":c.firefox?d="Firefox":c.mozilla?d="Mozilla":c.speedgrader&&(d="SpeedGrader for iPad"),d?c.version&&(c.version=c.version.split(/\./).slice(0,2).join("."),d=d+" "+c.version):d=b.t("browsers.unrecognized","Unrecognized Browser"),d},c.fileSize=function(a){var b=1024;return a<b?parseInt(a,10)+" bytes":a<b*b?parseInt(a/b,10)+"KB":Math.round(10*a/b/b)/10+"MB"},c.getUserServices=function(a,b,d){c.isArray(a)||(a=[a]);var e="/services?service_types="+a.join(",");c.ajaxJSON(e,"GET",{},function(a){b&&b(a)},function(a){d&&d(a)})};var g;c.findLinkForService=function(a,d){var f=c("#instructure_bookmark_search");f.length||(f=c("<div id='instructure_bookmark_search'/>"),f.append("<form id='bookmark_search_form' style='margin-bottom: 5px;'><img src='/images/blank.png'/>&nbsp;&nbsp;<input type='text' class='query' style='width: 230px;'/><button class='button search_button' type='submit'>"+e(b.t("buttons.search","Search"))+"</button></form>"),f.append("<div class='results' style='max-height: 200px; overflow: auto;'/>"),f.find("form").submit(function(d){d.preventDefault(),d.stopPropagation();var h=new Date;if(a=="diigo"&&g&&h-g<15e3){setTimeout(function(){f.find("form").submit()},15e3-(h-g)),f.find(".results").empty().append(e(b.t("status.diigo_search_throttling","Diigo limits users to one search every ten seconds.  Please wait...")));return}f.find(".results").empty().append(e(b.t("status.searching","Searching..."))),g=new Date;var i=f.find(".query").val(),j=c.replaceTags(f.data("reference_url"),"query",i);c.ajaxJSON(j,"GET",{},function(a){f.find(".results").empty(),a.length||f.find(".results").append(e(b.t("no_results_found","No Results Found")));for(var d in a)a[d].short_title=a[d].title,a[d].title==a[d].description&&(a[d].short_title=c.truncateText(a[d].description,30)),c("<div class='bookmark'/>").appendTo(f.find(".results")).append(c('<a class="bookmark_link" style="font-weight: bold;"/>').attr({href:a[d].url,title:a[d].title}).text(a[d].short_title)).append(c("<div style='margin: 5px 10px; font-size: 0.8em;'/>").text(a[d].description||b.t("no_description","No description")))},function(){f.find(".results").empty().append(e(b.t("errors.search_failed","Search failed, please try again.")))})}),f.delegate(".bookmark_link","click",function(a){a.preventDefault();var b=c(this).attr("href"),e=c(this).attr("title")||c(this).text();f.dialog("close"),d({url:b,title:e})})),f.find(".search_button").text(a=="delicious"?b.t("buttons.search_by_tag","Search by Tag"):b.t("buttons.search","Search")),f.find("form img").attr("src","/images/"+a+"_small_icon.png");var h="/search/bookmarks?q=%7B%7B+query+%7D%7D&service_type=%7B%7B+service_type+%7D%7D";h=c.replaceTags(h,"service_type",a),f.data("reference_url",h),f.find(".results").empty().end().find(".query").val(""),f.dialog("close").dialog({autoOpen:!1,title:b.t("titles.bookmark_search","Bookmark Search: %{service_name}",{service_name:c.titleize(a)}),open:function(){f.find("input:visible:first").focus().select()},width:400}).dialog("open")},c.findImageForService=function(a,d){var f=c("#instructure_image_search");f.find("button").attr("disabled",!1),f.length||(f=c("<div id='instructure_image_search'/>").append("<form id='image_search_form' style='margin-bottom: 5px;'><img src='/images/flickr_creative_commons_small_icon.png'/>&nbsp;&nbsp;<input type='text' class='query' style='width: 250px;' title='"+e(b.t("tooltips.enter_search_terms","enter search terms"))+"'/>"+"<button class='button' type='submit'>"+e(b.t("buttons.search","Search"))+"</button></form>").append("<div class='results' style='max-height: 240px; overflow: auto;'/>"),f.find("form .query").formSuggestion(),f.find("form").submit(function(a){a.preventDefault(),a.stopPropagation();var d=new Date;f.find("button").attr("disabled",!0),f.find(".results").empty().append(b.t("status.searching","Searching...")),f.bind("search_results",function(a,d){f.find("button").attr("disabled",!1);if(d&&d.photos&&d.photos.photo){f.find(".results").empty();for(var g in d.photos.photo){var h=d.photos.photo[g],i="https://farm"+h.farm+".static.flickr.com/"+h.server+"/"+h.id+"_"+h.secret+"_s.jpg",j="https://farm"+h.farm+".static.flickr.com/"+h.server+"/"+h.id+"_"+h.secret+".jpg",k="https://secure.flickr.com/photos/"+h.owner+"/"+h.id;f.find(".results").append(c('<div class="image" style="float: left; padding: 2px; cursor: pointer;"/>').append(c("<img/>",{data:{source:k,big_image_url:j},"class":"image_link",src:i,title:"embed "+(h.title||""),alt:h.title||""})))}}else f.find(".results").empty().append(e(b.t("errors.search_failed","Search failed, please try again.")))});var g=encodeURIComponent(f.find(".query").val());c.getScript("https://secure.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=734839aadcaa224c4e043eaf74391e50&per_page=25&license=1,2,3,4,5,6&sort=relevance&text="+g)}),f.delegate(".image_link","click",function(a){a.preventDefault(),f.dialog("close"),d({image_url:c(this).data("big_image_url")||c(this).attr("src"),link_url:c(this).data("source"),title:c(this).attr("alt")})})),f.find("form img").attr("src","/images/"+a+"_small_icon.png");var g=c("#editor_tabs .bookmark_search_url").attr("href");g=c.replaceTags(g,"service_type",a),f.data("reference_url",g||""),f.find(".results").empty(),f.find(".query").val(""),f.dialog({title:b.t("titles.image_search","Image Search: %{service_name}",{service_name:c.titleize(a)}),width:440,open:function(){f.find("input:visible:first").focus().select()},height:320})},c.truncateText=function(a,b){b=b||30;if(!a)return"";var c=(a||"").split(/\s/),d="",e=!1;for(var f in c){var g=c[f];e||(g&&d.length<b?(d.length>0&&(d+=" "),d+=g):(e=!0,d+="..."))}return d},c.toSentence=function(a,d){typeof d=="undefined"?d={}:d=="or"&&(d={two_words_connector:b.t("#support.array.or.two_words_connector"),last_word_connector:b.t("#support.array.or.last_word_connector")}),d=c.extend({words_connector:b.t("#support.array.words_connector"),two_words_connector:b.t("#support.array.two_words_connector"),last_word_connector:b.t("#support.array.last_word_connector")},d);switch(a.length){case 0:return"";case 1:return""+a[0];case 2:return a[0]+d.two_words_connector+a[1];default:return a.slice(0,-1).join(d.words_connector)+d.last_word_connector+a[a.length-1]}},c.queryParam=function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b=new RegExp("[\\?&]"+a+"=([^&#]*)"),c=b.exec(window.location.search);return c==null?c:decodeURIComponent(c[1].replace(/\+/g," "))},c.capitalize=function(a){return a.charAt(0).toUpperCase()+a.substring(1).toLowerCase()},a.youTubeRegEx=/^https?:\/\/(www\.youtube\.com\/watch.*v(=|\/)|youtu\.be\/)([^&#]*)/,c.youTubeID=function(b){var c=b.match(a.youTubeRegEx);return c&&c[c.length-1]?c[c.length-1]:null}})