
/**
 * Isotobe v1.5.25
 * An exquisite jQuery plugin for magical layouts
 * http://isotobe.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 *
 * Few modifications Added (beforeAnimation option, isotobe renamed to isotobe)
 */

/*jshint asi: true, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
// {var F=n.document,m=n.Modernizr,u=function(a){return a.charAt(0).toUpperCase()+a.slice(1)},z=["Moz","Webkit","O","Ms"],s=function(a){var b=F.documentElement.style,c;if("string"===typeof b[a])return a;a=u(a);for(var d=0,e=z.length;d<e;d++)if(c=z[d]+a,"string"===typeof b[c])return c},v=s("transform"),A=s("transitionProperty");r={csstransforms:function(){return!!v},csstransforms3d:function(){var a=!!s("perspective");if(a){var a="@media ("+" -o- -moz- -ms- -webkit- -khtml- ".split(" ").join("transform-3d),(")+ "modernizr)",b=f("<style>"+a+"{#modernizr{height:3px}}</style>").appendTo("head"),c=f('<div id="modernizr" />').appendTo("html"),a=3===c.height();c.remove();b.remove()}return a},csstransitions:function(){return!!A}};var p;if(m)for(p in r)m.hasOwnProperty(p)||m.addTest(p,r[p]);else{var m=n.Modernizr={_version:"1.6ish: miniModernizr for Isotobe"},w=" ",x;for(p in r)x=r[p](),m[p]=x,w+=" "+(x?"":"no-")+p;f("html").addClass(w)}if(m.csstransforms){var G=m.csstransforms3d?{translate:function(a){return"translate3d("+ a[0]+"px, "+a[1]+"px, 0) "},scale:function(a){return"scale3d("+a+", "+a+", 1) "}}:{translate:function(a){return"translate("+a[0]+"px, "+a[1]+"px) "},scale:function(a){return"scale("+a+") "}},B=function(a,b,c){var d=f.data(a,"isoTransform")||{},e={},g,h={};e[b]=c;f.extend(d,e);for(g in d)b=d[g],h[g]=G[g](b);g=(h.translate||"")+(h.scale||"");f.data(a,"isoTransform",d);a.style[v]=g};f.cssNumber.scale=!0;f.cssHooks.scale={set:function(a,b){B(a,"scale",b)},get:function(a,b){var c=f.data(a,"isoTransform"); return c&&c.scale?c.scale:1}};f.fx.step.scale=function(a){f.cssHooks.scale.set(a.elem,a.now+a.unit)};f.cssNumber.translate=!0;f.cssHooks.translate={set:function(a,b){B(a,"translate",b)},get:function(a,b){var c=f.data(a,"isoTransform");return c&&c.translate?c.translate:[0,0]}}}var C,D;m.csstransitions&&(C={WebkitTransitionProperty:"webkitTransitionEnd",MozTransitionProperty:"transitionend",OTransitionProperty:"oTransitionEnd otransitionend",transitionProperty:"transitionend"}[A],D=s("transitionDuration")); var t=f.event,H=f.event.handle?"handle":"dispatch",y;t.special.smartresize={setup:function(){f(this).bind("resize",t.special.smartresize.handler)},teardown:function(){f(this).unbind("resize",t.special.smartresize.handler)},handler:function(a,b){var c=this,d=arguments;a.type="smartresize";y&&clearTimeout(y);y=setTimeout(function(){t[H].apply(c,d)},"execAsap"===b?0:100)}};f.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])};f.IsotobeOm=function(a, b,c){this.element=f(b);this._create(a);this._init(c)};var I=["width","height"],E=f(n);f.IsotobeOm.settings={resizable:!0,layoutMode:"masonry",containerClass:"isotobe",itemClass:"isotobe-item",hiddenClass:"isotobe-hidden",hiddenStyle:{opacity:0,scale:0.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:"relative",overflow:"hidden"},animationEngine:"best-available",animationOptions:{queue:!1,duration:800},sortBy:"original-order",sortAscending:!0,resizesContainer:!0,transformsEnabled:!0, itemPositionDataEnabled:!1};f.IsotobeOm.prototype={_create:function(a){this.options=f.extend({},f.IsotobeOm.settings,a);this.styleQueue=[];this.elemCount=0;a=this.element[0].style;this.originalStyle={};var b=I.slice(0),c;for(c in this.options.containerStyle)b.push(c);for(var d=0,e=b.length;d<e;d++)c=b[d],this.originalStyle[c]=a[c]||"";this.element.css(this.options.containerStyle);this._updateAnimationEngine();this._updateUsingTransforms();this.options.getSortData=f.extend(this.options.getSortData, {"original-order":function(a,c){c.elemCount++;return c.elemCount},random:function(){return Math.random()}});this.reloadItems();this.offset={left:parseInt(this.element.css("padding-left")||0,10),top:parseInt(this.element.css("padding-top")||0,10)};var g=this;setTimeout(function(){g.element.addClass(g.options.containerClass)},0);this.options.resizable&&E.bind("smartresize.isotobe",function(){g.resize()});this.element.delegate("."+this.options.hiddenClass,"click",function(){return!1})},_getAtoms:function(a){var b= this.options.itemSelector;a=b?a.filter(b).add(a.find(b)):a;b={position:"absolute"};a=a.filter(function(a,b){return 1===b.nodeType});this.usingTransforms&&(b.left=0,b.top=0);a.css(b).addClass(this.options.itemClass);this.updateSortData(a,!0);return a},_init:function(a){this.$filteredAtoms=this._filter(this.$allAtoms);this._sort();this.reLayout(a)},option:function(a){if(f.isPlainObject(a)){this.options=f.extend(!0,this.options,a);for(var b in a)if(a="_update"+u(b),this[a])this[a]()}},_updateAnimationEngine:function(){var a; switch(this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,"")){case "css":case "none":a=!1;break;case "jquery":a=!0;break;default:a=!m.csstransitions}this.isUsingJQueryAnimation=a;this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var a=this.usingTransforms=this.options.transformsEnabled&&m.csstransforms&&m.csstransitions&&!this.isUsingJQueryAnimation;a||(delete this.options.hiddenStyle.scale,delete this.options.visibleStyle.scale); this.getPositionStyles=a?this._translate:this._positionAbs},_filter:function(a){var b=""===this.options.filter?"*":this.options.filter;if(!b)return a;var c=this.options.hiddenClass,d="."+c,e=a.filter(d),g=e;"*"!==b&&(g=e.filter(b),d=a.not(d).not(b).addClass(c),this.styleQueue.push({$el:d,style:this.options.hiddenStyle}));this.styleQueue.push({$el:g,style:this.options.visibleStyle});g.removeClass(c);return a.filter(b)},updateSortData:function(a,b){var c=this,d=this.options.getSortData,e,g;a.each(function(){e= f(this);g={};for(var a in d)g[a]=b||"original-order"!==a?d[a](e,c):f.data(this,"isotobe-sort-data")[a];f.data(this,"isotobe-sort-data",g)})},_sort:function(){var a=this.options.sortBy,b=this._getSorter,c=this.options.sortAscending?1:-1;this.$filteredAtoms.sort(function(d,e){var g=b(d,a),f=b(e,a);g===f&&"original-order"!==a&&(g=b(d,"original-order"),f=b(e,"original-order"));return(g>f?1:g<f?-1:0)*c})},_getSorter:function(a,b){return f.data(a,"isotobe-sort-data")[b]},_translate:function(a,b){return{translate:[a, b]}},_positionAbs:function(a,b){return{left:a,top:b}},_pushPosition:function(a,b,c){b=Math.round(b+this.offset.left);c=Math.round(c+this.offset.top);var d=this.getPositionStyles(b,c);this.styleQueue.push({$el:a,style:d});this.options.itemPositionDataEnabled&&a.data("isotobe-item-position",{x:b,y:c})},layout:function(a,b){this.options.beforeLayout&&this.options.beforeLayout(a,this);var c=this.options.layoutMode;this["_"+c+"Layout"](a);this.options.resizesContainer&&(c=this["_"+c+"GetContainerSize"](), this.styleQueue.push({$el:this.element,style:c}));this._processStyleQueue(a,b);this.isLaidOut=!0},_processStyleQueue:function(a,b){var c=this.isLaidOut?this.isUsingJQueryAnimation?"animate":"css":"css",d=this.options.animationOptions,e=this.options.onLayout,g,h,l,k;h=function(a,b){b.$el[c](b.style,d)};if(this._isInserting&&this.isUsingJQueryAnimation)h=function(a,b){g=b.$el.hasClass("no-transition")?"css":c;b.$el[g](b.style,d)};else if(b||e||d.complete){var n=!1,p=[b,e,d.complete],r=this;l=!0;k=function(){if(!n){for(var c, b=0,d=p.length;b<d;b++)c=p[b],"function"===typeof c&&c.call(r.element,a,r);n=!0}};if(this.isUsingJQueryAnimation&&"animate"===c)d.complete=k,l=!1;else if(m.csstransitions){for(var e=0,q=this.styleQueue[0],q=q&&q.$el;!q||!q.length;){q=this.styleQueue[e++];if(!q)return;q=q.$el}0<parseFloat(getComputedStyle(q[0])[D])&&(h=function(a,b){b.$el[c](b.style,d).one(C,k)},l=!1)}}this.options.beforeAnimation&&this.options.beforeAnimation(a,this);f.each(this.styleQueue,h);l&&k();this.styleQueue=[]},resize:function(){this["_"+ this.options.layoutMode+"ResizeChanged"]()&&this.reLayout()},reLayout:function(a){this["_"+this.options.layoutMode+"Reset"]();this.layout(this.$filteredAtoms,a)},addItems:function(a,b){var c=this._getAtoms(a);this.$allAtoms=this.$allAtoms.add(c);b&&b(c)},insert:function(a,b){this.element.append(a);var c=this;this.addItems(a,function(a){a=c._filter(a);c._addHideAppended(a);c._sort();c.reLayout();c._revealAppended(a,b)})},appended:function(a,b){var c=this;this.addItems(a,function(a){c._addHideAppended(a); c.layout(a);c._revealAppended(a,b)})},_addHideAppended:function(a){this.$filteredAtoms=this.$filteredAtoms.add(a);a.addClass("no-transition");this._isInserting=!0;this.styleQueue.push({$el:a,style:this.options.hiddenStyle})},_revealAppended:function(a,b){var c=this;setTimeout(function(){a.removeClass("no-transition");c.styleQueue.push({$el:a,style:c.options.visibleStyle});c._isInserting=!1;c._processStyleQueue(a,b)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())}, remove:function(a,b){this.$allAtoms=this.$allAtoms.not(a);this.$filteredAtoms=this.$filteredAtoms.not(a);var c=this,d=function(){a.remove();b&&b.call(c.element)};a.filter(":not(."+this.options.hiddenClass+")").length?(this.styleQueue.push({$el:a,style:this.options.hiddenStyle}),this._sort(),this.reLayout(d)):d()},shuffle:function(a){this.updateSortData(this.$allAtoms);this.options.sortBy="random";this._sort();this.reLayout(a)},destroy:function(){var a=this.usingTransforms,b=this.options;this.$allAtoms.removeClass(b.hiddenClass+ " "+b.itemClass).each(function(){var b=this.style;b.position="";b.top="";b.left="";b.opacity="";a&&(b[v]="")});var c=this.element[0].style,d;for(d in this.originalStyle)c[d]=this.originalStyle[d];this.element.unbind(".isotobe").undelegate("."+b.hiddenClass,"click").removeClass(b.containerClass).removeData("isotobe");E.unbind(".isotobe")},_getSegments:function(a){var b=this.options.layoutMode,c=a?"rowHeight":"columnWidth",d=a?"height":"width";a=a?"rows":"cols";var e=this.element[d](),d=this.options[b]&& this.options[b][c]||this.$filteredAtoms["outer"+u(d)](!0)||e,e=Math.floor(e/d),e=Math.max(e,1);this[b][a]=e;this[b][c]=d},_checkIfSegmentsChanged:function(a){var b=this.options.layoutMode,c=a?"rows":"cols",d=this[b][c];this._getSegments(a);return this[b][c]!==d},_masonryReset:function(){this.masonry={};this._getSegments();var a=this.masonry.cols;for(this.masonry.colYs=[];a--;)this.masonry.colYs.push(0)},_masonryLayout:function(a){var b=this,c=b.masonry;a.each(function(){var a=f(this),e=Math.ceil(a.outerWidth(!0)/ c.columnWidth),e=Math.min(e,c.cols);if(1===e)b._masonryPlaceBrick(a,c.colYs);else{var g=c.cols+1-e,h=[],l,k;for(k=0;k<g;k++)l=c.colYs.slice(k,k+e),h[k]=Math.max.apply(Math,l);b._masonryPlaceBrick(a,h)}})},_masonryPlaceBrick:function(a,b){for(var c=Math.min.apply(Math,b),d=0,e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}this._pushPosition(a,this.masonry.columnWidth*d,c);c+=a.outerHeight(!0);f=this.masonry.cols+1-f;for(e=0;e<f;e++)this.masonry.colYs[d+e]=c},_masonryGetContainerSize:function(){return{height:Math.max.apply(Math, this.masonry.colYs)}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function(a){var b=this,c=this.element.width(),d=this.fitRows;a.each(function(){var a=f(this),g=a.outerWidth(!0),h=a.outerHeight(!0);0!==d.x&&g+d.x>c&&(d.x=0,d.y=d.height);b._pushPosition(a,d.x,d.y);d.height=Math.max(d.y+h,d.height);d.x+=g})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return!0}, _cellsByRowReset:function(){this.cellsByRow={index:0};this._getSegments();this._getSegments(!0)},_cellsByRowLayout:function(a){var b=this,c=this.cellsByRow;a.each(function(){var a=f(this),e=Math.floor(c.index/c.cols),g=(c.index%c.cols+0.5)*c.columnWidth-a.outerWidth(!0)/2,e=(e+0.5)*c.rowHeight-a.outerHeight(!0)/2;b._pushPosition(a,g,e);c.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}}, _cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function(a){var b=this;a.each(function(a){a=f(this);b._pushPosition(a,0,b.straightDown.y);b.straightDown.y+=a.outerHeight(!0)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return!0},_masonryHorizontalReset:function(){this.masonryHorizontal={};this._getSegments(!0);var a=this.masonryHorizontal.rows; for(this.masonryHorizontal.rowXs=[];a--;)this.masonryHorizontal.rowXs.push(0)},_masonryHorizontalLayout:function(a){var b=this,c=b.masonryHorizontal;a.each(function(){var a=f(this),e=Math.ceil(a.outerHeight(!0)/c.rowHeight),e=Math.min(e,c.rows);if(1===e)b._masonryHorizontalPlaceBrick(a,c.rowXs);else{var g=c.rows+1-e,h=[],l,k;for(k=0;k<g;k++)l=c.rowXs.slice(k,k+e),h[k]=Math.max.apply(Math,l);b._masonryHorizontalPlaceBrick(a,h)}})},_masonryHorizontalPlaceBrick:function(a,b){for(var c=Math.min.apply(Math, b),d=0,e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}this._pushPosition(a,c,this.masonryHorizontal.rowHeight*d);c+=a.outerWidth(!0);f=this.masonryHorizontal.rows+1-f;for(e=0;e<f;e++)this.masonryHorizontal.rowXs[d+e]=c},_masonryHorizontalGetContainerSize:function(){return{width:Math.max.apply(Math,this.masonryHorizontal.rowXs)}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function(a){var b= this,c=this.element.height(),d=this.fitColumns;a.each(function(){var a=f(this),g=a.outerWidth(!0),h=a.outerHeight(!0);0!==d.y&&h+d.y>c&&(d.x=d.width,d.y=0);b._pushPosition(a,d.x,d.y);d.width=Math.max(d.x+g,d.width);d.y+=h})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return!0},_cellsByColumnReset:function(){this.cellsByColumn={index:0};this._getSegments();this._getSegments(!0)},_cellsByColumnLayout:function(a){var b=this,c=this.cellsByColumn; a.each(function(){var a=f(this),e=c.index%c.rows,g=(Math.floor(c.index/c.rows)+0.5)*c.columnWidth-a.outerWidth(!0)/2,e=(e+0.5)*c.rowHeight-a.outerHeight(!0)/2;b._pushPosition(a,g,e);c.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function(a){var b= this;a.each(function(a){a=f(this);b._pushPosition(a,b.straightAcross.x,0);b.straightAcross.x+=a.outerWidth(!0)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return!0}};f.fn.imagesLoaded=function(a){function b(){a.call(d,e)}function c(a){a=a.target;a.src!==h&&-1===f.inArray(a,l)&&(l.push(a),0>=--g&&(setTimeout(b),e.unbind(".imagesLoaded",c)))}var d=this,e=d.find("img").add(d.filter("img")),g=e.length,h="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", l=[];g||b();e.bind("load.imagesLoaded error.imagesLoaded",c).each(function(){var a=this.src;this.src=h;this.src=a});return d};f.fn.isotobeOm=function(a,b){if("string"===typeof a){var c=Array.prototype.slice.call(arguments,1);this.each(function(){var b=f.data(this,"isotobe");b?f.isFunction(b[a])&&"_"!==a.charAt(0)?b[a].apply(b,c):n.console&&n.console.error("no such method '"+a+"' for isotobe instance"):n.console&&n.console.error("cannot call methods on isotobe prior to initialization; attempted to call method '"+ a+"'")})}else this.each(function(){var c=f.data(this,"isotobe");c?(c.option(a),c._init(b)):f.data(this,"isotobe",new f.IsotobeOm(a,this,b))});return this}})(window,jQuery);
/*global jQuery: false */

