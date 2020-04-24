SET NAMES UTF8;
DROP DATABASE IF EXISTS sx;
CREATE DATABASE sx CHARSET=UTF8;
USE sx;


/**手机型号**/
CREATE TABLE sx_xinghao(
  fid INT PRIMARY KEY AUTO_INCREMENT,
  fname VARCHAR(32)
);

/**手机**/
CREATE TABLE sx_shouji(
  lid INT PRIMARY KEY AUTO_INCREMENT,
  id INT,              #所属型号家族编号
  title VARCHAR(128),         #主标题
  subtitle VARCHAR(128),      #副标题
  price DECIMAL(10,2),        #价格
  promise VARCHAR(64),        #服务承诺
  spec VARCHAR(64),           #颜色
  lname VARCHAR(32),          #商品名称
  os VARCHAR(32),             #操作系统
  memory VARCHAR(32),         #内存容量
  resolution VARCHAR(32),     #分辨率
  cpu VARCHAR(32),            #处理器  
  disk VARCHAR(32),           #硬盘容量及类型
  iphone VARCHAR(32),         #手机号码
  sold_count INT,             #已售出的数量
  is_onsale BOOLEAN           #是否促销中
);


/**手机图片**/
CREATE TABLE sx_tupian(
  pid INT PRIMARY KEY AUTO_INCREMENT,
  laptop_id INT,              #笔记本电脑编号
  sm VARCHAR(128),            #小图片路径
  md VARCHAR(128),            #中图片路径
  lg VARCHAR(128)             #大图片路径
);

/**用户信息**/
CREATE TABLE sx_user(
  uid INT PRIMARY KEY AUTO_INCREMENT,
  uname VARCHAR(32),
  upwd VARCHAR(32),
  email VARCHAR(64),
  phone VARCHAR(16),

  user_name VARCHAR(32),      #用户名，如王小明
  gender INT                  #性别  0-女  1-男

);

/**收货地址信息**/
CREATE TABLE sx_receiver_address(
  aid INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,                #用户编号
  receiver VARCHAR(16),       #接收人姓名
  province VARCHAR(16),       #省
  city VARCHAR(16),           #市
  county VARCHAR(16),         #县
  address VARCHAR(128),       #详细地址
  cellphone VARCHAR(16),      #手机
  fixedphone VARCHAR(16),     #固定电话
  postcode CHAR(6),           #邮编
  tag VARCHAR(16),            #标签名

  is_default BOOLEAN          #是否为当前用户的默认收货地址
);

/**购物车条目**/
CREATE TABLE sx_shoppingcart_item(
  iid INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,      #用户编号
  product_id INT,   #商品编号
  count INT,        #购买数量
  is_checked BOOLEAN #是否已勾选，确定购买
);

/**用户订单**/
CREATE TABLE sx_order(
  aid INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  address_id INT,
  status INT,             #订单状态  1-等待付款  2-等待发货  3-运输中  4-已签收  5-已取消
  order_time BIGINT,      #下单时间
  pay_time BIGINT,        #付款时间
  deliver_time BIGINT,    #发货时间
  received_time BIGINT    #签收时间
)AUTO_INCREMENT=10000000;

/**用户订单**/
CREATE TABLE sx_order_detail(
  did INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,           #订单编号
  product_id INT,         #产品编号
  count INT               #购买数量
);

/****首页轮播广告商品****/
CREATE TABLE sx_index_guanggao(
  cid INT PRIMARY KEY AUTO_INCREMENT,
  img VARCHAR(128),
  title VARCHAR(64),
  href VARCHAR(128)
);

/****首页商品****/
CREATE TABLE sx_index_shangpin(
  pid INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(64),
  details VARCHAR(128),
  pic VARCHAR(128),
  price DECIMAL(10,2),
  href VARCHAR(128),
  seq_recommended TINYINT,
  seq_new_arrival TINYINT,
  seq_top_sale TINYINT
);

