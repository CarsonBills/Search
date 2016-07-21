/***************
 * GroupBy SAYT
 * 2.2.83
 ***************/

/*
 * ! Dust - Asynchronous Templating - v2.5.1
 * http://linkedin.github.io/dustjs/
 * Copyright (c) 2014 Aleksander Williams; Released under the MIT License
 */
!function(root){function Context(a,b,c,d){this.stack=a,this.global=b,this.blocks=c,this.templateName=d}function Stack(a,b,c,d){this.tail=b,this.isObject=a&&"object"==typeof a,this.head=a,this.index=c,this.of=d}function Stub(a){this.head=new Chunk(this),this.callback=a,this.out=""}function Stream(){this.head=new Chunk(this)}function Chunk(a,b,c){this.root=a,this.next=b,this.data=[],this.flushable=!1,this.taps=c}function Tap(a,b){this.head=a,this.tail=b}var dust={},NONE="NONE",ERROR="ERROR",WARN="WARN",INFO="INFO",DEBUG="DEBUG",loggingLevels=[DEBUG,INFO,WARN,ERROR,NONE],EMPTY_FUNC=function(){},logger={},originalLog,loggerContext;dust.debugLevel=NONE,dust.config={whitespace:!1},dust._aliases={write:"w",end:"e",map:"m",render:"r",reference:"f",section:"s",exists:"x",notexists:"nx",block:"b",partial:"p",helper:"h"},root&&root.console&&root.console.log&&(loggerContext=root.console,originalLog=root.console.log),logger.log=loggerContext?function(){logger.log="function"==typeof originalLog?function(){originalLog.apply(loggerContext,arguments)}:function(){var a=Array.prototype.slice.apply(arguments).join(" ");originalLog(a)},logger.log.apply(this,arguments)}:function(){},dust.log=function(a,b){b=b||INFO,dust.debugLevel!==NONE&&dust.indexInArray(loggingLevels,b)>=dust.indexInArray(loggingLevels,dust.debugLevel)&&(dust.logQueue||(dust.logQueue=[]),dust.logQueue.push({message:a,type:b}),logger.log("[DUST "+b+"]: "+a))},dust.helpers={},dust.cache={},dust.register=function(a,b){a&&(dust.cache[a]=b)},dust.render=function(a,b,c){var d=new Stub(c).head;try{dust.load(a,d,Context.wrap(b,a)).end()}catch(e){d.setError(e)}},dust.stream=function(a,b){var c=new Stream,d=c.head;return dust.nextTick(function(){try{dust.load(a,c.head,Context.wrap(b,a)).end()}catch(e){d.setError(e)}}),c},dust.renderSource=function(a,b,c){return dust.compileFn(a)(b,c)},dust.compileFn=function(a,b){b=b||null;var c=dust.loadSource(dust.compile(a,b));return function(a,d){var e=d?new Stub(d):new Stream;return dust.nextTick(function(){"function"==typeof c?c(e.head,Context.wrap(a,b)).end():dust.log(new Error("Template ["+b+"] cannot be resolved to a Dust function"),ERROR)}),e}},dust.load=function(a,b,c){var d=dust.cache[a];return d?d(b,c):dust.onLoad?b.map(function(b){dust.onLoad(a,function(d,e){return d?b.setError(d):(dust.cache[a]||dust.loadSource(dust.compile(e,a)),void dust.cache[a](b,c).end())})}):b.setError(new Error("Template Not Found: "+a))},dust.loadSource=function(source,path){return eval(source)},dust.isArray=Array.isArray?Array.isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)},dust.indexInArray=function(a,b,c){if(c=+c||0,Array.prototype.indexOf)return a.indexOf(b,c);if(void 0===a||null===a)throw new TypeError('cannot call method "indexOf" of null');var d=a.length;for(1/0===Math.abs(c)&&(c=0),0>c&&(c+=d,0>c&&(c=0));d>c;c++)if(a[c]===b)return c;return-1},dust.nextTick=function(){return function(a){setTimeout(a,0)}}(),dust.isEmpty=function(a){return dust.isArray(a)&&!a.length?!0:0===a?!1:!a},dust.filter=function(a,b,c){if(c)for(var d=0,e=c.length;e>d;d++){var f=c[d];"s"===f?b=null:"function"==typeof dust.filters[f]?a=dust.filters[f](a):dust.log("Invalid filter ["+f+"]",WARN)}return b&&(a=dust.filters[b](a)),a},dust.filters={h:function(a){return dust.escapeHtml(a)},j:function(a){return dust.escapeJs(a)},u:encodeURI,uc:encodeURIComponent,js:function(a){return JSON?JSON.stringify(a):(dust.log("JSON is undefined.  JSON stringify has not been used on ["+a+"]",WARN),a)},jp:function(a){return JSON?JSON.parse(a):(dust.log("JSON is undefined.  JSON parse has not been used on ["+a+"]",WARN),a)}},dust.makeBase=function(a){return new Context(new Stack,a)},Context.wrap=function(a,b){return a instanceof Context?a:new Context(new Stack(a),{},null,b)},Context.prototype.get=function(a,b){return"string"==typeof a&&("."===a[0]&&(b=!0,a=a.substr(1)),a=a.split(".")),this._get(b,a)},Context.prototype._get=function(a,b){var c,d,e,f,g,h=this.stack,i=1;if(d=b[0],e=b.length,a&&0===e)f=h,h=h.head;else{if(a)h&&(h=h.head?h.head[d]:void 0);else{for(;h&&(!h.isObject||(f=h.head,c=h.head[d],void 0===c));)h=h.tail;h=void 0!==c?c:this.global?this.global[d]:void 0}for(;h&&e>i;)f=h,h=h[b[i]],i++}return"function"==typeof h?(g=function(){try{return h.apply(f,arguments)}catch(a){throw dust.log(a,ERROR),a}},g.__dustBody=!!h.__dustBody,g):(void 0===h&&dust.log("Cannot find the value for reference [{"+b.join(".")+"}] in template ["+this.getTemplateName()+"]"),h)},Context.prototype.getPath=function(a,b){return this._get(a,b)},Context.prototype.push=function(a,b,c){return new Context(new Stack(a,this.stack,b,c),this.global,this.blocks,this.getTemplateName())},Context.prototype.rebase=function(a){return new Context(new Stack(a),this.global,this.blocks,this.getTemplateName())},Context.prototype.current=function(){return this.stack.head},Context.prototype.getBlock=function(a){if("function"==typeof a){var b=new Chunk;a=a(b,this).data.join("")}var c=this.blocks;if(!c)return void dust.log("No blocks for context[{"+a+"}] in template ["+this.getTemplateName()+"]",DEBUG);for(var d,e=c.length;e--;)if(d=c[e][a])return d},Context.prototype.shiftBlocks=function(a){var b,c=this.blocks;return a?(b=c?c.concat([a]):[a],new Context(this.stack,this.global,b,this.getTemplateName())):this},Context.prototype.getTemplateName=function(){return this.templateName},Stub.prototype.flush=function(){for(var a=this.head;a;){if(!a.flushable)return a.error?(this.callback(a.error),dust.log("Chunk error ["+a.error+"] thrown. Ceasing to render this template.",WARN),void(this.flush=EMPTY_FUNC)):void 0;this.out+=a.data.join(""),a=a.next,this.head=a}this.callback(null,this.out)},Stream.prototype.flush=function(){for(var a=this.head;a;){if(!a.flushable)return a.error?(this.emit("error",a.error),dust.log("Chunk error ["+a.error+"] thrown. Ceasing to render this template.",WARN),void(this.flush=EMPTY_FUNC)):void 0;this.emit("data",a.data.join("")),a=a.next,this.head=a}this.emit("end")},Stream.prototype.emit=function(a,b){if(!this.events)return dust.log("No events to emit",INFO),!1;var c=this.events[a];if(!c)return dust.log("Event type ["+a+"] does not exist",WARN),!1;if("function"==typeof c)c(b);else if(dust.isArray(c))for(var d=c.slice(0),e=0,f=d.length;f>e;e++)d[e](b);else dust.log("Event Handler ["+c+"] is not of a type that is handled by emit",WARN)},Stream.prototype.on=function(a,b){return this.events||(this.events={}),this.events[a]?"function"==typeof this.events[a]?this.events[a]=[this.events[a],b]:this.events[a].push(b):b?this.events[a]=b:dust.log("Callback for type ["+a+"] does not exist. Listener not registered.",WARN),this},Stream.prototype.pipe=function(a){return this.on("data",function(b){try{a.write(b,"utf8")}catch(c){dust.log(c,ERROR)}}).on("end",function(){try{return a.end()}catch(b){dust.log(b,ERROR)}}).on("error",function(b){a.error(b)}),this},Chunk.prototype.write=function(a){var b=this.taps;return b&&(a=b.go(a)),this.data.push(a),this},Chunk.prototype.end=function(a){return a&&this.write(a),this.flushable=!0,this.root.flush(),this},Chunk.prototype.map=function(a){var b=new Chunk(this.root,this.next,this.taps),c=new Chunk(this.root,b,this.taps);this.next=c,this.flushable=!0;try{a(c)}catch(d){dust.log(d,ERROR),c.setError(d)}return b},Chunk.prototype.tap=function(a){var b=this.taps;return this.taps=b?b.push(a):new Tap(a),this},Chunk.prototype.untap=function(){return this.taps=this.taps.tail,this},Chunk.prototype.render=function(a,b){return a(this,b)},Chunk.prototype.reference=function(a,b,c,d){return"function"==typeof a&&(a=a.apply(b.current(),[this,b,null,{auto:c,filters:d}]),a instanceof Chunk)?a:dust.isEmpty(a)?this:this.write(dust.filter(a,c,d))},Chunk.prototype.section=function(a,b,c,d){if("function"==typeof a&&!a.__dustBody){try{a=a.apply(b.current(),[this,b,c,d])}catch(e){return dust.log(e,ERROR),this.setError(e)}if(a instanceof Chunk)return a}var f=c.block,g=c["else"];if(d&&(b=b.push(d)),dust.isArray(a)){if(f){var h=a.length,i=this;if(h>0){b.stack.head&&(b.stack.head.$len=h);for(var j=0;h>j;j++)b.stack.head&&(b.stack.head.$idx=j),i=f(i,b.push(a[j],j,h));return b.stack.head&&(b.stack.head.$idx=void 0,b.stack.head.$len=void 0),i}if(g)return g(this,b)}}else if(a===!0){if(f)return f(this,b)}else if(a||0===a){if(f)return f(this,b.push(a))}else if(g)return g(this,b);return dust.log("Not rendering section (#) block in template ["+b.getTemplateName()+"], because above key was not found",DEBUG),this},Chunk.prototype.exists=function(a,b,c){var d=c.block,e=c["else"];if(dust.isEmpty(a)){if(e)return e(this,b)}else if(d)return d(this,b);return dust.log("Not rendering exists (?) block in template ["+b.getTemplateName()+"], because above key was not found",DEBUG),this},Chunk.prototype.notexists=function(a,b,c){var d=c.block,e=c["else"];if(dust.isEmpty(a)){if(d)return d(this,b)}else if(e)return e(this,b);return dust.log("Not rendering not exists (^) block check in template ["+b.getTemplateName()+"], because above key was found",DEBUG),this},Chunk.prototype.block=function(a,b,c){var d=c.block;return a&&(d=a),d?d(this,b):this},Chunk.prototype.partial=function(a,b,c){var d;d=dust.makeBase(b.global),d.blocks=b.blocks,b.stack&&b.stack.tail&&(d.stack=b.stack.tail),c&&(d=d.push(c)),"string"==typeof a&&(d.templateName=a),d=d.push(b.stack.head);var e;return e="function"==typeof a?this.capture(a,d,function(a,b){d.templateName=d.templateName||a,dust.load(a,b,d).end()}):dust.load(a,this,d)},Chunk.prototype.helper=function(a,b,c,d){var e=this;if(!dust.helpers[a])return dust.log("Invalid helper ["+a+"]",WARN),e;try{return dust.helpers[a](e,b,c,d)}catch(f){return dust.log("Error in "+a+" helper: "+f,ERROR),e.setError(f)}},Chunk.prototype.capture=function(a,b,c){return this.map(function(d){var e=new Stub(function(a,b){a?d.setError(a):c(b,d)});a(e.head,b).end()})},Chunk.prototype.setError=function(a){return this.error=a,this.root.flush(),this};for(var f in Chunk.prototype)dust._aliases[f]&&(Chunk.prototype[dust._aliases[f]]=Chunk.prototype[f]);Tap.prototype.push=function(a){return new Tap(a,this)},Tap.prototype.go=function(a){for(var b=this;b;)a=b.head(a),b=b.tail;return a};var HCHARS=/[&<>"']/,AMP=/&/g,LT=/</g,GT=/>/g,QUOT=/\"/g,SQUOT=/\'/g;dust.escapeHtml=function(a){return"string"==typeof a&&HCHARS.test(a)?a.replace(AMP,"&amp;").replace(LT,"&lt;").replace(GT,"&gt;").replace(QUOT,"&quot;").replace(SQUOT,"&#39;"):a};var BS=/\\/g,FS=/\//g,CR=/\r/g,LS=/\u2028/g,PS=/\u2029/g,NL=/\n/g,LF=/\f/g,SQ=/'/g,DQ=/"/g,TB=/\t/g;dust.escapeJs=function(a){return"string"==typeof a?a.replace(BS,"\\\\").replace(FS,"\\/").replace(DQ,'\\"').replace(SQ,"\\'").replace(CR,"\\r").replace(LS,"\\u2028").replace(PS,"\\u2029").replace(NL,"\\n").replace(LF,"\\f").replace(TB,"\\t"):a},"object"==typeof exports?module.exports=dust:root.dust=dust}(function(){return this}()),function(a,b){"object"==typeof exports?module.exports=b(require("./dust")):b(a.dust)}(this,function(dust){var a=function(){function a(a,b){function c(){this.constructor=a}c.prototype=b.prototype,a.prototype=new c}function b(a,b,c,d,e,f){this.message=a,this.expected=b,this.found=c,this.offset=d,this.line=e,this.column=f,this.name="SyntaxError"}function c(a){function c(){return f(nd).line}function d(){return f(nd).column}function e(a){throw h(a,null,nd)}function f(b){function c(b,c,d){var e,f;for(e=c;d>e;e++)f=a.charAt(e),"\n"===f?(b.seenCR||b.line++,b.column=1,b.seenCR=!1):"\r"===f||"\u2028"===f||"\u2029"===f?(b.line++,b.column=1,b.seenCR=!0):(b.column++,b.seenCR=!1)}return od!==b&&(od>b&&(od=0,pd={line:1,column:1,seenCR:!1}),c(pd,od,b),od=b),pd}function g(a){qd>md||(md>qd&&(qd=md,rd=[]),rd.push(a))}function h(c,d,e){function g(a){var b=1;for(a.sort(function(a,b){return a.description<b.description?-1:a.description>b.description?1:0});b<a.length;)a[b-1]===a[b]?a.splice(b,1):b++}function h(a,b){function c(a){function b(a){return a.charCodeAt(0).toString(16).toUpperCase()}return a.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\x08/g,"\\b").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\f/g,"\\f").replace(/\r/g,"\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g,function(a){return"\\x0"+b(a)}).replace(/[\x10-\x1F\x80-\xFF]/g,function(a){return"\\x"+b(a)}).replace(/[\u0180-\u0FFF]/g,function(a){return"\\u0"+b(a)}).replace(/[\u1080-\uFFFF]/g,function(a){return"\\u"+b(a)})}var d,e,f,g=new Array(a.length);for(f=0;f<a.length;f++)g[f]=a[f].description;return d=a.length>1?g.slice(0,-1).join(", ")+" or "+g[a.length-1]:g[0],e=b?'"'+c(b)+'"':"end of input","Expected "+d+" but "+e+" found."}var i=f(e),j=e<a.length?a.charAt(e):null;return null!==d&&g(d),new b(null!==c?c:h(d,j),d,j,e,i.line,i.column)}function i(){var a;return a=j()}function j(){var a,b,c;for(a=md,b=[],c=k();c!==T;)b.push(c),c=k();return b!==T&&(nd=a,b=W(b)),a=b}function k(){var a;return a=I(),a===T&&(a=J(),a===T&&(a=l(),a===T&&(a=s(),a===T&&(a=u(),a===T&&(a=r(),a===T&&(a=F())))))),a}function l(){var b,c,d,e,f,h,i,k;if(sd++,b=md,c=m(),c!==T){for(d=[],e=Q();e!==T;)d.push(e),e=Q();d!==T?(e=M(),e!==T?(f=j(),f!==T?(h=q(),h!==T?(i=n(),i===T&&(i=Z),i!==T?(nd=md,k=$(c,f,h,i),k=k?_:Y,k!==T?(nd=b,c=ab(c,f,h,i),b=c):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y)}else md=b,b=Y;if(b===T)if(b=md,c=m(),c!==T){for(d=[],e=Q();e!==T;)d.push(e),e=Q();d!==T?(47===a.charCodeAt(md)?(e=bb,md++):(e=T,0===sd&&g(cb)),e!==T?(f=M(),f!==T?(nd=b,c=db(c),b=c):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y)}else md=b,b=Y;return sd--,b===T&&(c=T,0===sd&&g(X)),b}function m(){var b,c,d,e,f,h,i;if(b=md,c=L(),c!==T)if(eb.test(a.charAt(md))?(d=a.charAt(md),md++):(d=T,0===sd&&g(fb)),d!==T){for(e=[],f=Q();f!==T;)e.push(f),f=Q();e!==T?(f=v(),f!==T?(h=o(),h!==T?(i=p(),i!==T?(nd=b,c=gb(d,f,h,i),b=c):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y)}else md=b,b=Y;else md=b,b=Y;return b}function n(){var b,c,d,e,f,h,i;if(sd++,b=md,c=L(),c!==T)if(47===a.charCodeAt(md)?(d=bb,md++):(d=T,0===sd&&g(cb)),d!==T){for(e=[],f=Q();f!==T;)e.push(f),f=Q();if(e!==T)if(f=v(),f!==T){for(h=[],i=Q();i!==T;)h.push(i),i=Q();h!==T?(i=M(),i!==T?(nd=b,c=ib(f),b=c):(md=b,b=Y)):(md=b,b=Y)}else md=b,b=Y;else md=b,b=Y}else md=b,b=Y;else md=b,b=Y;return sd--,b===T&&(c=T,0===sd&&g(hb)),b}function o(){var b,c,d,e;return b=md,c=md,58===a.charCodeAt(md)?(d=jb,md++):(d=T,0===sd&&g(kb)),d!==T?(e=v(),e!==T?(nd=c,d=lb(e),c=d):(md=c,c=Y)):(md=c,c=Y),c===T&&(c=Z),c!==T&&(nd=b,c=mb(c)),b=c}function p(){var b,c,d,e,f,h,i;if(sd++,b=md,c=[],d=md,e=[],f=Q(),f!==T)for(;f!==T;)e.push(f),f=Q();else e=Y;for(e!==T?(f=A(),f!==T?(61===a.charCodeAt(md)?(h=ob,md++):(h=T,0===sd&&g(pb)),h!==T?(i=w(),i===T&&(i=v(),i===T&&(i=D())),i!==T?(nd=d,e=qb(f,i),d=e):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y);d!==T;){if(c.push(d),d=md,e=[],f=Q(),f!==T)for(;f!==T;)e.push(f),f=Q();else e=Y;e!==T?(f=A(),f!==T?(61===a.charCodeAt(md)?(h=ob,md++):(h=T,0===sd&&g(pb)),h!==T?(i=w(),i===T&&(i=v(),i===T&&(i=D())),i!==T?(nd=d,e=qb(f,i),d=e):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)}return c!==T&&(nd=b,c=rb(c)),b=c,sd--,b===T&&(c=T,0===sd&&g(nb)),b}function q(){var b,c,d,e,f,h,i,k;for(sd++,b=md,c=[],d=md,e=L(),e!==T?(58===a.charCodeAt(md)?(f=jb,md++):(f=T,0===sd&&g(kb)),f!==T?(h=A(),h!==T?(i=M(),i!==T?(k=j(),k!==T?(nd=d,e=qb(h,k),d=e):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y);d!==T;)c.push(d),d=md,e=L(),e!==T?(58===a.charCodeAt(md)?(f=jb,md++):(f=T,0===sd&&g(kb)),f!==T?(h=A(),h!==T?(i=M(),i!==T?(k=j(),k!==T?(nd=d,e=qb(h,k),d=e):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y);return c!==T&&(nd=b,c=tb(c)),b=c,sd--,b===T&&(c=T,0===sd&&g(sb)),b}function r(){var a,b,c,d,e;return sd++,a=md,b=L(),b!==T?(c=v(),c!==T?(d=t(),d!==T?(e=M(),e!==T?(nd=a,b=vb(c,d),a=b):(md=a,a=Y)):(md=a,a=Y)):(md=a,a=Y)):(md=a,a=Y),sd--,a===T&&(b=T,0===sd&&g(ub)),a}function s(){var b,c,d,e,f,h,i,j,k,l;if(sd++,b=md,c=L(),c!==T)if(62===a.charCodeAt(md)?(d=xb,md++):(d=T,0===sd&&g(yb)),d===T&&(43===a.charCodeAt(md)?(d=zb,md++):(d=T,0===sd&&g(Ab))),d!==T){for(e=[],f=Q();f!==T;)e.push(f),f=Q();if(e!==T)if(f=md,h=A(),h!==T&&(nd=f,h=Bb(h)),f=h,f===T&&(f=D()),f!==T)if(h=o(),h!==T)if(i=p(),i!==T){for(j=[],k=Q();k!==T;)j.push(k),k=Q();j!==T?(47===a.charCodeAt(md)?(k=bb,md++):(k=T,0===sd&&g(cb)),k!==T?(l=M(),l!==T?(nd=b,c=Cb(d,f,h,i),b=c):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y)}else md=b,b=Y;else md=b,b=Y;else md=b,b=Y;else md=b,b=Y}else md=b,b=Y;else md=b,b=Y;return sd--,b===T&&(c=T,0===sd&&g(wb)),b}function t(){var b,c,d,e,f;for(sd++,b=md,c=[],d=md,124===a.charCodeAt(md)?(e=Eb,md++):(e=T,0===sd&&g(Fb)),e!==T?(f=A(),f!==T?(nd=d,e=lb(f),d=e):(md=d,d=Y)):(md=d,d=Y);d!==T;)c.push(d),d=md,124===a.charCodeAt(md)?(e=Eb,md++):(e=T,0===sd&&g(Fb)),e!==T?(f=A(),f!==T?(nd=d,e=lb(f),d=e):(md=d,d=Y)):(md=d,d=Y);return c!==T&&(nd=b,c=Gb(c)),b=c,sd--,b===T&&(c=T,0===sd&&g(Db)),b}function u(){var b,c,d,e,f;return sd++,b=md,c=L(),c!==T?(126===a.charCodeAt(md)?(d=Ib,md++):(d=T,0===sd&&g(Jb)),d!==T?(e=A(),e!==T?(f=M(),f!==T?(nd=b,c=Kb(e),b=c):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y),sd--,b===T&&(c=T,0===sd&&g(Hb)),b}function v(){var a,b;return sd++,a=md,b=z(),b!==T&&(nd=a,b=Mb(b)),a=b,a===T&&(a=md,b=A(),b!==T&&(nd=a,b=Nb(b)),a=b),sd--,a===T&&(b=T,0===sd&&g(Lb)),a}function w(){var a,b;return sd++,a=md,b=x(),b===T&&(b=y()),b!==T&&(nd=a,b=Pb(b)),a=b,sd--,a===T&&(b=T,0===sd&&g(Ob)),a}function x(){var b,c,d,e,f;if(sd++,b=md,c=y(),c!==T)if(46===a.charCodeAt(md)?(d=Rb,md++):(d=T,0===sd&&g(Sb)),d!==T){if(e=[],f=y(),f!==T)for(;f!==T;)e.push(f),f=y();else e=Y;e!==T?(nd=b,c=Tb(c,e),b=c):(md=b,b=Y)}else md=b,b=Y;else md=b,b=Y;return sd--,b===T&&(c=T,0===sd&&g(Qb)),b}function y(){var b,c,d;if(sd++,b=md,c=[],Vb.test(a.charAt(md))?(d=a.charAt(md),md++):(d=T,0===sd&&g(Wb)),d!==T)for(;d!==T;)c.push(d),Vb.test(a.charAt(md))?(d=a.charAt(md),md++):(d=T,0===sd&&g(Wb));else c=Y;return c!==T&&(nd=b,c=Xb(c)),b=c,sd--,b===T&&(c=T,0===sd&&g(Ub)),b}function z(){var b,c,d,e;if(sd++,b=md,c=A(),c===T&&(c=Z),c!==T){if(d=[],e=C(),e===T&&(e=B()),e!==T)for(;e!==T;)d.push(e),e=C(),e===T&&(e=B());else d=Y;d!==T?(nd=b,c=Zb(c,d),b=c):(md=b,b=Y)}else md=b,b=Y;if(b===T)if(b=md,46===a.charCodeAt(md)?(c=Rb,md++):(c=T,0===sd&&g(Sb)),c!==T){for(d=[],e=C(),e===T&&(e=B());e!==T;)d.push(e),e=C(),e===T&&(e=B());d!==T?(nd=b,c=$b(d),b=c):(md=b,b=Y)}else md=b,b=Y;return sd--,b===T&&(c=T,0===sd&&g(Yb)),b}function A(){var b,c,d,e;if(sd++,b=md,ac.test(a.charAt(md))?(c=a.charAt(md),md++):(c=T,0===sd&&g(bc)),c!==T){for(d=[],cc.test(a.charAt(md))?(e=a.charAt(md),md++):(e=T,0===sd&&g(dc));e!==T;)d.push(e),cc.test(a.charAt(md))?(e=a.charAt(md),md++):(e=T,0===sd&&g(dc));d!==T?(nd=b,c=ec(c,d),b=c):(md=b,b=Y)}else md=b,b=Y;return sd--,b===T&&(c=T,0===sd&&g(_b)),b}function B(){var b,c,d,e,f,h;if(sd++,b=md,c=md,d=N(),d!==T){if(e=md,f=[],Vb.test(a.charAt(md))?(h=a.charAt(md),md++):(h=T,0===sd&&g(Wb)),h!==T)for(;h!==T;)f.push(h),Vb.test(a.charAt(md))?(h=a.charAt(md),md++):(h=T,0===sd&&g(Wb));else f=Y;f!==T&&(nd=e,f=gc(f)),e=f,e===T&&(e=v()),e!==T?(f=O(),f!==T?(nd=c,d=hc(e),c=d):(md=c,c=Y)):(md=c,c=Y)}else md=c,c=Y;return c!==T?(d=C(),d===T&&(d=Z),d!==T?(nd=b,c=ic(c,d),b=c):(md=b,b=Y)):(md=b,b=Y),sd--,b===T&&(c=T,0===sd&&g(fc)),b}function C(){var b,c,d,e,f;if(sd++,b=md,c=[],d=md,46===a.charCodeAt(md)?(e=Rb,md++):(e=T,0===sd&&g(Sb)),e!==T?(f=A(),f!==T?(nd=d,e=kc(f),d=e):(md=d,d=Y)):(md=d,d=Y),d!==T)for(;d!==T;)c.push(d),d=md,46===a.charCodeAt(md)?(e=Rb,md++):(e=T,0===sd&&g(Sb)),e!==T?(f=A(),f!==T?(nd=d,e=kc(f),d=e):(md=d,d=Y)):(md=d,d=Y);else c=Y;return c!==T?(d=B(),d===T&&(d=Z),d!==T?(nd=b,c=lc(c,d),b=c):(md=b,b=Y)):(md=b,b=Y),sd--,b===T&&(c=T,0===sd&&g(jc)),b}function D(){var b,c,d,e;if(sd++,b=md,34===a.charCodeAt(md)?(c=nc,md++):(c=T,0===sd&&g(oc)),c!==T?(34===a.charCodeAt(md)?(d=nc,md++):(d=T,0===sd&&g(oc)),d!==T?(nd=b,c=pc(),b=c):(md=b,b=Y)):(md=b,b=Y),b===T&&(b=md,34===a.charCodeAt(md)?(c=nc,md++):(c=T,0===sd&&g(oc)),c!==T?(d=G(),d!==T?(34===a.charCodeAt(md)?(e=nc,md++):(e=T,0===sd&&g(oc)),e!==T?(nd=b,c=qc(d),b=c):(md=b,b=Y)):(md=b,b=Y)):(md=b,b=Y),b===T))if(b=md,34===a.charCodeAt(md)?(c=nc,md++):(c=T,0===sd&&g(oc)),c!==T){if(d=[],e=E(),e!==T)for(;e!==T;)d.push(e),e=E();else d=Y;d!==T?(34===a.charCodeAt(md)?(e=nc,md++):(e=T,0===sd&&g(oc)),e!==T?(nd=b,c=rc(d),b=c):(md=b,b=Y)):(md=b,b=Y)}else md=b,b=Y;return sd--,b===T&&(c=T,0===sd&&g(mc)),b}function E(){var a,b;return a=u(),a===T&&(a=r(),a===T&&(a=md,b=G(),b!==T&&(nd=a,b=sc(b)),a=b)),a}function F(){var b,c,d,e,f,h,i,j;if(sd++,b=md,c=P(),c!==T){for(d=[],e=Q();e!==T;)d.push(e),e=Q();d!==T?(nd=b,c=uc(c,d),b=c):(md=b,b=Y)}else md=b,b=Y;if(b===T){if(b=md,c=[],d=md,e=md,sd++,f=K(),sd--,f===T?e=_:(md=e,e=Y),e!==T?(f=md,sd++,h=I(),sd--,h===T?f=_:(md=f,f=Y),f!==T?(h=md,sd++,i=J(),sd--,i===T?h=_:(md=h,h=Y),h!==T?(i=md,sd++,j=P(),sd--,j===T?i=_:(md=i,i=Y),i!==T?(a.length>md?(j=a.charAt(md),md++):(j=T,0===sd&&g(vc)),j!==T?(nd=d,e=wc(j),d=e):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y),d!==T)for(;d!==T;)c.push(d),d=md,e=md,sd++,f=K(),sd--,f===T?e=_:(md=e,e=Y),e!==T?(f=md,sd++,h=I(),sd--,h===T?f=_:(md=f,f=Y),f!==T?(h=md,sd++,i=J(),sd--,i===T?h=_:(md=h,h=Y),h!==T?(i=md,sd++,j=P(),sd--,j===T?i=_:(md=i,i=Y),i!==T?(a.length>md?(j=a.charAt(md),md++):(j=T,0===sd&&g(vc)),j!==T?(nd=d,e=wc(j),d=e):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y)):(md=d,d=Y);else c=Y;c!==T&&(nd=b,c=xc(c)),b=c}return sd--,b===T&&(c=T,0===sd&&g(tc)),b}function G(){var b,c,d,e,f;if(sd++,b=md,c=[],d=md,e=md,sd++,f=K(),sd--,f===T?e=_:(md=e,e=Y),e!==T?(f=H(),f===T&&(zc.test(a.charAt(md))?(f=a.charAt(md),md++):(f=T,0===sd&&g(Ac))),f!==T?(nd=d,e=wc(f),d=e):(md=d,d=Y)):(md=d,d=Y),d!==T)for(;d!==T;)c.push(d),d=md,e=md,sd++,f=K(),sd--,f===T?e=_:(md=e,e=Y),e!==T?(f=H(),f===T&&(zc.test(a.charAt(md))?(f=a.charAt(md),md++):(f=T,0===sd&&g(Ac))),f!==T?(nd=d,e=wc(f),d=e):(md=d,d=Y)):(md=d,d=Y);else c=Y;return c!==T&&(nd=b,c=Bc(c)),b=c,sd--,b===T&&(c=T,0===sd&&g(yc)),b}function H(){var b,c;return b=md,a.substr(md,2)===Cc?(c=Cc,md+=2):(c=T,0===sd&&g(Dc)),c!==T&&(nd=b,c=Ec()),b=c}function I(){var b,c,d,e,f,h;if(sd++,b=md,a.substr(md,2)===Gc?(c=Gc,md+=2):(c=T,0===sd&&g(Hc)),c!==T){for(d=[],e=md,f=md,sd++,a.substr(md,2)===Ic?(h=Ic,md+=2):(h=T,0===sd&&g(Jc)),sd--,h===T?f=_:(md=f,f=Y),f!==T?(a.length>md?(h=a.charAt(md),md++):(h=T,0===sd&&g(vc)),h!==T?(nd=e,f=Kc(h),e=f):(md=e,e=Y)):(md=e,e=Y);e!==T;)d.push(e),e=md,f=md,sd++,a.substr(md,2)===Ic?(h=Ic,md+=2):(h=T,0===sd&&g(Jc)),sd--,h===T?f=_:(md=f,f=Y),f!==T?(a.length>md?(h=a.charAt(md),md++):(h=T,0===sd&&g(vc)),h!==T?(nd=e,f=Kc(h),e=f):(md=e,e=Y)):(md=e,e=Y);d!==T?(a.substr(md,2)===Ic?(e=Ic,md+=2):(e=T,0===sd&&g(Jc)),e!==T?(nd=b,c=Lc(d),b=c):(md=b,b=Y)):(md=b,b=Y)}else md=b,b=Y;return sd--,b===T&&(c=T,0===sd&&g(Fc)),b}function J(){var b,c,d,e,f,h;if(sd++,b=md,a.substr(md,2)===Nc?(c=Nc,md+=2):(c=T,0===sd&&g(Oc)),c!==T){for(d=[],e=md,f=md,sd++,a.substr(md,2)===Pc?(h=Pc,md+=2):(h=T,0===sd&&g(Qc)),sd--,h===T?f=_:(md=f,f=Y),f!==T?(a.length>md?(h=a.charAt(md),md++):(h=T,0===sd&&g(vc)),h!==T?(nd=e,f=wc(h),e=f):(md=e,e=Y)):(md=e,e=Y);e!==T;)d.push(e),e=md,f=md,sd++,a.substr(md,2)===Pc?(h=Pc,md+=2):(h=T,0===sd&&g(Qc)),sd--,h===T?f=_:(md=f,f=Y),f!==T?(a.length>md?(h=a.charAt(md),md++):(h=T,0===sd&&g(vc)),h!==T?(nd=e,f=wc(h),e=f):(md=e,e=Y)):(md=e,e=Y);d!==T?(a.substr(md,2)===Pc?(e=Pc,md+=2):(e=T,0===sd&&g(Qc)),e!==T?(nd=b,c=Rc(d),b=c):(md=b,b=Y)):(md=b,b=Y)}else md=b,b=Y;return sd--,b===T&&(c=T,0===sd&&g(Mc)),b}function K(){var b,c,d,e,f,h,i,j,k,l;if(b=md,c=L(),c!==T){for(d=[],e=Q();e!==T;)d.push(e),e=Q();if(d!==T)if(Sc.test(a.charAt(md))?(e=a.charAt(md),md++):(e=T,0===sd&&g(Tc)),e!==T){for(f=[],h=Q();h!==T;)f.push(h),h=Q();if(f!==T){if(h=[],i=md,j=md,sd++,k=M(),sd--,k===T?j=_:(md=j,j=Y),j!==T?(k=md,sd++,l=P(),sd--,l===T?k=_:(md=k,k=Y),k!==T?(a.length>md?(l=a.charAt(md),md++):(l=T,0===sd&&g(vc)),l!==T?(j=[j,k,l],i=j):(md=i,i=Y)):(md=i,i=Y)):(md=i,i=Y),i!==T)for(;i!==T;)h.push(i),i=md,j=md,sd++,k=M(),sd--,k===T?j=_:(md=j,j=Y),j!==T?(k=md,sd++,l=P(),sd--,l===T?k=_:(md=k,k=Y),k!==T?(a.length>md?(l=a.charAt(md),md++):(l=T,0===sd&&g(vc)),l!==T?(j=[j,k,l],i=j):(md=i,i=Y)):(md=i,i=Y)):(md=i,i=Y);else h=Y;if(h!==T){for(i=[],j=Q();j!==T;)i.push(j),j=Q();i!==T?(j=M(),j!==T?(c=[c,d,e,f,h,i,j],b=c):(md=b,b=Y)):(md=b,b=Y)}else md=b,b=Y}else md=b,b=Y}else md=b,b=Y;else md=b,b=Y}else md=b,b=Y;return b===T&&(b=r()),b}function L(){var b;return 123===a.charCodeAt(md)?(b=Uc,md++):(b=T,0===sd&&g(Vc)),b}function M(){var b;return 125===a.charCodeAt(md)?(b=Wc,md++):(b=T,0===sd&&g(Xc)),b}function N(){var b;return 91===a.charCodeAt(md)?(b=Yc,md++):(b=T,0===sd&&g(Zc)),b}function O(){var b;return 93===a.charCodeAt(md)?(b=$c,md++):(b=T,0===sd&&g(_c)),b}function P(){var b;return 10===a.charCodeAt(md)?(b=ad,md++):(b=T,0===sd&&g(bd)),b===T&&(a.substr(md,2)===cd?(b=cd,md+=2):(b=T,0===sd&&g(dd)),b===T&&(13===a.charCodeAt(md)?(b=ed,md++):(b=T,0===sd&&g(fd)),b===T&&(8232===a.charCodeAt(md)?(b=gd,md++):(b=T,0===sd&&g(hd)),b===T&&(8233===a.charCodeAt(md)?(b=id,md++):(b=T,0===sd&&g(jd)))))),b}function Q(){var b;return kd.test(a.charAt(md))?(b=a.charAt(md),md++):(b=T,0===sd&&g(ld)),b===T&&(b=P()),b}var R,S=arguments.length>1?arguments[1]:{},T={},U={start:i},V=i,W=function(a){return["body"].concat(a).concat([["line",c()],["col",d()]])},X={type:"other",description:"section"},Y=T,Z=null,$=function(a,b,c,d){return d&&a[1].text===d.text||e("Expected end tag for "+a[1].text+" but it was not found."),!0},_=void 0,ab=function(a,b,e){return e.push(["param",["literal","block"],b]),a.push(e),a.concat([["line",c()],["col",d()]])},bb="/",cb={type:"literal",value:"/",description:'"/"'},db=function(a){return a.push(["bodies"]),a.concat([["line",c()],["col",d()]])},eb=/^[#?\^<+@%]/,fb={type:"class",value:"[#?\\^<+@%]",description:"[#?\\^<+@%]"},gb=function(a,b,c,d){return[a,b,c,d]},hb={type:"other",description:"end tag"},ib=function(a){return a},jb=":",kb={type:"literal",value:":",description:'":"'},lb=function(a){return a},mb=function(a){return a?["context",a]:["context"]},nb={type:"other",description:"params"},ob="=",pb={type:"literal",value:"=",description:'"="'},qb=function(a,b){return["param",["literal",a],b]},rb=function(a){return["params"].concat(a)},sb={type:"other",description:"bodies"},tb=function(a){return["bodies"].concat(a)},ub={type:"other",description:"reference"},vb=function(a,b){return["reference",a,b].concat([["line",c()],["col",d()]])},wb={type:"other",description:"partial"},xb=">",yb={type:"literal",value:">",description:'">"'},zb="+",Ab={type:"literal",value:"+",description:'"+"'},Bb=function(a){return["literal",a]},Cb=function(a,b,e,f){var g=">"===a?"partial":a;return[g,b,e,f].concat([["line",c()],["col",d()]])},Db={type:"other",description:"filters"},Eb="|",Fb={type:"literal",value:"|",description:'"|"'},Gb=function(a){return["filters"].concat(a)},Hb={type:"other",description:"special"},Ib="~",Jb={type:"literal",value:"~",description:'"~"'},Kb=function(a){return["special",a].concat([["line",c()],["col",d()]])},Lb={type:"other",description:"identifier"},Mb=function(a){var b=["path"].concat(a);return b.text=a[1].join(".").replace(/,line,\d+,col,\d+/g,""),b},Nb=function(a){var b=["key",a];return b.text=a,b},Ob={type:"other",description:"number"},Pb=function(a){return["literal",a]},Qb={type:"other",description:"float"},Rb=".",Sb={type:"literal",value:".",description:'"."'},Tb=function(a,b){return parseFloat(a+"."+b.join(""))},Ub={type:"other",description:"integer"},Vb=/^[0-9]/,Wb={type:"class",value:"[0-9]",description:"[0-9]"},Xb=function(a){return parseInt(a.join(""),10)},Yb={type:"other",description:"path"},Zb=function(a,b){return b=b[0],a&&b?(b.unshift(a),[!1,b].concat([["line",c()],["col",d()]])):[!0,b].concat([["line",c()],["col",d()]])},$b=function(a){return a.length>0?[!0,a[0]].concat([["line",c()],["col",d()]]):[!0,[]].concat([["line",c()],["col",d()]])},_b={type:"other",description:"key"},ac=/^[a-zA-Z_$]/,bc={type:"class",value:"[a-zA-Z_$]",description:"[a-zA-Z_$]"},cc=/^[0-9a-zA-Z_$\-]/,dc={type:"class",value:"[0-9a-zA-Z_$\\-]",description:"[0-9a-zA-Z_$\\-]"},ec=function(a,b){return a+b.join("")},fc={type:"other",description:"array"},gc=function(a){return a.join("")},hc=function(a){return a},ic=function(a,b){return b?b.unshift(a):b=[a],b},jc={type:"other",description:"array_part"},kc=function(a){return a},lc=function(a,b){return b?a.concat(b):a},mc={type:"other",description:"inline"},nc='"',oc={type:"literal",value:'"',description:'"\\""'},pc=function(){return["literal",""].concat([["line",c()],["col",d()]])},qc=function(a){return["literal",a].concat([["line",c()],["col",d()]])},rc=function(a){return["body"].concat(a).concat([["line",c()],["col",d()]])},sc=function(a){return["buffer",a]},tc={type:"other",description:"buffer"},uc=function(a,b){return["format",a,b.join("")].concat([["line",c()],["col",d()]])},vc={type:"any",description:"any character"},wc=function(a){return a},xc=function(a){return["buffer",a.join("")].concat([["line",c()],["col",d()]])},yc={type:"other",description:"literal"},zc=/^[^"]/,Ac={type:"class",value:'[^"]',description:'[^"]'},Bc=function(a){return a.join("")},Cc='\\"',Dc={type:"literal",value:'\\"',description:'"\\\\\\""'},Ec=function(){return'"'},Fc={type:"other",description:"raw"},Gc="{`",Hc={type:"literal",value:"{`",description:'"{`"'},Ic="`}",Jc={type:"literal",value:"`}",description:'"`}"'},Kc=function(a){return a},Lc=function(a){return["raw",a.join("")].concat([["line",c()],["col",d()]])},Mc={type:"other",description:"comment"},Nc="{!",Oc={type:"literal",value:"{!",description:'"{!"'},Pc="!}",Qc={type:"literal",value:"!}",description:'"!}"'},Rc=function(a){return["comment",a.join("")].concat([["line",c()],["col",d()]])},Sc=/^[#?\^><+%:@\/~%]/,Tc={type:"class",value:"[#?\\^><+%:@\\/~%]",description:"[#?\\^><+%:@\\/~%]"},Uc="{",Vc={type:"literal",value:"{",description:'"{"'},Wc="}",Xc={type:"literal",value:"}",description:'"}"'},Yc="[",Zc={type:"literal",value:"[",description:'"["'},$c="]",_c={type:"literal",value:"]",description:'"]"'},ad="\n",bd={type:"literal",value:"\n",description:'"\\n"'},cd="\r\n",dd={type:"literal",value:"\r\n",description:'"\\r\\n"'},ed="\r",fd={type:"literal",value:"\r",description:'"\\r"'},gd="\u2028",hd={type:"literal",value:"\u2028",description:'"\\u2028"'},id="\u2029",jd={type:"literal",value:"\u2029",description:'"\\u2029"'},kd=/^[\t\x0B\f \xA0\uFEFF]/,ld={type:"class",value:"[\\t\\x0B\\f \\xA0\\uFEFF]",description:"[\\t\\x0B\\f \\xA0\\uFEFF]"},md=0,nd=0,od=0,pd={line:1,column:1,seenCR:!1},qd=0,rd=[],sd=0;if("startRule"in S){if(!(S.startRule in U))throw new Error("Can't start parsing from rule \""+S.startRule+'".');V=U[S.startRule]}if(R=V(),R!==T&&md===a.length)return R;throw R!==T&&md<a.length&&g({type:"end",description:"end of input"}),h(null,rd,qd)}return a(b,Error),{SyntaxError:b,parse:c}}();return dust.parse=a.parse,a}),function(a,b){"object"==typeof exports?module.exports=b(require("./parser").parse,require("./dust")):b(a.dust.parse,a.dust)}(this,function(a,dust){function b(a){var b={};return o.filterNode(b,a)}function c(a,b){var c,d,e,f=[b[0]];for(c=1,d=b.length;d>c;c++)e=o.filterNode(a,b[c]),e&&f.push(e);return f}function d(a,b){var c,d,e,f,g=[b[0]];for(d=1,e=b.length;e>d;d++)f=o.filterNode(a,b[d]),f&&("buffer"===f[0]||"format"===f[0]?c?(c[0]="buffer"===f[0]?"buffer":c[0],c[1]+=f.slice(1,-2).join("")):(c=f,g.push(f)):(c=null,g.push(f)));return g}function e(a,b){return["buffer",q[b[1]],b[2],b[3]]}function f(a,b){return b}function g(){}function h(a,b){return dust.config.whitespace?b:null}function i(a,b){var c={name:b,bodies:[],blocks:{},index:0,auto:"h"};return"(function(){dust.register("+(b?'"'+b+'"':"null")+","+o.compileNode(c,a)+");"+j(c)+k(c)+"return body_0;})();"}function j(a){var b,c=[],d=a.blocks;for(b in d)c.push('"'+b+'":'+d[b]);return c.length?(a.blocks="ctx=ctx.shiftBlocks(blocks);","var blocks={"+c.join(",")+"};"):a.blocks=""}function k(a){var b,c,d=[],e=a.bodies,f=a.blocks;for(b=0,c=e.length;c>b;b++)d[b]="function body_"+b+"(chk,ctx){"+f+"return chk"+e[b]+";}body_"+b+".__dustBody=!0;";return d.join("")}function l(a,b){var c,d,e="";for(c=1,d=b.length;d>c;c++)e+=o.compileNode(a,b[c]);return e}function m(a,b,c){return"."+(dust._aliases[c]||c)+"("+o.compileNode(a,b[1])+","+o.compileNode(a,b[2])+","+o.compileNode(a,b[4])+","+o.compileNode(a,b[3])+")"
}function n(a){return a.replace(r,"\\\\").replace(s,'\\"').replace(t,"\\f").replace(u,"\\n").replace(v,"\\r").replace(w,"\\t")}var o={},p=dust.isArray;o.compile=function(c,d){if(!d&&null!==d)throw new Error("Template name parameter cannot be undefined when calling dust.compile");try{var e=b(a(c));return i(e,d)}catch(f){if(!f.line||!f.column)throw f;throw new SyntaxError(f.message+" At line : "+f.line+", column : "+f.column)}},o.filterNode=function(a,b){return o.optimizers[b[0]](a,b)},o.optimizers={body:d,buffer:f,special:e,format:h,reference:c,"#":c,"?":c,"^":c,"<":c,"+":c,"@":c,"%":c,partial:c,context:c,params:c,bodies:c,param:c,filters:f,key:f,path:f,literal:f,raw:f,comment:g,line:g,col:g},o.pragmas={esc:function(a,b,c){var d,e=a.auto;return b||(b="h"),a.auto="s"===b?"":b,d=l(a,c.block),a.auto=e,d}};var q={s:" ",n:"\n",r:"\r",lb:"{",rb:"}"};o.compileNode=function(a,b){return o.nodes[b[0]](a,b)},o.nodes={body:function(a,b){var c=a.index++,d="body_"+c;return a.bodies[c]=l(a,b),d},buffer:function(a,b){return".w("+x(b[1])+")"},format:function(a,b){return".w("+x(b[1]+b[2])+")"},reference:function(a,b){return".f("+o.compileNode(a,b[1])+",ctx,"+o.compileNode(a,b[2])+")"},"#":function(a,b){return m(a,b,"section")},"?":function(a,b){return m(a,b,"exists")},"^":function(a,b){return m(a,b,"notexists")},"<":function(a,b){for(var c=b[4],d=1,e=c.length;e>d;d++){var f=c[d],g=f[1][1];if("block"===g)return a.blocks[b[1].text]=o.compileNode(a,f[2]),""}return""},"+":function(a,b){return"undefined"==typeof b[1].text&&"undefined"==typeof b[4]?".block(ctx.getBlock("+o.compileNode(a,b[1])+",chk, ctx),"+o.compileNode(a,b[2])+", {},"+o.compileNode(a,b[3])+")":".block(ctx.getBlock("+x(b[1].text)+"),"+o.compileNode(a,b[2])+","+o.compileNode(a,b[4])+","+o.compileNode(a,b[3])+")"},"@":function(a,b){return".h("+x(b[1].text)+","+o.compileNode(a,b[2])+","+o.compileNode(a,b[4])+","+o.compileNode(a,b[3])+")"},"%":function(a,b){var c,d,e,f,g,h,i,j,k,l=b[1][1];if(!o.pragmas[l])return"";for(c=b[4],d={},j=1,k=c.length;k>j;j++)h=c[j],d[h[1][1]]=h[2];for(e=b[3],f={},j=1,k=e.length;k>j;j++)i=e[j],f[i[1][1]]=i[2][1];return g=b[2][1]?b[2][1].text:null,o.pragmas[l](a,g,d,f)},partial:function(a,b){return".p("+o.compileNode(a,b[1])+","+o.compileNode(a,b[2])+","+o.compileNode(a,b[3])+")"},context:function(a,b){return b[1]?"ctx.rebase("+o.compileNode(a,b[1])+")":"ctx"},params:function(a,b){for(var c=[],d=1,e=b.length;e>d;d++)c.push(o.compileNode(a,b[d]));return c.length?"{"+c.join(",")+"}":"{}"},bodies:function(a,b){for(var c=[],d=1,e=b.length;e>d;d++)c.push(o.compileNode(a,b[d]));return"{"+c.join(",")+"}"},param:function(a,b){return o.compileNode(a,b[1])+":"+o.compileNode(a,b[2])},filters:function(a,b){for(var c=[],d=1,e=b.length;e>d;d++){var f=b[d];c.push('"'+f+'"')}return'"'+a.auto+'"'+(c.length?",["+c.join(",")+"]":"")},key:function(a,b){return'ctx.get(["'+b[1]+'"], false)'},path:function(a,b){for(var c=b[1],d=b[2],e=[],f=0,g=d.length;g>f;f++)e.push(p(d[f])?o.compileNode(a,d[f]):'"'+d[f]+'"');return"ctx.getPath("+c+", ["+e.join(",")+"])"},literal:function(a,b){return x(b[1])},raw:function(a,b){return".w("+x(b[1])+")"}};var r=/\\/g,s=/"/g,t=/\f/g,u=/\n/g,v=/\r/g,w=/\t/g,x="undefined"==typeof JSON?function(a){return'"'+n(a)+'"'}:JSON.stringify;return dust.compile=o.compile,dust.filterNode=o.filterNode,dust.optimizers=o.optimizers,dust.pragmas=o.pragmas,dust.compileNode=o.compileNode,dust.nodes=o.nodes,o});

