//引入模块
const express = require("express");
const pool = require("../sx_pool.js");

//创建路由器对象
let router = express.Router();
//挂载路由
//===============================================
//1.添加购物车 POST /add
router.post("/add", (req, res) => {
  //1.1获取数据
  let obj = req.body;
  //1.2验证各项数据是否为空
  let i = 400;
  for (const key in obj) {
    i++;
    if (!obj[key]) {
      res.send({ code: i, msg: `${key} required` });
      return;
    }
  }
  //如果用户没有登录
  let uid = req.session.loginUid;
  let lid = obj.lid;
  let buyCount = obj.buyCount;
  if (!uid) {
    req.session.pageToJump = "cart.html";
    req.session.toBuyLid = lid;
    req.session.toBuyCount = buyCount;
    res.send({ code: 300, msg: "login required" });
    return;
  }

  //判断用户的购物车中是否已有该商品
  let sql = `SELECT iid FROM sx_shoppingcart_item WHERE user_id=? AND product_id=?`;
  pool.query(sql, [uid, lid], (err, result) => {
    if (err) throw err;
    let sql2;
    if (result.length > 0) {
      //用户购物车已经有该商品，则加1
      sql2 = `UPDATE sx_shoppingcart_item SET count=count+${buyCount} WHERE user_id=${uid} AND product_id=${lid}`;
    } else {
      sql2 = `INSERT INTO sx_shoppingcart_item VALUES(NULL, ${uid}, ${lid}, ${buyCount}, false)`;
    }

    console.log(sql2);

    pool.query(sql2, (err, result2) => {
      if (err) throw err;
      //如果数据更新或插入成功，响应对象
      if (result2.affectedRows > 0) {
        res.send({ code: 200, msg: `add success` });
      } else {
        res.send({ code: 301, msg: `add failed, err: ${err}` });
      }
    });
  });
});

//===============================================
//2.购物车列表 GET /list
router.get("/list", (req, res) => {
  //1.1获取数据
  //1.2参数:无(获取当前用户的所有记录)
  if (!req.session.loginUid) {
    req.session.pageToJump = "cart.html";
    res.send({ code: 300, msg: "login required" });
    return;
  }
  let user = { id: req.session.loginUid }; //
  //1.3执行SQL语句
  let sql = `SELECT a.iid,a.product_id as lid ,b.title,b.spec, b.price,a.count,'' as pic 
                FROM sx_shoppingcart_item a INNER JOIN sx_shouji b ON a.product_id = b.lid 
                WHERE a.user_id = ? `;
  pool.query(sql, [user.id], (err, result) => {
    if (err) {
      res.send({ code: 301, msg: `list failed, err: ${err}` }); //throw err;
      return;
    }

    //如果数据获取成功（记录数量是0也是一种成功），响应对象
    let sxn = {
      code: 200,
      msg: "list ok",
      data: result,
    };
    for (let i = 0; i < sx.data.length; i++) {
      let lid = sx.data[i].lid;
      (function (lid, i) {
        pool.query(
          "SELECT md FROM sx_tupian WHERE laptop_id=? LIMIT 0,1",
          [lid],
          (err, result) => {
            if (result.length > 0) retJson.data[i].pic = result[0].md;
          }
        );
      })(lid, i);
    }

      res.send(sx);
  });
});

//===============================================
//3.删除购物车 GET /delete   http://127.0.0.1:8080/cart/delete?iid=1
router.get("/delete", (req, res) => {
  //1.1获取数据
  let obj = req.query;
  //1.2验证数据
  if (!obj.iid) {
    res.send({ code: 401, msg: "iid required" });
    return;
  }

  if(!req.session.loginUid){
    res.send({code:300,msg:'login required'});
    return;
  }
  //1.3执行SQL语句
  let sql = "DELETE FROM sx_shoppingcart_item WHERE iid =?";
  pool.query(sql, [obj.iid], (err, result) => {
    if (err) {
      res.send({
        code: 201,
        msg: `delete failed, err: ${err}`,
      }); //throw err;
      return;
    }    
    //数据库操作影响的记录行数
    if (result.affectedRows > 0) {
      res.send({ code: 200, msg: `delete success： iid=${obj.iid}` });
    } else {
      res.send({ code: 301, msg: `delete error： iid=${obj.iid}` });
    }
  });
});

