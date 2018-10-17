CREATE TABLE `i_passport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `access_token` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `expire_at` timestamp NULL DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_userid` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