/*
 * ! dustjs-helpers - v1.5.0
 * https://github.com/linkedin/dustjs-helpers
 * Copyright (c) 2014 Aleksander Williams; Released under the MIT License
 */
!function(dust){function _deprecated(a){_deprecatedCache[a]||(_log("Deprecation warning: "+a+" is deprecated and will be removed in a future version of dustjs-helpers","WARN"),_log("For help and a deprecation timeline, see https://github.com/linkedin/dustjs-helpers/wiki/Deprecated-Features#"+a.replace(/\W+/g,""),"WARN"),_deprecatedCache[a]=!0)}function isSelect(a){var b=a.current();return"object"==typeof b&&b.isSelect===!0}function jsonFilter(a,b){return"function"==typeof b?b.toString().replace(/(^\s+|\s+$)/gm,"").replace(/\n/gm,"").replace(/,\s*/gm,", ").replace(/\)\{/gm,") {"):b}function filter(a,b,c,d,e){d=d||{};var f,g,h=c.block,i=d.filterOpType||"";if(d.hasOwnProperty("key"))f=dust.helpers.tap(d.key,a,b);else{if(!isSelect(b))return _log("No key specified for filter in:"+i+" helper "),a;f=b.current().selectKey,b.current().isResolved&&(e=function(){return!1})}return g=dust.helpers.tap(d.value,a,b),e(coerce(g,d.type,b),coerce(f,d.type,b))?(isSelect(b)&&(b.current().isResolved=!0),h?a.render(h,b):(_log("No body specified for "+i+" helper "),a)):c["else"]?a.render(c["else"],b):a}function coerce(a,b,c){if("undefined"!=typeof a)switch(b||typeof a){case"number":return+a;case"string":return String(a);case"boolean":return a="false"===a?!1:a,Boolean(a);case"date":return new Date(a);case"context":return c.get(a)}return a}var _log=dust.log?function(a,b){b=b||"INFO",dust.log(a,b)}:function(){},_deprecatedCache={},helpers={tap:function(a,b,c){if("function"!=typeof a)return a;var d,e="";return d=b.tap(function(a){return e+=a,""}).render(a,c),b.untap(),d.constructor!==b.constructor?d:""===e?!1:e},sep:function(a,b,c){var d=c.block;return b.stack.index===b.stack.of-1?a:d?d(a,b):a},idx:function(a,b,c){var d=c.block;return _deprecated("{@idx}"),d?d(a,b.push(b.stack.index)):a},contextDump:function(a,b,c,d){var e,f=d||{},g=f.to||"output",h=f.key||"current";return g=dust.helpers.tap(g,a,b),h=dust.helpers.tap(h,a,b),e="full"===h?JSON.stringify(b.stack,jsonFilter,2):JSON.stringify(b.stack.head,jsonFilter,2),"console"===g?(_log(e),a):(e=e.replace(/</g,"\\u003c"),a.write(e))},"if":function(chunk,context,bodies,params){var body=bodies.block,skip=bodies["else"],cond;if(params&&params.cond){if(_deprecated("{@if}"),cond=dust.helpers.tap(params.cond,chunk,context),eval(cond))return body?chunk.render(bodies.block,context):(_log("Missing body block in the if helper!"),chunk);if(skip)return chunk.render(bodies["else"],context)}else _log("No condition given in the if helper!");return chunk},math:function(a,b,c,d){if(d&&"undefined"!=typeof d.key&&d.method){var e=d.key,f=d.method,g=d.operand,h=d.round,i=null;switch(e=dust.helpers.tap(e,a,b),g=dust.helpers.tap(g,a,b),f){case"mod":(0===g||g===-0)&&_log("operand for divide operation is 0/-0: expect Nan!"),i=parseFloat(e)%parseFloat(g);break;case"add":i=parseFloat(e)+parseFloat(g);break;case"subtract":i=parseFloat(e)-parseFloat(g);break;case"multiply":i=parseFloat(e)*parseFloat(g);break;case"divide":(0===g||g===-0)&&_log("operand for divide operation is 0/-0: expect Nan/Infinity!"),i=parseFloat(e)/parseFloat(g);break;case"ceil":i=Math.ceil(parseFloat(e));break;case"floor":i=Math.floor(parseFloat(e));break;case"round":i=Math.round(parseFloat(e));break;case"abs":i=Math.abs(parseFloat(e));break;default:_log("method passed is not supported")}return null!==i?(h&&(i=Math.round(i)),c&&c.block?a.render(c.block,b.push({isSelect:!0,isResolved:!1,selectKey:i})):a.write(i)):a}return _log("Key is a required parameter for math helper along with method/operand!"),a},select:function(a,b,c,d){var e=c.block;if(d&&"undefined"!=typeof d.key){var f=dust.helpers.tap(d.key,a,b);return e?a.render(c.block,b.push({isSelect:!0,isResolved:!1,selectKey:f})):(_log("Missing body block in the select helper "),a)}return _log("No key given in the select helper!"),a},eq:function(a,b,c,d){return d?(d.filterOpType="eq",filter(a,b,c,d,function(a,b){return b===a})):a},ne:function(a,b,c,d){return d?(d.filterOpType="ne",filter(a,b,c,d,function(a,b){return b!==a})):a},lt:function(a,b,c,d){return d?(d.filterOpType="lt",filter(a,b,c,d,function(a,b){return a>b})):a},lte:function(a,b,c,d){return d?(d.filterOpType="lte",filter(a,b,c,d,function(a,b){return a>=b})):a},gt:function(a,b,c,d){return d?(d.filterOpType="gt",filter(a,b,c,d,function(a,b){return b>a})):a},gte:function(a,b,c,d){return d?(d.filterOpType="gte",filter(a,b,c,d,function(a,b){return b>=a})):a},"default":function(a,b,c,d){return d&&(d.filterOpType="default"),filter(a,b,c,d,function(){return!0})},size:function(a,b,c,d){var e,f,g,h=0;if(d=d||{},e=d.key,e&&e!==!0)if(dust.isArray(e))h=e.length;else if(!isNaN(parseFloat(e))&&isFinite(e))h=e;else if("object"==typeof e){f=0;for(g in e)Object.hasOwnProperty.call(e,g)&&f++;h=f}else h=(e+"").length;else h=0;return a.write(h)}};for(var key in helpers)dust.helpers[key]=helpers[key];"undefined"!=typeof exports&&(module.exports=dust)}("undefined"!=typeof exports?require("dustjs-linkedin"):dust);

