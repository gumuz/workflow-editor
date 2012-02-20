/**
 * jQuery workflow editor 
 *
 *
 * Guyon Moree 2011
 */


/**
 * ImageManager
 * 
 * Image loader & manager
 */
var ImageLoader = {
    loaded: 0,
    total: 0,
    images: {},
    resources: {
        box_head: "http://jqueryui.com/themeroller/images/?new=5c9ccc&w=500&h=100&f=png&q=100&fltr[]=over|textures/12_gloss_wave.png|0|0|55",
        icons_sprite: "http://jqueryui.com/themeroller/images/?new=469bdd&w=256&h=240&f=png&fltr[]=rcd|256&fltr[]=mask|icons/icons.png"
    },
    load: function() {
        var $this = this;
        for(var key in $this.resources) {
            $this.total += 1;
            $this.images[key] = new Image();
            $this.images[key].src = $this.resources[key];
            $this.images[key].onload = function() {
                $this.loaded += 1;
            };
        }
    }
};

/**
 * Draw loading screen
 * 
 * Draw the loader screen for a specific progress state
 */
function draw_loader(ctx, progress) {
    // context settings
    var width = ctx.canvas.width,
        height = ctx.canvas.height;
    
    // background    
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, width, height);
    
    // loader text
    ctx.fillStyle = "white";
    ctx.fillText("loading (" + progress.current + "/" + progress.total + ")", 10, 10);
}

/**
 * Draw connection
 * 
 * Draw a connection between 2 nodes
 */
function draw_connection(ctx, start_node, end_node) {
    ctx.strokeStyle = "rgba(100,100,100,1)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(start_node.x+150, start_node.y+75);
    ctx.bezierCurveTo(start_node.x+250, start_node.y+75, end_node.x-100, end_node.y+75, end_node.x, end_node.y+75)
    //ctx.lineTo(end_node.x, end_node.y+75);
    ctx.stroke();
    
    ctx.strokeStyle = "rgba(10,10,0,1)";
    ctx.lineWidth = 2;
    ctx.moveTo(start_node.x+150, start_node.y+75);
    ctx.bezierCurveTo(start_node.x+250, start_node.y+75, end_node.x-100, end_node.y+75, end_node.x, end_node.y+75)
    //ctx.lineTo(end_node.x, end_node.y+75);
    ctx.stroke();
}

/**
 * Draw drag-line
 * 
 * Draw a line between the mouse and an output
 */
function draw_dragline(ctx, node, x, y) {
    ctx.strokeStyle = "rgba(100,100,100,.6)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(node.x+150, node.y+75);
    ctx.bezierCurveTo(node.x+250, node.y+75, x-50, y, x, y)
    ctx.lineTo(x, y);
    ctx.stroke();
    
    
}

/**
 * Draw node
 * 
 * Draw a node
 */
function draw_node(ctx, node, highlight) {
    // font settings
    var text = node.id,
        text_size = ctx.measureText(text);
        
    ctx.font = "15px Arial"
    ctx.textBaseline = "top";
    
    // box settings
    var box_min_width = 150,
        box_width = (text_size.width > box_min_width)?text_size.width:box_min_width,
        box_height = 150,
        header_height = 25,
        margin = 5;        
        
    // draw highlight
    if(highlight) {
        ctx.fillStyle = "rgba(200,200,200,.6)";
        ctx.fillRect(3, 3, box_width, box_height);
    }
   
   // draw input
    ctx.beginPath();
    ctx.fillStyle = "#5C9CCC";
    ctx.arc(0, 75, 10, 45, 90);
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(0, 75, 8, 45, 90);
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(ImageLoader.images.icons_sprite, 80, 192, 16, 16, -8, 67, 16, 16);
    
    // draw output
    ctx.beginPath();
    ctx.fillStyle = "#5C9CCC";
    ctx.arc(box_width, 75, 10, 45, 90);
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(box_width, 75, 8, 45, 90);
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(ImageLoader.images.icons_sprite, 48, 192, 16, 16, box_width-8, 67, 16, 16);
    
    // draw box
    ctx.fillStyle = "rgba(135,182,217,.6)";
    ctx.fillRect(0, 0, box_width, box_height);
    
    // draw header bg    
    ctx.drawImage(ImageLoader.images.box_head, 1, 1, box_width-2, header_height);
    
    // draw close button
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    if(highlight) {
        ctx.arc(box_width-12, 13, 8, 45, 90);
    } else {
        ctx.arc(box_width-12, 13, 5, 45, 90);
    }
        
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(ImageLoader.images.icons_sprite, 32, 192, 16, 16, box_width-20, 5, 16, 16);
    
    // draw drag handle
    ctx.drawImage(ImageLoader.images.icons_sprite, 0, 224, 16, 16, 0, 0, 16, 16);
    
    // draw header text
    ctx.fillStyle = "white";
    ctx.fillText(text, margin+10, margin);
    
    // draw content box
    ctx.fillStyle = "rgba(256,256,256,.6)";
    ctx.fillRect(1, header_height+2, box_width-2, box_height-header_height-3); 
    
}

