function animate(element,targetJson,time,callback){
    if(window.navigator.userAgent.indexOf("MSIE")!=-1) //IE11已经没有MSIE关键字了
    {
        var interval = 50;
    }else{
        var interval = 10;
    }
    //目标json   样式初始值json   步长json
    var cssJson = {};

    for(var k in targetJson)//遍历目标json 提取css对应得初始值json
    {
        cssJson[k] = parseFloat(myfetchComputedStyle(element,k));
    }
    var stepJson = {};
    var maxcount = time/interval;
    for(var k in targetJson)
    {
        stepJson[k] = parseFloat((targetJson[k] - cssJson[k])/maxcount);
    }

    var count=0;//计算运动步数
    var timer = setInterval(function(){
        count++;
        for(var k in targetJson)
        {
            cssJson[k] += stepJson[k];
            if(k!="opacity")
            {
                element.style[k] = cssJson[k] + "px";
            }else{
                element.style[k] = targetJson[k];
                element.style.filter = "alpha(opacity" + targetJson[k]*100 + ")";
            }
        }
        if(count == maxcount)
        {
            if(k!="opacity")
            {
                element.style[k] = targetJson[k] + "px";
            }else{
                element.style[k] = targetJson[k];
                element.style.filter = "alpha(opacity" + targetJson[k]*100 + ")";
            }
            clearInterval(timer);
            callback.apply(element);
        }
    },interval)
    //获取css计算后样式
    function myfetchComputedStyle(element,cssstyle){
        //检测是否为IE浏览器 IE不支持getComputedStyle
        if(window.getComputedStyle)
        {
            //正则表达式 检测样式名称 是否为驼峰写法
            cssstyle = cssstyle.replace(/([A-Z])/g,function(match,$1){
                return "-" + $1.toLowerCase();
            });
            return window.getComputedStyle(element)[cssstyle];
        }else{
            cssstyle = cssstyle.replace(/\-([a-z])/g,function(match,$1){
                return $1.toUpperCase();
            });
            return element.currentStyle[cssstyle];
        }
    }
}