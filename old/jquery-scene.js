/**
 * jQuery workflow editor 
 *
 *
 * Guyon Moree 2011
 */


var Scene = {
    // Engine class
    Engine: function(options) {
        var defaults = {
            canvas: undefined,
            root: undefined,
            interval: 1000
        };
        
        this.options = $.extend(defaults, options);
        
        // run!
        this.run = function run() {
            var $this = this;
            setInterval(function (){$this._run()}, this.options.interval);
        };
        this._run = function() {
            if(this.update()) this.draw();
        };
        
        // update scene
        this.update = function(options) {
            return this.options.root.update();
        };
        
        // draw scene
        this.draw = function(options) {  
            //console.log("draw scene");          
            var ctx = this.options.canvas.getContext("2d");
            ctx.moveTo(0, 0);
                        
            this.options.root.draw(ctx);
        };
        
        // locate object by mouse position
        this.locate = function(x, y) {
            if((x > this.options.root.options.x && x < (this.options.root.options.x+this.options.root.options.width)) && (y > this.options.root.options.y && y < (this.options.root.options.y+this.options.root.options.height))) {
                return this.options.root.locate(x-this.options.root.options.x, y-this.options.root.options.y);
            } else return null;
        };
        
        // click!
        this.click = function(x, y) {
            var location = this.locate(x, y);
            if(location) {
                this.options.root.event({
                    type: "click",
                    object: location.object,
                    offset_x: location.x,
                    offset_y: location.y,
                    x: x,
                    y: y
                });
            }            
        };
        
        // click!
        this.mousemove = function(x, y) {
            var location = this.locate(x, y);            
            if(location) {
                this.options.root.event({
                    type: "mousemove",
                    object: location.object,
                    offset_x: location.x,
                    offset_y: location.y,
                    x: x,
                    y: y
                });
            }            
        };
        
        // mousedown!
        this.mousedown = function(x, y) {
            var location = this.locate(x, y);
            if(location) {
                this.options.root.event({
                    type: "mousedown",
                    object: location.object,
                    offset_x: location.x,
                    offset_y: location.y,
                    x: x,
                    y: y
                });
            }            
        };
        
        // mouseup!
        this.mouseup = function(x, y) {
            var location = this.locate(x, y);
            if(location) {
                this.options.root.event({
                    type: "mouseup",
                    object: location.object,
                    offset_x: location.x,
                    offset_y: location.y,
                    x: x,
                    y: y
                });
            }            
        };
    },
    
    // Sprite class
    Sprite: function(options) {
        //consolee.log("sprite created");
        
        this.children = [];
        this.updated = true;
        this.active = true;
        
        defaults = {
            x: 0,
            y: 0,
            width: 100,
            height: 100
        };
        
        this.options = $.extend(defaults, options);
        
        // update sprite
        this.update = function(options) {
            var updated = this.updated;
            this.updated = false;
            
            if(this._update!==undefined){ 
                this._update();
            }
        
            // update children
            for(var i=0; i<this.children.length; i++) {
                var child = this.children[i];
                
                updated = child.update() || updated;
            }
            
            return updated;
        }
        
        // draw sprite
        this.draw = function(ctx) {
            //consolee.log("draw sprite");
            
            if(this._draw!==undefined){ 
                ctx.save();
                this._draw(ctx);
                ctx.restore();
            }
                        
            // draw children
            for(var i=0; i<this.children.length; i++) {
                var child = this.children[i];
                
                ctx.save();
                ctx.translate(child.options.x, child.options.y);
                child.draw(ctx);
                ctx.restore();
            }
            
            this.updated = false;
            
        }
        
        // main event handler
        this.event = function(event) {
            if(this._event!==undefined){ 
                this._event(event);
            }
                        
            // propagate event to children
            for(var i=0; i<this.children.length; i++) {
                var child = this.children[i];
                child.event(event);
            }
            
        }
        
        // click
        this.locate = function(x, y) {
            var target = this;
            
            for(var i=0; i<this.children.length; i++) {
                var child = this.children[i];
                
                if((x > child.options.x && x < (child.options.x+child.options.width)) && (y > child.options.y && y < (child.options.y+child.options.height))) {
                    return child.locate(x-child.options.x, y-child.options.y);
                }
            }
            
            return {object:this, x:x, y:y};
        }
    },
    
    // Rectangle sprite class
    RectSprite: function(options) {
        this.base = Scene.Sprite;
        this.base(options);
        
        var defaults = {
            color: "#000",
            width: 100,
            height: 100
        };
        
        this.options = $.extend(this.options, defaults, options);
        
        // draw
        this._draw = function(ctx) {
            //consolee.log("RectSprite _draw");
            ctx.fillStyle = this.options.color;
            ctx.fillRect(0,0, this.options.width, this.options.height);
        }
    },
    
    // Image sprite class
    ImageSprite: function(options) {
        this.base = Scene.Sprite;
        this.base(options);
        
        var defaults = {
            image: new Image(),
            resize: false,
            width: 100,
            height: 100
        };
        
        this.options = $.extend(this.options, defaults, options);
        
        if(typeof this.options.image == "string") {
            var img = new Image();
            img.src = this.options.image;
            this.options.image = img;
        }
            
        
        // draw
        this._draw = function(ctx) {
            //consolee.log("ImageSprite _draw");
            if(this.options.resize) {
                ctx.drawImage(this.options.image, 0, 0, this.options.width, this.options.height);
            } else {
                ctx.drawImage(this.options.image, 0, 0);
            }
        }
    }
}
