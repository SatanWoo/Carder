/**
 *
 * Created by jarvis on 6/7/15.
 */

function render(){
    console.log(query);

    var ajaxReq = new XMLHttpRequest();
    ajaxReq.open("get",'/iframeAPI?url=' + query.url + '&source=' + query.source,true);
    ajaxReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    ajaxReq.send();

    ajaxReq.onreadystatechange=function()
    {
        if (ajaxReq.readyState==4 && ajaxReq.status==200)
        {
            var data = ajaxReq.responseText;
            console.log(data);
        }
    }
}

window.onload = function(){
  render();
};
