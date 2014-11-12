function selectAll(){
 var checklist = document.getElementsByName ("selected");
   if(document.getElementById("select_all").checked)
   {
   for(var i=0;i<checklist.length;i++)
   {
      checklist[i].checked = 1;
   }
 }else{
  for(var j=0;j<checklist.length;j++)
  {
     checklist[j].checked = 0;
  }
 }

}

$.fn.webSocket = function(opt){

    var st = {};
    st = $.extend(st,opt);
    var message = {};
    var $this = $(this);


    var genUid = function(){
        return new Date().getTime()+""+Math.floor(Math.random()*899+100);
    };

    var init = function(e){

        var socket = io.connect('ws://172.10.10.9:3000');
        var node = $(e.target);
        message.id = genUid();
        message.filename = node.attr('filename');
        BootstrapDialog.show({message:function(){
            var escapeString = function (html){
                var elem = document.createElement('div')
                var txt = document.createTextNode(html)
                elem.appendChild(txt)
                return elem.innerHTML;
            }
            var tag = $('<div id="log" style="height:300px;overflow: auto;"></div>');
            //告诉服务器端有用户登录
            socket.emit('login', {userid:message.id, filename:message.filename});
            socket.on('message',function(obj){
                //去除log中的颜色控制字符
                var regx =  /\x1B\[([0-9]{1,3}((;[0-9]{1,3})*)?)?[m|K]/g;
                tag.append('<p>'+escapeString(obj.content.replace(regx,''))+'</p>');
                tag.animate({ scrollTop: tag[0].scrollHeight}, 1000);
            });
            return tag[0];
        } ,
            title:'日志',
            onhide:function(){
                socket.emit('disconnect');
        }});
    }


    $this.on("click",function(e){
        init(e);
        return false;
    });

}
