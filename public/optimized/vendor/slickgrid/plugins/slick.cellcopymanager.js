(function(a){function b(){function b(a){g=a,g.onKeyDown.subscribe(d)}function c(){g.onKeyDown.unsubscribe(d)}function d(b,c){var d;g.getEditorLock().isActive()||(b.which==a.ui.keyCode.ESCAPE&&i&&(b.preventDefault(),f(),h.onCopyCancelled.notify({ranges:i}),i=null),b.which==67&&(b.ctrlKey||b.metaKey)&&(d=g.getSelectionModel().getSelectedRanges(),d.length!=0&&(b.preventDefault(),i=d,e(d),h.onCopyCells.notify({ranges:d}))),b.which==86&&(b.ctrlKey||b.metaKey)&&i&&(b.preventDefault(),f(),d=g.getSelectionModel().getSelectedRanges(),h.onPasteCells.notify({from:i,to:d}),i=null))}function e(a){var b=g.getColumns(),c={};for(var d=0;d<a.length;d++)for(var e=a[d].fromRow;e<=a[d].toRow;e++){c[e]={};for(var f=a[d].fromCell;f<=a[d].toCell;f++)c[e][b[f].id]="copied"}g.setCellCssStyles("copy-manager",c)}function f(){g.removeCellCssStyles("copy-manager")}var g,h=this,i;a.extend(this,{init:b,destroy:c,clearCopySelection:f,onCopyCells:new Slick.Event,onCopyCancelled:new Slick.Event,onPasteCells:new Slick.Event})}a.extend(!0,window,{Slick:{CellCopyManager:b}})})(jQuery)