(function(n, f, r) {
    var F = n.document, m = n.Modernizr, u = function(a) {
        return a.charAt(0).toUpperCase() + a.slice(1)
    }, z = ["Moz", "Webkit", "O", "Ms"], s = function(a) {
        var b = F.documentElement.style, c;
        if ("string" === typeof b[a])
            return a;
        a = u(a);
        for (var d = 0, e = z.length; d < e; d++)
            if (c = z[d] + a, "string" === typeof b[c])
                return c
    }, v = s("transform"), A = s("transitionProperty");
    r = {csstransforms: function() {
            return!!v
        }, csstransforms3d: function() {
            var a = !!s("perspective");
            if (a) {
                var a = "@media (" + " -o- -moz- -ms- -webkit- -khtml- ".split(" ").join("transform-3d),(") + "modernizr)", b = f("<style>" + a + "{#modernizr{height:3px}}</style>").appendTo("head"), c = f('<div id="modernizr" />').appendTo("html"), a = 3 === c.height();
                c.remove();
                b.remove()
            }
            return a
        }, csstransitions: function() {
            return!!A
        }};
    var p;
    if (m)
        for (p in r)
            m.hasOwnProperty(p) || m.addTest(p, r[p]);
    else {
        var m = n.Modernizr = {_version: "1.6ish: miniModernizr for Isotobe"}, w = " ", x;
        for (p in r)
            x = r[p](), m[p] = x, w += " " + (x ? "" : "no-") + p;
        f("html").addClass(w)
    }
    if (m.csstransforms) {
        var G = m.csstransforms3d ? {translate: function(a) {
                return"translate3d(" + a[0] + "px, " + a[1] + "px, 0) "
            }, scale: function(a) {
                return"scale3d(" + a + ", " + a + ", 1) "
            }} : {translate: function(a) {
                return"translate(" + a[0] + "px, " + a[1] + "px) "
            }, scale: function(a) {
                return"scale(" + a + ") "
            }}, B = function(a, b, c) {
            var d = f.data(a, "isoTransform") || {}, e = {}, g, h = {};
            e[b] = c;
            f.extend(d, e);
            for (g in d)
                b = d[g], h[g] = G[g](b);
            g = (h.translate || "") + (h.scale || "");
            f.data(a, "isoTransform", d);
            a.style[v] = g
        };
        f.cssNumber.scale = !0;
        f.cssHooks.scale = {set: function(a, b) {
                B(a, "scale", b)
            }, get: function(a, b) {
                var c = f.data(a, "isoTransform");
                return c && c.scale ? c.scale : 1
            }};
        f.fx.step.scale = function(a) {
            f.cssHooks.scale.set(a.elem, a.now + a.unit)
        };
        f.cssNumber.translate = !0;
        f.cssHooks.translate = {set: function(a, b) {
                B(a, "translate", b)
            }, get: function(a, b) {
                var c = f.data(a, "isoTransform");
                return c && c.translate ? c.translate : [0, 0]
            }}
    }
    var C, D;
    m.csstransitions && (C = {WebkitTransitionProperty: "webkitTransitionEnd", MozTransitionProperty: "transitionend", OTransitionProperty: "oTransitionEnd otransitionend", transitionProperty: "transitionend"}[A], D = s("transitionDuration"));
    var t = f.event, H = f.event.handle ? "handle" : "dispatch", y;
    t.special.smartresize = {setup: function() {
            f(this).bind("resize", t.special.smartresize.handler)
        }, teardown: function() {
            f(this).unbind("resize", t.special.smartresize.handler)
        }, handler: function(a, b) {
            var c = this, d = arguments;
            a.type = "smartresize";
            y && clearTimeout(y);
            y = setTimeout(function() {
                t[H].apply(c, d)
            }, "execAsap" === b ? 0 : 100)
        }};
    f.fn.smartresize = function(a) {
        return a ? this.bind("smartresize", a) : this.trigger("smartresize", ["execAsap"])
    };
    f.Isotobe = function(a, b, c) {
        this.element = f(b);
        this._create(a);
        this._init(c)
    };
    var I = ["width", "height"], E = f(n);
    f.Isotobe.settings = {resizable: !0, layoutMode: "masonry", containerClass: "isotobe", itemClass: "isotobe-item", hiddenClass: "isotobe-hidden", hiddenStyle: {opacity: 0, scale: 0.001}, visibleStyle: {opacity: 1, scale: 1}, containerStyle: {position: "relative", overflow: "hidden"}, animationEngine: "best-available", animationOptions: {queue: !1, duration: 800}, sortBy: "original-order", sortAscending: !0, resizesContainer: !0, transformsEnabled: !0, itemPositionDataEnabled: !1};
    f.Isotobe.prototype = {_create: function(a) {
            this.options = f.extend({}, f.Isotobe.settings, a);
            this.styleQueue = [];
            this.elemCount = 0;
            a = this.element[0].style;
            this.originalStyle = {};
            var b = I.slice(0), c;
            for (c in this.options.containerStyle)
                b.push(c);
            for (var d = 0, e = b.length; d < e; d++)
                c = b[d], this.originalStyle[c] = a[c] || "";
            this.element.css(this.options.containerStyle);
            this._updateAnimationEngine();
            this._updateUsingTransforms();
            this.options.getSortData = f.extend(this.options.getSortData, {"original-order": function(a, c) {
                    c.elemCount++;
                    return c.elemCount
                }, random: function() {
                    return Math.random()
                }});
            this.reloadItems();
            this.offset = {left: parseInt(this.element.css("padding-left") || 0, 10), top: parseInt(this.element.css("padding-top") || 0, 10)};
            var g = this;
            setTimeout(function() {
                g.element.addClass(g.options.containerClass)
            }, 0);
            this.options.resizable && E.bind("smartresize.isotobe", function() {
                g.resize()
            });
            this.element.delegate("." + this.options.hiddenClass, "click", function() {
                return!1
            })
        }, _getAtoms: function(a) {
            var b = this.options.itemSelector;
            a = b ? a.filter(b).add(a.find(b)) : a;
            b = {position: "absolute"};
            a = a.filter(function(a, b) {
                return 1 === b.nodeType
            });
            this.usingTransforms && (b.left = 0, b.top = 0);
            a.css(b).addClass(this.options.itemClass);
            this.updateSortData(a, !0);
            return a
        }, _init: function(a) {
            this.$filteredAtoms = this._filter(this.$allAtoms);
            this._sort();
            this.reLayout(a)
        }, option: function(a) {
            if (f.isPlainObject(a)) {
                this.options = f.extend(!0, this.options, a);
                for (var b in a)
                    if (a = "_update" + u(b), this[a])
                        this[a]()
            }
        }, _updateAnimationEngine: function() {
            var a;
            switch (this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, "")) {
                case "css":
                case "none":
                    a = !1;
                    break;
                case "jquery":
                    a = !0;
                    break;
                default:
                    a = !m.csstransitions
            }
            this.isUsingJQueryAnimation = a;
            this._updateUsingTransforms()
        }, _updateTransformsEnabled: function() {
            this._updateUsingTransforms()
        }, _updateUsingTransforms: function() {
            var a = this.usingTransforms = this.options.transformsEnabled && m.csstransforms && m.csstransitions && !this.isUsingJQueryAnimation;
            a || (delete this.options.hiddenStyle.scale, delete this.options.visibleStyle.scale);
            this.getPositionStyles = a ? this._translate : this._positionAbs
        }, _filter: function(a) {
            var b = "" === this.options.filter ? "*" : this.options.filter;
            if (!b)
                return a;
            var c = this.options.hiddenClass, d = "." + c, e = a.filter(d), g = e;
            "*" !== b && (g = e.filter(b), d = a.not(d).not(b).addClass(c), this.styleQueue.push({$el: d, style: this.options.hiddenStyle}));
            this.styleQueue.push({$el: g, style: this.options.visibleStyle});
            g.removeClass(c);
            return a.filter(b)
        }, updateSortData: function(a, b) {
            var c = this, d = this.options.getSortData, e, g;
            a.each(function() {
                e = f(this);
                g = {};
                for (var a in d)
                    g[a] = b || "original-order" !== a ? d[a](e, c) : f.data(this, "isotobe-sort-data")[a];
                f.data(this, "isotobe-sort-data", g)
            })
        }, _sort: function() {
            var a = this.options.sortBy, b = this._getSorter, c = this.options.sortAscending ? 1 : -1;
            this.$filteredAtoms.sort(function(d, e) {
                var g = b(d, a), f = b(e, a);
                g === f && "original-order" !== a && (g = b(d, "original-order"), f = b(e, "original-order"));
                return(g > f ? 1 : g < f ? -1 : 0) * c
            })
        }, _getSorter: function(a, b) {
            return f.data(a, "isotobe-sort-data")[b]
        }, _translate: function(a, b) {
            return{translate: [a, b]}
        }, _positionAbs: function(a, b) {
            return{left: a, top: b}
        }, _pushPosition: function(a, b, c) {
            b = Math.round(b + this.offset.left);
            c = Math.round(c + this.offset.top);
            var d = this.getPositionStyles(b, c);
            this.styleQueue.push({$el: a, style: d});
            this.options.itemPositionDataEnabled && a.data("isotobe-item-position", {x: b, y: c})
        }, layout: function(a, b) {
            this.options.beforeLayout && this.options.beforeLayout(a, this);
            var c = this.options.layoutMode;
            this["_" + c + "Layout"](a);
            this.options.resizesContainer && (c = this["_" + c + "GetContainerSize"](), this.styleQueue.push({$el: this.element, style: c}));
            this._processStyleQueue(a, b);
            this.isLaidOut = !0
        }, _processStyleQueue: function(a, b) {
            var c = this.isLaidOut ? this.isUsingJQueryAnimation ? "animate" : "css" : "css", d = this.options.animationOptions, e = this.options.onLayout, g, h, l, k;
            h = function(a, b) {
                b.$el[c](b.style, d)
            };
            if (this._isInserting && this.isUsingJQueryAnimation)
                h = function(a, b) {
                    g = b.$el.hasClass("no-transition") ? "css" : c;
                    b.$el[g](b.style, d)
                };
            else if (b || e || d.complete) {
                var n = !1, p = [b, e, d.complete], r = this;
                l = !0;
                k = function() {
                    if (!n) {
                        for (var c, b = 0, d = p.length; b < d; b++)
                            c = p[b], "function" === typeof c && c.call(r.element, a, r);
                        n = !0
                    }
                };
                if (this.isUsingJQueryAnimation && "animate" === c)
                    d.complete = k, l = !1;
                else if (m.csstransitions) {
                    for (var e = 0, q = this.styleQueue[0], q = q && q.$el; !q || !q.length; ) {
                        q = this.styleQueue[e++];
                        if (!q)
                            return;
                        q = q.$el
                    }
                    0 < parseFloat(getComputedStyle(q[0])[D]) && (h = function(a, b) {
                        b.$el[c](b.style, d).one(C, k)
                    }, l = !1)
                }
            }
            this.options.beforeAnimation && this.options.beforeAnimation(a, this);
            f.each(this.styleQueue, h);
            l && k();
            this.styleQueue = []
        }, resize: function() {
            this["_" + this.options.layoutMode + "ResizeChanged"]() && this.reLayout()
        }, reLayout: function(a) {
            this["_" + this.options.layoutMode + "Reset"]();
            this.layout(this.$filteredAtoms, a)
        }, addItems: function(a, b) {
            var c = this._getAtoms(a);
            this.$allAtoms = this.$allAtoms.add(c);
            b && b(c)
        }, insert: function(a, b) {
            this.element.append(a);
            var c = this;
            this.addItems(a, function(a) {
                a = c._filter(a);
                c._addHideAppended(a);
                c._sort();
                c.reLayout();
                c._revealAppended(a, b)
            })
        }, appended: function(a, b) {
            var c = this;
            this.addItems(a, function(a) {
                c._addHideAppended(a);
                c.layout(a);
                c._revealAppended(a, b)
            })
        }, _addHideAppended: function(a) {
            this.$filteredAtoms = this.$filteredAtoms.add(a);
            a.addClass("no-transition");
            this._isInserting = !0;
            this.styleQueue.push({$el: a, style: this.options.hiddenStyle})
        }, _revealAppended: function(a, b) {
            var c = this;
            setTimeout(function() {
                a.removeClass("no-transition");
                c.styleQueue.push({$el: a, style: c.options.visibleStyle});
                c._isInserting = !1;
                c._processStyleQueue(a, b)
            }, 10)
        }, reloadItems: function() {
            this.$allAtoms = this._getAtoms(this.element.children())
        }, remove: function(a, b) {
            this.$allAtoms = this.$allAtoms.not(a);
            this.$filteredAtoms = this.$filteredAtoms.not(a);
            var c = this, d = function() {
                a.remove();
                b && b.call(c.element)
            };
            a.filter(":not(." + this.options.hiddenClass + ")").length ? (this.styleQueue.push({$el: a, style: this.options.hiddenStyle}), this._sort(), this.reLayout(d)) : d()
        }, shuffle: function(a) {
            this.updateSortData(this.$allAtoms);
            this.options.sortBy = "random";
            this._sort();
            this.reLayout(a)
        }, destroy: function() {
            var a = this.usingTransforms, b = this.options;
            this.$allAtoms.removeClass(b.hiddenClass + " " + b.itemClass).each(function() {
                var b = this.style;
                b.position = "";
                b.top = "";
                b.left = "";
                b.opacity = "";
                a && (b[v] = "")
            });
            var c = this.element[0].style, d;
            for (d in this.originalStyle)
                c[d] = this.originalStyle[d];
            this.element.unbind(".isotobe").undelegate("." + b.hiddenClass, "click").removeClass(b.containerClass).removeData("isotobe");
            E.unbind(".isotobe")
        }, _getSegments: function(a) {
            var b = this.options.layoutMode, c = a ? "rowHeight" : "columnWidth", d = a ? "height" : "width";
            a = a ? "rows" : "cols";
            var e = this.element[d](), d = this.options[b] && this.options[b][c] || this.$filteredAtoms["outer" + u(d)](!0) || e, e = Math.floor(e / d), e = Math.max(e, 1);
            this[b][a] = e;
            this[b][c] = d
        }, _checkIfSegmentsChanged: function(a) {
            var b = this.options.layoutMode, c = a ? "rows" : "cols", d = this[b][c];
            this._getSegments(a);
            return this[b][c] !== d
        }, _masonryReset: function() {
            this.masonry = {};
            this._getSegments();
            var a = this.masonry.cols;
            for (this.masonry.colYs = []; a--; )
                this.masonry.colYs.push(0)
        }, _masonryLayout: function(a) {
            var b = this, c = b.masonry;
            a.each(function() {
                var a = f(this), e = Math.ceil(a.outerWidth(!0) / c.columnWidth), e = Math.min(e, c.cols);
                if (1 === e)
                    b._masonryPlaceBrick(a, c.colYs);
                else {
                    var g = c.cols + 1 - e, h = [], l, k;
                    for (k = 0; k < g; k++)
                        l = c.colYs.slice(k, k + e), h[k] = Math.max.apply(Math, l);
                    b._masonryPlaceBrick(a, h)
                }
            })
        }, _masonryPlaceBrick: function(a, b) {
            for (var c = Math.min.apply(Math, b), d = 0, e = 0, f = b.length; e < f; e++)
                if (b[e] === c) {
                    d = e;
                    break
                }
            this._pushPosition(a, this.masonry.columnWidth * d, c);
            c += a.outerHeight(!0);
            f = this.masonry.cols + 1 - f;
            for (e = 0; e < f; e++)
                this.masonry.colYs[d + e] = c
        }, _masonryGetContainerSize: function() {
            return{height: Math.max.apply(Math, this.masonry.colYs)}
        }, _masonryResizeChanged: function() {
            return this._checkIfSegmentsChanged()
        }, _fitRowsReset: function() {
            this.fitRows = {x: 0, y: 0, height: 0}
        }, _fitRowsLayout: function(a) {
            var b = this, c = this.element.width(), d = this.fitRows;
            a.each(function() {
                var a = f(this), g = a.outerWidth(!0), h = a.outerHeight(!0);
                0 !== d.x && g + d.x > c && (d.x = 0, d.y = d.height);
                b._pushPosition(a, d.x, d.y);
                d.height = Math.max(d.y + h, d.height);
                d.x += g
            })
        }, _fitRowsGetContainerSize: function() {
            return{height: this.fitRows.height}
        }, _fitRowsResizeChanged: function() {
            return!0
        }, _cellsByRowReset: function() {
            this.cellsByRow = {index: 0};
            this._getSegments();
            this._getSegments(!0)
        }, _cellsByRowLayout: function(a) {
            var b = this, c = this.cellsByRow;
            a.each(function() {
                var a = f(this), e = Math.floor(c.index / c.cols), g = (c.index % c.cols + 0.5) * c.columnWidth - a.outerWidth(!0) / 2, e = (e + 0.5) * c.rowHeight - a.outerHeight(!0) / 2;
                b._pushPosition(a, g, e);
                c.index++
            })
        }, _cellsByRowGetContainerSize: function() {
            return{height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top}
        }, _cellsByRowResizeChanged: function() {
            return this._checkIfSegmentsChanged()
        }, _straightDownReset: function() {
            this.straightDown = {y: 0}
        }, _straightDownLayout: function(a) {
            var b = this;
            a.each(function(a) {
                a = f(this);
                b._pushPosition(a, 0, b.straightDown.y);
                b.straightDown.y += a.outerHeight(!0)
            })
        }, _straightDownGetContainerSize: function() {
            return{height: this.straightDown.y}
        }, _straightDownResizeChanged: function() {
            return!0
        }, _masonryHorizontalReset: function() {
            this.masonryHorizontal = {};
            this._getSegments(!0);
            var a = this.masonryHorizontal.rows;
            for (this.masonryHorizontal.rowXs = []; a--; )
                this.masonryHorizontal.rowXs.push(0)
        }, _masonryHorizontalLayout: function(a) {
            var b = this, c = b.masonryHorizontal;
            a.each(function() {
                var a = f(this), e = Math.ceil(a.outerHeight(!0) / c.rowHeight), e = Math.min(e, c.rows);
                if (1 === e)
                    b._masonryHorizontalPlaceBrick(a, c.rowXs);
                else {
                    var g = c.rows + 1 - e, h = [], l, k;
                    for (k = 0; k < g; k++)
                        l = c.rowXs.slice(k, k + e), h[k] = Math.max.apply(Math, l);
                    b._masonryHorizontalPlaceBrick(a, h)
                }
            })
        }, _masonryHorizontalPlaceBrick: function(a, b) {
            for (var c = Math.min.apply(Math, b), d = 0, e = 0, f = b.length; e < f; e++)
                if (b[e] === c) {
                    d = e;
                    break
                }
            this._pushPosition(a, c, this.masonryHorizontal.rowHeight * d);
            c += a.outerWidth(!0);
            f = this.masonryHorizontal.rows + 1 - f;
            for (e = 0; e < f; e++)
                this.masonryHorizontal.rowXs[d + e] = c
        }, _masonryHorizontalGetContainerSize: function() {
            return{width: Math.max.apply(Math, this.masonryHorizontal.rowXs)}
        }, _masonryHorizontalResizeChanged: function() {
            return this._checkIfSegmentsChanged(!0)
        }, _fitColumnsReset: function() {
            this.fitColumns = {x: 0, y: 0, width: 0}
        }, _fitColumnsLayout: function(a) {
            var b = this, c = this.element.height(), d = this.fitColumns;
            a.each(function() {
                var a = f(this), g = a.outerWidth(!0), h = a.outerHeight(!0);
                0 !== d.y && h + d.y > c && (d.x = d.width, d.y = 0);
                b._pushPosition(a, d.x, d.y);
                d.width = Math.max(d.x + g, d.width);
                d.y += h
            })
        }, _fitColumnsGetContainerSize: function() {
            return{width: this.fitColumns.width}
        }, _fitColumnsResizeChanged: function() {
            return!0
        }, _cellsByColumnReset: function() {
            this.cellsByColumn = {index: 0};
            this._getSegments();
            this._getSegments(!0)
        }, _cellsByColumnLayout: function(a) {
            var b = this, c = this.cellsByColumn;
            a.each(function() {
                var a = f(this), e = c.index % c.rows, g = (Math.floor(c.index / c.rows) + 0.5) * c.columnWidth - a.outerWidth(!0) / 2, e = (e + 0.5) * c.rowHeight - a.outerHeight(!0) / 2;
                b._pushPosition(a, g, e);
                c.index++
            })
        }, _cellsByColumnGetContainerSize: function() {
            return{width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth}
        }, _cellsByColumnResizeChanged: function() {
            return this._checkIfSegmentsChanged(!0)
        }, _straightAcrossReset: function() {
            this.straightAcross = {x: 0}
        }, _straightAcrossLayout: function(a) {
            var b = this;
            a.each(function(a) {
                a = f(this);
                b._pushPosition(a, b.straightAcross.x, 0);
                b.straightAcross.x += a.outerWidth(!0)
            })
        }, _straightAcrossGetContainerSize: function() {
            return{width: this.straightAcross.x}
        }, _straightAcrossResizeChanged: function() {
            return!0
        }};
    f.fn.imagesLoaded = function(a) {
        function b() {
            a.call(d, e)
        }
        function c(a) {
            a = a.target;
            a.src !== h && -1 === f.inArray(a, l) && (l.push(a), 0 >= --g && (setTimeout(b), e.unbind(".imagesLoaded", c)))
        }
        var d = this, e = d.find("img").add(d.filter("img")), g = e.length, h = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", l = [];
        g || b();
        e.bind("load.imagesLoaded error.imagesLoaded", c).each(function() {
            var a = this.src;
            this.src = h;
            this.src = a
        });
        return d
    };
    f.fn.isotobe = function(a, b) {
        if ("string" === typeof a) {
            var c = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var b = f.data(this, "isotobe");
                b ? f.isFunction(b[a]) && "_" !== a.charAt(0) ? b[a].apply(b, c) : n.console && n.console.error("no such method '" + a + "' for isotobe instance") : n.console && n.console.error("cannot call methods on isotobe prior to initialization; attempted to call method '" + a + "'")
            })
        } else
            this.each(function() {
                var c = f.data(this, "isotobe");
                c ? (c.option(a), c._init(b)) : f.data(this, "isotobe", new f.Isotobe(a, this, b))
            });
        return this
    }
})(window, jQuery);

