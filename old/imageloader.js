function ImageLoader(resources, callback) {
    this._count = 0;
    this._loaded = 0;
    this.images = {}
    this.callback = callback;
    
    for(var key in resources) this._count++;
    
    var $this = this;
    for(var key in resources) {
        this.images[key] = new Image();
        this.images[key].src = resources[key];
        this.images[key].onload = function() {
            $this._loaded++;
            if($this._loaded == $this._count) {
                $this.callback();
            }
        };
    }
    
    this.done_loading = function() {
        return this._loaded == this._count;
    };
}
