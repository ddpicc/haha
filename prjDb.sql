/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.20 : Database - littleAnt
*********************************************************************
*/

DROP DATABASE IF EXISTS `littleAnt`;

CREATE DATABASE `littleAnt`;

USE `littleAnt`;

/* 创建用户表 */
DROP TABLE IF EXISTS `littleAnt_user`;

CREATE TABLE `littleAnt_user` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `storage_number` varchar(5) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `token` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL,
  `is_superadmin` smallint(5) NOT NULL DEFAULT 0,
  `name` varchar(30) NOT NULL,
  `user_phone` varchar(30) NOT NULL,
  `balance` float(30) NOT NULL DEFAULT 0,
  `user_address` text,
  `plan_startdate` date,
  `rateTable_id` smallint(5) unsigned DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

insert into `littleAnt_user`(`storage_number`,`email`,`password`,`token`,`role`,`is_superadmin`,`name`,`user_phone`,`balance`) values ('ACCED','qcui10@outlook.com','0cc6928e741d75e7a92396317522069e','1c2b','admin',1,'崔潜','+8613378128456',100), ('BCQWZ','test@test.com','098f6bcd4621d373cade4e832627b4f6','3d4a','default',0,'测试','+8613708746391',100), ('BCQEZ','operator@test.com','098f6bcd4621d373cade4e832627b4f6','3d4K','operator',0,'操作者','+8613708746391',100);


/* 创建地址表 */
DROP TABLE IF EXISTS `littleAnt_recipients`;

CREATE TABLE `littleAnt_recipients` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint(5) unsigned,
  `name` varchar(30) NOT NULL,
  `country_code` varchar(50) NOT NULL DEFAULT 'China +86',
  `phone` varchar(20) NOT NULL,
  `identity_card` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `zip` varchar(10),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/* 刚入库的包裹，包含一件或多件物品，客户未点击发货*/
/* statue can be 已入库，部分发货，已全部发出*/
DROP TABLE IF EXISTS `littleAnt_third_party_package`;

CREATE TABLE `littleAnt_third_party_package` (
  `id` smallint(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint(5) unsigned,
  /*预报包裹时填写的信息*/
  `user_defined_tracking` varchar(30) NOT NULL,  /*客户单号*/
  `courier` varchar(20),
  `in_store_date` date,
  /*小蚂蚁包裹ID*/
  `package_Id` smallint(10) unsigned,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


/* 用户发货，生成小蚂蚁单号的包裹*/
/* statue can be 已发出，已送达*/
DROP TABLE IF EXISTS `littleAnt_user_package`;

CREATE TABLE `littleAnt_user_package` (
  `id` smallint(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` smallint(5) unsigned,
  `litlleant_tracking_number` varchar(30) NOT NULL,
  `created_at` date,
  /*发货时填写的信息*/
  `package_description` text,
  `package_comment` text,
  `total` float(10),   /*预估货值*/
  `to_name` varchar(30),
  `to_country_code` varchar(20) NOT NULL DEFAULT 'China +86',
  `to_phone` varchar(30),
  `to_identity_card` varchar(50),
  `to_address` text,
  `to_city` varchar(30),
  `to_state` varchar(30),
  `to_zip` varchar(10),
  /*管理员编辑信息*/
  `total_weight` float(10) NOT NULL DEFAULT 0,
  `total_price` float(10) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL,
  `finishprocess_time` datetime,
  `admin_comment` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/* 小蚂蚁单号对应的vendor（中通，圆通，etc）单号*/
/* 一个小蚂蚁单号可以对应多个child order*/
DROP TABLE IF EXISTS `littleAnt_child_package`;

CREATE TABLE `littleAnt_child_package` (
  `id` smallint(10) unsigned NOT NULL AUTO_INCREMENT,
  `litlleant_package_id` smallint(5) unsigned,
  `vendor` varchar(20),
  `vendor_tracking_number` varchar(30),
  
  /*管理员编辑信息*/
  `weight` float(10) NOT NULL DEFAULT 0,
  `bag_id` smallint(5) unsigned,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


/* 包裹里的物品信息,管理员拍照录入*/
DROP TABLE IF EXISTS `littleAnt_admin_report_items`;

CREATE TABLE `littleAnt_admin_report_items` (
  `id` smallint(10) unsigned NOT NULL AUTO_INCREMENT,
  `third_party_packageId` smallint(10) unsigned,
  `package_Id` smallint(10) unsigned,
  `item_name` varchar(30) NOT NULL,
  `item_count` smallint(5) NOT NULL DEFAULT 1,
  `pic1_url` varchar(50),
  `pic1_name` varchar(50),
  `pic2_url` varchar(50),
  `pic2_name` varchar(50),
  `pic3_url` varchar(50),
  `pic3_name` varchar(50),
  `origiral_item_Id` smallint(10) unsigned,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/* 用户申报的物品信息 */
DROP TABLE IF EXISTS `littleAnt_user_report_items`;

CREATE TABLE `littleAnt_user_report_items` (
  `id` smallint(10) unsigned NOT NULL AUTO_INCREMENT,
  `package_Id` smallint(10) unsigned,
  `childPackage_Id` smallint(10) unsigned,
  `type` varchar(20),
  `item_name` varchar(30) NOT NULL,
  `price` float(10) NOT NULL DEFAULT 0,
  `unit` smallint(5) NOT NULL DEFAULT 0,
  `brand` varchar(20),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


/* 创建用户invoice */
DROP TABLE IF EXISTS `littleAnt_user_invoice`;

CREATE TABLE `littleAnt_user_invoice` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `invoice_type` varchar(20),
  `total` float(10) NOT NULL DEFAULT 0,
  `user_sotrageNm` varchar(5) NOT NULL,
  `tracking_number` text,
  `memo` text,
  `created_at` date,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/* 创建charge rate table*/
DROP TABLE IF EXISTS `littleAnt_rate_table`;

CREATE TABLE `littleAnt_rate_table` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `alias` text,
  `classA_rate` float(10) NOT NULL DEFAULT 0,
  `classB_rate` float(10) NOT NULL DEFAULT 0,
  `classC_rate` float(10) NOT NULL DEFAULT 0,
  `classD_rate` float(10) NOT NULL DEFAULT 0,
  `memo` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

insert into `littleAnt_rate_table`(`alias`,`classA_rate`,`classB_rate`) values ('默认',3.5,5.5);

/* 创建processing batch table*/
DROP TABLE IF EXISTS `littleAnt_mailbag`;

CREATE TABLE `littleAnt_mailbag` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` text,
  `amount` smallint NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL,
  `vendor` varchar(20),
  `created_at` datetime,
  `sendOut_at` datetime,
  `flyToChina_at` datetime,
  `beginCustomerClear_at` datetime,
  `customerFinish_at` datetime,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;