/*
 * ! accounting.js v0.3.2, copyright 2011 Joss Crowcroft, MIT license,
 * http://josscrowcroft.github.com/accounting.js namespaced to dust, i.e.
 * dust.accounting
 */
(function(p,z){function q(a){return!!(""===a||a&&a.charCodeAt&&a.substr)}function m(a){return u?u(a):"[object Array]"===v.call(a)}function r(a){return"[object Object]"===v.call(a)}function s(a,b){var d,a=a||{},b=b||{};for(d in b)b.hasOwnProperty(d)&&null==a[d]&&(a[d]=b[d]);return a}function j(a,b,d){var c=[],e,h;if(!a)return c;if(w&&a.map===w)return a.map(b,d);for(e=0,h=a.length;e<h;e++)c[e]=b.call(d,a[e],e,a);return c}function n(a,b){a=Math.round(Math.abs(a));return isNaN(a)?b:a}function x(a){var b=c.settings.currency.format;"function"===typeof a&&(a=a());return q(a)&&a.match("%v")?{pos:a,neg:a.replace("-","").replace("%v","-%v"),zero:a}:!a||!a.pos||!a.pos.match("%v")?!q(b)?b:c.settings.currency.format={pos:b,neg:b.replace("%v","-%v"),zero:b}:a}var c={version:"0.3.2",settings:{currency:{symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3},number:{precision:0,grouping:3,thousand:",",decimal:"."}}},w=Array.prototype.map,u=Array.isArray,v=Object.prototype.toString,o=c.unformat=c.parse=function(a,b){if(m(a))return j(a,function(a){return o(a,b)});a=a||0;if("number"===typeof a)return a;var b=b||".",c=RegExp("[^0-9-"+b+"]",["g"]),c=parseFloat((""+a).replace(/\((.*)\)/,"-$1").replace(c,"").replace(b,"."));return!isNaN(c)?c:0},y=c.toFixed=function(a,b){var b=n(b,c.settings.number.precision),d=Math.pow(10,b);return(Math.round(c.unformat(a)*d)/d).toFixed(b)},t=c.formatNumber=function(a,b,d,i){if(m(a))return j(a,function(a){return t(a,b,d,i)});var a=o(a),e=s(r(b)?b:{precision:b,thousand:d,decimal:i},c.settings.number),h=n(e.precision),f=0>a?"-":"",g=parseInt(y(Math.abs(a||0),h),10)+"",l=3<g.length?g.length%3:0;return f+(l?g.substr(0,l)+e.thousand:"")+g.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+e.thousand)+(h?e.decimal+y(Math.abs(a),h).split(".")[1]:"")},A=c.formatMoney=function(a,b,d,i,e,h){if(m(a))return j(a,function(a){return A(a,b,d,i,e,h)});var a=o(a),f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format);return(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal))};c.formatColumn=function(a,b,d,i,e,h){if(!a)return[];var f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format),l=g.pos.indexOf("%s")<g.pos.indexOf("%v")?!0:!1,k=0,a=j(a,function(a){if(m(a))return c.formatColumn(a,f);a=o(a);a=(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal));if(a.length>k)k=a.length;return a});return j(a,function(a){return q(a)&&a.length<k?l?a.replace(f.symbol,f.symbol+Array(k-a.length+1).join(" ")):Array(k-a.length+1).join(" ")+a:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=c;exports.accounting=c}else"function"===typeof define&&define.amd?define([],function(){return c}):(c.noConflict=function(a){return function(){p.accounting=a;c.noConflict=z;return c}}(p.accounting),p.accounting=c)})(dust);

