"use strict";angular.module("AngularDoc-VsCode").directive("architectureDiagram",["$http","$log","diagramServer","$websocket",function(t,e,r,n){return{restrict:"AE",template:'<svg id="graph"><marker id="arrow" class="arrow"viewBox="0 0 20 20" refX="0" refY="3"markerUnits="strokeWidth"markerWidth="15" markerHeight="15"orient="auto"><path d="M0,0 L0,6 L9,3 z" /></marker><defs><filter id="glow"><feColorMatrix type="matrix"values ="0 0 0 0   00 0 0 0.9 0 0 0 0 0.9 0 0 0 0 1   0"/><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>',scope:{data:"=",url:"="},link:function(a,o,i){var s={top:20,right:120,bottom:240,left:120},l=750,u=30,c=50,d=16,h=1e-6;a.maxHeight=0;var f;a.width=1200,a.height=800;var m=$("#wsUrl").val(),p=n(m);p.onMessage(function(t){var e;try{e=JSON.parse(event.data)}catch(t){e={username:"anonymous",message:event.data}}e.refresh&&(console.log(e.refresh),a&&a.svg.selectAll("*").remove(),a.getData())}),a.init=function(){a.svg=d3.select(o[0]).select("svg").attr("width",a.width).attr("height",a.height).append("g").attr("transform","translate("+s.left+","+s.top+")"),a.routeStartPos=3*(a.width-s.right-s.left)/4;var t=a.height-s.top-s.bottom;a.tree=d3.layout.tree().size([t,a.routeStartPos]),a.update(a.overView);var e=a.svg.node().getBBox();d3.select(o[0]).select("svg").attr("width",s.left+Math.max(e.width,a.routeStartPos)+s.right).attr("height",s.top+Math.max(e.height,a.maxHeight)+s.bottom),f=d3.tip().attr("class","d3-tip").renderId(function(){return"overview"}).offset(function(t){return[0,0]}).html(function(t){var e="";return e})};$("#diagram");a.getData=function(){t({method:"GET",url:a.url}).then(function(t){e.debug("get overview success"),a.overView=t.data.hierarchy||[],a.init()},function(t){e.debug("error"),e.debug(t)})},a.getData(),a.update=function(t){var e=a.tree.nodes(a.overView),n=a.tree.links(e),o=_.maxBy(e,function(t){return t.depth}),i=a.routeStartPos/(o.depth+1),s=[],f=new Map,m="NgModule"!=a.overView.kind;$(e).each(function(t,e){if(e.id=e.symbolName+t,m)switch(e.depth){case 0:e.x=0,e.y=0;break;case 1:e.x=c,e.y=0;break;default:e.x=c+t*u,e.y=(e.depth-1)*i}else switch(e.depth){case 0:e.x=0,e.y=0;break;default:e.x=t*u,e.y=e.depth*i}e.x0=e.x,e.y0=e.y,a.maxHeight<e.x&&(a.maxHeight=e.x),e.isSharedModule&&f.put(e.symbolName,e),"Reference"==e.kind&&s.push({source:e.symbolName,target:e.parent})}),$(s).each(function(t,e){e.source=f.get(e.source)});var p=a.svg.selectAll("g.node").data(e.filter(function(t){return"Reference"!=t.kind}),function(t){return t.id}),g=p.enter().append("g").attr("class","node").attr("transform",function(e){return"translate("+t.y0+","+t.x0+")"}).style("opacity",h).on("mouseover",function(t){return a.highlight(t,!0)}).on("mouseout",function(t){return a.highlight(t,!1)});g.append("g").attr("class","icon-path").attr("transform","translate(-8,-8)").on("click",function(t){t.children?(t._children=t.children,t.children=null):(t.children=t._children,t._children=null),a.update(t)}).append("path").attr("transform","scale(0.65,0.65)").attr("d",function(t){return 0==t.depth?"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z":"NgModule"==t.kind?"M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z":"M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z"}),g.append("text").attr("class","node").attr("x",function(t){return"Component"==t.kind?13:-13}).attr("dy",".35em").attr("text-anchor",function(t){return"Component"==t.kind?"start":"end"}).text(function(t){return t.symbolName}).each(function(t,e){t.nodeWidth=t.children||t._children?0:r.getTextWidth(t.symbolName,14)}).on("click",function(t){$("#openFile").attr("href",encodeURI("command:ngdoc.openEditor?"+JSON.stringify("/"+t.file+".ts")));var e=document.getElementById("openFile");e.click(),$("#openFile").attr("href","")}),p.transition().duration(l).style("opacity",1).attr("transform",function(t){return"translate("+t.y+","+t.x+")"});var v=(p.exit().transition().duration(l).style("opacity",h).attr("transform",function(e){return"translate("+t.y+","+t.x+")"}).remove(),this.svg.selectAll("path.link").data(n.filter(function(t){return"Reference"!=t.target.kind}),function(t){return t.source.id+"/"+t.target.id})),y=d3.svg.diagonal().projection(function(t){return[t.y,t.x]});v.enter().insert("path","g").attr("class","link").attr("d",function(e){var r={x:t.x0,y:t.y0};return y({source:r,target:r})}),v.transition().duration(l).attr("d",y),v.exit().transition().duration(l).attr("d",function(e){var r={x:t.x,y:t.y};return y({source:r,target:r})}).remove();var x=e.filter(function(t){return!!t.route&&"Component"==t.kind}),k=this.svg.selectAll("g.routenode").data(x,function(t){return t.symbolName}),w=k.enter().append("g").attr("class",function(t){return"routenode source-"+t.symbolName}).attr("transform",function(t){return"translate("+(t.y+t.nodeWidth)+","+t.x+")"}).style("opacity",h).on("mouseover",function(t){return a.highlight(t,!0)}).on("mouseout",function(t){return a.highlight(t,!1)});w.append("line").style("stroke","orange").style("stroke-dasharray","4,8").attr("marker-end",function(t){return"url("+location.href+"#arrow)"}).attr("x1",d).attr("y1",0).attr("x2",function(t){return a.routeStartPos-t.y-t.nodeWidth-d}).attr("y2",0),w.append("g").attr("class","routenode-icon").attr("x",-8).attr("y",8).attr("transform",function(t){return"translate("+(a.routeStartPos-t.y-t.nodeWidth)+",-8)"}).append("path").attr("transform","scale(0.65,0.65)").attr("d",function(t){return"M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"}),w.append("text").attr("x",function(t){return a.routeStartPos-t.y-t.nodeWidth+18}).attr("dy",".35em").attr("class","d3label").attr("text-anchor","start").text(function(t){return t.route}),k.transition().duration(2*l).style("opacity",.8).attr("transform",function(t){return"translate("+(t.y+t.nodeWidth)+","+t.x+")"}),k.exit().transition().duration(l).style("opacity",h).remove();var b=a.svg.selectAll(".referenceLink").data(s,function(t){return t.target.id}),N=a.crossDiagonal().projection(function(t){return[t.y,t.x]});b.enter().append("path").attr("class","referenceLink").attr("opacity",h).style("stroke","orange").style("stroke-dasharray","4,8").style("fill","none").attr("d",function(t){var e={x:t.source.x,y:t.source.y};return y({source:e,target:e})}),b.transition().duration(2*l).style("opacity",.8).attr("d",N),b.exit().style("opacity",h).remove()},a.updateNodes=function(t){var e=a.svg.selectAll("g.node");e.select("text.node").transition().duration(500).style("filter",function(e){return t(e)?"url("+location.href+"#glow)":null}),e.select("g.icon-path").transition().duration(500).style("fill",function(e){return t(e)?this.searchNodeColor:"#1f77b4"})},a.highlight=function(t,e){a.svg.selectAll(".routenode.source-"+t.symbolName).classed("highlight",e||!!t.route&&!!this.searchVal&&t.route.toLowerCase().indexOf(this.searchVal)>=0).style("opacity",e?1:.8)},a.crossDiagonal=function(){var t=function(t){return t.source},e=function(t){return t.target},r=function(t){return[t.x,t.y]},n=10,a=2,o=function(o,i){var s=t.call(this,o,i),l=e.call(this,o,i),u=(s.x+l.x)/2,c=(s.x+l.x)/2,d=0,h=0;s.x===l.x&&(d=(s.depth>l.depth?-1:1)*a+(l.y-s.y)/n),s.y===l.y&&(h=(s.x>l.x?-1:1)*a+(l.x-s.x)/n);var f=[s,{x:c+d,y:s.y+h},{x:u+d,y:l.y+h},l];return f=f.map(r),"M"+f[0]+"C"+f[1]+" "+f[2]+" "+f[3]};return o.source=function(e){return arguments.length?(t=d3.functor(e),o):t},o.target=function(t){return arguments.length?(e=d3.functor(t),o):e},o.projection=function(t){return arguments.length?(r=t,o):r},o}}}}]).directive("classifyLayout",["$http","$log",function(t,e){return{restrict:"AE",template:'<div ng-repeat="n_cla in data | orderBy:\'className\' " ><h3>{{n_cla.letter}}</h3><ul class="classe-list"><li class="classe-item" ng-repeat="cla in n_cla.data | orderBy: [\'className\']" ><span ng-click="openEditor(cla.file)">{{cla.className}}</span></li></ul></div>',scope:{data:"="},link:function(t,e,r){t.firstWordSort=function(t){var e,r="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),n=[];return $.each(r,function(r,a){e={letter:a,data:[]},$.each(t,function(t,r){var n=r.className.substr(0,1).toLowerCase();a.toLowerCase()===n&&e.data.push(r)}),e.data&&e.data.length>0&&n.push(e)}),n},t.data=t.firstWordSort(t.data),t.openEditor=function(t){$("#openFile").attr("href",encodeURI("command:ngdoc.openEditor?"+JSON.stringify("/"+t+".ts")));var e=document.getElementById("openFile");e.click(),$("#openFile").attr("href","")}}}}]).directive("classesLayout",["$http","$log","$compile","$websocket",function(t,e,r,n){return{restrict:"AE",transclude:!0,template:'<div style="classes" flex layout-fill style="height:100%;"><md-tabs flex md-dynamic-height md-border-bottom><md-tab  flex ng-repeat="item in objTypeItem" label="{{item.name}} {{item.count}}"><md-content class="classify_md_content" class="md-padding" flex><classify-layout data="item.group"></classify-layout></md-content></md-tab></md-tabs></div>',scope:{data:"=?",url:"="},link:function(r,a,o){console.log(r.url);var i=$("#wsUrl").val(),s=n(i);s.onMessage(function(t){var e;try{e=JSON.parse(event.data)}catch(t){e={username:"anonymous",message:event.data}}e.refresh&&r.getData()}),r.getData=function(){t({method:"GET",url:r.url}).then(function(t){r.objTypeItem=[{id:"All",name:"All",property:"all",count:0,group:[]},{id:"Modules",name:"Modules",property:"modules",count:0,group:[]},{id:"Components",name:"Components",property:"components",count:0,group:[]},{id:"Injectables",name:"Injectables",property:"injectables",count:0,group:[]},{id:"Directives",name:"Directives",property:"directives",count:0,group:[]},{id:"Pipes",name:"Pipes",property:"pipes",count:0,group:[]}];var e={0:0,1:0,2:0,3:0,4:0,5:0},n={0:[],1:[],2:[],3:[],4:[],5:[]};$.each(t.data,function(t,r){e[0]=e[0]+1;var a=r.file;n[0].push({id:r._id,className:r.symbolName,file:a}),"NgModule"==r.ng2Type&&(e[1]=e[1]+1,n[1].push({id:r._id,className:r.symbolName,file:a})),"Component"==r.ng2Type&&(e[2]=e[2]+1,n[2].push({id:r._id,className:r.symbolName,file:a})),"Injectable"==r.ng2Type&&(e[3]=e[3]+1,n[3].push({id:r._id,className:r.symbolName,file:a})),"Directive"==r.ng2Type&&(e[4]=e[4]+1,n[4].push({id:r._id,className:r.symbolName,file:a})),"Pipe"==r.ng2Type&&(e[5]=e[5]+1,n[5].push({id:r._id,className:r.symbolName,file:a}))});for(var a=0;a<r.objTypeItem.length;a++)r.objTypeItem[a].count=e[a],r.objTypeItem[a].group=n[a]},function(t){e.debug("error"),e.debug(t)})},r.getData()}}}]).directive("importsDiagram",["$http","$log","$websocket",function(t,e,r){return{restrict:"AE",template:'<div><div><svg id="importsD-graph"><defs></defs></svg></div></div>',scope:{data:"=?",url:"="},link:function(e,n,a){e.rx,e.ry,e.rotate,e.svg,e.cluster,e.line,e.m0,e.div,e.nodes=[],e.width=900,e.height=720,e.init=function(){e.importData&&(e.rx=e.width/2,e.ry=e.height/2,e.rotate=0,e.cluster=d3.layout.cluster().size([360,e.ry-120]).sort(function(t,e){return d3.ascending(t.key,e.key)}),e.line=d3.svg.line.radial().interpolate("bundle").tension(.85).radius(function(t){return t.y}).angle(function(t){return t.x/180*Math.PI}),e.svg=d3.select(n[0]).select("svg").attr("width",e.width).attr("height",e.width).append("svg:g").attr("transform","translate("+e.rx+","+e.ry+")"),e.svg.append("path").attr("class","arc").attr("d",d3.svg.arc().outerRadius(e.ry-120).innerRadius(0).startAngle(0).endAngle(2*Math.PI)).on("mousedown",function(t){return e.mousedown()}),d3.select(window).on("mousemove",function(t){return e.mousemove()}).on("mouseup",function(t){return e.mouseup()}),e.render(e.importData))};var o=$("#wsUrl").val(),i=r(o);i.onMessage(function(t){var r;try{r=JSON.parse(event.data)}catch(t){r={username:"anonymous",message:event.data}}r.refresh&&(e.svg&&e.svg.selectAll("*").remove(),e.getData())}),e.getData=function(){t({method:"GET",url:e.url}).then(function(t){e.importData=t.data,e.init()},function(t){})},e.getData(),e.render=function(t){if(t&&0!=t.length){var r=e;e.nodes=e.cluster.nodes(e.getRoot(t));var n=e.getImports(t),a=d3.layout.bundle(),o=a(n);e.svg.selectAll("path.link").data(n).enter().append("svg:path").attr("class",function(t){return"link source-"+t.source.key+" target-"+t.target.key}).attr("d",function(t,e){return r.line(o[e])});e.svg.selectAll("g.node").data(e.nodes.filter(function(t){return!t.children})).enter().append("svg:g").attr("class","node").attr("id",function(t){return"node-"+t.key}).attr("transform",function(t){return"rotate("+(t.x-90)+")translate("+t.y+")"}).append("svg:text").attr("dx",function(t){return t.x<180?8:-8}).attr("dy",".31em").attr("text-anchor",function(t){return t.x<180?"start":"end"}).attr("transform",function(t){return t.x<180?null:"rotate(180)"}).text(function(t){return t.key}).on("mouseover",function(t){return e.mouseover(t)}).on("mouseout",function(t){return e.mouseout(t)}).on("mousedown",function(t){return e.onSelect.emit(t)})}},e.mouse=function(t){return[t.pageX-e.rx,t.pageY-e.ry]},e.mousedown=function(){e.m0=e.mouse(d3.event);var t=d3.event;t.preventDefault()},e.mousemove=function(){if(e.m0){var t=e.mouse(d3.event),r=180*Math.atan2(e.cross(e.m0,t),e.dot(e.m0,t))/Math.PI;e.div.style("-webkit-transform","translateY("+(e.ry-e.rx)+"px)rotateZ("+r+"deg)translateY("+(e.rx-e.ry)+"px)")}},e.mouseup=function(){if(e.m0){var t=e.mouse(d3.event),r=180*Math.atan2(e.cross(e.m0,t),e.dot(e.m0,t))/Math.PI;e.rotate+=r,e.rotate>360?e.rotate-=360:e.rotate<0&&(e.rotate+=360),e.m0=null,e.div.style("-webkit-transform",null),e.svg.attr("transform","translate("+e.rx+","+e.ry+")rotate("+e.rotate+")").selectAll("g.node text").attr("dx",function(t){return(t.x+e.rotate)%360<180?8:-8}).attr("text-anchor",function(t){return(t.x+e.rotate)%360<180?"start":"end"}).attr("transform",function(t){return(t.x+e.rotate)%360<180?null:"rotate(180)"})}},e.mouseover=function(t){e.svg.selectAll("path.link.target-"+t.key).classed("target",!0).each(e.updateNodes(e.svg,"source",!0)),e.svg.selectAll("path.link.source-"+t.key).classed("source",!0).each(e.updateNodes(e.svg,"target",!0))},e.mouseout=function(t){e.svg.selectAll("path.link.source-"+t.key).classed("source",!1).each(e.updateNodes(e.svg,"target",!1)),e.svg.selectAll("path.link.target-"+t.key).classed("target",!1).each(e.updateNodes(e.svg,"source",!1))},e.updateNodes=function(t,e,r){return function(n){r&&this.parentNode.appendChild(this),t.select("#node-"+n[e].key).classed(e,r)}},e.cross=function(t,e){return t[0]*e[1]-t[1]*e[0]},e.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]},e.getRoot=function(t){function e(t,n){var a=r[t];return a||(a=r[t]=n||{name:t,children:[]},t.length&&(a.parent=e("",null),a.parent.children.push(a),a.key=t)),a}var r={};return t.forEach(function(t){return e(t.symbolName,t)}),r[""]},e.getImports=function(t){var e={},r=[];return t.forEach(function(t){e[t.symbolName]=t}),t.forEach(function(t){var n=e[t.symbolName];n&&t.imports&&t.imports.forEach(function(t){if(t){var a=e[t.name];a&&r.push({source:n,target:a})}})}),r},e.focus=function(t){e.nodes.forEach(function(r){r.key==t.symbolName&&e.mouseover(r)})}}}}]).directive("modulesDiagram",["$http","$log","$websocket",function(t,e,r){return{restrict:"AE",template:'<svg id="modules-graph"><marker id="triangle"viewBox="0 0 10 10" refX="35" refY="5"markerUnits="strokeWidth"markerWidth="4" markerHeight="3"orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker><defs><linearGradient id="panel-gradient"x1="0%" y1="40%" x2="0%" y2="100%" ><stop offset="0%"  stop-color="#009688"/><stop offset="100%" stop-color="#fff"/></linearGradient><filter height="130%" id="drop-shadow"><feGaussianBlur result="blur" stdDeviation="5" in="SourceAlpha"/><feOffset result="offsetBlur" dy="2" dx="2" in="blur"/><feMerge><feMergeNode in="offsetBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter height="130%" id="drop-shadow-deep"><feGaussianBlur result="blur" stdDeviation="5" in="SourceAlpha"/><feOffset result="offsetBlur" dy="4" dx="4" in="blur"/><feMerge><feMergeNode in="offsetBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>',scope:{data:"=?",url:"="},link:function(e,n,a){var o,i={top:20,right:20,bottom:20,left:20},s=750,l=30,u=16,c=1e-6,d={w:120,h:24,s:3,r:3},h={w:120,h:24,s:3,t:10},f=3;e.width=1200,e.height=800;e.init=function(){e.widthVal=e.width-i.right-i.left,e.heightVal=e.height-i.top-i.bottom,$.each(e.modulesData,function(t,r){r.index=t,r.maxItems=_.max([r.imports.length,r.exports.length,r.declarations.length])||1,r.pos=[t%f,Math.floor(t/f)],r.x=r.pos[0]*(e.widthVal/f),r.y=200*r.pos[1]}),e.moduleLinks=[],o=d3.select(n[0]).select("svg").attr("width",e.width).attr("height",e.height).append("g").attr("transform","translate("+i.left+","+i.top+")"),e.updateDiagram()};var m=$("#wsUrl").val(),p=r(m);p.onMessage(function(t){var r;try{r=JSON.parse(event.data)}catch(t){r={username:"anonymous",message:event.data}}r.refresh&&(e.svg&&e.svg.selectAll("*").remove(),e.getData())}),e.getData=function(){t({method:"GET",url:e.url}).then(function(t){e.modulesData=t.data,e.init()},function(t){})},e.getData(),e.updateDiagram=function(){var t=o.selectAll("g.module").data(e.modulesData);t.exit().remove();var r=t.enter().append("g").attr("class","module").attr("transform",function(t){return"translate("+t.x+","+t.y+")"}).style("filter","url("+location.href+"#drop-shadow)").on("mouseover",function(t){d3.select(this).style("filter","url("+location.href+"#drop-shadow-deep)")}).on("mouseout",function(t){d3.select(this).style("filter","url("+location.href+"#drop-shadow)")}).style("opacity",c);e.drawModule(r);var a=[0,0,0],u=[],h=0,m=0;r.each(function(t,r){var n=r%f,o=Math.floor(r/f);t.width=e.maxImport+e.maxDeclaration+e.maxExport+2*l,t.height=(t.maxItems+1)*(d.h+d.s)+d.s,h+=t.width,m+=t.height,t.width>a[n]&&(a[n]=t.width),(!u[o]||t.height>u[o])&&(u[o]=t.height)}),t.transition().duration(s).style("opacity",1).attr("transform",function(t){for(var e=0,r=0,n=t.index%f,o=Math.floor(t.index/f),i=0;i<n;i++)e+=a[i]+l;for(var i=0;i<o;i++)r+=u[i]+l;return t.x=e,t.y=r,"translate("+t.x+","+t.y+")"}),d3.select(n[0]).select("svg").attr("width",i.left+h+i.right).attr("height",i.top+m+i.bottom)},e.drawModule=function(t){e.maxDeclaration=0,e.maxImport=0,e.maxExport=0;var r=t.append("g").attr("class","imports").attr("transform","translate(0, 0)"),n=r.selectAll("g.import").data(function(t){return t.imports||[]}).enter().append("g").attr("class","import").attr("transform",function(t,e){return"translate(0,"+(d.s+(e+1)*(d.h+d.s))+")"});n.append("text").attr("class","labelbox").attr("x",(h.w+h.t)/2).attr("y",h.h/2).attr("dy","0.35em").attr("text-anchor","middle").text(function(t){return t.name}).each(function(t,r){var n=e.getTextWidth(t.name,12);n>e.maxImport&&(e.maxImport=n)}).transition().duration(500).attr("x",d.s+h.t+e.maxImport/2);n.insert("polygon","text").attr("class","import").attr("points",e.chevronPoints(e.maxImport+h.t));var a=t.selectAll("g.declaration").data(function(t){return t.declarations||[]}).enter().append("g").attr("class","declaration").attr("transform",function(t,r){return"translate("+(e.maxImport+l)+","+(d.s+(r+1)*(d.h+d.s))+")"}).style("cursor","pointer").on("click",function(t){$("#openFile").attr("href",encodeURI("command:ngdoc.openEditor?"+JSON.stringify("/"+t.file+".ts")));var e=document.getElementById("openFile");e.click(),$("#openFile").attr("href","")});a.append("text").attr("class","labelbox").attr("x",d.s+d.w/2).attr("y",d.h/2).attr("dy","0.35em").attr("text-anchor","middle").text(function(t){return t.name}).each(function(t,r){var n=e.getTextWidth(t.name,12);n>e.maxDeclaration&&(e.maxDeclaration=n)}).transition().duration(500).attr("x",d.s+e.maxDeclaration/2);a.insert("rect","text").attr("class","declaration").attr("rx",d.r).attr("ry",d.r).attr("width",e.maxDeclaration+2*d.s).attr("height",d.h);var o=t.append("g").attr("class","exports").attr("transform","translate("+(e.maxImport+l+e.maxDeclaration+l)+", 0)"),i=o.selectAll("g.export").data(function(t){return t.exports||[]}).enter().append("g").attr("class","export").attr("transform",function(t,e){return"translate(0,"+(d.s+(e+1)*(d.h+d.s))+")"});i.append("text").attr("class","labelbox").attr("x",(h.w+h.t)/2).attr("y",h.h/2).attr("dy","0.35em").attr("text-anchor","middle").text(function(t){return t.name}).each(function(t,r){var n=e.getTextWidth(t.name,12);n>e.maxExport&&(e.maxExport=n)}).transition().duration(500).attr("x",d.s+h.t+e.maxExport/2);i.insert("polygon","text").attr("class","export").attr("points",function(t){return e.chevronPoints(e.maxExport+h.t)});var s=t.insert("g",":first-child").attr("class","outline").attr("transform","translate("+2*e.maxImport/3+", 0)").style("cursor","pointer").on("click",function(t){$("#openFile").attr("href",encodeURI("command:ngdoc.openEditor?"+JSON.stringify("/"+t.file+".ts")));var e=document.getElementById("openFile");e.click(),$("#openFile").attr("href","")}),c=e.maxImport/3+e.maxDeclaration+e.maxExport/3+2*l;s.append("rect").attr("class","module-outline").attr("rx",d.r).attr("ry",d.r).attr("width",c).attr("height",function(t){return(t.maxItems+1)*(d.h+d.s)+d.s}).attr("fill","url("+location.href+"#panel-gradient)"),s.append("g").attr("x",d.s).attr("y",u+d.s).attr("transform","translate(3,5)").attr("fill","#ffffff").append("path").attr("transform","scale(0.65,0.65)").attr("d","M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z"),s.append("text").attr("class","labelbox").attr("x",u+2*d.s).attr("y",d.h/2).attr("dy",".35em").attr("text-anchor","start").text(function(t){return t.symbolName}),s.append("line").style("stroke","black").attr("x1",0).attr("y1",d.h+d.s).attr("x2",c).attr("y2",d.h+d.s)},e.chevronPoints=function(t){var e=[];return e.push("0,0"),e.push(t+",0"),e.push(t+h.t+","+h.h/2),e.push(t+","+h.h),e.push("0,"+h.h),e.push(h.t+","+h.h/2),e.join(" ")},e.calculateLinkPath=function(t){var e=t.target.className,r=t.source.imports.indexOf(e),n={x:t.source.x,y:t.source.y+(r+1)*(d.h+d.s)+d.h/2},a={x:t.target.x+2*d.w,y:t.target.y};return d3.svg.diagonal()({source:n,target:a})},e.findImportedFile=function(t,e){for(var r in t)if(r.elements&&r.elements.indexOf(e)>=0)return r.module+".ts";return null},e.getTextWidth=function(t,e){var r=document.getElementById("__getwidth");return null==r&&(r=document.createElement("span"),r.id=t+"-offsetWidth",document.body.appendChild(r),r.style.visibility="hidden",r.style.whiteSpace="nowrap"),r.innerHTML=t,r.style.fontSize=e+"px",r.offsetWidth}}}}]).directive("routesDiagram",["$http","$log","diagramServer","$websocket",function(t,e,r,n){return{restrict:"AE",template:'<svg id="routes-graph"><marker id="arrow" class="arrow"viewBox="0 0 20 20" refX="0" refY="3"markerUnits="strokeWidth"markerWidth="15" markerHeight="15"orient="auto"><path d="M0,0 L0,6 L9,3 z" /></marker><defs></defs></svg>',scope:{data:"=?",url:"="},link:function(e,a,o){e.width=1200,e.height=800;var i={top:20,right:120,bottom:240,left:80},s=750,l=30,u=16,c=1e-6,d=10;e.maxHeight=0,e.init=function(){e.widthVal=e.width-i.right-i.left,e.heightVal=e.height-i.top-i.bottom,e.tree=d3.layout.tree().size([e.heightVal,3*e.widthVal/4]),e.svg=d3.select(a[0]).select("svg").attr("width",e.width).attr("height",e.height).append("g").attr("transform","translate("+i.left+","+i.top+")"),e.update(e.routesData);e.svg.node().getBBox()};var h=$("#wsUrl").val(),f=n(h);f.onMessage(function(t){var r;try{r=JSON.parse(event.data)}catch(t){r={username:"anonymous",message:event.data}}r.refresh&&(e.svg&&e.svg.selectAll("*").remove(),e.getData())}),e.getData=function(){t({method:"GET",url:e.url}).then(function(t){e.routesData=t.data,e.init()},function(t){})},e.getData(),e.filterNode=function(t){return!t.isSharedModule&&"Reference"!=t.kind&&("NgModule"==t.kind||null!=t.route)},e.update=function(t){var n=e.tree.nodes(e.routesData),a=e.tree.links(n);$(n).each(function(t,e){e.id=e.route+t,e.x0=e.x=i.top+t*l,e.y0=e.y=180*e.depth});var o=e.svg.selectAll("g.node").data(n,function(t){return t.symbolName}),o=this.svg.selectAll("g.node").data(n,function(t){return t.id}),h=o.enter().append("g").attr("class",function(t){return"node source-"+t.id}).attr("transform",function(e){return"translate("+t.y0+","+t.x0+")"}).style("opacity",c).on("mouseover",function(t){return e.highlight(t,!0)}).on("mouseout",function(t){return e.highlight(t,!1)}).on("click",function(t){t.children?(t._children=t.children,t.children=null):(t.children=t._children,t._children=null),e.update(t)});h.append("g").attr("class","icon-path").attr("transform","translate(-8,-8)").append("path").attr("transform","scale(0.65,0.65)").attr("d","M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"),h.append("text").attr("x",function(t){return t.children||t._children?-10:10}).attr("dy",".35em").attr("text-anchor",function(t){return t.children||t._children?"end":"start"}).text(function(t){return t.route?t.route:t.bootstrap?"<ROOT>":"<default>"}).each(function(t,e){t.nodeWidth=t.children||t._children?0:r.getTextWidth(t.route?t.route:t.bootstrap?"<ROOT>":"<default>",14)});var f=(o.transition().duration(s).style("opacity",1).attr("transform",function(t){return"translate("+t.y+","+t.x+")"}),o.exit().transition().duration(s).style("opacity",c).attr("transform",function(e){return"translate("+t.y+","+t.x+")"}).remove());f.selectAll("text").style("fill-opacity",c);var m=e.svg.selectAll("path.link").data(a,function(t){return t.source.id+"/"+t.target.id}),p=d3.svg.diagonal().projection(function(t){return[t.y,t.x]});m.enter().insert("path","g").attr("class","link").attr("d",function(e){var r={x:t.x0,y:t.y0};return p({source:r,target:r})}).style("stroke-width",function(t){return t.source.redirectTo==t.target.route||t.source.route==t.target.route?"2px":"1px"}),m.transition().duration(s).attr("d",p),m.exit().transition().duration(s).attr("d",function(e){var r={x:t.x,y:t.y};return p({source:r,target:r})}).remove();var g=n.filter(function(t){return null!=t.__component}),v=e.svg.selectAll("g.compnode").data(g,function(t){var e=t.__component;return e.name||e.symbolName}),y=v.enter().append("g").attr("class",function(t){return"compnode target-"+t.id}).attr("transform",function(t){return"translate("+(t.y+t.nodeWidth)+","+t.x+")"}).style("opacity",c).on("mouseover",function(t){return e.highlight(t,!0)}).on("mouseout",function(t){return e.highlight(t,!1)});y.append("line").style("stroke","orange").style("stroke-dasharray","4,8").attr("x1",d+2).attr("y1",0).attr("x2",function(t){return 3*e.widthVal/4-t.y-t.nodeWidth-u}).attr("y2",0).attr("marker-end",function(t){return"url("+location.href+"#arrow)"}),y.append("g").attr("class","icon-path").attr("transform",function(t){return"translate("+(3*e.widthVal/4-t.y-t.nodeWidth)+",-8)"}).append("path").attr("transform","scale(0.65,0.65)").attr("d",function(t){return t.__component&&"NgModule"==t.__component.kind?"M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z":"M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z"}),y.append("text").attr("x",function(t){return 3*e.widthVal/4-t.y-t.nodeWidth+18}).attr("dy",".35em").attr("class","d3label").attr("text-anchor","start").text(function(t){var e=t.__component;return e.name||e.symbolName}).style("cursor","pointer").on("click",function(t){$("#openFile").attr("href",encodeURI("command:ngdoc.openEditor?"+JSON.stringify("/"+t.__component.file+".ts")));var e=document.getElementById("openFile");e.click(),$("#openFile").attr("href","")});v.transition().duration(2*s).style("opacity",.8).attr("transform",function(t){return"translate("+(t.y+t.nodeWidth)+","+t.x+")"}),v.exit().transition().duration(s).style("opacity",c).remove()},e.highlight=function(t,r){e.svg.select(".compnode.target-"+t.name||t.symbolName).classed("highlight",r).style("opacity",r?1:.8)}}}}]);