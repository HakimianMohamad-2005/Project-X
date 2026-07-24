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