/*
 * Isotobe custom layout mode that extends masonry in order to work with percentage-sized columns
 */
(function(l, e) {
    e.extend(e.Isotobe.prototype, {_sloppyMasonryReset: function() {
            var b = this.element.width(), d = this.options.sloppyMasonry && this.options.sloppyMasonry.columnWidth || this.$filteredAtoms.outerWidth(!0) || b;
            this.sloppyMasonry = {cols: Math.round(b / d), columnWidth: d};
            b = this.sloppyMasonry.cols;
            for (this.sloppyMasonry.colYs = []; b--; )
                this.sloppyMasonry.colYs.push(0)
        }, _sloppyMasonryLayout: function(b) {
            var d = this, c = d.sloppyMasonry;
            b.each(function() {
                var b = e(this), a = Math.round(b.outerWidth(!0) / c.columnWidth),
                        a = Math.min(a, c.cols);
                if (1 === a)
                    d._sloppyMasonryPlaceBrick(b, c.colYs);
                else {
                    var f = c.cols + 1 - a, h = [], k, g;
                    for (g = 0; g < f; g++)
                        k = c.colYs.slice(g, g + a), h[g] = Math.max.apply(Math, k);
                    d._sloppyMasonryPlaceBrick(b, h)
                }
            })
        }, _sloppyMasonryPlaceBrick: function(b, d) {
            for (var c = Math.min.apply(Math, d), e = 0, a = 0, f = d.length; a < f; a++)
                if (d[a] === c) {
                    e = a;
                    break
                }
            this._pushPosition(b, this.sloppyMasonry.columnWidth * e, c);
            c += b.outerHeight(!0);
            f = this.sloppyMasonry.cols + 1 - f;
            for (a = 0; a < f; a++)
                this.sloppyMasonry.colYs[e + a] = c
        }, _sloppyMasonryGetContainerSize: function() {
            return{height: Math.max.apply(Math,
                        this.sloppyMasonry.colYs)}
        }, _sloppyMasonryResizeChanged: function() {
            return!0
        }})
})(this, this.jQuery);