/*
 * GroupBy Dust Helpers (Minified)
 */
!function(d){ d.helpers.setData = function(a, b, c, e) { var f = dust.escapeHtml($.toJSON(e)); return a.write('data-ui-autocomplete-item="' + f + '"') }, d.helpers.generateId = function(a) { for (var b = ""; b.length < 10;) b += Math.random().toString(36).substr(2); return a.write('id="' + b.substr(0, 10) + '"') }, d.helpers.formatNumber = function(a, b, c, e) { return n = e.n || 0, p = e.precision || 0, t = e.thousands || "", x = e.decimal || ".", a.write(d.accounting.formatNumber(n, p, t, x)) }; }("undefined"!=typeof exports?module.exports=require("dustjs-linkedin"):dust);

/* ! jQuery JSON plugin v2.4.0 | github.com/Krinkle/jquery-json */
!function($){"use strict";var escape=/["\\\x00-\x1f\x7f-\x9f]/g,meta={"\b":"\\b","  ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},hasOwn=Object.prototype.hasOwnProperty;$.toJSON="object"==typeof JSON&&JSON.stringify?JSON.stringify:function(a){if(null===a)return"null";var b,c,d,e,f=$.type(a);if("undefined"===f)return void 0;if("number"===f||"boolean"===f)return String(a);if("string"===f)return $.quoteString(a);if("function"==typeof a.toJSON)return $.toJSON(a.toJSON());if("date"===f){var g=a.getUTCMonth()+1,h=a.getUTCDate(),i=a.getUTCFullYear(),j=a.getUTCHours(),k=a.getUTCMinutes(),l=a.getUTCSeconds(),m=a.getUTCMilliseconds();return 10>g&&(g="0"+g),10>h&&(h="0"+h),10>j&&(j="0"+j),10>k&&(k="0"+k),10>l&&(l="0"+l),100>m&&(m="0"+m),10>m&&(m="0"+m),'"'+i+"-"+g+"-"+h+"T"+j+":"+k+":"+l+"."+m+'Z"'}if(b=[],$.isArray(a)){for(c=0;c<a.length;c++)b.push($.toJSON(a[c])||"null");return"["+b.join(",")+"]"}if("object"==typeof a){for(c in a)if(hasOwn.call(a,c)){if(f=typeof c,"number"===f)d='"'+c+'"';else{if("string"!==f)continue;d=$.quoteString(c)}f=typeof a[c],"function"!==f&&"undefined"!==f&&(e=$.toJSON(a[c]),b.push(d+":"+e))}return"{"+b.join(",")+"}"}},$.evalJSON="object"==typeof JSON&&JSON.parse?JSON.parse:function(str){return eval("("+str+")")},$.secureEvalJSON="object"==typeof JSON&&JSON.parse?JSON.parse:function(str){var filtered=str.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"");if(/^[\],:{}\s]*$/.test(filtered))return eval("("+str+")");throw new SyntaxError("Error parsing JSON, source is not valid.")},$.quoteString=function(a){return a.match(escape)?'"'+a.replace(escape,function(a){var b=meta[a];return"string"==typeof b?b:(b=a.charCodeAt(),"\\u00"+Math.floor(b/16).toString(16)+(b%16).toString(16))})+'"':'"'+a+'"'}}(jQuery);
/*
 * SAYT Widget Definition
 */
