const mysql=require('mysql');
//创建连接池对象
let pool=mysql.createPool({
  host:'127.0.0.1',
  port:'3306',
  user:'root',
  password:'',
  database:'sx',
  connectionLimit:15,
	  multipleStatements: true  //允许query执行多条SQL语句
});
//导出连接池对象
module.exports=pool;