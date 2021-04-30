/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.20 : Database - littleAnt
*********************************************************************
*/


USE `littleAnt`;


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


