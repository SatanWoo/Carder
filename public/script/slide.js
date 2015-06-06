function Slide(_parent,_child,_before,_after){
    this.parent = document.getElementById(_parent);
    this.child = document.getElementsByClassName(_child);
    this.before = document.getElementById(_before);
    this.after = document.getElementById(_after);
    this.slideTimer = null;
    this.slideOrder = 0;

    this.autoSlide = function(){
        var self = this;
        this.slideTimer = setInterval(function(){
            var _order = self.slideOrder;
            self.getNextOrder();
            console.log(self.child[self.slideOrder]);
            self.child[self.slideOrder].style.cssText = 'left:100%;';
            setTimeout(function(){
                self.child[_order].style.cssText = 'left:-100%;transition:all 0.6s ease;';
                self.child[self.slideOrder].style.cssText = 'left:0;transition:all 0.6s ease;';
            },10);
        },2000);
    };

    this.getNextOrder = function(){
        this.slideOrder++;
        if(this.slideOrder >= this.child.length){
            this.slideOrder = 0;
        }
        return this.slideOrder;
    };
    this.getForwardOrder = function(){
        this.slideOrder--;
        if(this.slideOrder < 0){
            this.slideOrder = this.child.length -1;;
        }
        return this.slideOrder;

    };

}