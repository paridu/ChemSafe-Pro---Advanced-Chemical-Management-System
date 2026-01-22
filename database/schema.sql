
-- ChemSafe Pro - Advanced Chemical Management System
-- Full System Schema: Supporting AI Logistics, RAG, Procurement, and PPE Lifecycle
-- Standard: MySQL 8.0+ / MariaDB 10.4+

CREATE DATABASE IF NOT EXISTS chemsafe_db;
USE chemsafe_db;

-- =====================================================
-- 1. CORE SYSTEM & USER MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` ENUM('Admin', 'Safety Officer', 'Staff') NOT NULL DEFAULT 'Staff',
  `department` VARCHAR(100) NOT NULL,
  `avatar_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 2. PPE MANAGEMENT & TRANSACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS `ppe_items` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('Mask', 'Gloves', 'Goggles', 'Suit', 'Boots', 'Ear Protection', 'Helmet', 'Apron') NOT NULL,
  `icon` VARCHAR(50) NOT NULL, 
  `description` TEXT NULL,
  `stock_level` INT DEFAULT 0,
  `min_stock_threshold` INT DEFAULT 10,
  `unit` VARCHAR(20) DEFAULT 'Units',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `ppe_transactions` (
  `id` VARCHAR(50) NOT NULL,
  `ppe_id` VARCHAR(50) NOT NULL,
  `transaction_type` ENUM('Restock', 'Withdrawal') NOT NULL,
  `quantity` INT NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `notes` TEXT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ppe_id`) REFERENCES `ppe_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 3. STORAGE & SPATIAL MAPPING
-- =====================================================

CREATE TABLE IF NOT EXISTS `storage_locations` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `area` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `capacity` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Normal', 'Full', 'Warning') NOT NULL DEFAULT 'Normal',
  `responsible_person_name` VARCHAR(100) NULL,
  `photo_base64` LONGTEXT NULL,
  -- Spatial / Map Positioning
  `map_x` INT DEFAULT 0,
  `map_y` INT DEFAULT 0,
  `lat` DECIMAL(10, 8) NULL,
  `lng` DECIMAL(11, 8) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `storage_required_ppe` (
  `storage_id` VARCHAR(50) NOT NULL,
  `ppe_id` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`storage_id`, `ppe_id`),
  FOREIGN KEY (`storage_id`) REFERENCES `storage_locations` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`ppe_id`) REFERENCES `ppe_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 4. CHEMICAL INVENTORY & COMPLIANCE
-- =====================================================

CREATE TABLE IF NOT EXISTS `chemicals` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `cas_number` VARCHAR(50) NOT NULL,
  `location_detail` VARCHAR(100) NOT NULL, -- Rack/Shelf specific
  `storage_id` VARCHAR(50) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `unit` VARCHAR(20) NOT NULL,
  `expiry_date` DATE NOT NULL,
  `responsible_person` VARCHAR(100) NOT NULL,
  `revision_date` DATE NOT NULL,
  `retention_years` INT DEFAULT 5,
  `sds_available` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`storage_id`) REFERENCES `storage_locations` (`id`),
  INDEX `idx_cas` (`cas_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `chemical_hazards` (
  `chemical_id` VARCHAR(50) NOT NULL,
  `hazard_class` ENUM('Flammable', 'Corrosive', 'Toxic', 'Oxidizer', 'Explosive', 'Environmental Hazard', 'Health Hazard', 'None') NOT NULL,
  PRIMARY KEY (`chemical_id`, `hazard_class`),
  FOREIGN KEY (`chemical_id`) REFERENCES `chemicals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `sds_documents` (
  `id` VARCHAR(50) NOT NULL,
  `chemical_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `version` VARCHAR(20) DEFAULT 'v1.0',
  `last_updated` DATE NOT NULL,
  `file_size` VARCHAR(20) NULL,
  `standard` ENUM('GHS', 'OSHA', 'EU') DEFAULT 'GHS',
  `file_data` LONGTEXT NULL, -- Base64 encoded PDF
  PRIMARY KEY (`id`),
  FOREIGN KEY (`chemical_id`) REFERENCES `chemicals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 5. OPERATIONS: PROCUREMENT, WASTE & INCIDENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS `purchase_requests` (
  `id` VARCHAR(50) NOT NULL,
  `chemical_name` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `requester_name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected', 'Ordered') NOT NULL DEFAULT 'Pending',
  `request_date` DATE NOT NULL,
  `approved_by` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `waste_logs` (
  `id` VARCHAR(50) NOT NULL,
  `chemical_name` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `generator` VARCHAR(100) NOT NULL,
  `generation_date` DATE NOT NULL,
  `disposal_method` VARCHAR(100) NOT NULL,
  `status` ENUM('Storage', 'Transport', 'Disposed') NOT NULL DEFAULT 'Storage',
  `manifest_number` VARCHAR(100) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `incident_reports` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `location` VARCHAR(100) NOT NULL,
  `severity` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
  `status` ENUM('Open', 'Investigating', 'Closed') NOT NULL DEFAULT 'Open',
  `description` TEXT NOT NULL,
  `reporter` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 6. AI LOGISTICS & VECTOR INFRASTRUCTURE
-- =====================================================

CREATE TABLE IF NOT EXISTS `ai_providers` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `provider_type` ENUM('Cloud', 'Local', 'Hybrid') NOT NULL,
  `endpoint` VARCHAR(255) NOT NULL,
  `api_key` VARCHAR(255) NULL,
  `model_name` VARCHAR(100) NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `vector_stores` (
  `id` VARCHAR(50) NOT NULL,
  `provider_name` ENUM('Chroma', 'Pinecone', 'Milvus', 'Memory') NOT NULL,
  `index_name` VARCHAR(100) NOT NULL,
  `dimension` INT NOT NULL DEFAULT 768,
  `status` ENUM('Connected', 'Disconnected') DEFAULT 'Connected',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `knowledge_documents` (
  `id` VARCHAR(50) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `vector_count` INT DEFAULT 0,
  `status` ENUM('Pending', 'Processing', 'Indexed', 'Error') DEFAULT 'Indexed',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 7. SYSTEM AUDIT & NEWS
-- =====================================================

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(50) NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `user_id` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `action` VARCHAR(100) NOT NULL, -- e.g. MOVE_STOCK, APPROVE_PURCHASE
  `details` TEXT NOT NULL,
  `severity` ENUM('info', 'warning', 'critical') DEFAULT 'info',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `news_items` (
  `id` VARCHAR(50) NOT NULL,
  `text` TEXT NOT NULL,
  `type` ENUM('Breaking', 'General', 'Alert') NOT NULL,
  `position` ENUM('Top', 'Bottom') NOT NULL DEFAULT 'Top',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `speed` ENUM('Slow', 'Medium', 'Fast') NOT NULL DEFAULT 'Medium',
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- SEED DATA
-- =====================================================

INSERT INTO `users` (`id`, `name`, `email`, `role`, `department`) VALUES
('U-001', 'Jane Doe', 'jane@chemsafe.com', 'Safety Officer', 'Safety Dept'),
('U-002', 'Admin User', 'admin@chemsafe.com', 'Admin', 'IT Operations');

INSERT INTO `ppe_items` (`id`, `name`, `type`, `icon`, `description`, `stock_level`, `min_stock_threshold`) VALUES
('PPE-001', 'N95 Respirator', 'Mask', 'fa-mask-face', 'Standard particulate protection.', 500, 100),
('PPE-002', 'Nitrile Gloves', 'Gloves', 'fa-hands-clapping', 'Chemical resistant.', 1200, 200);

INSERT INTO `storage_locations` (`id`, `name`, `area`, `capacity`, `map_x`, `map_y`, `lat`, `lng`) VALUES
('STR-B4', 'Warehouse B4', 'Logistics North', 5000.00, 150, 200, 13.756300, 100.501800);

INSERT INTO `chemicals` (`id`, `name`, `cas_number`, `location_detail`, `storage_id`, `quantity`, `unit`, `expiry_date`, `responsible_person`, `revision_date`) VALUES
('C0028/2025', 'Ethanol 95%', '64-17-5', '#B4L1_SHELF1', 'STR-B4', 50.00, 'Liters', '2026-05-12', 'Somchai P.', '2024-01-10');

INSERT INTO `chemical_hazards` (`chemical_id`, `hazard_class`) VALUES
('C0028/2025', 'Flammable'), ('C0028/2025', 'Health Hazard');

INSERT INTO `news_items` (`id`, `text`, `type`, `start_date`, `end_date`, `speed`) VALUES
('NW-001', 'BREAKING: Global Safety Standards Updated for ISO 14001:2025.', 'Breaking', '2024-01-01', '2026-12-31', 'Fast');
