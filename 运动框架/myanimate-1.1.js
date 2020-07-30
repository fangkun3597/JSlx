function animate(element,targetJson,time,tweenString,callback){
    //加入函数重载 智能判断用户传入参数
    if(arguments.length<3 || typeof arguments[0] != "object" || typeof arguments[1] != "object")
    {
        throw new Error("对不起，你传进来的参数数量不对或者参数类型不对，请仔细检查哦！");
        return ;
    }
    else if(arguments.length==3)
    {
        tweenString = "Linear";
		callback = null;
    }
    else if(arguments.length==4)
    {
        switch(typeof arguments[3])
        {
            case "string":
                callback = null;
                break;

            case "function":
                callback = arguments[3];
                tweenString = "Linear";
                break;

            default:
                throw new Error("对不起，你传进来的参数数量不对或者参数类型不对，请仔细检查哦！");
        }
    }


    if(window.navigator.userAgent.indexOf("MSIE")!=-1) //IE11已经没有MSIE关键字了
    {
        var interval = 50;
    }else{
        var interval = 20;
    }
    element.isanimated = true;
    //目标json   样式初始值json   变化量json
    var cssJson = {};
    var stepJson = {};
    for(var k in targetJson)//遍历目标json 提取css对应得初始值json
    {
        cssJson[k] = parseFloat(myfetchComputedStyle(element,k));
        targetJson[k] = parseFloat(targetJson[k]); //去掉px
        stepJson[k] = parseFloat(targetJson[k] - cssJson[k]);
    }
    var maxcount = time/interval;

    var count=0;//计算运动步数
    var number=0;
    var timer = setInterval(function(){
        for(var k in targetJson)
        {
            //第一个参数t表示当前帧编号
            //第二个参数b表示起始位置
            //第三个参数c表示变化量
            //第四个参数d表示总帧数
            number = Tween[tweenString](count,cssJson[k],stepJson[k],maxcount)
            if(k!="opacity")
            {
                element.style[k] = number + "px";
            }else{
                element.style[k] = number;
                element.style.filter = "alpha(opacity" + number*100 + ")";
            }
        }
        count++;
        if(count == maxcount)
        {
            for(var k in targetJson)
            {
                if(k!="opacity")
                {
                    element.style[k] = targetJson[k] + "px";
                }else{
                    element.style[k] = targetJson[k];
                    element.style.filter = "alpha(opacity" + targetJson[k]*100 + ")";
                }
            }
            clearInterval(timer);
			element.isanimated = false;
			//调用回调函数，并且让回调函数中的this表示运动的对象
			//我们加上了判断，如果callback存在，再执行函数
			callback && callback.apply(element);
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
    //第一个参数t表示当前帧编号
    //第二个参数b表示起始位置
    //第三个参数c表示变化量
    //第四个参数d表示总帧数
    var Tween = {
        Linear: function(t, b, c, d) {
            return c * t / d + b;
        },
        //二次的
        QuadEaseIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        QuadEaseOut: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        QuadEaseInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        //三次的
        CubicEaseIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        CubicEaseOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        CubicEaseInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        //四次的
        QuartEaseIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        QuartEaseOut: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        QuartEaseInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        QuartEaseIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        QuartEaseOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        QuartEaseInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        //正弦的
        SineEaseIn: function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        SineEaseOut: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        SineEaseInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        ExpoEaseIn: function(t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        ExpoEaseOut: function(t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        ExpoEaseInOut: function(t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        CircEaseIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        CircEaseOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        CircEaseInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        ElasticEaseIn: function(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        ElasticEaseOut: function(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        ElasticEaseInOut: function(t, b, c, d, a, p) {
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        //冲过头系列
        BackEaseIn: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        BackEaseOut: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        BackEaseInOut: function(t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        //弹跳系列
        BounceEaseIn: function(t, b, c, d) {
            return c - Tween.BounceEaseOut(d - t, 0, c, d) + b;
        },
        BounceEaseOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        BounceEaseInOut: function(t, b, c, d) {
            if (t < d / 2) return Tween.BounceEaseIn(t * 2, 0, c, d) * .5 + b;
            else return Tween.BounceEaseOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    }
}