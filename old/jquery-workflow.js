/**
 * jQuery workflow editor 
 *
 *
 * Guyon Moree 2011
 */

/**
 * Node Sprite
 * 
 * Basic node sprite
 */
function NodeSprite (options) {
        this.base = Scene.RectSprite;
        this.base(options);
        
        var defaults = {
            color: "grey",
            width: 150,
            height: 150,
            highlight: false,
            dragging: false
        };
        
        this.options = $.extend(this.options, defaults, options);
        
        
        // main box
        var box = new Scene.RectSprite($.extend(defaults, {
            color: "rgba(135,182,217,.6)",
            x: 1,
            y: 1
        }));
        
        var header_img = new Scene.ImageSprite({
            x: 1,
            y: 1,
            resize: true,
            width: this.options.width-2,
            height: 25,
            image: "http://jqueryui.com/themeroller/images/?new=5c9ccc&w=500&h=100&f=png&q=100&fltr[]=over|textures/12_gloss_wave.png|0|0|55"
        });
        
        box.children.push(header_img);
        this.children.push(box);
        
        this._event = function(event) {
            if(event.type=="click" && event.object===header_img) {
                this.updated = true;
            }

            if(event.type=="mousemove" && (event.object===header_img||event.object===box)) {
                this.options.highlight = true;
                this.updated = true;
            } else if(event.type=="mousemove" && this.options.highlight) {
                this.options.highlight = false;
                this.updated = true;
            }
            
            if(event.type=="mousedown" && event.object===header_img) {
                this.options.highlight = true;
                this.updated = true;
                this.options.dragging = {x:event.offset_x, y:event.offset_y};
            }
            
            if(event.type=="mouseup") {
                this.options.highlight = true;
                this.updated = true;
                this.options.dragging = false;
            }
            
            if(event.type=="mousemove" && this.options.dragging) {
                this.options.x = event.x-this.options.dragging.x;
                this.options.y = event.y-this.options.dragging.y;
                this.updated = true;
            }
        }
        
        this._update = function() {
            if(this.options.highlight) {
                box.options.x = -1;
                box.options.y = -1;
            } else {
                box.options.x = 0;
                box.options.y = 0;
            }
        }
}
        



(function ($) {
    var methods = {
        /**
         * Initialize plugin
         * 
         * set up plugin for every selected element
        */
        init: function (options) {
            //ImageLoader.load();
            
            var defaults = {}
            
            var settings = $.extend(defaults, options);
            
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('workflow');                
                
                var root = new Scene.RectSprite({
        	        color: "lightgrey",
        	        width: $this.attr("width"),
        	        height: $this.attr("height")
        	    });
        	    
        	    
                var engine = new Scene.Engine({
        	        canvas: $this[0],
        	        root: root,
        	        interval: 1
        	    });
        	    
        	    engine.run();   
        	    
        	    var img_loader = new ImageLoader({
                    header_background: "http://jqueryui.com/themeroller/images/?new=5c9ccc&w=500&h=100&f=png&q=100&fltr[]=over|textures/12_gloss_wave.png|0|0|55"
                }, function() {
                    root.children.push(new NodeSprite({x:100, y:100}));
        	        root.children.push(new NodeSprite({x:400, y:100}));
                });        
        	    
        	    // events
        	    $this.click(function(event) {
        	        var x = event.offsetX, y = event.offsetY;
        	        engine.click(x, y);
        	    });
        	    $this.mousemove(function(event) {
        	        var x = event.offsetX, y = event.offsetY;
        	        engine.mousemove(x, y);
        	    });  
        	    $this.mousedown(function(event) {
        	        var x = event.offsetX, y = event.offsetY;
        	        engine.mousedown(x, y);
        	    });     
        	    $this.mouseup(function(event) {
        	        var x = event.offsetX, y = event.offsetY;
        	        engine.mouseup(x, y);
        	    }); 
            });
        }
    };

    $.fn.workflow = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.workflow');
        }

    };

})(jQuery);
