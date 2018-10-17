CREATE TABLE `i_i18n_url_lang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hostname` varchar(100) CHARACTER SET utf8 NOT NULL,
  `pathname` varchar(100) CHARACTER SET utf8 NOT NULL,
  `lang_id` int(11) NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_lang_id` (`lang_id`),
  KEY `idx_hostname` (`hostname`),
  KEY `idx_pathname` (`pathname`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;