$.widget('custom.sayt', $.ui.autocomplete, {
    options: {
        // Triggers
        selectSearchTerm: function (data) {
        },
        selectNavigation: function (data) {
        },
        selectProduct: function (data) {
        },

        // SAYT Options
        subdomain: '',

        // Search Params - Common
        collection: '',

        // Search Params - Autocomplete
        numSearchTerms: 5,
        numNavigations: 5,
        sortAlphabetically: false,
        fuzzyMatch: false,

        // Search Params - Product
        area: 'Production',
        numProducts: 4,
        productSort: null,
        shouldSearchSuggestionFirst: true,
        hideNoProductsMessage: false,
        defaultImage: ' ',

        // Template Options
        autocompleteTemplate: 'autocompleteTemplate',
        productTemplate: 'productTemplate',
        delay: 250,

        // jQuery Autocomplete Options
        minLength: 3,
        source: function (request, callback) {
            $.ajax({
                url: this._getUrl('.groupbycloud.com/api/v1/sayt/search'),
                type: 'GET',
                data: {
                    query: request.term,
                    collection: this._getValue(this.options.collection),
                    searchItems: this.options.numSearchTerms,
                    navigationItems: this.options.numNavigations,
                    productItems: 8,
                    alphabetize: this.options.sortAlphabetically,
                    fuzzy: this.options.fuzzyMatch
                },
                dataType: 'jsonp'
            }).done(function (json) {
                console.log(json)
                console.log(callback)
                callback(json);
            }).fail(function () {
                callback({});
            });
        }
    },

    // Parent Overrides
    _init: function () {
        this.lastFocusedId;
        this.productSearchTimer;
        this.spacePressed = false;
        this.element.context.sayt = this;

        var self = this;
        this.element.keydown(function (event) {
            self._focus(false);
            if (event.keyCode === 32) {
                self.spacePressed = true;
            }
        });

        this.options.focus = function (event, ui) {
            event.preventDefault();
            var item = ui.item;
            if(item === undefined){
                event.stopImmediatePropagation();
            } else if (item.type === 'searchTerm') {
                this.sayt._focusChange(item.value, null, event, item);
            } else if (item.type === 'navigation') {
                this.sayt._focusChange(null, '~' + item.category + '='
                + item.value, event, item);
            }
        };
        this.options.select = function (event, ui) {
            // Go directly to live detail page

            
            // event.preventDefault();
            // var item = ui.item;
            // if (item.type === 'searchTerm') {
            //     this.sayt.options.selectSearchTerm(item);
            // } else if (item.type === 'navigation') {
            //     this.sayt.options.selectNavigation(item);
            // } else if (item.type === 'product') {
            //     this.sayt.options.selectProduct(item);
            // }
        };
    },
    _destroy: function () {
        this._clearTimeout();
        this._super('_destroy');
    },
    _suggest: function( items ) {
        var ul = this.menu.element.empty();
        this._renderMenu( ul, items );
        this.isNewMenu = true;
        this.menu.refresh();

        // size and position menu
        ul.css('top', 0);
        ul.css('left', 0);
        this._resizeMenu();
        if ( this.options.autoFocus ) {
            this.menu.next();
        }

        this._styleCleanup();
    },
    _renderMenu: function (ul, items) {
        if (!'stats' in items[1]) {
            return;
        }
        if (items[1].stats.searchCount > 0 || items[1].stats.navigationCount > 0) {
            dust.render(this.options.autocompleteTemplate, {
                items: [items[1]]
            }, function (err, out) {
                ul.css('z-index', '1000000');
                ul.attr('id', 'sayt-menu');
                ul.append(out);
            });
        }

        if (!this.options.shouldSearchSuggestionFirst) {
            this._searchProduct(this.element.val());
        } else if (items[1].stats.searchCount == 0) {
            this._searchProduct(this.element.val());
        } else if (items[1].stats.searchCount > 0) {
            this._searchProduct(items[1].searchTerms[0].value);
        }
    },

    // Private Helper Methods
    _getUrl: function (url) {
        return (window.location.protocol == 'https:' ? 'https:' : 'http:') + '//' + this._getValue(this.options.subdomain) + url;
    },
    _clearTimeout: function () {
        this.productSearchTimer || clearTimeout(this.productSearchTimer);
    },
    _styleCleanup: function () {
        var el = this.element;
        var ul = this.menu.element;
        if(ul.children().length == 0){
            ul.hide();
        } else {
            var autocompletes = ul.find('.ui-menu-item').not('.sayt-product-content');
            if (autocompletes.length == 0) {
                ul.find('.ui-menu-divider').remove();
            }
            ul.position( $.extend({of: el}, this.options.position ) );
            ul.show();
        }
    },
    _focus: function (enable, newId) {
        if (typeof newId !== 'undefined') {
            this.lastFocusedId = newId;
        }
        if (typeof this.lastFocusedId !== 'undefined') {
            var lf = $('#' + this.lastFocusedId);
            (enable ? lf.addClass : lf.removeClass)('ui-state-focus');
        }
    },
    _focusChange: function (searchTerm, refinements, event, item) {
        this._focus(false);
        if (typeof event.keyCode !== 'undefined') { // using keyboard
            this._focus(true, item.id);
            this.element.val(item.value);
            this._searchProduct(searchTerm, refinements);
        }
    },
    _searchProduct: function (searchTerm, refinements) {
        if (this.spacePressed) {
            this._searchProductWithClearedTimer(searchTerm, refinements);
        } else {
            this._clearTimeout();
            var self = this;
            this.productSearchTimer = setTimeout(function () {
                self._searchProductWithClearedTimer(searchTerm, refinements);
            }, this.options.delay);
        }
    },
    _getValue: function (obj) {
        return $.isFunction(obj) ? obj() : obj;
    },
    _searchProductWithClearedTimer: function (searchTerm, refinements) {
        this._clearTimeout();
        this.spacePressed = false;
        var self = this;
        var data = {
            query: searchTerm == null ? '' : searchTerm,
            refinements: refinements == null ? '' : refinements,
            collection: this._getValue(this.options.collection),
            area: this.options.area,
            productItems: this.options.numProducts,
            searchItems: 0,
            navigationItems: 0
        };
        if (this.options.productSort !== null) {
            data['productSort'] = this.options.productSort;
        }

        $.ajax({
            url: this._getUrl('.groupbycloud.com/api/v1/sayt/products'),
            type: 'GET',
            data: data,
            dataType: 'jsonp'
        }).done(function (data) {
            var ul = $(self.menu.element);
            ul.find('.sayt-product-content').remove();
            if(self.options.hideNoProductsMessage &&
                ($.isEmptyObject(data) || $.isEmptyObject(data[1]))){
                // do nothing
            } else if(ul.is(":visible")) {
                dust.render(self.options.productTemplate, {
                    items: data.result,
                    defaultImage: self.options.defaultImage
                }, function (err, out) {
                    ul.append(out);
                });
                self._styleCleanup();
            }
        });
    }
});
