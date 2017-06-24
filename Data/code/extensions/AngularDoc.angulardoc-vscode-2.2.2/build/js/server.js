!function(e){function t(n){if(r[n])return r[n].exports;var a=r[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,t,r){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=13)}([function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ngdocScheme="ngdoc",t.TS_MODE={language:"typescript",scheme:"file"};var r;!function(e){e.authentication={get method(){return"angulardoc/authentication"}}}(r=t.ServerRequest||(t.ServerRequest={}));var n;!function(e){e.metadata={get method(){return"angulardoc/server"}}}(n=t.ServerNotification||(t.ServerNotification={}));var a;!function(e){e.metadata={get method(){return"angulardoc/metadata"}}}(a=t.ServerMetadata||(t.ServerMetadata={}));var o;!function(e){e.params={get method(){return"angulardoc/configurationChanged"}}}(o=t.ConfigurationChanged||(t.ConfigurationChanged={}))},function(e,t){e.exports=require("vscode-languageserver")},function(e,t){e.exports=require("path")},function(e,t){e.exports=require("request")},function(e,t){e.exports=require("typescript")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),a=r(1),o=r(4),i=r(6),s=r(0),l=r(7),c=r(12),d=r(10),u=r(3),f=function(){function e(e,t,r,n,a){this.rootPath=e,this.access_token=t,this.baseUrl=r,this.repoId=n,this.loginName=a}return e.prototype.setAccessToken=function(e){this.access_token=e},e.prototype.setRepoId=function(e){this.repoId=e},e.prototype.setLoginName=function(e){this.loginName=e},e.prototype.initMetadatas=function(e,t,r){var o=this,i=new Date(t.lastSync?t.lastSync:0).toLocaleString(),l=(Object.create(null),new a.ErrorMessageTracker);r.console.log("Scanning "+t.fileFilter+" in "+e+" that were modified after "+i),d({root:e,fileFilter:t.fileFilter,directoryFilter:t.directoryFilter||"**/!(*.spec).ts"},function(a,i){if(a)l.add("Error occurred while scanning files: "+a),r.console.error("Error occurred while scanning files: "+a);else if(i){if(0==i.files.length){r.console.info("Could not find ts files in root path");var c=(new Date).getTime();t.lastSync=c,r.sendNotification(s.ServerNotification.metadata,{file:e,lastSync:c})}var d=i.files.filter(function(e){var r=e.stat.mtime;return r&&r.getTime()>t.lastSync}).map(function(t){return{time:t.stat.mtime,path:n.resolve(e,t.path)}}).sort(function(e,t){return e.time-t.time}),u=[];d.forEach(function(t){r.console.log("Collecting metadata for "+t.path),u.push(o.collect(e,t.path,l,r))}),d.length>0&&Promise.all(u).then(function(n){r.console.log("Collected metadata from "+d.length+" files");var a=(new Date).getTime();t.lastSync=a,l.sendErrors(r),r.sendNotification(s.ServerNotification.metadata,{file:e,lastSync:a})}),0==d.length&&r.console.log("No new files to process in "+e)}})},e.prototype.collectMetadatasFromFolder=function(e,t,r,a,o){var i=this;d({root:t,fileFilter:a.fileFilter,directoryFilter:a.directoryFilter||"**/!(*.spec).ts"},function(l,c){var d=c.files.map(function(r){var a=n.join(t,r.path);return n.resolve(e,a)}),u=[];d.forEach(function(t){o.console.log("Collecting metadata for "+t),u.push(i.collect(e,t,r,o))}),d.length>0&&Promise.all(u).then(function(e){o.console.log("Collected metadata from "+d.length+" files");var n=(new Date).getTime();r.sendErrors(o),a.lastSync=n,o.sendNotification(s.ServerNotification.metadata,{file:t,lastSync:n})}),0==d.length&&o.console.log("No new files to process in "+t)})},e.prototype.collect=function(e,t,r,a){var s=this;return new Promise(function(l,c){var d=o.createProgram([t],{target:o.ScriptTarget.ES5,module:o.ModuleKind.CommonJS}),u=(d.getTypeChecker(),new i.Ng2xMetaCollector(e));try{var f=u.getMeta(d.getSourceFile(t),!1);if(f){var p=n.relative(e,t);p=p.substring(0,p.lastIndexOf("."));var m=encodeURIComponent("/"),v=s.baseUrl+"/api/metadata/vscode/"+s.repoId+"/"+m+"/"+encodeURIComponent(p);s.uploadMetadata(v,f,p,s.access_token,r).then(function(e){e||r.sendErrors(a),l(e)})}else l()}catch(e){r.add(JSON.stringify(e)),c(e)}})},e.prototype.createNewRepo=function(e,t){var r=this,n=this.baseUrl+"/api/users/me/repos",a={repoType:"vscode",repoId:this.repoId,owner:this.loginName,projectPath:encodeURIComponent("/")};return new Promise(function(o,i){var c=new l.HttpRequest(l.HttpClient.POST,n,{Authorization:"Bearer "+r.access_token},a);(new l.HttpClient).send(c).then(function(r){if(r)201==r.statusCode?(t.sendNotification(s.ServerNotification.metadata,{createNewRepoId:!0}),o(!1)):(console.log("Established repo on AngularDoc"),o(!0));else{var n="No response from AngularDoc for creating repo";console.log(n),e.add(n),o(!1)}}).catch(function(t){var r="Error response from AngularDoc for creating repo: "+JSON.stringify(t);console.log(r),e.add(r),o(!1)})})},e.prototype.uploadMetadata=function(e,t,r,n,a){var o=new Buffer(JSON.stringify(t),"utf-8");return new Promise(function(t,i){c.gzip(o,function(o,i){u({url:e+"?access_token="+n,method:"POST",headers:{"Content-Type":"application/json","Content-Encoding":"gzip"},body:i},function(e,n,o){if(e)n?console.log("error: "+n.statusCode):a.add(JSON.stringify(e)),t(e);else if(n)if(n.statusCode>400){var i="Server response code is "+n.statusCode;a.add(i),t(i)}else console.log("Metadata collected for "+r),t(null);else console.log("No response from saving metadata for "+r),t(null)})})})},e.prototype.deleteMetadata=function(e,t,r){var a=this,o=n.relative(e,t);o=o.substring(0,o.lastIndexOf("."));var i=encodeURIComponent("/"),s=this.baseUrl+"/api/metadata/vscode/"+this.repoId+"/"+i+"/"+encodeURIComponent(o);return new Promise(function(e,n){var o=new l.HttpRequest(l.HttpClient.DELETE,s,{Authorization:"Bearer "+a.access_token},{});(new l.HttpClient).send(o).then(function(n){if(n)if(n.statusCode>400){var a="Failed to delete metadata for "+t+" -- error code "+n.statusCode;r.add(a),e(a)}else console.log("Deleted metadata for "+t),e(null);else console.log("No response from deleting metadata for "+t),e(null)}).catch(function(t){console.log(JSON.stringify(t)),r.add(JSON.stringify(t)),e(t)})})},e.prototype.deleteFolder=function(e,t,r){var a=this,o=n.relative(e,t),i=encodeURIComponent("/"),s=this.baseUrl+"/api/metadata/vscode/"+this.repoId+"/"+i+"/"+encodeURIComponent(o)+"/folder";return new Promise(function(e,t){var n=new l.HttpRequest(l.HttpClient.DELETE,s,{Authorization:"Bearer "+a.access_token},{});(new l.HttpClient).send(n).then(function(t){if(t)if(t.statusCode>400){var n="Failed to delete folder for "+o+" -- error code "+t.statusCode;r.add(n),e(n)}else console.log("Deleted folder for "+o),e(null);else console.log("No response from deleting folder for "+o),e(null)}).catch(function(t){console.log(JSON.stringify(t)),r.add(JSON.stringify(t)),e(t)})})},e.prototype.clearTsMetadatas=function(e){var t=this,r=encodeURIComponent("/"),n=this.baseUrl+"/api/metadata/vscode/"+this.repoId+"/"+r;return new Promise(function(a,o){var i=new l.HttpRequest(l.HttpClient.DELETE,n,{Authorization:"Bearer "+t.access_token},{});(new l.HttpClient).send(i).then(function(t){if(t)if(t.statusCode>400){var n="Failed to Refresh projects for "+r+" -- error code "+t.statusCode;e.add(n),a(null)}else console.log("Refresh projects from server"),a(null);else console.log("No response from Refresh projects for "+r),a(null)}).catch(function(t){console.log(JSON.stringify(t)),e.add(JSON.stringify(t)),a(t)})})},e}();t.MetadataSynchronizer=f},function(e,t,r){"use strict";function n(e,t,r){var n=f.relative(t,r);if(e){if("@angular"==e.substr(0,"@angular".length))return e;var a=f.dirname(n),o=f.join(a,e),i=f.resolve(t,o);return u.existsSync(i)||u.existsSync(i+".ts")?o:e}return""}function a(e){if(e)switch(e.kind){case d.SyntaxKind.StringKeyword:return"String";case d.SyntaxKind.BooleanKeyword:return"Boolean";case d.SyntaxKind.NumberKeyword:return"Number";case d.SyntaxKind.AnyKeyword:return"Any";case d.SyntaxKind.ArrayType:return"Array";case d.SyntaxKind.TypeReference:var t=e,r=t.typeName.text;return r}return"Any"}function o(e,t,r){if(Array.isArray(e))for(var n=0,a=e;n<a.length;n++){var o=a[n];if(o.loadChildren){var s=o.loadChildren,l=i(s,t,r);o.loadChildren=l}}}function i(e,t,r){var n="";if(e){var a=void 0,o=void 0;e.indexOf("#")>=0?(a=e.substring(0,e.lastIndexOf("#"))+".ts",o=e.substring(e.indexOf("#")+1,e.length)):a=e+".ts";for(var i=f.dirname(t),s=i+"/"+a,l=!0;!u.existsSync(s);)if(i=i.substring(0,i.lastIndexOf("/")),s=""===i?a:i+"/"+a,""===i){l=!1;break}if(l){var c=f.relative(r,s);n=c.substring(0,c.lastIndexOf(".ts")),o&&(n=n+"#"+o)}}return n}function s(e){if(Array.isArray(e)){for(var t=0,r=e;t<r.length;t++){var n=r[t];if(!l(n))return!1}return!0}return l(e)}function l(e){var t=Object.keys(e);if(t&&t.length>0){for(var r=0,n=0,a=t;n<a.length;n++){var o=a[n];v.indexOf(o)>=0&&r++}return t.length===r}return!1}Object.defineProperty(t,"__esModule",{value:!0});var c=r(8),d=r(4),u=r(9),f=r(2),p=r(11),m=d.ModifierFlags?function(e){return!!(d.getCombinedModifierFlags(e)&d.ModifierFlags.Export)}:function(e){return!!(e.flags&d.NodeFlags.Export)},v=(d.ModifierFlags?function(e){return!!(d.getCombinedModifierFlags(e)&d.ModifierFlags.Static)}:function(e){return!!(e.flags&d.NodeFlags.Static)},d.SyntaxKind.SpreadElement||d.SyntaxKind.SpreadElementExpression,["path","pathMatch","component","redirectTo","outlet","canActivate","canActivateChild","canDeactivate","data","resolve","children","loadChildren"]),h=function(){function e(e){this.projectDir=e,this.metaCollector=new c.MetadataCollector}return e.prototype.getMeta=function(e,t){var r;try{r=this.metaCollector.getMetadata(e,t),r&&this.postHandle(r,e,t)}catch(e){e&&(r=null)}return r},e.prototype.getAllMeta=function(e,t){var r=this;return p.Observable.create(function(n){e.forEach(function(e){r.getMeta(e,t);n.next(e)}),n.complete()})},e.prototype.buildSymbol=function(e){var t=this,r=new Map;["Object","Function","String","Number","Array","Boolean","Map","NaN","Infinity","Math","Date","RegExp","Error","Error","EvalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError","JSON","ArrayBuffer","DataView","Int8Array","Uint8Array","Uint8ClampedArray","Uint16Array","Int16Array","Int32Array","Uint32Array","Float32Array","Float64Array","Any"].forEach(function(e){return r.set(e,{__symbolic:"reference",name:e})});var a=function(e){return e.replace(/^['"]|['"]$/g,"")},o=function(i){switch(i.kind){case d.SyntaxKind.ClassDeclaration:var s=i,l=f.relative(t.projectDir,e.fileName);r.set(s.name.text,{__symbolic:"reference",module:l.substring(0,l.lastIndexOf(".ts")),name:s.name.text});break;case d.SyntaxKind.ImportEqualsDeclaration:var c=i;if(c.moduleReference.kind===d.SyntaxKind.ExternalModuleReference){var u=c.moduleReference;u.expression.parent||(u.expression.parent=u,u.parent=e);var p=n(a(u.expression.getText()),t.projectDir,e.fileName);r.set(c.name.text,{__symbolic:"reference",module:p})}else r.set(c.name.text,{__symbolic:"error",message:"Unsupported import syntax"});break;case d.SyntaxKind.ImportDeclaration:var m=i;if(!m.importClause)break;m.moduleSpecifier.parent||(m.moduleSpecifier.parent=m,m.parent=e);var v=n(a(m.moduleSpecifier.getText()),t.projectDir,e.fileName);m.importClause.name&&r.set(m.importClause.name.text,{__symbolic:"reference",module:v,default:!0});var h=m.importClause.namedBindings;if(h)switch(h.kind){case d.SyntaxKind.NamedImports:for(var g=0,y=h.elements;g<y.length;g++){var S=y[g];r.set(S.name.text,{__symbolic:"reference",module:v,name:S.propertyName?S.propertyName.text:S.name.text})}break;case d.SyntaxKind.NamespaceImport:r.set(h.name.text,{__symbolic:"reference",module:v})}}d.forEachChild(i,o)};return e&&d.forEachChild(e,o),r},e.prototype.postHandle=function(e,t,r){var n=this,a=this.buildSymbol(t);this.handleFileLocation(e,t);var o=new Map;d.forEachChild(t,function(e){switch(e.kind){case d.SyntaxKind.ExportDeclaration:var t=e,r=t.moduleSpecifier,n=t.exportClause;r||n.elements.forEach(function(e){var t=e.name.text,r=(e.propertyName||e.name).text;o.set(r,t)})}});var i=function(e){return o.has(e.text)},s=function(e){return m(e)||i(e.name)};d.forEachChild(t,function(r){switch(r.kind){case d.SyntaxKind.ClassDeclaration:var o=r;if(o.name){var i=o.name.text;if(s(o)){for(var l=0,u=o.members;l<u.length;l++){var f=u[l];switch(f.kind){case d.SyntaxKind.Constructor:case d.SyntaxKind.MethodDeclaration:var p=f;n.handleMethod(e,p,a,i);break;case d.SyntaxKind.PropertyDeclaration:case d.SyntaxKind.GetAccessor:case d.SyntaxKind.SetAccessor:var v=f;c.isMetadataError(v)||n.handleProperty(e,v,a,i)}}o.heritageClauses&&n.handleHeritageClause(e,o.heritageClauses,a,i),n.updateDecoratorMembers(e,i,t)}}break;case d.SyntaxKind.VariableStatement:var h=r;if(m(h))for(var g=0,y=h.declarationList.declarations;g<y.length;g++){var S=y[g];if(S.name.kind==d.SyntaxKind.Identifier){var x=S.name.text;n.handleSpreadStatement(e,x,t),n.handleVariableStatement(e,S,t)}}}}),this.resolveRelativePath(e,this.projectDir,t)},e.prototype.handleFileLocation=function(e,t){var r=f.relative(this.projectDir,t.fileName);r.endsWith(".ts")&&(r=r.substring(0,r.lastIndexOf(".ts"))),e.file=r},e.prototype.handleDecorators=function(e,t,r,a){var o=e.metadata,i=o[r];if(i.decorators)for(var s=0,l=i.decorators;s<l.length;s++){var c=l[s];if(c.arguments)for(var d=0,u=c.arguments;d<u.length;d++){var f=u[d];if(f[a])for(var p=0,m=f[a];p<m.length;p++){var v=m[p];if("reference"===v.__symbolic){var h=v.module,g=n(h,this.projectDir,t.fileName);v.module=g}else if("select"===v.__symbolic){var y=v.expression,h=y.module,g=n(h,this.projectDir,t.fileName);y.module=g}}}}},e.prototype.updateDecoratorMembers=function(e,t,r){var n=e.metadata,a=n[t];if(a.decorators)for(var o=0,i=a.decorators;o<i.length;o++){var s=i[o];if(s.arguments)for(var l=0,c=s.arguments;l<c.length;l++){var d=c[l];if(d.declarations)for(var u=0,f=d.declarations;u<f.length;u++){var p=f[u];if("select"===p.__symbolic){var m=p.expression,v=p.member;p.member=this.resolveMember(m,v,r)}}}}},e.prototype.handleVariableStatement=function(e,t,r){var n=e.metadata,a=t.name.text,i=n[a],l=i.arguments;if(l&&l.length>0)for(var c=0,d=l;c<d.length;c++){var u=d[c];s(u)&&o(u,r.fileName,this.projectDir)}},e.prototype.handleSpreadStatement=function(e,t,r){var n=e.metadata,a=n[t],o=a.arguments,i=[];if(arguments&&Array.isArray(o)){for(var s=0,l=o;s<l.length;s++){var c=l[s],d=[];i.push(d);for(var u=0,f=c;u<f.length;u++){var p=f[u];if("spread"===p.__symbolic&&p.expression){var m=p.expression,v=this.resolveSpreadElement(m,r);if(v&&Array.isArray(v))for(var h=0,g=v;h<g.length;h++){var y=g[h];d.push(y)}}else d.push(p)}}a.arguments=i}},e.prototype.handleMethod=function(e,t,r,n){var o=e.metadata,i=o[n],s=i.members,l=t.parameters;if(l&&l.length>0){var c=t.kind===d.SyntaxKind.Constructor,u=void 0;if(c)u=s.__ctor__[0];else{var f=t.name.text;u=s[f][0]}for(var p=[],m=0,v=l;m<v.length;m++){var h=v[m],g=h.name.text,y=a(h.type),S=r.get(y);S||(S={__symbolic:"reference",name:y}),S.param=g,p.push(S)}u.parameters=p}},e.prototype.handleProperty=function(e,t,r,n){var o={__symbolic:"property"},i=t.name.text,s=t.type;if(s){var l=a(s);if(o.type=r.get(l),s.kind===d.SyntaxKind.ArrayType){var c=a(s.elementType);o.ref=r.get(c)}}var u=e.metadata,f=u[n],p=f.members;p?p[i]=o:(p={},p[i]=o,f.members=p)},e.prototype.handleHeritageClause=function(e,t,r,n){var a=e.metadata,o=a[n],i=[];if(o.extends&&delete o.extends,t&&t.length>0){for(var s=0,l=t;s<l.length;s++){var c=l[s],u=c.token;if(u==d.SyntaxKind.ImplementsKeyword){if(c.types)for(var f=0,p=c.types;f<p.length;f++){var m=p[f],v=m.expression.text,h=r.get(v);i.push({__symbolic:"implements",interfaces:h.module+"#"+h.name})}}else if(u==d.SyntaxKind.ExtendsKeyword){var m=c.types[0],v=m.expression.text,h=r.get(v);i.push({__symbolic:"extends",extends:h.module+"#"+h.name})}}o.heritages=i}},e.prototype.resolveMember=function(e,t,r){if(e.name){var a=e.name;if(e.module){var o=n(e.module,this.projectDir,r.fileName),i=f.join(this.projectDir+"/"+o+".ts");if(u.existsSync(i)){var s=d.createProgram([i],{target:d.ScriptTarget.ES5,module:d.ModuleKind.CommonJS}),l=s.getSourceFile(i),c=this.metaCollector.getMetadata(l,!1),p=c.metadata;return p[a]?this.resolve(p[a],t):null}}}},e.prototype.resolve=function(e,t){for(var r,n=Object.keys(e),a=0,o=n;a<o.length;a++){var i=o[a],s=e[i];if("object"==typeof s){if(i===t){r=s;break}r=this.resolve(s,t)}}return r},e.prototype.resolveSpreadElement=function(e,t){if(e.name){var r=e.name;if(e.module){var a=n(e.module,this.projectDir,t.fileName),o=f.join(this.projectDir+"/"+a+".ts");if(u.existsSync(o)){var i=d.createProgram([o],{target:d.ScriptTarget.ES5,module:d.ModuleKind.CommonJS}),s=i.getSourceFile(o),l=this.metaCollector.getMetadata(s,!1),c=l.metadata;return c[r]}}}},e.prototype.resolveRelativePath=function(e,t,r){for(var a=Object.keys(e),o=0,s=a;o<s.length;o++){var l=s[o],c=e[l];if("loadChildren"===l){var d=i(c,r.fileName,t);e[l]=d}else if("object"==typeof c)if("reference"===c.__symbolic&&c.module){var u=c.module,f=n(u,t,r.fileName);c.module=f}else this.resolveRelativePath(c,t,r)}},e}();t.Ng2xMetaCollector=h},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(3),a=function(){function e(e,t,r,n){for(var a=[],o=4;o<arguments.length;o++)a[o-4]=arguments[o];this.method=e,this.url=t,this.headers=r,this.json=n,this.token=a[0]}return e}();t.HttpRequest=a;var o=function(){function e(e,t,r,n){this.statusCode=e,this.statusMessage=t,this.headers=r,this.body=n}return e}();t.HttpResponse=o;var i=function(){function e(){}return e.prototype.send=function(e){var t=e.url;e.token&&(t=t+"?access_token="+e.token);var r={url:encodeURI(decodeURI(t)),method:e.method,headers:e.headers,json:e.json,timeout:3e4};return new Promise(function(e,t){n(r,function(r,n,a){return r?void t(r):void e(new o(n.statusCode,n.statusMessage,n.headers,a))})})},e.getHeaderValue=function(e,t){if(e)for(var r in e)if(r.toLowerCase()===t.toLowerCase())return e[r];return null},e}();i.GET="GET",i.POST="POST",i.DELETE="DELETE",i.PUT="PUT",t.HttpClient=i},function(e,t){e.exports=require("@angular/tsc-wrapped")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("readdirp")},function(e,t){e.exports=require("rxjs")},function(e,t){e.exports=require("zlib")},function(e,t,r){"use strict";function n(e,t){var r=Object.getOwnPropertyNames(e),n=Object.getOwnPropertyNames(t);if(r.length!=n.length)return!1;for(var a=0;a<r.length;a++){var o=r[a];if(e[o]!==t[o])return!1}return!0}function a(e){if(!(m&&e&&e.access_token&&e.repoId))return void(f=null);if(f){f.setAccessToken(e.access_token),f.setRepoId(e.repoId),f.setLoginName(e.email);var t=new i.ErrorMessageTracker;0===e.lastSync&&f.clearTsMetadatas(t),f.createNewRepo(t,c).then(function(r){r?f.initMetadatas(u,e,c):t.sendErrors(c)})}else{f=new l.MetadataSynchronizer(u,e.access_token,e.baseUrl||"http://angulardoc.io",e.repoId,e.email),c.console.log("Metadata Synchronizer initialized");var r=new i.ErrorMessageTracker;0===e.lastSync&&f.clearTsMetadatas(r),f.createNewRepo(r,c).then(function(t){t?f.initMetadatas(u,e,c):r.sendErrors(c)})}}function o(e){if(f){var t=i.Files.uriToFilePath(e);null==t&&(t=e);var r=new i.ErrorMessageTracker;f.collect(u,t,r,c).then(function(e){if(e)r.sendErrors(c);else{var n=(new Date).getTime();p.lastSync=n,c.sendNotification(s.ServerNotification.metadata,{file:t,lastSync:n})}})}}Object.defineProperty(t,"__esModule",{value:!0});var i=r(1),s=r(0),l=r(5),c=i.createConnection(new i.IPCMessageReader(process),new i.IPCMessageWriter(process)),d=new i.TextDocuments;d.listen(c);var u,f,p,m=!1;c.onInitialize(function(e){return u=e.rootPath,p=e.initializationOptions,a(p),m=!0,{capabilities:{textDocumentSync:i.TextDocumentSyncKind.Full}}}),c.onDidChangeConfiguration(function(e){var t=e.settings,r=t.angulardoc;r&&(p||(p={}),r.access_token===p.access_token&&r.email===p.email&&r.username===p.username&&n(r.directoryFilter,p.directoryFilter)&&n(r.fileFilter,p.fileFilter)||(p.access_token=r.access_token,p.email=r.email,p.username=r.username,p.directoryFilter=r.directoryFilter,p.fileFilter=r.fileFilter,a(p)))}),c.onRequest(s.ConfigurationChanged.params,function(e){e&&(p||(p={}),e.lastSync===p.lastSync&&e.repoId===p.repoId||(p.lastSync=e.lastSync,p.repoId=e.repoId,a(p)))}),c.onRequest(s.ServerMetadata.metadata,function(e){if(f){var t=new i.ErrorMessageTracker;"Delete"==e.action?(c.console.log("Deleting metadata for "+e.url),f.deleteMetadata(u,e.url,t).then(function(r){if(r)t.sendErrors(c);else{var n=(new Date).getTime();p.lastSync=n,c.sendNotification(s.ServerNotification.metadata,{file:e.url,lastSync:n})}})):"DeleteFolder"==e.action?f.deleteFolder(u,e.url,t).then(function(r){if(r)t.sendErrors(c);else{var n=(new Date).getTime();p.lastSync=n,c.sendNotification(s.ServerNotification.metadata,{file:e.url,lastSync:n})}}):"RenameFolder"==e.action?f.collectMetadatasFromFolder(u,e.url,t,p,c):o(e.url)}return e.action}),d.onDidSave(function(e){o(e.document.uri)}),c.onDidSaveTextDocument(function(e){o(e.textDocument.uri)}),c.listen()}]);