const express = require('express');
//引入连接池模块
const pool = require('../sx_pool.js');
//创建路由器对象
let router = express.Router();
//挂载路由
router.get('/index',(req,res)=>{
    let obj={};
    pool.query(`
    SELECT cid,img,title,href FROM sx_index_guanggao;
    SELECT pid,title,details,pic,price,href FROM sx_index_shangpin WHERE seq_recommended>0 ORDER BY seq_recommended  LIMIT 3;
    SELECT pid,title,details,pic,price,href FROM sx_index_shangpin WHERE seq_new_arrival>0 ORDER BY seq_new_arrival LIMIT 3;
    SELECT pid,title,details,pic,price,href FROM sx_index_shangpin WHERE seq_top_sale>0 ORDER BY seq_top_sale LIMIT 3;
    `,(err,result)=>{
        if(err) throw err;
        obj.carouselItems=result[0];
        obj.recommendedItems=result[1];
        obj.newArrialItems=result[2];
        obj.topSaleItems=result[3];
        res.send(obj);
    })
});
//导出路由器对象
module.exports=router;