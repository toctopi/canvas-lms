define(["jquery","jquery.instructure_date_and_time"],function(a){a.fn.keycodes=function(b,c){var d={27:"esc",9:"tab",32:"space",13:"return",8:"backspace",145:"scroll",20:"capslock",144:"numlock",19:"pause",45:"insert",36:"home",46:"del",35:"end",33:"pageup",34:"pagedown",37:"left",38:"up",39:"right",40:"down",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",191:"/"};a.browser.mozilla&&(d=a.extend(d,{96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",0:"191"})),typeof b=="string"&&(b={keyCodes:b}),this.filter(":input,object,embed").length>0&&(b.ignore="");var b=a.extend({},a.fn.keycodes.defaults,b),e=[],f=[],g=b.keyCodes.split(" ");return a.each(g,function(a,b){f.push(b),b=b.split("+").sort().join("+").toLowerCase(),e.push(b)}),this.bind("keydown",function(g,h){g=h&&h.keyCode?h:g;if(b.ignore&&a(g.target).is(b.ignore))return;var i=[];g.shiftKey&&i.push("Shift"),g.ctrlKey&&i.push("Ctrl"),g.metaKey&&i.push("Meta"),g.altKey&&i.push("Alt");var j=d[g.keyCode];j=j||String.fromCharCode(g.keyCode),i.push(j),i=i.sort().join("+").toLowerCase(),g.keyMatches=function(a){return a=a.split("+").sort().join("+").toLowerCase(),a==i};var k=a.inArray(i,e),l=a(document).data("last_datepicker");if(l&&l[0]==this&&g.keyCode==27)return g.preventDefault(),!1;k!=-1&&(g.keyString=f[k],c.call(this,g))}),this},a.fn.keycodes.defaults={ignore:":input,object,embed",keyCodes:""}})