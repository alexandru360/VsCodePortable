d3.tip=function(){function t(t){w=d(t),T=w.createSVGPoint(),document.body.appendChild(g)}function e(){return"n"}function n(){return[0,0]}function r(){return" "}function o(){var t=y();return{top:t.n.y-g.offsetHeight/2,left:t.n.x}}function l(){var t=y();return{top:t.s.y,left:t.s.x-g.offsetWidth/2}}function i(){var t=y();return{top:t.e.y-g.offsetHeight/2,left:t.e.x}}function f(){var t=y();return{top:t.w.y-g.offsetHeight/2,left:t.w.x-g.offsetWidth}}function s(){var t=y();return{top:t.nw.y-g.offsetHeight,left:t.nw.x-g.offsetWidth}}function u(){var t=y();return{top:t.ne.y-g.offsetHeight,left:t.ne.x}}function c(){var t=y();return{top:t.sw.y,left:t.sw.x-g.offsetWidth}}function a(){var t=y();return{top:t.se.y,left:t.e.x}}function p(){var t=d3.select(document.createElement("div"));return t.style({position:"relative",opacity:0,pointerEvents:"none",boxSizing:"border-box"}),t.node()}function d(t){return t=t.node(),"svg"==t.tagName.toLowerCase()?t:t.ownerSVGElement}function y(){var t=b||d3.event.target,e={},n=t.getScreenCTM(),r=t.getBBox(),o=r.width,l=r.height,i=r.x,f=r.y,s=document.documentElement.scrollTop||document.body.scrollTop,u=document.documentElement.scrollLeft||document.body.scrollLeft;return T.x=i+u,T.y=f+s,e.nw=T.matrixTransform(n),T.x+=o,e.ne=T.matrixTransform(n),T.y+=l,e.se=T.matrixTransform(n),T.x-=o,e.sw=T.matrixTransform(n),T.y-=l/2,e.w=T.matrixTransform(n),T.x+=o,e.e=T.matrixTransform(n),T.x-=o/2,T.y-=l/2,e.n=T.matrixTransform(n),T.y+=l,e.s=T.matrixTransform(n),e}var m=e,h=n,x=null,v=r,g=p(),w=null,T=null,b=null;t.show=function(){var e=Array.prototype.slice.call(arguments);e[e.length-1]instanceof SVGElement&&(b=e.pop());var n,r=v.apply(this,e),o=h.apply(this,e),l=m.apply(this,e),i=d3.select(g),f=0;for(i.html(r).style({opacity:1,"pointer-events":"all"});f--;)i.classed(H[f],!1);return n=E.get(l).apply(this),i.classed(l,!0).style({top:n.top+o[0]+"px",left:n.left+o[1]+"px"}),t},t.hide=function(){return nodel=d3.select(g),nodel.style({opacity:0,"pointer-events":"none"}),t},t.attr=function(e,n){if(arguments.length<2&&"string"==typeof e)return d3.select(g).attr(e);var r=Array.prototype.slice.call(arguments);return d3.selection.prototype.attr.apply(d3.select(g),r),t},t.style=function(e,n){if(arguments.length<2&&"string"==typeof e)return d3.select(g).style(e);var r=Array.prototype.slice.call(arguments);return d3.selection.prototype.style.apply(d3.select(g),r),t},t.direction=function(e){return arguments.length?(m=null==e?e:d3.functor(e),t):m},t.offset=function(e){return arguments.length?(h=null==e?e:d3.functor(e),t):h},t.renderId=function(e){return arguments.length?(x=e,t):null},t.html=function(e){return arguments.length?(v=null==e?e:d3.functor(e),t):v};var E=d3.map({n:o,s:l,e:i,w:f,nw:s,ne:u,sw:c,se:a}),H=E.keys();return t};