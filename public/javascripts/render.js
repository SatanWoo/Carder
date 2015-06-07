/**
 *
 * Created by jarvis on 6/7/15.
 */

function render(){
    console.log(query);
    var html='';
    var cssNode = document.createElement('link');
    cssNode.rel="stylesheet";

    var ajaxReq = new XMLHttpRequest();
    ajaxReq.open("get",'/iframeAPI?url=' + encodeURIComponent(query.url) + '&source=' + query.source,true);
    ajaxReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    ajaxReq.send();

    ajaxReq.onreadystatechange=function()
    {
        if (ajaxReq.readyState==4 && ajaxReq.status==200)
        {
            var data = JSON.parse(ajaxReq.responseText);
            if(data.type == 'ebay' || data.type == 'ecommerce'){
                cssNode.href = '/stylesheets/product1.css';
                document.getElementsByTagName('head')[0].appendChild(cssNode);
                if(data.image.length > 0 ){
                    for(var i = 0;i < data.image.length;i++){
                        if(i == 0){
                            console.log(1);
                            html += '<header class="card-gallery"  id="slideList">\
                       <div class=" slideCard card-image-wrap" style="left: 0;">\
                       <div class="card-image" style="background-image: url(' + data.image[0] + ');" alt="" ></div>\
                       </div>'
                        }
                        else{
                            html += '<div class=" slideCard card-image-wrap ">\
                       <div class="card-image" style="background-image: url(' + data.image[0] + ');" alt="" ></div>\
                       </div>'
                        }
                    }

                    if(data.image.length > 1){
                        html += '<a href="javascript:void(0)" id="before" class="iconfont"> &#xe61b;</a>\
                    <a href="javascript:void(0)" id="after" class="iconfont"> &#xe615;</a>\
                    </header>'
                    }
                    else{
                        html += '</header>'
                    }
                }
                html += ' <div class="card-content">\
                <a href="'+ query.url +'" target="_blank" class="card-title">'+
                data.title + '</a>';

                if(data.type != 'ebay'){
                    html += '<div class="card-description" id="content">' + data.description + '</div>';
                }
                html+=' <footer class="card-footer">\
                <span class="card-price">\
                <span class="card-price-inner">$' + data.price + '</span>\
                </span>\
                </footer>\
                </div>';
                document.getElementsByClassName('card')[0].innerHTML = html;
                if(data.image.length > 1){
                    var slide = new Slide('slideList',data.image,'before','after','content',150);
                    slide.autoSlide();
                }
            }
            else if(data.type == 'article'){
                cssNode.href = '/stylesheets/common.css';
                document.getElementsByTagName('head')[0].appendChild(cssNode);
                if(data.images.length > 0 ){
                   for(var i = 0;i < data.images.length;i++){
                       if(i == 0){
                           html += '<header  id="slideList">\
                       <div class=" slideCard" style="left: 0;">\
                       <div class="card-image" style="background-image: url(' + data.images[0] + ');" alt="" ></div>\
                       </div>'
                       }
                       else{
                            html += '<div class=" slideCard">\
                       <div class="card-image" style="background-image: url(' + data.images[0] + ');" alt="" ></div>\
                       </div>'
                       }
                   }

                    if(data.images.length > 1){
                        html += '<a href="javascript:void(0)" id="before" class="iconfont"> &#xe61b;</a>\
                    <a href="javascript:void(0)" id="after" class="iconfont"> &#xe615;</a>\
                    </header>'
                    }
                    else{
                        html += '</header>'
                    }
                }

                html += ' <div class="card-content">\
                <div class="card-title">'+
                data.title +
                '</div>\
                <div class="card-description" id="content">'+
                 data.content +
                '</div>\
                <footer class="card-footer">\
                <a target="_blank" href="' + query.url + '" class="knowMore">Know More</a>\
                </footer>\
                </div>';
                document.getElementsByClassName('card')[0].innerHTML = html;
                if(data.images.length > 1){
                    var slide = new Slide('slideList',data.images,'before','after','content',150);
                    slide.autoSlide();
                }

            }
            else if(query.source == 'Tudou'){
                document.getElementsByClassName('card')[0].style.cssText = 'width:280px;margin:0 auto;';
                document.getElementsByClassName('card')[0].innerHTML = '<iframe width="280"  frameborder="0" src="http://www.tudou.com/programs/view/html5embed.action?code=' + data.tudouId + '"></iframe>'
            }
        }
    }
}

window.onload = function(){
  render();
};
