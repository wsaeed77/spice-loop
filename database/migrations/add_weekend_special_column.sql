-- SQL script to add is_weekend_special column to menu_items table
-- Run this in phpMyAdmin or MySQL command line

ALTER TABLE `menu_items` 
ADD COLUMN `is_weekend_special` TINYINT(1) NOT NULL DEFAULT 0 
AFTER `is_featured`;

