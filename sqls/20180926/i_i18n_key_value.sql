CREATE TABLE `i_i18n_key_value` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_lang_id` int(11) NOT NULL,
  `pathname` varchar(100) CHARACTER SET utf8 NOT NULL,
  `key` varchar(50) CHARACTER SET utf8 NOT NULL,
  `value` text CHARACTER SET utf8 NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_key` (`key`),
  KEY `idx_url_lang_id` (`url_lang_id`),
  KEY `idx_pathname` (`pathname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;