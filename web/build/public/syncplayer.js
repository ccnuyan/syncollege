!function(e){function n(i){if(t[i])return t[i].exports;var o=t[i]={exports:{},id:i,loaded:!1};return e[i].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var t={};return n.m=e,n.c=t,n.p="/_assets/",n(0)}({0:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}var o=t(228),d=i(o);!function(){function e(e){window.snapshot.owner&&Reveal.addEventListener("slidechanged",function(n){window.justEmitted?window.justEmitted=!1:e.emit("slidechanged",{snapshot:window.snapshot._id,user:window.user._id,h:n.indexh,v:n.indexv})}),e.on("slidechanged",function(e){window.justEmitted=!0,Reveal.navigateTo(e.h,e.v)})}function n(e){window.root.addEventListener("decisionChanged",function(n){e.emit("listenerDecisionChanged",n.detail)}),e.on("listenerDecisionChanged",function(e){var n=new CustomEvent("listenerDecisionChanged",{detail:e});window.root.dispatchEvent(n)})}function t(){window.io_agent=io.connect(__IO_HOST),window.io_agent.emit("join_snapshot",{snapshot:window.snapshot._id}),new e(window.io_agent),new n(window.io_agent)}window.snapshot?t():window.root.addEventListener("snapshotLoaded",function(){t()});var i=function(){this.element=_Y_.create("div","qrcodeContainer",{display:"none",position:"fixed",zIndex:255,background:"white",width:"100%",height:"100%"}),_Y_.setHTML(this.element,'<div class="dead-center"></div>'),new QRCode(this.element.firstChild,{text:window.location.href,width:"800",height:"800",correctLevel:QRCode.CorrectLevel.H}),window.root.appendChild(this.element),window.addEventListener("keydown",function(e){"q"===(0,d["default"])(e)&&_Y_.show(this.element)}.bind(this)),window.addEventListener("keyup",function(e){"q"===(0,d["default"])(e)&&_Y_.hide(this.element)}.bind(this))};new i}()},228:function(e,n){e.exports=function(e){var n=e.which,o=e.metaKey||e.ctrlKey,d=e.altKey,r=e.shiftKey,s="";if(d&&(s+="A-"),o&&(s+="C-"),16===n)return"shift";if(17===n)return"control";if(18===n)return"alt";var a;if(n>=65&&90>=n)return a=String.fromCharCode(n),r||(a=a.toLowerCase()),s+a;if(a=n>=48&&57>=n?String.fromCharCode(n):t[n],r&&a){var w=i[a];return w?s+w:s+"S-"+a}return a&&s+a};var t={8:"backspace",9:"	",13:"\n",20:"capslock",27:"escape",32:" ",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"delete",107:"+",109:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},i={"`":"~",1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")",";":":",",":"<",".":">","=":"+","-":"_","/":"?","[":"{","\\":"|","]":"}","'":'"'}}});