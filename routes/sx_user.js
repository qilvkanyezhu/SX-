const express=require('express');
//引入连接池模块
const pool=require('../sx_pool.js');
//创建路由器对象
let router=express.Router();
//挂载路由
//1.注册用户  post  /reg
router.post('/reg',(req,res)=>{
  //1.1获取数据
  let obj=req.body;
  //1.2验证各项数据是否为空
  if(!obj.uname){
    res.send({code:401,msg:'uname required'});
	//阻止往后执行
	return;
  }
  if(!obj.upwd){
    res.send({code:402,msg:'upwd required'});
	return;
  }
  if(!obj.email){
    res.send({code:403,msg:'email required'});
	return;
  }
  if(!obj.phone){
    res.send({code:404,msg:'phone required'});
	return;
  }
  //1.3执行SQL语句
  pool.query('INSERT INTO sx_user SET ?',[obj],(err,result)=>{
    if(err) throw err;
	console.log(result);
	//如果数据插入成功，响应对象
	if(result.affectedRows>0){
	  res.send({code:200,msg:'register suc'});
	}
  });
});
//2.用户登录 post /login
router.post("/login", (req, res) => {  
  //1.1获取数据
  let user = req.body;
  //1.2验证各项数据是否为空
  if (!user.uname) {
    res.send({ code: 401, msg: "uname required" });
    return;
  } else if (!user.upwd) {
    res.send({ code: 402, msg: "upwd required" });
    return;
  }

  //1.3执行SQL语句,查看是否登录成功（使用用户名和密码两个条件能查询到数据）
  let sql = "SELECT * FROM sx_user WHERE uname = ? AND upwd = ?";
  pool.query(sql, [user.uname, user.upwd], (err, result) => {
	  console.log(result);
    if (err) throw err;
    //判断查询的结果（数组）长度是否大于0,如果大于0，说明查询到数据，有这个用户登录成功    
    if (result.length > 0) {
    //登陆成功后将用户uname和uid保存在session中
      req.session.loginUname=user.uname;
      req.session.loginUid=result[0].uid;
      res.send({ code: 200, msg: "login success" });
    } else {
      res.send({ code: 301, msg: "login failed：uname or upwd is error" });
    }
  });
});
//3.检索用户 get  /detail
router.get('/detail',(req,res)=>{
  //3.1获取数据
  let obj=req.query;
  //console.log(obj);
  //3.2验证数据是否为空
  if(!obj.uid){
    res.send({code:401,msg:'uid required'});
	return;
  }
  //3.3执行SQL语句
  pool.query('SELECT uid,uname,email,phone FROM sx_user WHERE uid=?',[obj.uid],(err,result)=>{
    if(err) throw err;
	//console.log(result);
	//如果数组长度大于0，检索到对应的用户，否则检索不到
	if(result.length>0){
	  res.send({
		code:200,
		msg:'ok',
		data:result[0]
	  });
	}else{
	  res.send({code:301,msg:'can not found'});
	}
  });
});
//4.修改用户信息  get  /update
router.get('/update',(req,res)=>{
  //4.1获取数据
  let obj=req.query;
  //console.log(obj);
  //4.2验证数据是否为空
  //遍历对象，访问每个属性，如果属性值为空，提示属性名那一项必须的
  let i=400;
  for(let key in obj){
	i++;
    //console.log(key,obj[key]);
	if(!obj[key]){
	  res.send({code:i,msg:key+' required'});
	  return;
	}
  }
  //4.3执行SQL语句
  pool.query('UPDATE sx_user SET ? WHERE uid=?',[obj,obj.uid],(err,result)=>{
    if(err) throw err;
	//console.log(result);
	if(result.affectedRows>0){
	  res.send({code:200,msg:'update suc'});
	}else{
	  res.send({code:301,msg:'update err'});
	}
  });
});
//5.用户列表 get  /list
router.get('/list',(req,res)=>{
  //5.1获取数据
  let obj=req.query;
  //5.2验证是否为空
  if(!obj.pno) obj.pno=1;
  if(!obj.count) obj.count=2;
  console.log(obj);
  //5.3将count转为整型
  obj.count=parseInt(obj.count);
  //5.4计算start
  let start=(obj.pno-1)*obj.count;
  //5.5执行SQL语句
  pool.query('SELECT*FROM sx_user LIMIT ?,?',[start,obj.count],(err,result)=>{
    if(err) throw err;
	res.send({code:200,data:result});
  });
});

//删除用户
router.get('/delete',(req,res)=>{
  //获取数据
  let obj=req.query;
  //console.log(obj);
  //验证数据是否为空
  if(!obj.uid){
    res.send({code:401,msg:'uid required'});
	return;
  }
  //执行SQL语句
  pool.query('DELETE FROM sx_user WHERE uid=?',[obj.uid],(err,result)=>{
    if(err) throw err;
	console.log(result);
	if(result.affectedRows>0){
	  res.send({
		code:200,
		msg:'成功删除'
	  });
	}else{
	  res.send({code:301,msg:'删除失败'});
	}
  });
});

//===============================================
//10.退出登录 GET /logout
router.get("/logout", (req, res) => {
   req.session.destroy();
   res.send({ code: 200, msg: "logout success" });  
});

//===============================================
//11.获取当前用户信息接口 GET /sessiondata
router.get("/sessiondata", (req, res) => { 
   res.send({
    "code": 200,
    "msg": "success",
    "data":{
        "uid":req.session.loginUid,
        "uname":req.session.loginUname
    }
  });  
});

//导出路由器对象
module.exports=router;