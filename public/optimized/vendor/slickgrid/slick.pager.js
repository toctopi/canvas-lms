(function(a){function b(b,c,d){function e(){b.onPagingInfoChanged.subscribe(function(a){m(a)}),l(),m(b.getPagingInfo())}function f(){var a=!Slick.GlobalEditorLock.commitCurrentEdit(),c=b.getPagingInfo(),d=Math.floor(c.totalRows/c.pageSize);return{canGotoFirst:!a&&c.pageSize!=0&&c.pageNum>0,canGotoLast:!a&&c.pageSize!=0&&c.pageNum!=d,canGotoPrev:!a&&c.pageSize!=0&&c.pageNum>0,canGotoNext:!a&&c.pageSize!=0&&c.pageNum<d,pagingInfo:c,lastPage:d}}function g(a){b.setPagingOptions({pageSize:a})}function h(){f().canGotoFirst&&b.setPagingOptions({pageNum:0})}function i(){var a=f();a.canGotoLast&&b.setPagingOptions({pageNum:a.lastPage})}function j(){var a=f();a.canGotoPrev&&b.setPagingOptions({pageNum:a.pagingInfo.pageNum-1})}function k(){var a=f();a.canGotoNext&&b.setPagingOptions({pageNum:a.pagingInfo.pageNum+1})}function l(){d.empty(),n=a("<span class='slick-pager-status' />").appendTo(d);var b=a("<span class='slick-pager-nav' />").appendTo(d),e=a("<span class='slick-pager-settings' />").appendTo(d);e.append("<span class='slick-pager-settings-expanded' style='display:none'>Show: <a data=0>All</a><a data='-1'>Auto</a><a data=25>25</a><a data=50>50</a><a data=100>100</a></span>"),e.find("a[data]").click(function(b){var d=a(b.target).attr("data");if(d!=undefined)if(d==-1){var e=c.getViewport();g(e.bottom-e.top)}else g(parseInt(d))});var f="<span class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ",l="' /></span>";a(f+"ui-icon-lightbulb"+l).click(function(){a(".slick-pager-settings-expanded").toggle()}).appendTo(e),a(f+"ui-icon-seek-first"+l).click(h).appendTo(b),a(f+"ui-icon-seek-prev"+l).click(j).appendTo(b),a(f+"ui-icon-seek-next"+l).click(k).appendTo(b),a(f+"ui-icon-seek-end"+l).click(i).appendTo(b),d.find(".ui-icon-container").hover(function(){a(this).toggleClass("ui-state-hover")}),d.children().wrapAll("<div class='slick-pager' />")}function m(a){var b=f();d.find(".slick-pager-nav span").removeClass("ui-state-disabled"),b.canGotoFirst||d.find(".ui-icon-seek-first").addClass("ui-state-disabled"),b.canGotoLast||d.find(".ui-icon-seek-end").addClass("ui-state-disabled"),b.canGotoNext||d.find(".ui-icon-seek-next").addClass("ui-state-disabled"),b.canGotoPrev||d.find(".ui-icon-seek-prev").addClass("ui-state-disabled"),a.pageSize==0?n.text("Showing all "+a.totalRows+" rows"):n.text("Showing page "+(a.pageNum+1)+" of "+(Math.floor(a.totalRows/a.pageSize)+1))}var n,o;e()}a.extend(!0,window,{Slick:{Controls:{Pager:b}}})})(jQuery)