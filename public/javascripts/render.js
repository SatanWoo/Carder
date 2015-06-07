/**
 *
 * Created by jarvis on 6/7/15.
 */

function render(){
    console.log(query);

    var ajaxReq = new XMLHttpRequest();
    ajaxReq.open("get",'/iframeAPI?url=' + encodeURIComponent(query.url) + '&source=' + query.source,true);
    ajaxReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    ajaxReq.send();

    ajaxReq.onreadystatechange=function()
    {
        if (ajaxReq.readyState==4 && ajaxReq.status==200)
        {
            var data = JSON.parse(ajaxReq.responseText);
            if(data.type == 'ecommerce'){
                var cssNode = document.createElement('link');
                cssNode.href = '/stylesheets/product1.css';
                cssNode.rel="stylesheet";
                document.getElementsByTagName('head')[0].appendChild(cssNode);
                html = '<header class="card-gallery" id="slideList">\
                    <div class="card-image-wrap slideCard" style="left: 0;">\
                        <div class="card-image" style="background-image: url('+ data.image +');" alt="" ></div>\
                    </div>\
                <a href="javascript:void(0)" id="before" class="iconfont"> &#xe61b;</a>\
                <a href="javascript:void(0)" id="after" class="iconfont"> &#xe615;</a>\
                </header>\
                <div class="card-content">\
                <a href="'+ query.url +'" target="_blank" class="card-title">'+
                data.title +
                '</a>\
                <div class="card-description" id="content">\
                detail\
                </div>\
                <footer class="card-footer">\
                <span class="card-price">\
                <span class="card-price-inner">' + data.priceCurrency + data.price + '</span>\
                </span>\
                </footer>\
                </div>';
                document.getElementsByClassName('card')[0].innerHTML = html;
            }
            console.log(data);
        }
    }
}

window.onload = function(){
  render();
};
