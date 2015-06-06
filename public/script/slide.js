function Slide(_parent,_child,_before,_after,_content,_slideMaxHeight){
    this.parent = document.getElementById(_parent);
    this.child = document.getElementsByClassName(_child);
    this.before =_before;
    this.after = _after;
    this.content = document.getElementById(_content);
    this.slideTimer = null;
    this.slideOrder = 0;
    this.hasSlideImgMove = false;
    this.slideMaxHeight = _slideMaxHeight;

    var self = this;

    console.log(this.before,this.after);
    this.autoSlide = function(){
        this.slideTimer = setInterval(function(){
            self.toAfter(self.slideOrder,self.getNextOrder());
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

    this.toBefore = function(before,after){
            self.child[after].style.cssText = 'left:-100%;';
            setTimeout(function(){
                self.child[before].style.cssText = 'left:100%;transition:all 0.6s ease;';
                self.child[after].style.cssText = 'left:0;transition:all 0.6s ease;';
                setTimeout(function(){
                    self.hasSlideImgMove = false;
                },700);
            },10);
    };
    this.toAfter = function(before,after){
            self.child[after].style.cssText = 'left:100%;';
            setTimeout(function(){
                self.child[before].style.cssText = 'left:-100%;transition:all 0.6s ease;';
                self.child[after].style.cssText = 'left:0;transition:all 0.6s ease;';
                setTimeout(function(){
                    self.hasSlideImgMove = false;
                },700);
            },10);
    };


    this.parent.onmouseover = function () {
        clearInterval(self.slideTimer);
    };
    this.parent.onmouseout  = function () {
        self.autoSlide();
    };
    document.addEventListener('click',function(e){
        if(e.target.id == self.before && !self.hasSlideImgMove){
            self.hasSlideImgMove = true;
            self.toBefore(self.slideOrder,self.getForwardOrder());
        }
        if(e.target.id == self.after && !self.hasSlideImgMove){
            self.hasSlideImgMove = true;
            self.toAfter(self.slideOrder,self.getNextOrder());

        }
    });

    this.content.onmousewheel = function(e){
        var contentTop = self.content.offsetTop;
        var parentTop = self.parent.offsetTop;
        var contentHeight = self.content.clientHeight;
        var contentScrollHeight = self.content.scrollHeight;
        var slideListHeight = contentTop - parentTop;
        if(contentHeight <= self.slideMaxHeight
            && slideListHeight > 30
            && contentScrollHeight > contentHeight){

            var newContentHeight = contentHeight - e.wheelDeltaY;
            var newSlideListHeight = slideListHeight + e.wheelDeltaY;

            self.content.style.maxHeight = newContentHeight + 'px';
            self.parent.style.height = newSlideListHeight + 'px';

         }
    };




    //this.before.onclick = function(){
    //    console.log('before');
    //    var _order = self.slideOrder;
    //    self.toBefore(self.getForwardOrder(),_order);
    //};
    //this.after.onclick = function(){
    //    console.log('after');
    //    self.toBefore(self.slideOrder,self.getNextOrder());
    //};

}