/*******************/
/******数据导入******/
/*******************/
/**手机**/
INSERT INTO sx_xinghao VALUES
(NULL,'Galaxy Z'),
(NULL,'Galaxy S'),
(NULL,'Galaxy Note'),
(NULL,'Galaxy A'),
(NULL,'Galaxy M'),
(NULL,'Galaxy W');
/**三星**/
INSERT INTO sx_shouji VALUES
(NULL,1,'Samsung Galaxy Z Flip ','SM-G9880',11999,'*退货补运费 *30天无忧退货 *48小时快速退款 *72小时发货','潘多拉紫','Samsung Galaxy Z Flip','Android','8G','1080 x 2636 (FHD+)','Snapdragon 855','256GB',150123456789,2968,true),
(NULL,1,'Samsung Galaxy Fold', 'SM-G9880',9999,'*退货补运费 *30天无忧退货 *48小时快速退款 *72小时发货','量子黑','Samsung Galaxy Fold','Android','8G','1080 x 2636 (FHD+)','Snapdragon 855','256GB',150123456789,3333,true),
(NULL,2,'Samsung Galaxy S20 Ultra 5G','SM-G9880',9999,'*退货补运费 *30天无忧退货 *48小时快速退款 *72小时发货','遐想黑','Samsung Galaxy S20 Ultra 5G','Android','8G','3200 x 1440 (Quad HD+)','Snapdragon 855','256GB',3423556789,2968,true),
(NULL,2,'Galaxy Note10+ 5G ','SM-N9760',11999,'*退货补运费 *30天无忧退货 *48小时快速退款 *72小时发货','莫奈彩','Galaxy Note10+ 5G','Android','8G','1080 x 2636 (FHD+)','Snapdragon 855','256GB',150123456789,2968,true),
(NULL,2,'Galaxy A71 5G ','SM-A7160',3999,'*退货补运费 *30天无忧退货 *48小时快速退款 *72小时发货','切割蓝','Galaxy A71 5G','Android','8G','1080 x 2636 (FHD+)','Snapdragon 855','256GB',150123456789,2968,true),
(NULL,3,'Samsung Galaxy M30s ','SM-M3070',1999,'*退货补运费 *30天无忧退货 *48小时快速退款 *72小时发货','皓月白','Samsung Galaxy M30s','Android','8G','1080 x 2636 (FHD+)','Snapdragon 855','256GB',150123456789,2968,true),
(NULL,3,'Samsung W20 5G ','SM-W2020',19999,'*退货补运费 *30天无忧退货 *48小时快速退款 *72小时发货','青涩白','Samsung W20 5G','Android','8G','1080 x 2636 (FHD+)','Snapdragon 855','256GB',150123456789,2968,true);

/**图片**/
INSERT INTO sx_tupian VALUES
(NULL, 1, 'img/1.jpg','img/2.jpg','img/3.jpg'),
(NULL, 2,  'img/4.jpg','img/5.jpg','img/6.jpg'),
(NULL, 3,  'img/7.jpg','img/8.jpg','img/9.jpg'),
(NULL, 4,  'img/10.jpg','img/11.jpg','img/12.jpg'),
(NULL, 5,  'img/13.jpg','img/14.jpg','img/15.jpg'),
(NULL, 6, 'img/16.jpg','img/17.jpg','img/18.jpg'),
(NULL, 7,  'img/19.jpg','img/20.jpg','img/21.jpg');


/**用户信息**/
INSERT INTO sx_user VALUES
(NULL, 'xiaoming', '123456', 'xiaoming@qq.com', '13501234567',  '小明', '1'),
(NULL, 'xiaowang', '123456', 'xiaowang@qq.com', '13501234568',  '小王', '1'),
(NULL, 'lili', '123456', 'lili@qq.com', '13501234569', '丽丽', '1'),
(NULL, 'diandian', '123456', 'diandian@qq.com', '13501234560', '点点', '0');

/****首页轮播广告商品****/
INSERT INTO sx_index_guanggao VALUES
(NULL, '1.jpg','轮播广告商品1','product_details.html?lid=28'),
(NULL, '2.jpg','轮播广告商品2','product_details.html?lid=19'),
(NULL, '3.jpg','轮播广告商品3','lookforward.html'),
(NULL, '20.jpg','轮播广告商品4','lookforward.html');

/****首页商品****/
INSERT INTO sx_index_shangpin VALUES
(NULL, 'Galaxy Z系列', '高通骁龙865,1080 x 2636 (FHD+)512GB SSD', '1.jpg', 6988, 'product_details.html?lid=1', 1, 1, 1),
(NULL, 'Galaxy S系列', '高通骁龙865|512GB SSD|12GB内存', '2.jpg', 3488, 'product_details.html?lid=5', 2, 2, 2),
(NULL, 'Galaxy Note系列', '高通骁龙865|256GB SSD|4GB内存', '3.jpg', 5399, 'product_details.html?lid=9', 3, 3, 3),
(NULL, 'Galaxy A系列', '高通骁龙855|512GB SSD|4GB内存', '4.jpg', 4966, 'product_details.html?lid=13', 4, 4, 4),
(NULL, 'Galaxy M系列', '高通骁龙855|1TGB SSD|8GB内存', '5.jpg', 6299, 'product_details.html?lid=17', 5, 5, 5),
(NULL, 'Galaxy W系列', '高通骁龙865|512GB SSD|6GB内存', '6.jpg', 5199, 'product_details.html?lid=19', 6, 6, 6);


