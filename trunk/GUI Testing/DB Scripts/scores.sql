CREATE TABLE `scores` (
   `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   `name` varchar(15) NOT NULL DEFAULT 'anonymous',
   `score` int(10) UNSIGNED NOT NULL DEFAULT '0'
)