CREATE DATABASE IF NOT EXISTS `hook_game` DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `hook_game`;

CREATE TABLE IF NOT EXISTS `game_user`(
   `uuid` VARCHAR(100) NOT NULL,
   `session_key` VARCHAR(40) NOT NULL,
   `openid` VARCHAR(40) NOT NULL,
   `name` VARCHAR(40) NOT NULL,
   `avatar` VARCHAR(200),
   `create_time` DATETIME,
   `update_time` DATETIME,
   `gender` INT,
   `province` VARCHAR(40),
   `country` VARCHAR(40),
   `city` VARCHAR(40),
   `language` VARCHAR(40),
   PRIMARY KEY ( `openid` )
) DEFAULT CHARSET=utf8mb4;