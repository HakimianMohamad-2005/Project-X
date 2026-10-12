-- Database Schema for Orangutan Book E-commerce
-- MySQL / phpMyAdmin Compatible for cPanel

CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) NOT NULL UNIQUE,
  `created_at` VARCHAR(50) NOT NULL,
  `final_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` VARCHAR(50) NOT NULL DEFAULT 'ثبت سفارش',
  `payment_method` VARCHAR(50) DEFAULT 'online',
  `tracking_number` VARCHAR(100) DEFAULT '',
  `customer_info` TEXT NOT NULL,
  `items` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `b2b_inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `company_name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `quantity` VARCHAR(100) DEFAULT '',
  `notes` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lead_samples` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `organization` VARCHAR(255) DEFAULT '',
  `position` VARCHAR(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Confidential Visitor Telemetry Logs
CREATE TABLE IF NOT EXISTS `visitor_telemetry` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `visitor_id` VARCHAR(50) NOT NULL,
  `session_id` VARCHAR(50) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_seen_at` DATETIME DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `page_views` INT DEFAULT 1,
  `referrer` VARCHAR(255) DEFAULT '',
  `ip_address` VARCHAR(60) DEFAULT '',
  `city` VARCHAR(100) DEFAULT '',
  `country` VARCHAR(100) DEFAULT '',
  `device_type` VARCHAR(50) DEFAULT '',
  `os_name` VARCHAR(100) DEFAULT '',
  `browser_name` VARCHAR(100) DEFAULT '',
  `gpu_renderer` VARCHAR(255) DEFAULT '',
  `cpu_cores` INT DEFAULT 4,
  `ram_gb` INT DEFAULT NULL,
  `battery_level` INT DEFAULT NULL,
  `network_type` VARCHAR(50) DEFAULT '',
  `screen_resolution` VARCHAR(50) DEFAULT '',
  `current_path` VARCHAR(255) DEFAULT '/',
  `duration_seconds` INT DEFAULT 0,
  `raw_telemetry_json` LONGTEXT,
  INDEX `idx_vid` (`visitor_id`),
  INDEX `idx_sid` (`session_id`),
  INDEX `idx_created` (`created_at`),
  INDEX `idx_last_seen` (`last_seen_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per section opened during a visit (for "most visited sections")
CREATE TABLE IF NOT EXISTS `visitor_pageviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `visitor_id` VARCHAR(50) NOT NULL,
  `session_id` VARCHAR(50) NOT NULL,
  `path` VARCHAR(255) DEFAULT '/',
  `section` VARCHAR(60) DEFAULT '',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pv_created` (`created_at`),
  INDEX `idx_pv_section` (`section`),
  INDEX `idx_pv_sid` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
