const express = require('express');
//引入连接池模块
const pool = require('../sx_pool.js');
//创建路由器对象
let router = express.Router();
//挂载路由
//5.商品列表 get  /list
router.get("/list", (req, res) => {
    let obj = req.query;
    if (!obj.pno) obj.pno = 1;
    if (!obj.count) obj.count = 1;
    obj.pno = parseInt(obj.pno);
    obj.count = parseInt(obj.count);
    let start = (obj.pno - 1) * obj.count;
    let sql = `SELECT sx_shouji.lid,sx_shouji.title,sx_shouji.price,sx_shouji.sold_count,sx_shouji.is_onsale,sx_tupian.md as pic FROM sx_shouji INNER JOIN (select laptop_id, max(md) md from sx_tupian GROUP BY laptop_id) sx_tupian LIMIT ?,?;
    select * from sx_shouji`;
    pool.query(sql, [start, obj.count], (err, result) => {
        let recordCount = result[1].length;
        let pageSize = obj.count;
        let pno = obj.pno;
        let pageCount = parseInt(recordCount / pageSize) + 1;
        if (err) throw err;
        res.send({
            code: 200,
            msg: "list ok",
            recordCount: recordCount,
            pageSize: pageSize,
            pno: pno,
            pageCount: pageCount,
            data: result[0]
        });
    });
});
//商品详情
router.get("/detail", (req, res) => {
 //5.1获取数据
    let obj = req.query;
    if (!obj.lid) {
        res.send({
            code: 401,
            msg: "lid required"
        });
        return;
    };
	  //5.5执行SQL语句
    let sql = `SELECT * FROM sx_shouji WHERE lid=?;
               SELECT pid,laptop_id,sm,md,lg FROM sx_tupian WHERE laptop_id=?;
               SELECT fid,fname FROM sx_xinghao INNER JOIN sx_shouji ON sx_xinghao.fid = sx_shouji.id WHERE sx_shouji.lid = ?;
               SELECT lid,spec FROM sx_shouji WHERE id IN (SELECT id FROM sx_shouji WHERE lid = ?); `;
    pool.query(sql, [obj.lid, obj.lid, obj.lid, obj.lid], (err, result) => {

	   result[2][0].laptopList=result[3]
        if (err) throw err;
		
        if (result.length > 0) {
		
            console.log({
                code: 200,
                msg: "detail ok",
                details:result[0][0] ,
                picList: result[1],
                family: result[2][0],
			   	
            }); 
	
            res.send({
                code: 200,
                msg: "detail ok",
                details:result[0][0],
                picList: result[1],
                family: result[2][0],
            })
        } else {
            res.send({
                code: 301,
                msg: "can not found"
            });
        }

    });
});
//商品删除
router.get('/delete',(req,res)=>{
  //3.1获取数据
  let obj=req.query;
  //console.log(obj);
  //3.2验证数据是否为空
  if(!obj.lid){
    res.send({code:401,msg:'uid required'});
	return;
  }
  //3.3执行SQL语句
  pool.query('DELETE FROM sx_shouji WHERE lid=?',[obj.lid],(err,result)=>{
    if(err) throw err;
	console.log(result);
	if(result.affectedRows>0){
	  res.send({
		code:200,
		msg:'删除成功'
	  });
	}else{
	  res.send({code:201,msg:'删除失败'});
	}
  });
});
//商品添加
router.post('/add',(req,res)=>{
  //3.1获取数据
  let obj=req.body;
    console.log(obj);
  //3.2验证数据是否为空
   if(!obj.id){
    res.send({code:401,msg:'所属商品编号为空'});
	//阻止往后执行
	return;
  }
  if(!obj.title){
    res.send({code:402,msg:'主标题为空'});
	return;
  }
   if(!obj.subtitle){
    res.send({code:403,msg:'副标题为空'});
	return;
  }
  if(!obj.price){
    res.send({code:404,msg:'价格为空'});
	return;
  }
  //3.3执行SQL语句
  pool.query('INSERT INTO sx_shouji SET ?',[obj],(err,result)=>{
    if(err) throw err;
	console.log(result);
	if(result.affectedRows>0){
	  res.send({
		code:200,
		msg:'添加成功'
	  });
	}else{
	  res.send({code:301,msg:'添加失败'});
	}
  });
});

//导出路由器对象
module.exports = router;