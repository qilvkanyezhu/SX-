const express=require('express');
const bodyParser=require('body-parser');
//引入路由器
const userRouter=require('./routes/sx_user.js');
const productRouter=require("./routes/sx_product.js");
const cartRouter=require("./routes/sx_cart.js");
const indexRouter=require('./routes/sx_index');


const session = require("express-session");
const cookieParser = require("cookie-parser");
let app=express()
app.use(express.json()); 
 app.use( bodyParser.urlencoded({
  extended:false
}) );
;
app.listen(8080);
app.use(session({ 
    secret: 'sx',// 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));
app.use(cookieParser("sx"));
//托管静态资源
app.use( express.static('public') );
//使用body-parser中间件

//把用户路由器挂载到服务器，给URL添加前缀/user  /user/reg
app.use("/user",userRouter);
app.use("/product",productRouter);
app.use("/cart",cartRouter);
app.use(indexRouter);
