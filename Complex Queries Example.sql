--TABLE INSERTIONS

UPDATE `tb_products` SET `item_id` = "5a57caXXXXXXX3efe" ,`item_name`= "Snacks"

And updation in `tb_users_setup` put OpenAuthKey


--TABLE ALTERATIONS 

ALTER TABLE `tb_products` ADD `item_id` MEDIUMTEXT NULL DEFAULT NULL AFTER `market_user_id`, ADD `item_name` MEDIUMTEXT NULL DEFAULT NULL AFTER `item_id`;

ALTER TABLE `tb_users` ADD `merchant_id_df` VARCHAR(100) NULL DEFAULT NULL AFTER `user_view`, ADD FULLTEXT `merchant_id_df` (`merchant_id`(27));


ALTER TABLE `tb_users_setup` ADD `shared_secret` MEDIUMTEXT NULL DEFAULT NULL AFTER `task_tagging`, ADD `pickup_time` INT NOT NULL DEFAULT '0' AFTER `shared_secret`;


ALTER TABLE `tb_jobs` ADD `city` MEDIUMTEXT NULL DEFAULT NULL AFTER `is_deleted`, ADD `state` MEDIUMTEXT NULL DEFAULT NULL AFTER `city`, ADD `zip_code` TINYTEXT NULL DEFAULT NULL AFTER `state`;