//===============================================
//4.修改购物车条目中的购买数量 GET /updatecount
router.get("/updatecount", (req, res) => {  
  //1.1获取数据
  let obj = req.query;
  //1.2验证各项数据是否为空
  let i = 400;
  for (const key in cart) {
    i++;
    if (!cart[key]) {
      res.send({ code: i, msg: `${key} required` });
      return;
    }
  }

  if(!req.session.loginUid){
    res.send({code:300,msg:'login required'});
    return;
}
  //1.3执行SQL语句
  let sql = "UPDATE sx_shoppingcart_item SET count = ? WHERE iid=?";
  pool.query(sql, [obj.count, obj.iid], (err, result) => {
    let sx = {};
    if (err) {
      sx = { code: 201, msg: `update failed, errMessage: ${err}` };
    } //throw err;
    
    //如果数据更改成功，响应对象
    if (result.affectedRows > 0) {
      sx = { code: 200, msg: "update success" };
    } else {
     sx = { code: 301, msg: "update error" };
    }
    res.send(sx);
  });
});

//===============================================
//5.修改购物车条目中的是否勾选 GET /updatechecked
router.get("/updatechecked", (req, res) => {
  //console.log( req.body );
  //1.1获取数据obj
  let obj = req.query;
  //1.2验证各项数据是否为空
  let i = 400;
  for (const key in obj) {
    i++;
    if (!obj[key]) {
      res.send({ code: i, msg: `${key} required` });
      return;
    }
  }
  //验证用户是否登录
  if(!req.session.loginUid){
    res.send({code:300,msg:'login required'});
    return;
  }
  //1.3执行SQL语句  //注意：接口参数与表字段名不一致
  let sql = "UPDATE sx_shoppingcart_item SET is_checked=? WHERE iid=?";
  pool.query(sql, [obj.checked, obj.iid], (err, result) => {
    let sx = {};
    if (err) {
      sx = { code: 301, msg: `update failed, errMessage: ${err}` };
    } //throw err;

    console.log(result);
    //如果数据更改成功，响应对象
    if (result.affectedRows > 0) {
      sx = { code: 200, msg: "update ok" };
    } else {
      sx = { code: 301, msg: "update error" };
    }
    res.send(sx);
  });
});

//===============================================
//2.购物车列表（勾选商品） GET /listchecked
router.get("/listchecked", (req, res) => {
  console.log(req.query);
  //1.1获取数据
  //1.2参数:无(获取当前用户的所有记录)
  let user = {};
  //1.3执行SQL语句
  let sql = `SELECT a.iid,a.product_id as lid ,b.title,b.spec, b.price,a.count,'' as pic 
                  FROM sx_shoppingcart_item a INNER JOIN sx_shouji b ON a.product_id = b.lid 
                  WHERE a.is_checked=1 AND a.user_id = ? `;
  pool.query(sql, [user.id], (err, result) => {
    if (err) {
      res.send({ code: 301, msg: `list failed, errMessage: ${err}` }); //throw err;
      return;
    }

    //如果数据获取成功（记录数量是0也是一种成功），响应对象
    let sx = {
      code: 200,
      msg: "list ok",
      data: result,
    };
    for (let i = 0; i < sx.data.length; i++) {
      let lid = sx.data[i].lid;
      (function (lid, i) {
        pool.query(
          "SELECT md FROM xz_laptop_pic WHERE laptop_id=? LIMIT 0,1",
          [lid],
          (err, result) => {
            if (result.length>0)              
              sx.data[i].pic = result[0].md;
          }
        );
      })(lid, i);
    }

    //延时调用
      res.send(sx);
  });
});

//===============================================
module.exports = router;
