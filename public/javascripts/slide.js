function Slide(_parent,_slideImg,_before,_after,_content,_slideMaxHeight){
    this.parent = document.getElementById(_parent);
    this.slideImg = _slideImg;
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
        if(this.slideOrder >= this.slideImg.length){
            this.slideOrder = 0;
        }
        return this.slideOrder;
    };
    this.getForwardOrder = function(){
        this.slideOrder--;
        if(this.slideOrder < 0){
            this.slideOrder = this.slideImg.length -1;;
        }
        return this.slideOrder;

    };
    this.toBefore = function(before,after){
        var newNode = this.createSlideImgNode(after);
        newNode.style.left = '-100%';
        var slideCard = document.getElementsByClassName('slideCard');
        var currentSlideNode = slideCard[0];
        setTimeout(function(){
            slideCard[0].style.cssText = 'left:100%;';
            self.parent.insertBefore(newNode,null);
            slideCard[slideCard.length - 1].style.cssText ='left:0;transition:all 0.6s ease;';
            setTimeout(function(){
                self.hasSlideImgMove = false;
                currentSlideNode.parentNode.removeChild(currentSlideNode);
            },2000);
        },10);
    };
    this.toAfter = function(before,after){
        var newNode = this.createSlideImgNode(after);
        newNode.style.left = '100%';
        var slideCard = document.getElementsByClassName('slideCard');
        var currentSlideNode = slideCard[slideCard.length - 1];
        setTimeout(function(){
            slideCard[slideCard.length - 1].style.cssText = 'left:-100%;';
            self.parent.insertBefore(newNode,null);
            slideCard[slideCard.length - 1].style.cssText ='left:0;transition:all 0.6s ease;';
            setTimeout(function(){
                self.hasSlideImgMove = false;
                currentSlideNode.parentNode.removeChild(currentSlideNode);
            },700);
        },10);
    };
    this.createSlideImgNode = function(_order){
        var newNode = document.createElement('div');
        newNode.className = 'slideCard card-image-wrap ';
        newNode.innerHTML = '<div class="card-image" style="background-image: url(' + this.slideImg[_order] + ');" alt="" ></div>'
        return newNode;
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

    document.getElementsByClassName('card')[0].onmousewheel = function(e){
        var parentHeight = self.parent.clientHeight;
        var contentHeight = self.content.clientHeight;
        var contentScrollHeight = self.content.scrollHeight;
        //console.log(e.wheelDeltaY ,contentHeight ,parentHeight,contentScrollHeight);
        console.log(e.wheelDeltaY > 0 , parentHeight== 30);
        if(e.wheelDeltaY < 0
            &&contentHeight >= 80
            && parentHeight > 30
            && parentHeight <= self.slideMaxHeight
            && contentScrollHeight > contentHeight){

                var newContentHeight = contentHeight - e.wheelDeltaY;
                var newSlideListHeight = parentHeight + e.wheelDeltaY;
                if(newSlideListHeight <= 30){
                    newSlideListHeight = 30;
                    newContentHeight = (parentHeight - 30) + contentHeight;
                    self.content.style.overflow = 'auto';
                }
                if(newContentHeight >= contentScrollHeight){
                    newContentHeight = contentScrollHeight;
                    newSlideListHeight = contentHeight - newContentHeight + parentHeight;
                }
                self.content.style.maxHeight = newContentHeight + 'px';
                self.parent.style.height = newSlideListHeight + 'px';
        }else if(e.wheelDeltaY > 0
            &&contentHeight > 80
            && parentHeight >= 30
            && parentHeight < self.slideMaxHeight
            && contentScrollHeight >= contentHeight
            &&self.content.scrollTop == 0){

            var newContentHeight = contentHeight - e.wheelDeltaY;
            var newSlideListHeight = parentHeight + e.wheelDeltaY;
            if(newContentHeight <= 80){
                newContentHeight = 80;
                newSlideListHeight = contentHeight - 80 + parentHeight;
            }
            if(newSlideListHeight >= self.slideMaxHeight){
                newSlideListHeight = self.slideMaxHeight;
                newContentHeight = (parentHeight - newSlideListHeight) + contentHeight;
            }
            self.content.style.maxHeight = newContentHeight + 'px';
            self.parent.style.height = newSlideListHeight + 'px';
            self.content.style.overflow = 'hidden';
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