define(["jquery","media_comments"],function(a){tinymce.create("tinymce.plugins.InstructureRecord",{init:function(b,c){b.addCommand("instructureRecord",function(){var c=a("#"+b.id);a.mediaComment("create","any",function(d,e){c.editorBox("insert_code","<a href='/media_objects/"+d+"' class='instructure_inline_media_comment "+(e||"video")+"_comment' id='media_comment_"+d+"'>this is a media comment</a><br>"),b.selection.select(a(b.getBody()).find("#media_comment_"+d+" + br")[0]),b.selection.collapse(!0)})}),b.addButton("instructure_record",{title:"Record/Upload Media",cmd:"instructureRecord",image:c+"/img/record.gif"})},getInfo:function(){return{longname:"InstructureRecord",author:"Brian Whitmer",authorurl:"http://www.instructure.com",infourl:"http://www.instructure.com",version:tinymce.majorVersion+"."+tinymce.minorVersion}}}),tinymce.PluginManager.add("instructure_record",tinymce.plugins.InstructureRecord)})