/*
 * Isotobe custom layout mode that extends masonry in order to work with percentage-sized columns
 */
(function(l,e){e.extend(e.Isotobe.prototype,{_sloppyMasonryReset:function(){var b=this.element.width(),d=this.options.sloppyMasonry&&this.options.sloppyMasonry.columnWidth||this.$filteredAtoms.outerWidth(!0)||b;this.sloppyMasonry={cols:Math.round(b/d),columnWidth:d};b=this.sloppyMasonry.cols;for(this.sloppyMasonry.colYs=[];b--;)this.sloppyMasonry.colYs.push(0)},_sloppyMasonryLayout:function(b){var d=this,c=d.sloppyMasonry;b.each(function(){var b=e(this),a=Math.round(b.outerWidth(!0)/c.columnWidth),
a=Math.min(a,c.cols);if(1===a)d._sloppyMasonryPlaceBrick(b,c.colYs);else{var f=c.cols+1-a,h=[],k,g;for(g=0;g<f;g++)k=c.colYs.slice(g,g+a),h[g]=Math.max.apply(Math,k);d._sloppyMasonryPlaceBrick(b,h)}})},_sloppyMasonryPlaceBrick:function(b,d){for(var c=Math.min.apply(Math,d),e=0,a=0,f=d.length;a<f;a++)if(d[a]===c){e=a;break}this._pushPosition(b,this.sloppyMasonry.columnWidth*e,c);c+=b.outerHeight(!0);f=this.sloppyMasonry.cols+1-f;for(a=0;a<f;a++)this.sloppyMasonry.colYs[e+a]=c},_sloppyMasonryGetContainerSize:function(){return{height:Math.max.apply(Math,
this.sloppyMasonry.colYs)}},_sloppyMasonryResizeChanged:function(){return!0}})})(this,this.jQuery);