/**
 * Colide node
 * 
 * Check if position is with node bounds
 */
function colide(node, x, y) {
    if (x > node.x-10 && x < node.x+160 && y > node.y && y < node.y+150) {
        // ok, we're in, now check specifics
        if(x>node.x+130 && y<node.y+20) {
            return "close";
        }
        if(x>node.x+130 && y<node.y+20) {
            return "close";
        }
        if((x>node.x-10 && x<node.x+10)&& (y>node.y+65 && y<node.y+85)) {
            return "input";
        }
        if((x>node.x+140 && x<node.x+160)&& (y>node.y+70 && y<node.y+80)) {
            return "output";
        }
        
        return "hover";
    } else return false;
}

(function ($) {
    var methods = {
        /**
         * Initialize plugin
         * 
         * set up plugin for every selected element
        */
        init: function (options) {
            ImageLoader.load();
            
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('workflow'),
                    workflow = {
                        nodes: [
                            {
                                id: "test1", 
                                type: "test",
                                active: true,
                                x: 50,
                                y: 50
                            },
                            {
                                id: "test2", 
                                type: "test",
                                active: true,
                                x: 300,
                                y: 50
                            },
                            {
                                id: "test3", 
                                type: "test",
                                active: true,
                                x: 300,
                                y: 250
                            },
                            {
                                id: "test4", 
                                type: "test",
                                active: true,
                                x: 550,
                                y: 150
                            }
                        ],
                        connections: [
                            {start: "test1", end: "test2"}, 
                            {start: "test1", end: "test3"}
                        ]
                    };

                if (!data) {
                    $(this).data('workflow', {
                        target: $this,
                        workflow: workflow,
                        state: {
                            type:"loading"
                        },
                        images: {}
                    });
                }
                
                // run!
                $this.workflow('setup_ui');
                $this.workflow('draw');
            });
        },
        /**
         * Setup interface
         * 
         * Create elements for user interface
         */
        setup_ui: function() {
            return this.each(function () {
                // get instance data
                var $this = $(this),
                    data = $this.data('workflow');
                
                // $this element attributes
                $this.css({
                    overflow: "scroll"
                });
                
                // canvas attributes
                var canvas = $("<canvas/>").attr({
                    width: $this.width(),
                    height: $this.height()                    
                }).css({
                    "background-image": "url('grid.png')"
                }).appendTo($this);
                
                data.context = canvas[0].getContext("2d");
                
                $this.workflow('setup_events');
            });
        },
        /**
         * Setup events
         * 
         * Bind event handlers for user interface
         */
        setup_events: function () {
            return this.each(function () {
                // get instance data
                var $this = $(this),
                    data = $this.data('workflow'),
                    workflow = data.workflow;
                
                var canvas = $this.find("canvas");
                
                
                // click
                canvas.click(function(event) {
                    var x = event.offsetX, y = event.offsetY,
                        target = null;
                    
                    // check for mouse collisions
                    for(var i=0; i<workflow.nodes.length; i++) {
                        if(!workflow.nodes[i].active) continue;
                        target = colide(workflow.nodes[i], x, y);
                        if(target=="close") {
                            workflow.nodes[i].active = false;
                            break;
                        }
                    }
                    $this.workflow('draw');
                });
                
                // mouseover events
                canvas.mousemove(function(event) {
                    var x = event.offsetX, y = event.offsetY,
                        collision = false, target = null;
                        
                    // drag-mode?
                    if(data.state.type=="node_drag") {
                        var offset_x = data.state.offset.x, offset_y = data.state.offset.y
                        data.state.node.x = x-offset_x;
                        data.state.node.y = y-offset_y;
                        
                        // expand?
                        if((canvas.width()-data.state.node.x)<200) {
                            canvas.attr("width", canvas.width()+200);
                        }
                        if((canvas.height()-data.state.node.y)<200) {
                            canvas.attr("height", canvas.height()+200);
                        }
                        
                        $this.workflow('draw');
                        return;
                    }
                    
                    // output drag?
                    if(data.state.type=="output_drag") {
                        data.state.position = {x:x,y:y};
                        $this.workflow('draw');
                        return;
                    }
                    
                    // check for mouse collisions
                    for(var i=0; i<workflow.nodes.length; i++) {
                        if(!workflow.nodes[i].active) continue;
                        target = colide(workflow.nodes[i], x, y);
                        if(target) {
                            collision = true;
                            $this.css("cursor", "pointer");
                            if(data.state.type!="node_hover" || data.state.node!=workflow.nodes[i].id) {
                                data.state = {type:"node_hover", node: workflow.nodes[i]};
                                $this.workflow('draw');
                            }
                        }
                    }
                    // remove current collision
                    if(collision==false && data.state.type=="node_hover") {
                        $this.css("cursor", "default");
                        data.state = {type: "idle"};
                        $this.workflow('draw');
                    }
                });
                
                // mousedown dragging event
                canvas.mousedown(function() {
                    var x = event.offsetX, y = event.offsetY,
                        target = null;
                        
                    // check for mouse collisions
                    for(var i=0; i<workflow.nodes.length; i++) {
                        target = colide(workflow.nodes[i], x, y);
                        if(target=="output") {
                            data.state = {type:"output_drag", node: workflow.nodes[i], position: {x:x, y:y}};
                        } else if (target=="hover"){
                            data.state = {type:"node_drag", node: workflow.nodes[i], offset: {x:x-workflow.nodes[i].x, y:y-workflow.nodes[i].y}};
                        }
                    }
                });
                
                // mouseup dragging event
                canvas.mouseup(function() {
                    var x = event.offsetX, y = event.offsetY,
                        target = null;
                       
                    if(data.state.type=="output_drag") { 
                        // check for mouse collisions
                        for(var i=0; i<workflow.nodes.length; i++) {
                            target = colide(workflow.nodes[i], x, y);
                            if(target=="input") {
                                workflow.connections.push({start:data.state.node.id, end:workflow.nodes[i].id})
                                console.log(workflow.connections);
                            } 
                        }
                    }
                    
                    data.state = {type: "idle"};
                    $this.workflow('draw');
                });
                
                // dblclick creation
                canvas.dblclick(function() {
                    var x = event.offsetX, y = event.offsetY;
                    workflow.nodes.push({
                        id: Math.random(),
                        type: "test",
                        x: x,
                        y: y
                    });
                });
            });
        },
        /**
         * Draw
         * 
         * Draw current state to canvas
         */
        draw: function() {
            return this.each(function () {
                var $this = $(this);
                setTimeout(function(){$this.workflow('_draw')}, 1);    
            });
            
        },
        _draw: function() {
            return this.each(function () {
                // get instance data
                var $this = $(this),
                    data = $this.data('workflow'),
                    workflow = data.workflow,
                    state = data.state,
                    ctx = data.context;
                    
                var width = ctx.canvas.width,
                    height = ctx.canvas.height;
                    
                // background
                ctx.fillStyle = "white";
                ctx.clearRect(0, 0, width, height);
                    
                if(state.type == "loading") {
                    // draw loader until all media is loaded
                    draw_loader(ctx, {current: ImageLoader.loaded, total: ImageLoader.total});
                    if(ImageLoader.loaded==ImageLoader.total) { // done loading
                        data.state = {type: "idle"};
                    }
                    $this.workflow('draw');
                } else {                    
                    // draw connections
                    for(var i=0; i<workflow.connections.length; i++) {
                        for(var j=0; j<workflow.nodes.length; j++) {
                            var node = workflow.nodes[j];
                            
                            if(workflow.nodes[j].id==workflow.connections[i].start) var start_node = workflow.nodes[j];
                            if(workflow.nodes[j].id==workflow.connections[i].end) var end_node = workflow.nodes[j];
                        }
                        
                        if(!start_node.active || !end_node.active) continue;
                        
                        draw_connection(ctx, start_node, end_node);
                    }
                    
                    if(state.type=="output_drag") {
                        // draw dragline
                        draw_dragline(ctx, state.node, state.position.x, state.position.y);
                    }
                    
                    // draw nodes
                    for(var i=0; i<workflow.nodes.length; i++) {
                        var node = workflow.nodes[i];
                        
                        if(!node.active) continue;
                        
                        // draw node on x,y
                        ctx.save();
                        ctx.translate(node.x, node.y);
                        draw_node(ctx, node, ((state.type=="node_hover" && state.node==node) || (state.type=="node_drag" && state.node==node)));
                        ctx.restore();
                    }                    
                }
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
