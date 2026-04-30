-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mer. 29 avr. 2026 à 12:39
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `atoum_ra`
--

-- --------------------------------------------------------

--
-- Structure de la table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `log_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) UNSIGNED DEFAULT NULL,
  `causer_type` varchar(255) DEFAULT NULL,
  `causer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `batch_uuid` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `activity_log`
--

INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES
(1, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 1, NULL, NULL, '{\"attributes\":{\"id\":1,\"first_name\":\"Admin\",\"last_name\":\"User\",\"email\":\"admin@example.com\",\"phone\":null,\"role\":\"admin\",\"is_locked\":false}}', NULL, '2026-02-26 09:54:00', '2026-02-26 09:54:00'),
(2, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 2, NULL, NULL, '{\"attributes\":{\"id\":2,\"first_name\":\"Gestionnaire\",\"last_name\":\"User\",\"email\":\"gestionnaire@example.com\",\"phone\":null,\"role\":\"gestionnaire\",\"is_locked\":false}}', NULL, '2026-02-26 09:54:00', '2026-02-26 09:54:00'),
(3, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 3, NULL, NULL, '{\"attributes\":{\"id\":3,\"first_name\":\"Client\",\"last_name\":\"User\",\"email\":\"client@example.com\",\"phone\":null,\"role\":\"client\",\"is_locked\":false}}', NULL, '2026-02-26 09:54:01', '2026-02-26 09:54:01'),
(4, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 4, 'App\\Modules\\Auth\\Models\\User', 2, '{\"attributes\":{\"id\":4,\"first_name\":\"Christian MPONDO EPO\",\"last_name\":\"MPONDO EPO\",\"email\":\"mcsoltice@gmail.com\",\"phone\":\"696063115\",\"role\":\"gestionnaire\",\"is_locked\":false}}', NULL, '2026-02-26 22:32:38', '2026-02-26 22:32:38'),
(5, 'user', 'User : événement updated', 'App\\Modules\\Auth\\Models\\User', 'updated', 2, 'App\\Modules\\Auth\\Models\\User', 2, '{\"attributes\":{\"phone\":\"35382008818626\"},\"old\":{\"phone\":null}}', NULL, '2026-02-27 00:19:46', '2026-02-27 00:19:46'),
(6, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 5, NULL, NULL, '{\"attributes\":{\"id\":5,\"first_name\":\"Taylor\",\"last_name\":\"Ryan\",\"email\":\"sethryan707@gmail.com\",\"phone\":\"657140688\",\"role\":\"client\",\"is_locked\":false}}', NULL, '2026-03-06 00:08:21', '2026-03-06 00:08:21'),
(7, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 6, NULL, NULL, '{\"attributes\":{\"id\":6,\"first_name\":\"Nyambang\",\"last_name\":\"Tresor\",\"email\":\"nyambangetresor@gmail.com\",\"phone\":\"+237656249695\",\"role\":\"client\",\"is_locked\":false}}', NULL, '2026-03-06 00:08:40', '2026-03-06 00:08:40'),
(8, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 7, 'App\\Modules\\Auth\\Models\\User', 1, '{\"attributes\":{\"id\":7,\"first_name\":\"Christian\",\"last_name\":\"MPONDO EPO\",\"email\":\"mpchristian703@gmail.com\",\"phone\":\"298603\",\"role\":\"gestionnaire\",\"is_locked\":false}}', NULL, '2026-03-09 10:24:07', '2026-03-09 10:24:07'),
(9, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 8, NULL, NULL, '{\"attributes\":{\"id\":8,\"first_name\":\"Mc\",\"last_name\":\"Soltice\",\"email\":\"mcsoltice@gmail.com\",\"phone\":null,\"role\":\"client\",\"is_locked\":false}}', NULL, '2026-04-09 14:22:07', '2026-04-09 14:22:07'),
(10, 'user', 'User : événement updated', 'App\\Modules\\Auth\\Models\\User', 'updated', 8, NULL, NULL, '{\"attributes\":{\"is_locked\":false},\"old\":{\"is_locked\":null}}', NULL, '2026-04-09 14:22:07', '2026-04-09 14:22:07'),
(11, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 9, NULL, NULL, '{\"attributes\":{\"id\":9,\"first_name\":\"Mc\",\"last_name\":\"Soltice\",\"email\":\"mcsoltice@gmail.com\",\"phone\":null,\"role\":\"client\",\"is_locked\":false}}', NULL, '2026-04-09 14:27:16', '2026-04-09 14:27:16'),
(12, 'user', 'User : événement updated', 'App\\Modules\\Auth\\Models\\User', 'updated', 9, NULL, NULL, '{\"attributes\":{\"is_locked\":false},\"old\":{\"is_locked\":null}}', NULL, '2026-04-09 14:27:16', '2026-04-09 14:27:16'),
(13, 'user', 'User : événement created', 'App\\Modules\\Auth\\Models\\User', 'created', 10, NULL, NULL, '{\"attributes\":{\"id\":10,\"first_name\":\"Mc\",\"last_name\":\"Soltice\",\"email\":\"mcsoltice@gmail.com\",\"phone\":null,\"role\":\"client\",\"is_locked\":false}}', NULL, '2026-04-09 14:45:50', '2026-04-09 14:45:50'),
(14, 'user', 'User : événement updated', 'App\\Modules\\Auth\\Models\\User', 'updated', 10, NULL, NULL, '{\"attributes\":{\"is_locked\":false},\"old\":{\"is_locked\":null}}', NULL, '2026-04-09 14:45:50', '2026-04-09 14:45:50'),
(15, 'user', 'User : événement updated', 'App\\Modules\\Auth\\Models\\User', 'updated', 1, 'App\\Modules\\Auth\\Models\\User', 1, '{\"attributes\":{\"phone\":\"696063115\"},\"old\":{\"phone\":null}}', NULL, '2026-04-10 07:59:10', '2026-04-10 07:59:10'),
(16, 'user', 'User : événement updated', 'App\\Modules\\Auth\\Models\\User', 'updated', 10, 'App\\Modules\\Auth\\Models\\User', 10, '{\"attributes\":{\"phone\":\"6960631155\"},\"old\":{\"phone\":null}}', NULL, '2026-04-10 08:08:59', '2026-04-10 08:08:59'),
(17, 'user', 'User : événement updated', 'App\\Modules\\Auth\\Models\\User', 'updated', 10, 'App\\Modules\\Auth\\Models\\User', 10, '{\"attributes\":{\"phone\":\"69606311555\"},\"old\":{\"phone\":\"6960631155\"}}', NULL, '2026-04-10 09:10:08', '2026-04-10 09:10:08');

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Tisanes & Infusions', 'Thés, tisanes et infusions de plantes biologiques pour le bien-être et la santé.', NULL, '2026-02-17 08:00:37', '2026-02-17 08:00:37'),
(2, 'Encens & Résines', 'Encens, résines et bois (encens, myrrhe, santal, palo santo) pour les rituels et la purification.', NULL, '2026-02-17 08:00:37', '2026-02-17 08:00:37'),
(3, 'Élixirs & Sirops', 'Préparations liquides concentrées, élixirs et sirops à base de plantes.', NULL, '2026-02-17 08:00:37', '2026-02-17 08:00:37'),
(4, 'Plantes & Poudres', 'Plantes séchées, poudres (guarana, acérola, gingembre) et ingrédients bruts.', NULL, '2026-02-17 08:00:37', '2026-02-17 08:00:37'),
(5, 'Bains Rituels', 'Préparations dédiées aux bains de purification, de désenvoûtement et de bien-être.', NULL, '2026-02-17 08:00:37', '2026-02-17 08:00:37'),
(6, 'Compositions Spécialisées', 'Mélanges complexes de plantes pour des besoins spécifiques (fertilité, etc.).', NULL, '2026-02-17 08:00:37', '2026-02-17 08:00:37'),
(7, 'Alimentation', 'Produits alimentaires naturels comme les miels, le riz et les graines.', NULL, '2026-02-17 08:00:37', '2026-02-17 08:00:37'),
(8, 'Artisanat & Symboles', 'Objets artisanaux, symboles, talismans, bijoux et croix de vie.', NULL, '2026-02-17 08:00:37', '2026-02-17 08:00:37'),
(9, 'Produits Rituels', 'Accessoires et fournitures pour les rituels (bougies, charbon, sels, soufre).', NULL, '2026-02-17 08:00:37', '2026-02-17 08:00:37');

-- --------------------------------------------------------

--
-- Structure de la table `delivery_options`
--

CREATE TABLE `delivery_options` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `delay_days` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `delivery_options`
--

INSERT INTO `delivery_options` (`id`, `name`, `description`, `price`, `delay_days`, `is_active`, `order`, `created_at`, `updated_at`) VALUES
(1, 'Livraison Standard', 'Livraison en 72 heures', 10.00, 2, 1, 1, '2026-02-26 09:54:01', '2026-02-26 09:54:01'),
(2, 'Livraison Express', 'Livraison en 24 heures', 50.00, 1, 1, 2, '2026-02-26 09:54:01', '2026-02-26 09:54:01'),
(3, 'Magasin', 'Retrait en Boutique', 0.00, 0, 1, 3, '2026-02-26 09:54:01', '2026-02-26 09:54:01');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `locked_until` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_01_09_163446_create_personal_access_tokens_table', 1),
(5, '2026_01_09_164320_create_permission_tables', 1),
(6, '2026_01_09_175103_create_activity_log_table', 1),
(7, '2026_01_09_175104_add_event_column_to_activity_log_table', 1),
(8, '2026_01_09_175105_add_batch_uuid_column_to_activity_log_table', 1),
(9, '2026_01_09_194715_login_attemps', 1),
(10, '2026_01_10_170641_create_categories_table', 1),
(11, '2026_01_10_170719_create_products_table', 1),
(12, '2026_02_01_223546_delivery', 1),
(13, '2026_02_02_102904_order', 1),
(14, '2026_02_02_103035_order_items', 1),
(15, '2026_02_05_223912_stock_movements', 1),
(16, '2026_02_08_184058_alter_orders_user_nullable', 1),
(17, '2026_04_04_222934_add_google_id_to_users_table', 2);

-- --------------------------------------------------------

--
-- Structure de la table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `delivery_option_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `total_amount` decimal(12,2) UNSIGNED NOT NULL,
  `currency` char(3) NOT NULL DEFAULT 'EUR',
  `shipping_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shipping_address`)),
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `reference`, `user_id`, `delivery_option_id`, `status`, `payment_method`, `is_paid`, `total_amount`, `currency`, `shipping_address`, `cancelled_at`, `created_at`, `updated_at`) VALUES
('019c9f08-4ec6-72e1-8c49-40ee40133780', 'ORD-2026-00001', NULL, 3, 'cancelled', 'cash_on_delivery', 0, 187.99, '€', '{\"first_name\":\"Christian MPONDO EPO\",\"last_name\":\"MPONDO EPO\",\"email\":\"mcsoltice@gmail.com\",\"phone\":\"+237696063115\",\"address\":\"NYALLA PARISO\"}', '2026-03-08 20:05:56', '2026-02-27 11:17:27', '2026-03-08 20:05:56'),
('019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'ORD-2026-00003', NULL, 3, 'cancelled', 'cash_on_delivery', 0, 410.98, '€', '{\"first_name\":\"Taylor\",\"last_name\":\"Ryan\",\"email\":\"sethryan707@gmail.com\",\"phone\":\"657140688\",\"address\":\"Akwa\"}', '2026-03-08 20:05:30', '2026-03-06 00:11:38', '2026-03-08 20:05:30'),
('019cc0b7-5a30-719e-9040-932283f501a1', 'ORD-2026-00004', NULL, 3, 'cancelled', 'cash_on_delivery', 0, 15.99, '€', '{\"first_name\":\"Nyambang\",\"last_name\":\"Tresor\",\"email\":\"nyambangetresor@gmail.com\",\"phone\":\"+237656249695\",\"address\":\"Situ\\u00e9 \\u00e0 Deido Douala, Cameroun.\"}', '2026-03-08 20:05:23', '2026-03-06 00:16:07', '2026-03-08 20:05:23'),
('019cde8b-9d67-73f0-b0d7-95e5b3f73bcf', 'ORD-2026-00005', NULL, 1, 'pending', 'mobile_money', 0, 70.00, '€', '{\"first_name\":\"lamine\",\"last_name\":\"MPONDO EPO\",\"email\":\"mcsoltice@gmail.com\",\"phone\":\"+237696063115\",\"address\":\"NYALLA PARISO\"}', NULL, '2026-03-11 19:16:57', '2026-03-11 19:16:57'),
('019d6e99-0676-7347-a816-c768b8a9ba0d', 'ORD-2026-00006', NULL, 1, 'pending', 'credit_card', 0, 183.97, '€', '{\"first_name\":\"User1\",\"last_name\":\"user1\",\"email\":\"user1@gmail.com\",\"phone\":\"666666666\",\"address\":\"NYALLA PARISO\"}', NULL, '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
('019d6e9a-3e5c-72b3-90d8-64bb50c230f6', 'ORD-2026-00007', 1, 2, 'pending', 'cash_on_delivery', 0, 144.99, '€', '{\"first_name\":\"Admin\",\"last_name\":\"User\",\"email\":\"admin@example.com\",\"phone\":\"+237696063115\",\"address\":\"NYALLA PARISO\"}', NULL, '2026-04-08 18:38:15', '2026-04-08 18:38:15'),
('019d79b0-be14-703f-9dc2-d66392095a10', 'ORD-2026-00008', 1, 3, 'pending', 'cash_on_delivery', 0, 55.00, '€', '{\"first_name\":\"Admin\",\"last_name\":\"User\",\"email\":\"admin@example.com\",\"phone\":\"696063115\",\"address\":\"NYALLA PARISO\"}', NULL, '2026-04-10 22:18:39', '2026-04-10 22:18:39'),
('019d79b0-e0d8-721b-844f-f75de22c8db3', 'ORD-2026-00009', 1, 3, 'pending', 'cash_on_delivery', 0, 55.00, '€', '{\"first_name\":\"Admin\",\"last_name\":\"User\",\"email\":\"admin@example.com\",\"phone\":\"696063115\",\"address\":\"NYALLA PARISO\"}', NULL, '2026-04-10 22:18:48', '2026-04-10 22:18:48');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `unit_price`, `total_price`, `created_at`, `updated_at`) VALUES
(1, '019c9f08-4ec6-72e1-8c49-40ee40133780', '0564789e-6aa3-41f4-8735-d98baf9b4c07', 'Gingembre biologique en poudre Yawoum village', 1, 12.00, 12.00, '2026-02-27 11:17:27', '2026-02-27 11:17:27'),
(2, '019c9f08-4ec6-72e1-8c49-40ee40133780', 'ab5b069d-c453-47da-86a1-c4b2942383b1', 'Elixir amaigrissant Yawoum Village', 1, 80.00, 80.00, '2026-02-27 11:17:27', '2026-02-27 11:17:27'),
(3, '019c9f08-4ec6-72e1-8c49-40ee40133780', 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', 'Bain de désenvoutement d\'excellence Yawoum Village', 1, 80.00, 80.00, '2026-02-27 11:17:27', '2026-02-27 11:17:27'),
(4, '019c9f08-4ec6-72e1-8c49-40ee40133780', 'f7e0b4da-0b3b-454b-8198-34cc05518ff7', 'Tisane de feuilles d\'Angélique biologique Yawoum village', 1, 15.99, 15.99, '2026-02-27 11:17:27', '2026-02-27 11:17:27'),
(8, '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', 'Bain de désenvoutement d\'excellence Yawoum Village', 4, 80.00, 320.00, '2026-03-06 00:11:38', '2026-03-06 00:11:38'),
(9, '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'be1807a8-6927-4a2b-aa3b-ae486f9d8e1b', 'Tisane de souci officinal biologique Yawoum village', 2, 11.99, 23.98, '2026-03-06 00:11:38', '2026-03-06 00:11:38'),
(10, '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', '0564789e-6aa3-41f4-8735-d98baf9b4c07', 'Gingembre biologique en poudre Yawoum village', 1, 12.00, 12.00, '2026-03-06 00:11:38', '2026-03-06 00:11:38'),
(11, '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', '07e97fa8-8773-4c98-9e85-347a60cb26bd', 'Maison de vie , sirop élixir contre les troubles sexuel de Yawoum village', 1, 55.00, 55.00, '2026-03-06 00:11:38', '2026-03-06 00:11:38'),
(12, '019cc0b7-5a30-719e-9040-932283f501a1', 'f7e0b4da-0b3b-454b-8198-34cc05518ff7', 'Tisane de feuilles d\'Angélique biologique Yawoum village', 1, 15.99, 15.99, '2026-03-06 00:16:07', '2026-03-06 00:16:07'),
(13, '019cde8b-9d67-73f0-b0d7-95e5b3f73bcf', '917af3f5-67c3-4489-bda9-7d3542824c00', 'Tisane détox minceur de Yawoum Village', 1, 60.00, 60.00, '2026-03-11 19:16:57', '2026-03-11 19:16:57'),
(14, '019d6e99-0676-7347-a816-c768b8a9ba0d', '0fee0ec3-b92e-453b-8f25-03121994c49b', 'Infusion de racines de pissenlit biologique yawoum village', 2, 18.00, 36.00, '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(15, '019d6e99-0676-7347-a816-c768b8a9ba0d', 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', 'Bain de désenvoutement d\'excellence Yawoum Village', 1, 80.00, 80.00, '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(16, '019d6e99-0676-7347-a816-c768b8a9ba0d', 'eccbf4ec-f120-488a-b973-e5078462364a', 'Bois de santal biologique Yawoum village', 1, 29.99, 29.99, '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(17, '019d6e99-0676-7347-a816-c768b8a9ba0d', 'ed4e5093-1151-4849-af0f-fe2a0f7e4a90', 'Infusion de thym biologique Yawoum village', 1, 15.99, 15.99, '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(18, '019d6e99-0676-7347-a816-c768b8a9ba0d', 'be1807a8-6927-4a2b-aa3b-ae486f9d8e1b', 'Tisane de souci officinal biologique Yawoum village', 1, 11.99, 11.99, '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(19, '019d6e9a-3e5c-72b3-90d8-64bb50c230f6', '0564789e-6aa3-41f4-8735-d98baf9b4c07', 'Gingembre biologique en poudre Yawoum village', 1, 12.00, 12.00, '2026-04-08 18:38:15', '2026-04-08 18:38:15'),
(20, '019d6e9a-3e5c-72b3-90d8-64bb50c230f6', '0fee0ec3-b92e-453b-8f25-03121994c49b', 'Infusion de racines de pissenlit biologique yawoum village', 1, 18.00, 18.00, '2026-04-08 18:38:15', '2026-04-08 18:38:15'),
(21, '019d6e9a-3e5c-72b3-90d8-64bb50c230f6', '4e9dc16c-8c1b-4b7c-8c81-dcd9abceb794', 'Tisane de feuilles d\'artichaut biologique Yawoum village', 1, 4.99, 4.99, '2026-04-08 18:38:15', '2026-04-08 18:38:15'),
(22, '019d6e9a-3e5c-72b3-90d8-64bb50c230f6', '917af3f5-67c3-4489-bda9-7d3542824c00', 'Tisane détox minceur de Yawoum Village', 1, 60.00, 60.00, '2026-04-08 18:38:15', '2026-04-08 18:38:15'),
(23, '019d79b0-be14-703f-9dc2-d66392095a10', '11033c83-5cd5-4c89-9b53-2d76d6430181', 'Elixir bien-être', 1, 55.00, 55.00, '2026-04-10 22:18:39', '2026-04-10 22:18:39'),
(24, '019d79b0-e0d8-721b-844f-f75de22c8db3', '11033c83-5cd5-4c89-9b53-2d76d6430181', 'Elixir bien-être', 1, 55.00, 55.00, '2026-04-10 22:18:48', '2026-04-10 22:18:48');

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(5, 'App\\Modules\\Auth\\Models\\User', 4, 'auth_token', '472a81a172a68a7e6cbd4ac38bdab61cb692654e64671b36fcb4fe57d1e7d981', '{\"0\":\"user.view\",\"1\":\"user.create\",\"2\":\"user.update\",\"4\":\"product.view\",\"5\":\"product.create\",\"6\":\"product.update\",\"8\":\"category.view\",\"9\":\"category.create\",\"10\":\"category.update\",\"12\":\"delivery.view\",\"13\":\"delivery.create\",\"14\":\"delivery.update\",\"16\":\"order.view\",\"17\":\"order.create\",\"18\":\"order.update\"}', NULL, NULL, '2026-02-26 22:32:38', '2026-02-26 22:32:38'),
(6, 'App\\Modules\\Auth\\Models\\User', 4, 'auth_token', '530fd6d4774fdaa96987674e9d0df21a0c42433aa0a172f3abeab358834514dc', '{\"0\":\"user.view\",\"1\":\"user.create\",\"2\":\"user.update\",\"4\":\"product.view\",\"5\":\"product.create\",\"6\":\"product.update\",\"8\":\"category.view\",\"9\":\"category.create\",\"10\":\"category.update\",\"12\":\"delivery.view\",\"13\":\"delivery.create\",\"14\":\"delivery.update\",\"16\":\"order.view\",\"17\":\"order.create\",\"18\":\"order.update\"}', '2026-03-03 11:58:19', NULL, '2026-03-03 11:52:02', '2026-03-03 11:58:19'),
(7, 'App\\Modules\\Auth\\Models\\User', 4, 'auth_token', '13247a41ae520b9f3c3489ae1f9282dc827898bd3567c0f3406eb0b4f60b5a98', '{\"0\":\"user.view\",\"1\":\"user.create\",\"2\":\"user.update\",\"4\":\"product.view\",\"5\":\"product.create\",\"6\":\"product.update\",\"8\":\"category.view\",\"9\":\"category.create\",\"10\":\"category.update\",\"12\":\"delivery.view\",\"13\":\"delivery.create\",\"14\":\"delivery.update\",\"16\":\"order.view\",\"17\":\"order.create\",\"18\":\"order.update\"}', '2026-03-04 14:49:35', NULL, '2026-03-03 12:06:33', '2026-03-04 14:49:35'),
(8, 'App\\Modules\\Auth\\Models\\User', 5, 'auth_token', '4abf7460f33a6886e8a7f965f45a3247813ea4fb631926975f0afdf45af0df02', '{\"0\":\"user.view\",\"1\":\"user.create\",\"4\":\"product.view\",\"5\":\"product.create\",\"8\":\"category.view\",\"9\":\"category.create\",\"12\":\"delivery.view\",\"13\":\"delivery.create\",\"16\":\"order.view\",\"17\":\"order.create\"}', NULL, NULL, '2026-03-06 00:08:21', '2026-03-06 00:08:21'),
(9, 'App\\Modules\\Auth\\Models\\User', 6, 'auth_token', 'b5cbf777a6f259d8316e23b31395a132256bb8d285ec141dbfcaf9ce61025f22', '{\"0\":\"user.view\",\"1\":\"user.create\",\"4\":\"product.view\",\"5\":\"product.create\",\"8\":\"category.view\",\"9\":\"category.create\",\"12\":\"delivery.view\",\"13\":\"delivery.create\",\"16\":\"order.view\",\"17\":\"order.create\"}', NULL, NULL, '2026-03-06 00:08:40', '2026-03-06 00:08:40'),
(10, 'App\\Modules\\Auth\\Models\\User', 4, 'auth_token', 'd78577daf31c37ae26ef5bff5e35c13240b3536156810803f046e76e416893c7', '{\"0\":\"user.view\",\"1\":\"user.create\",\"2\":\"user.update\",\"4\":\"product.view\",\"5\":\"product.create\",\"6\":\"product.update\",\"8\":\"category.view\",\"9\":\"category.create\",\"10\":\"category.update\",\"12\":\"delivery.view\",\"13\":\"delivery.create\",\"14\":\"delivery.update\",\"16\":\"order.view\",\"17\":\"order.create\",\"18\":\"order.update\"}', '2026-03-06 07:26:29', NULL, '2026-03-06 00:17:09', '2026-03-06 07:26:29'),
(11, 'App\\Modules\\Auth\\Models\\User', 6, 'auth_token', 'd481756b86bd2cd2185588cce7d00d59ee37927a547e77b401c113ecec0114bc', '{\"0\":\"user.view\",\"1\":\"user.create\",\"4\":\"product.view\",\"5\":\"product.create\",\"8\":\"category.view\",\"9\":\"category.create\",\"12\":\"delivery.view\",\"13\":\"delivery.create\",\"16\":\"order.view\",\"17\":\"order.create\"}', NULL, NULL, '2026-03-06 00:28:13', '2026-03-06 00:28:13'),
(39, 'App\\Modules\\Auth\\Models\\User', 1, 'auth_token', '484daeece31f3826e2ac49503d954d274af4f345f20b6fe1ec53255a1a184b8f', '[\"user.view\",\"user.create\",\"user.update\",\"user.delete\",\"product.view\",\"product.create\",\"product.update\",\"product.delete\",\"category.view\",\"category.create\",\"category.update\",\"category.delete\",\"delivery.view\",\"delivery.create\",\"delivery.update\",\"delivery.delete\",\"order.view\",\"order.create\",\"order.update\",\"order.delete\"]', '2026-04-10 22:18:48', NULL, '2026-04-10 22:17:08', '2026-04-10 22:18:48'),
(41, 'App\\Modules\\Auth\\Models\\User', 1, 'auth_token', '58a6f7ad5823f1e6dba6c10feecdb8ad4822fadaff41deff4a0980aab7af08eb', '[\"user.view\",\"user.create\",\"user.update\",\"user.delete\",\"product.view\",\"product.create\",\"product.update\",\"product.delete\",\"category.view\",\"category.create\",\"category.update\",\"category.delete\",\"delivery.view\",\"delivery.create\",\"delivery.update\",\"delivery.delete\",\"order.view\",\"order.create\",\"order.update\",\"order.delete\"]', '2026-04-26 08:24:19', NULL, '2026-04-26 08:24:10', '2026-04-26 08:24:19'),
(42, 'App\\Modules\\Auth\\Models\\User', 1, 'auth_token', 'db1b360cfc8d0a62811597af401c7c6da6d968880faf896ccf40ef58fcb9450b', '[\"user.view\",\"user.create\",\"user.update\",\"user.delete\",\"product.view\",\"product.create\",\"product.update\",\"product.delete\",\"category.view\",\"category.create\",\"category.update\",\"category.delete\",\"delivery.view\",\"delivery.create\",\"delivery.update\",\"delivery.delete\",\"order.view\",\"order.create\",\"order.update\",\"order.delete\"]', '2026-04-28 19:37:38', NULL, '2026-04-28 19:37:35', '2026-04-28 19:37:38');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ingredients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ingredients`)),
  `usage_instructions` varchar(255) DEFAULT NULL,
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  `stock` int(11) NOT NULL DEFAULT 0,
  `is_promotional` tinyint(1) NOT NULL DEFAULT 0,
  `promo_end_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `price`, `original_price`, `main_image`, `description`, `ingredients`, `usage_instructions`, `benefits`, `stock`, `is_promotional`, `promo_end_date`, `created_at`, `updated_at`, `deleted_at`) VALUES
('0564789e-6aa3-41f4-8735-d98baf9b4c07', 'Gingembre biologique en poudre Yawoum village', 7, 12.00, 13.99, 'products/gingembre-biologique-en-poudre-yawoum-village-05647/main/k0I8T7TfPyIrcb3NUmzuEQDKyDe0mjPvMspVTdPd.png', 'S\'il est réputé pour ses vertus sur la libido, il est aussi antibactérien, anti-nauséeux, antioxydant, antidouleur, anti-inflammatoire et antidiabétique.\r\nIl agit sur la digestion en l\'améliorant et sur notre système immunitaire, en le renforçant.\r\ngrâce à son effet brûle-graisse, il est parfait pour garder la ligne et avoir (ou retrouver) un ventre plat !', '[\"Gingembre naturel\"]', 'Faites chauffer 1 l d\'eau, mélangez ensuite 2 cuillères à café de gingembre en poudre . laisser infuser  puis boire.\r\n3 tasses maximum par jour sois au fin des repas.', NULL, 99, 1, '2026-02-26 23:00:00', '2026-02-18 15:31:27', '2026-04-08 18:38:15', NULL),
('07d111b6-926a-4349-98a3-a5c0e8132d80', 'Bois bandé en poudre biologique Yawoum village', 4, 29.99, 29.99, 'products/bois-bande-en-poudre-biologique-yawoum-village-07d11/main/zUAOrwfY5S6enKSRqM8yjrRK0GXI3FYxg3FvJaBk.png', 'Stimulant général qui permet de lutter contre la fatigue et de retrouver la vitalité nécessaire à une libido épanouie. Le bois bandé aurait une action contre le stress et l\'anxiété, deux grands obstacles aux rapports intimes réussis.\r\nLe bois bandé est très efficace et agit rapidement. Il est indiqué pour traiter l\'impuissance chez l\'homme, et la frigidité chez la femme.\r\nLa présence de yohimbine, un principe actif aux propriétés vasodilatatrices, facilite l\'afflux sanguin, donc l\'érection.', NULL, 'Macérer 5g de poudre dans 1L d\'eau froide 8h, bouillir 20 min, filtrer. Boire 1 verre matin et soir max 2 semaines, conservation au frigo possible.', '[\"diminue la tension art\\u00e9rielle\",\"am\\u00e9liore la m\\u00e9moire\",\"pr\\u00e9vient l\'apparition d\'ulc\\u00e8res\",\"soulage la douleur musculaire\",\"r\\u00e9duit la fatigue et le stress\",\"soulage les rhumatismes\"]', 100, 1, '2026-03-11 23:00:00', '2026-02-17 21:14:45', '2026-03-09 11:27:03', NULL),
('07e97fa8-8773-4c98-9e85-347a60cb26bd', 'Maison de vie , sirop élixir contre les troubles sexuel de Yawoum village', 3, 50.00, 55.00, 'products/maison-de-vie-sirop-elixir-contre-les-troubles-sexuel-de-yawoum-village-07e97/main/ljbnaGHzh5iPmF0vpgEG0UjN1sOLfr4qlTbMSIWY.png', 'Deficience sexuelle se traduit par la manifestation d’une certaine difficulté à vivre pleinement sa vie sexuelle et conduit généralement à des troubles de l’érection, une perte de tonus ou une diminution du désir ( perte de libido )\r\nL’augmentation de cette fameuse déficience sexuelle provient très probablement du fait que les hommes en parlent plus à leurs médecins, contrairement à il y a quelques années. Touchant essentiellement les hommes de plus de quarante ans, cette fatigue a des causes physiologiques (par exemple, l’affectation des organes génitaux ou du système urinaire) ou psychologiques (craintes, angoisses ou perte de confiance). Mais l’ennemi numéro 1 reste le stress ! C’est pour cette raison qu’une bonne hygiène de vie est très conseillée : pas d’excès d’alcool et de tabac, alimentation équilibrée…', NULL, 'Sirop à bases de plantes biologiques.\r\nTraitement composé par Atoum Râ Mbianga Phytothérapeute clinicienne herboriste experte .', NULL, 100, 1, '2026-03-12 23:00:00', '2026-02-17 20:00:01', '2026-03-09 11:27:40', NULL),
('0fee0ec3-b92e-453b-8f25-03121994c49b', 'Infusion de racines de pissenlit biologique yawoum village', 1, 18.00, 20.99, 'products/infusion-de-racines-de-pissenlit-biologique-yawoum-village-0fee0/main/qPTj3EZXoyUOSMNDEto9aUQr7wEnDc0guf7UDEBT.png', 'Excellent pour le système digestif : il aide à guérir les troubles mineurs de la digestion, tels que les ballonnements et la constipation.\r\nSert également à éliminer les toxines du foie et de la vésicule biliaire.\r\nle pissenlit a  \"un grand potentiel comme alternative efficace à la chimiothérapie\". Les études in vitro ont démontré l\'efficacité de la plante pour lutter contre les cellules cancéreuses pancréatiques et les cellules cancéreuses du côlon\"', NULL, 'Faire bouillir 1 cuillère à café de racine coupée en petits morceaux pendant 5 minutes dans 1 tasse d\'eau ; à boire avant les repas, 2 à 3 fois par jour.', NULL, 97, 1, '2026-03-11 23:00:00', '2026-02-20 13:00:20', '2026-04-08 18:38:15', NULL),
('11033c83-5cd5-4c89-9b53-2d76d6430181', 'Elixir bien-être', 3, 55.00, NULL, 'products/elixir-bien-etre-peau-eclatante-detox-yawoum-village-11033/main/1cvxU0KvPmER6gnsbECeFtwjtLEkSjMRWrugieOL.png', 'Traitement par Atoum ~Râ Mbianga Phytothérapeute clinicienne herboriste.\r\nContribue à maintenir votre peau dans une bonne santé vitale.', NULL, '1  cuillère à soupe dans 50cl d’eau bouillir 5 min boire chaud 2 fois par jour.', '[\"Pr\\u00e9serve\",\"purifie.  Regain d\'\\u00e9nergie\",\"meilleure qualit\\u00e9 de sommeil\",\"diminution du stress. Tout fonctionnera mieux \\u00e0 l\'int\\u00e9rieur\",\"et cela aura des effets visibles \\u00e0 l\'ext\\u00e9rieur : teint plus lumineux\",\"cheveux et ongles renforc\\u00e9s.\"]', 98, 0, NULL, '2026-02-17 06:27:09', '2026-04-10 22:18:48', NULL),
('1aca3c5c-a6c8-4417-b863-75e38b1cd2f7', 'Résine ritualiste de storax biologique Yawoum village', 1, 10.00, 12.99, 'products/resine-ritualiste-de-storax-biologique-yawoum-village-1aca3/main/3YlRB2T7D4pePcCoqo8wFYaBVd9ZSiWKjYClzlTt.png', 'La Résine Storax apporte un parfum floral et résineux, aux notes d\'amande, luttant contre les énergies négatives et intervenant sur le sens des responsabilités, la constance et la fidélité.\r\nRésine 100% naturelle qui  stimule les sentiments, les émotions et les sensations.', NULL, 'Tous nos produits sont  issus d\'une agriculture biologique.\r\nconditionnement : 20 grammes', NULL, 100, 1, '2026-03-11 23:00:00', '2026-02-20 11:25:58', '2026-03-09 11:28:42', NULL),
('1bd2e1b2-8e11-413b-b66d-35dafa9d4e22', 'Infusion de fumeterre biologique Yawoum village', 1, 13.99, NULL, 'products/infusion-de-fumeterre-biologique-yawoum-village-1bd2e/main/kkyyMP8Rm3e9tciJykS8VXOtX2CpIPV23UoV4D8P.webp', 'La tisane de fumeterre agit sur la sphère hépatique, et peut avoir une action bénéfique sur les dartres et les affections cutanées comme le psoriasis, en complément à d\'autres soins. Elle se montre très efficace également en cas d\'eczéma suintant, précise la naturopathe. Pour l\'eczéma sec on préférera la bardane.\"A fortes doses et au cours d\'un usage prolongé, la fumeterre peut avoir une action hypotonisante, amaigrissante. Il faut donc veiller au risque d\'hémolyse, soit une destruction de globules rouges dans le sang. c\'est pour cela que je ne la coseille pas en utilisation par voie orale.', NULL, '50 g de fumeterre pour 1L d\'eau, faire bouillir 5 min, filtrer et laisser refroidir. Quand l\'eau est tiède, utiliser en application locale contre les troubles cutanées (dartres, psoriasis, eczéma) à l\'aide d\'une compresse imbibée.', NULL, 100, 0, NULL, '2026-02-20 12:33:57', '2026-02-20 12:33:57', NULL),
('2510daaa-a3fb-4260-989a-fdea849c4215', 'Bain de purificationYawoum Village', 1, 149.00, NULL, 'products/bain-de-purificationyawoum-village-2510d/main/mfqK5Fbinn9HHIKyOailZLEeP6MalpLpS29KwgLu.png', 'Ce bain  sert à se débarrasser des influences négatives accumulées et, pendant qu’on y est, à s’attirer les grâces de notre destinée terrestre.\r\nCela également afin de  placer de grands espoirs pour votre futur.\r\nCela n’est pas une pratique purement sanitaire. C’est un rituel. Pour mettre toutes les chances de son côté, un bain  doit se faire dans la discretion sans etre deranger. Ainsi , vous vous connecter à votre source primordiale. Chance , succés et équilibre.', NULL, 'Rituel à effectuer pendant 9 jours.', NULL, 100, 0, NULL, '2026-02-17 20:04:01', '2026-02-25 09:41:08', NULL),
('452be657-8469-434d-a73e-36a5da24526d', 'Tisane biologique \"miracle\"', 1, 29.99, NULL, 'products/tisane-biologique-miracle-452be/main/69gUh91RwTTOAsmacAskgjIG72FBLVhyHMrqmEbX.png', 'Prendre la cure une fois par jour pendant 20 jours consécutifs. Pour de meilleurs résultats il est conseillé de la prendre 20 minutes avant le repas du soir.', NULL, 'Laisser infuser dans une tasse de 150ml d\'eau bouillante, pendant 10-15 minutes et la boire avant ou après avoir mangé.', '[\"Lib\\u00e9ration des toxines\",\"Digestion rapide\",\"Coupe faim efficace\",\"Br\\u00fble les calories\",\"Sommeil paisible\",\"Booste le m\\u00e9tabolisme\"]', 100, 0, NULL, '2026-02-17 12:52:22', '2026-02-25 08:58:48', NULL),
('4bd9390f-35fa-4837-9fb9-a5ba162250e4', 'Tisane de prêle biologique Yawoum village', 1, 23.99, NULL, 'products/tisane-de-prele-biologique-yawoum-village-4bd93/main/PYWQydlgUoXp5Oqnl2zrkHOEKZSSSiZ6FzBcyx6D.png', 'Propriétés reminéralisantes, diurétiques  et anti-inflammatoires.  C\'est l\'une des meilleures alliées des reins : elle agit contre les calculs urinaires, les coliques néphrétiques, les cystites, la prostatite . Elle est employée pour traiter l\'ostéoporose (traitement adjuvant), favorise la consolidation des os suite à une fracture, soulage les œdèmes et douleurs causés par un traumatisme superficiel.', NULL, 'Mode d\'emploi inclus dans le sachet.\r\n Boire 3 à 4 tasses par jour jusqu\'à amélioration.', '[\"Acc\\u00e9l\\u00e9re la cicatrisation de plaies b\\u00e9nignes ( en compresse )\",\"traiter les douleurs li\\u00e9es \\u00e0 l\'arthrose et les tendinites ( compresse aussi )\",\"Ameliore la r\\u00e9sistance des ongles et des cheveux fragiles\",\"traite les infections des voies urinaires\",\"et facilite la perte de poids.\"]', 100, 0, NULL, '2026-02-17 20:27:03', '2026-02-17 20:27:03', NULL),
('4e9dc16c-8c1b-4b7c-8c81-dcd9abceb794', 'Tisane de feuilles d\'artichaut biologique Yawoum village', 1, 4.99, NULL, 'products/tisane-de-feuilles-dartichaut-biologique-yawoum-village-4e9dc/main/mo8SuMSXgF9dcAOeQfU20GBdgZamNM4DhIljmDmt.png', 'Les infusions d\'artichaut sont très employées pour stimuler le système hépato-biliaire, et augmenter la production de bile. En soignant le foie et en régénérant les cellules hépatiques, elles entraînent de nombreux bienfaits.\r\nElle permet donc de soulager les maux de digestion associés à un mauvais fonctionnement de la vésicule biliaire et du foie .\r\nLa composition des feuilles d\'artichaut fait qu\'elles seraient efficaces pour réduire les symptômes et la qualité de vie des patients souffrant du syndrome de l\'intestin irritable.\r\nsoulage certains problèmes urinaires, ainsi que l’arthrite, la goutte et les rhumatismes. \r\nLa prise d\'artichaut permettrait de baisser le taux de mauvais cholestérol et de triglycérides.\r\nLa teneur en antioxydants, vitamines et minéraux de la plante permettraient d\'aider à combattre le cancer du foie.\r\nPour les personnes obèses afin de lutter contre la cellulite et la surcharge pondérale, dans le cadre d\'une alimentation équilibrée. En effet, la feuille d’artichaut possède des propriétés détoxifiantes et hypocaloriques, mais son action sur la digestion aide aussi.', NULL, 'Faites bouillir de l\'eau puis ajoutez 1 cuillère à café de feuilles séchées dans une tasse de 25 cl.\r\nLaissez infuser 10 minutes avant de boire la tisane.', NULL, 99, 0, NULL, '2026-02-20 12:39:11', '2026-04-08 18:38:15', NULL),
('579652e1-524a-4dc7-a570-4e06ebc0816e', 'Infusion de ciboule', 1, 20.99, NULL, 'products/infusion-de-ciboule-57965/main/NposfXjOoo3uXELyFtdcAp6m02T3tJpVcIAnUTWt.png', 'Infusion de ciboule du village Yawoum. Comble les carences d\'un régime alimentaire déséquilibré car elle contient des vitamines C, B2 et K, du calcium, du sodium, du phosphore et du fer.\r\nBénéfique pour la circulation du sang, elle favorise l\'élasticité des vaisseaux et les préserve d\'un vieillissement prématuré\r\nAntioxydant non négligeable avec tout les bienfaits pour la santé que ça entraine.', NULL, 'Verser de l’eau frémissante sur une cuillére à soupe de la préparation pour 250 ml , ( une tasse ).\r\nCouvrir la et laisser infuser 5 minutes avant de filtrer. Ajouter selon le goût une cuillère de miel.', '[\"Verser de l\\u2019eau fr\\u00e9missante sur une cuill\\u00e9re \\u00e0 soupe de la pr\\u00e9paration pour 250 ml ( une tasse )\",\"Couvrir la et laisser infuser 5 minutes avant de filtrer\",\"Ajouter selon le go\\u00fbt une cuill\\u00e8re de miel.\"]', 100, 0, NULL, '2026-02-17 13:01:24', '2026-02-17 13:01:24', NULL),
('58239bb7-0bf4-42e7-a558-b4b7956719a4', 'Bois bandé en poudre biologique Yawoum village', 4, 29.99, NULL, 'products/bois-bande-en-poudre-biologique-yawoum-village-58239/main/RQx2HhmHSeQWwMLwEGRxf5PqKH1CSbq2EY0b85XE.png', 'Stimulant général qui permet de lutter contre la fatigue et de retrouver la vitalité nécessaire à une libido épanouie. Le bois bandé aurait une action contre le stress et l\'anxiété, deux grands obstacles aux rapports intimes réussis.\r\nLe bois bandé est très efficace et agit rapidement. Il est indiqué pour traiter l\'impuissance chez l\'homme, et la frigidité chez la femme.\r\nLa présence de yohimbine, un principe actif aux propriétés vasodilatatrices, facilite l\'afflux sanguin, donc l\'érection.', NULL, 'Macérer 5g de poudre dans 1L d\'eau froide 8h, bouillir 20 min, filtrer. Boire 1 verre matin et soir max 2 semaines, conservation au frigo possible.', '\"[\\\"diminue la tension art\\\\u00e9rielle\\\",\\\"- am\\\\u00e9liore la m\\\\u00e9moire\\\",\\\"pr\\\\u00e9vient l\'apparition d\'ulc\\\\u00e8res\\\",\\\"soulage la douleur musculaire\\\",\\\"r\\\\u00e9duit la fatigue et le stress\\\",\\\"soulage les rhumatismes\\\"]\"', 100, 0, NULL, '2026-02-17 21:05:34', '2026-02-17 21:12:33', '2026-02-17 21:12:33'),
('5cdda0cb-6928-4473-b951-b0d72df31f0c', 'Infusion miraculeuse Pokam', 1, 79.00, NULL, 'products/infusion-miraculeuse-pokam-5cdda/main/Q13U4c77RCZfEttD8DxN6jiJw9X3BJldj3YLLkii.png', 'Infusion miraculeuse Pokam provenant de Yawoum Village. anti diabéte radicale trés puissante.\r\nAide le contrôle de la glycémie.', NULL, 'Laissez infuser dans l\'eau frémissante pendant 10 à 15 minutes. 2 tasses par jour ( matin et soir ).', '[\"Maintien le taux de cholest\\u00e9rol normal dans le sang\",\"Favorise \\u00e9galement la bonne sant\\u00e9 du foie\",\"de la peau ainsi que des organes reproducteurs et urinaires.\"]', 100, 0, NULL, '2026-02-17 09:58:30', '2026-02-17 09:58:30', NULL),
('603e1f11-941f-4eea-b932-0a8ce010253f', 'Grand logis de vie Yawoum Village', 3, 55.00, NULL, 'products/grand-logis-de-vie-yawoum-village-603e1/main/FDuU0uzL3RlqK7riTOKFcwPOeTdaHrZP7EOwPMAh.png', 'Traitement composé par Atoum Râ Mbianga Phytothérapeute clinicienne herborister experte .             \r\n soigne les maladies suivantes :\r\n -Disfonctionnement des cellules du foi due à la chimiothérapie  ( traitements médicamenteux ayant pour but la destruction des cellules cancéreuses )\r\n- Hépatomégalie ( augmentation du volume du foie )\r\n- Stéatose hépatique  (excès de graisses dans le foie, qui n\'est pas dû à une consommation élevée d\'alcool ).', NULL, 'Sur prescription de la therapeute', NULL, 100, 0, NULL, '2026-02-17 13:51:41', '2026-02-17 13:52:27', NULL),
('6542aed0-1c86-4fa8-add4-4ff6d7377d4f', 'feuilles de myrte ( encens) Yawoum village', 2, 14.99, NULL, 'products/feuilles-de-myrte-encens-yawoum-village-6542a/main/67jUtPVD1nfAov9C3cnNP1lgzqx2ygWsjj2mcdad.png', 'les feuilles de Myrte représentent le principe féminin.\r\nElle aide à faire de la clarté dans nos propres opinions et purifie l\'atmosphère environnementale, favorise l’ouverture de l\'esprit et détend les nerfs.\r\nElle a un effet rafraîchissant.\r\nL\'encens naturel peut être utilisé pour divers rites de purification, y compris le «nettoyage» de l’aura.\r\nAdapté pour être brûlé sur du charbon ou dans des brûleurs d’encens spéciaux', NULL, 'Tous nos produits sont  issus d\'une agriculture biologique.\r\nconditionnement : 50 grammes.', NULL, 100, 0, NULL, '2026-02-20 11:47:36', '2026-03-08 20:05:42', NULL),
('694c7682-87b2-4fa5-8405-91994a920a4f', 'Tisane de feuilles de bardane biologique Yawoum village', 4, 11.99, NULL, 'products/tisane-de-feuilles-de-bardane-biologique-yawoum-village-694c7/main/5MIICX7gAFmRDOyIR3upgU7hrb5qirs4U3Al60n3.png', 'Stimule les fonctions du foie et de la bile, et a une légère capacité à protéger le foie.\r\nSoulage les troubles bénins des voies urinaires grâce à son effet diurétique.\r\nAméliore  le fonctionnement de l\'appareil urinaire en favorisant l\'élimination des urines.\r\nContribue à traiter certaines affections de la peau liées à un excès de production de séborrhée (ex : acné, furoncles).\r\nCet usage Favorise le microbiote : \"La bardane est surtout un bon prébiotique grâce à l\'inuline qui favorise une bonne flore intestinale, mais peut parfois entrainer des ballonnements\".\r\nAnti-inflammatoire : la bardane agirait également \"sur les inflammations articulaires chroniques (rhumatismes), sur la goutte, elle facilite l\'élimination des substances inflammatoires en l\'associant à d\'autres plantes anti-inflammatoires\".\r\nHypoglycémiante : \"les vertus hypoglycémiantes de la bardane la rendent intéressante en cas de glycémie élevée. Toutefois il ne faut jamais la prendre  si vous prenez un traitement hypoglycémiant\".', NULL, 'En infusion : permet une action contre les infections cutanées, les problèmes de peau. 5 g de feuilles séchées pour 1 litre d\'eau bouillante. Laisser infuser 10 min, boire 2 tasses par jour.', NULL, 100, 0, NULL, '2026-02-20 12:42:56', '2026-02-25 09:41:08', NULL),
('765fe004-c6c1-45da-aa7e-5004cbececd9', 'Poudre d\'acérola biologique Yawoum village', 4, 13.99, NULL, 'products/poudre-dacerola-biologique-yawoum-village-765fe/main/H8NcDtLNQfmJpVGW0C1E75WG3jBVm6cW6G9BmYgK.png', 'Souvent associé au thé vert et au gingembre dans nos préparations, l\'acérola consommé sous forme d\'infusion, de thé et de tisane est un véritable stimulant pour notre système immunitaire permettant donc de lutter contre la fatique, l\'épuisement et le surmenage.\r\nGrâce à sa haute teneur en vitamine C, l\'acérola est le meilleur allié de vos défenses immunitaires.\r\n\r\nrecommander à l\'arrivée de l\'hiver,.\r\n\r\nEn période de stress ou de surmenage.\r\n\r\nL\'acérola contribue au fonctionnement normal du système immunitaire.\r\n\r\nFavorise l\'absorption intestinale du fer.\r\n\r\nPurifiant : nettoyant de l\'organisme, il peut aider au sevrage tabagique.\r\n\r\nReminéralisant : recommandé en cas d\'augmentation des besoins de l\'organisme.\r\nContre-indications\r\nL\'acérola peut augmenter le taux d\'acide urique. Pour cette raison, il est contre-indiqué aux personnes souffrant de goutte. L\'acérola pouvant favoriser les calculs rénaux, il est également contre-indiqué aux personnes susceptibles de souffrir de cette pathologie.', NULL, '5 grammes pour une tasse de 25 cl d\'eau chaude.', NULL, 100, 0, NULL, '2026-02-18 15:15:32', '2026-02-18 15:15:32', NULL),
('7fe81acd-da88-42df-acd1-366163722c95', 'infusion de fleur de Jéricho biologique Yawoum village', 1, 15.99, NULL, 'products/infusion-de-fleur-de-jericho-biologique-yawoum-village-7fe81/main/C42swMwCuVUjBHoqzkXbNlzhP7t0FKOwW9NH9V92.png', 'Utilisée pour tomber enceinte.\r\n Utile pour retrouver une bonne fertilité\r\n Effets sur le foie de manière préventive en le protégeant puis en le soignant.\r\nAgit sur le diabète en régulant le taux de sucre.\r\n Très efficace pour favoriser la sécrétion d\'urine.\r\n Permet aussi d\'agir sur la conjonctivite.\r\nPlantes porte-bonheur du désert connues des sorciers néolithiques\r\nUtilisé dans certaines cérémonies vaudou ou de sorcellerie.', NULL, 'Porter un bol d\'eau à ébullition. Laisser refroidir jusqu\'à 40°C environ. Mettre quelques brins de rose de Jéricho ou la fleur entière dans l\'eau.', NULL, 100, 0, NULL, '2026-02-18 11:03:31', '2026-02-18 11:03:31', NULL),
('834d1e5e-55bb-4074-8371-6b2f1f979bd7', 'Tisane de saule biologique Yawoum village', 1, 19.99, NULL, 'products/tisane-de-saule-biologique-yawoum-village-834d1/main/c9OcjraMfkYssZ32RNEPzFfMWk3Q4KcJ5bXyN0UE.png', 'Antalgiques : calme les douleurs lombaires, les douleurs articulaires, les douleurs d\'arthrose, les névralgies, les maux de tête, les règles douloureuses, les bursites (La bourse séreuse est un petit sac rempli de liquide qui sépare les os et d\'autres parties du corps, comme les tendons ou les muscles )  et tendinites.', NULL, 'Buvez 3 tasses par jour.\r\nconditionnement : sachet pret à l\'emploi.', '[\"Indiqu\\u00e9e pour diminuer la fi\\u00e8vre li\\u00e9e au rhume et les insomnies.\"]', 100, 0, NULL, '2026-02-17 20:21:12', '2026-02-17 20:21:13', NULL),
('917af3f5-67c3-4489-bda9-7d3542824c00', 'Tisane détox minceur de Yawoum Village', 1, 60.00, NULL, 'products/tisane-detox-minceur-de-yawoum-village-917af/main/gKGDazrUX9gkVEKzPNvpCkXqP1YoAAMYDy5BqRWY.png', 'Mélange de plantes biologiques composé par nos soins suivant les méthodes traditionnelles ancestrales pour nettoyer vos parois intestinales  ( tous les déchets du corps entreposer dans votre circuit de digestion ).', NULL, '1 cuillère à soupe dans 50 cl d’eau. Bouillir  et  laisser infuser 7 min . Une tisane le soir au coucher pendant 3 jours consécutifs puis refaire pendant 3 semaines.  \r\nConditionnement : sachet pret à l\'emploi.', NULL, 98, 0, NULL, '2026-02-17 13:35:45', '2026-04-08 18:38:15', NULL),
('9a69f259-2402-4d60-a596-dcb03c03dcd2', 'Infusion de griffonia biologique Yawoum village', 1, 15.99, NULL, 'products/infusion-de-griffonia-biologique-yawoum-village-9a69f/main/SqtHOSetcVk4Iww5AHXVPzXshqUc6liTmfX6tBgz.png', 'Le griffonia est déconseillé aux enfants, aux femmes enceintes ou allaitantes ainsi qu\'aux femmes prenant une contraception et aux épileptiques. On évite de l’associer à des médicaments (antidépresseurs notamment), de la gentiane et du millepertuis.', NULL, 'Les cures de griffonia peuvent être d\'une durée d\'un à trois mois.10 grammes par tasse de 25 cl d\'eau , laisser infuser 10 minutes.', '[\"R\\u00e9gulation du sommeil\",\"r\\u00e9gulation de l\'humeur\",\"r\\u00e9gulation du stress\",\"r\\u00e9gulation de l\'app\\u00e9tit\",\"riche en antioxydants\",\"lutte contre le stress oxydatif\",\"lutte contre le vieillissement\",\"traitement des difficult\\u00e9s d\'endormissement\",\"traitement de l\'insomnie\",\"traitement des r\\u00e9veils nocturnes\",\"traitement de l\'agressivit\\u00e9\",\"traitement de l\'angoisse\",\"traitement du stress\",\"traitement de la d\\u00e9pression\",\"traitement de la boulimie\",\"action sur la sph\\u00e8re nerveuse\",\"traitement des c\\u00e9phal\\u00e9es\",\"favorise la gu\\u00e9rison des inflammations cutan\\u00e9es\",\"favorise la gu\\u00e9rison des br\\u00fblures.\"]', 100, 0, NULL, '2026-02-17 21:36:16', '2026-02-17 21:36:16', NULL),
('9eeee160-fe7f-4ff6-883f-e79237a46e5f', 'tisane d\'aesculus hippocostanum biologique Yawoum Village', 1, 15.99, NULL, 'products/tisane-daesculus-hippocostanum-biologique-yawoum-village-9eeee/main/2cNs98i3cZ4DpTJBh7JrlexPMSCnJzWjqfUdFvOy.png', 'Puissant traitement des hémorroïdes, des varices, de l\'insuffisance veineuse .\r\nATTENTION :  réputé toxique, sa prise doit être de courte durée. Il est généralement conseillé de boire 1 à 2 tasses par jour entre les repas pendant 14 jours, suivi d\'au moins 10 jours de pause.\r\nMal dosée , elle peut provoquer des troubles digestifs ainsi que des nausées.\r\nIl est contre-indiqué chez les personnes souffrant d\'insuffisance rénale, les personnes sous traitement anticoagulant ou allant se faire opérer, au moins 3 jours avant l\'opération, ainsi que sur les lésions cutanées.\r\nIl est déconseillé d\'en consommer en cas de cholestase, ainsi qu\'en cas de diabète si vous êtes sous traitement hypoglycémiant. Attention à ne pas associer le fruit à d\'autres plantes anticoagulantes .', NULL, 'Ajoutez 1 cuillère à café de graines concassées à une tasse d’eau froide, faites bouillir 5 minutes, laissez infuser 10 minutes, puis sucrez au miel.', NULL, 100, 0, NULL, '2026-02-18 11:17:03', '2026-02-18 11:17:03', NULL),
('aa18199e-319e-4e40-b36c-e4bd012653d8', 'Poudre de guarana biologique Yawoum village', 4, 13.99, NULL, 'products/poudre-de-guarana-biologique-yawoum-village-aa181/main/loBDnblLiVdjQP30d0bscA1o5e5Vr3DB5vNd8mgk.png', 'Elle contient des acides gras essentiels, et possède des propriétés stimulantes grâce à la caféine qu’il contient.', '[\"vitamines A\",\"E\",\"B1\",\"B3 et PP\",\"calcium\",\"le potassium\",\"le phosphore\",\"le fer\",\"le cuivre\",\"le zinc et le magn\\u00e9sium\",\"des oligo\\u00e9l\\u00e9ments dont le s\\u00e9l\\u00e9nium et le strontium.\"]', 'Il est préconisé de prendre environ 2 grammes de guarana par jour le matin et le midi pendant quatre à six semaines.', '[\"am\\u00e9liorer la concentration\",\"contribue \\u00e0 am\\u00e9liorer la m\\u00e9moire\",\"Action positive pour diminuer la fatigue passag\\u00e8re .\"]', 100, 0, NULL, '2026-02-18 15:05:24', '2026-02-25 08:58:48', NULL),
('ab5b069d-c453-47da-86a1-c4b2942383b1', 'Elixir amaigrissant Yawoum Village', 3, 80.00, NULL, 'products/elixir-amaigrissant-yawoum-village-ab5b0/main/TVBBi0dWZLqXCXn4t44lgtNJu8AlOiStz0huMInW.png', 'Elle permet de fondre à vue d’œil.\r\nne pas mangez de sucre !!!\r\nSi vous n\'avez pas tricher , vous aurez perdu jusqu\'à 4 kilogrammes sans effort en mangeant normalement et sans excés.Conditionnement : Sachet pret à l\'emploi.', NULL, '3 tasses par jour.\r\nCe prend chaude à chaque fin de repas.', NULL, 100, 0, NULL, '2026-02-17 13:15:21', '2026-03-08 20:05:56', NULL),
('ad7523bb-1c9a-4c4e-84d2-84bfe40c83a6', 'Elixir de la grande demeure de vie Yawoum village', 1, 55.00, NULL, 'products/elixir-de-la-grande-demeure-de-vie-yawoum-village-ad752/main/M3u1s2ggvtBKNaj7WYPhVfKG7L3NQ4HJhgOzK6fv.png', 'Sirop à bases de plantes biologiques.\r\n\r\nTraitement par Atoum Râ Mbianga Phytothérapeute clinicienne herboriste experte .\r\n\r\ncontre les maladies ci dessous:\r\n  Maladie de parkinson\r\n Hypertension artérielle\r\n Maladie d’alzheimer\r\nTrouble de circulation du système nerveux central.', NULL, '2 cuillère à soupe à boire 2 fois par jour .\r\n\r\nTop résultat.', NULL, 100, 0, NULL, '2026-02-17 19:45:22', '2026-02-17 19:45:22', NULL),
('be1807a8-6927-4a2b-aa3b-ae486f9d8e1b', 'Tisane de souci officinal biologique Yawoum village', 1, 11.99, NULL, 'products/tisane-de-souci-officinal-biologique-yawoum-village-be180/main/orhAiA5ZqULgEg2bqoqaVb9I5dZAX4efN53RfND5.png', 'En infusion, le souci officinal est efficace en cas de troubles digestifs, de mycoses, de douleurs prémenstruelles ou de régulation du cycle menstruel.', NULL, 'Pour cela, il suffit de faire bouillir 200 ml d\'eau et d\'y jeter 2 c. à café de fleurs séchées. En boire 1 tasse 3 fois par jour pendant 15 jours maximum.\r\nTous nos produits sont  issus d\'une agriculture biologique.', NULL, 99, 0, NULL, '2026-02-20 12:50:13', '2026-04-08 18:36:55', NULL),
('c1d76166-e644-43fc-905a-dc4b99183a1b', 'Bois d\'agar biologique Yawoum village', 9, 16.99, NULL, 'products/bois-dagar-biologique-yawoum-village-c1d76/main/Qe0SYeICTinH9m271X1h8Hp5XQiHc6Ul3McfngTq.png', 'Calmant et relaxant, il supprime les énergies négatives du corps, et améliore la perception.\r\nRéduit l’anxiété et invoque un sentiment de paix, de vigueur et d’harmonie.\r\nSuppressions des comportements obsessionnels.\r\nAide à créer l’harmonie et l’équilibre dans votre maison.\r\nIl est utilisé et recommandé par des maitres spirituels afin de donner de l’inspiration et mettre en condition pour la méditation, l’atteinte de la paix intérieure et la sérénité.', NULL, 'Tous nos produits sont  issus d\'une agriculture biologique.\r\nconditionnement : 100 grammes environ.', '[\"Apporte une connexion entre les fonctions du corps et de l\\u2019esprit\",\"Am\\u00e9liore la r\\u00e9ception des sens et ouvre l\\u2019esprit\",\"Calme les fonctions principales du corps humain.\"]', 100, 0, NULL, '2026-02-20 10:53:49', '2026-02-25 09:00:06', NULL),
('e1a350da-892f-4eda-b8f2-93e9546027fd', 'Résine ritualiste mastic biologique Yawoum village', 9, 23.99, NULL, 'products/resine-ritualiste-mastic-biologique-yawoum-village-e1a35/main/3xhdrJgNHpxKnx0HbiQ4p2VOzE58W8bcsEvPtoVE.png', 'Il se prête bien aux fumigations destinées à accompagner une pratique méditative ou contemplative et peut, grâce à ses qualités lumineuses, nous aider dans les périodes ou nous sommes en recherche de clarté et de compréhension.\r\nSon parfum élève vers le haut, vers la lumière et favorise,  les capacités de clairvoyance, de vision et d’intuition.\r\nproduit biologique fabriqué dans nos ateliers specialisés.', '[\"Resine pur\"]', 'Conditionnement : 25 grammes.', NULL, 100, 0, NULL, '2026-02-18 15:45:37', '2026-02-18 15:45:37', NULL),
('ea7b4d29-f510-494b-b3f6-30546b35a364', 'infusion de ginkgo biloba biologique de Yawoum village', 1, 31.99, NULL, 'products/infusion-de-ginkgo-biloba-biologique-de-yawoum-village-ea7b4/main/d3wBKKmmzaLiIQOwrRY1deXQ0AzAQ9zKZYPkZNk7.png', 'Neuroprotecteur, le ginkgo biloba agit sur le cerveau.\r\nUtilisées pour traiter les symptômes de la démence sénile et des états de faiblesse comme les pertes de mémoire, la dépression, les troubles de la concentration et de la vigilance, les acouphènes ou encore les maux de tête.De par son action fluidifiante sur le sang, le gingko est contre-indiqué lors d\'une grossesse ou en période d\'allaitement. \"En cas d\'intervention chirurgicale, il est recommandé de cesser le traitement au moins 48 heures avant. Il est déconseillé d\'associer le ginkgo à certains médicaments anticoagulants comme la warfarine et l\'aspirine, les antiépileptiques, les antidiabétiques et antidiurétiques.', NULL, 'Boire une tasse par jour.', NULL, 100, 0, NULL, '2026-02-17 20:51:09', '2026-02-17 20:51:09', NULL),
('eccbf4ec-f120-488a-b973-e5078462364a', 'Bois de santal biologique Yawoum village', 1, 29.99, NULL, 'products/bois-de-santal-biologique-yawoum-village-eccbf/main/XAVXWwCB0sWFlM81clVubGI1qWoWJeF2IxbgksKL.png', 'Le bois de santal transmet de la chaleur et des ondes positives à l\'environnement dans lequel il est placé.\r\nInduit un état de sérénité grâce à son arôme relaxant,qui transmet une grande paix intérieure.\r\nIl aide à améliorer la capacité de concentration, par exemple, lors de l\'étude et de l\'apprentissage.\r\nEnfin, il est idéal pour la spiritualité, la méditation et il aide à soulager\r\nmoments de nervosité ou d\'anxiété.\r\nCe bâton d\'encens parfumera votre maison d\'un parfum de\r\ntranquillité.\r\nIl est utilisé  en fumigation pour ses effets apaisants et aphrodisiaques, donc en cas de stress par exemple ou de baisse de la libido.', NULL, 'Tous nos produits sont  issus d\'une agriculture biologique.\r\nconditionnement : environ 100 grammes.', '[\"Assainir l\'air\",\"Am\\u00e9liorer le bien-\\u00eatre mental\",\"Pr\\u00e9pare et purifie l\'\\u00e2me.\"]', 99, 0, NULL, '2026-02-20 11:39:25', '2026-04-08 18:36:55', NULL),
('ed4e5093-1151-4849-af0f-fe2a0f7e4a90', 'Infusion de thym biologique Yawoum village', 1, 15.99, NULL, 'products/infusion-de-thym-biologique-yawoum-village-ed4e5/main/ICf2hsoW3k3V6wBT8aPFqwwecxkuAjqCgZuk4CGL.png', 'Le thym est tout d\'abord très fortement antioxydant.\r\n le thym (déshydraté surtout) est très riche en fer qui participe à la formation des globules rouges et en vitamine K qui participe à la coagulation et à la formation des os.\r\nContre la toux en en cas de rhume \"Il agit sur beaucoup de maladies ORL et respiratoires.\r\nle thym contient un principe anxiolytique qui pourrait être bénéfique au sommeil.\r\nUn des composants du thym, le carvacrol, pourrait avoir des effets relaxants sur les personnes anxieuses.\r\nLe thym fait partie des plantes médicinales les plus utilisées pour ses propriétés antivirales et anti microbiennes.\r\nL\'usage du thym sauvage ou du thym bio dans des infusions est bénéfique  surtout en hiver, pour permettre de soulager votre organisme des infections de saison.', NULL, '1 cuillére à soupe pour 500 ml d\'eau bouillante , laisser infuser 5 minutes , filtrer et boire jusqu\'a 4 tasses par jour.', NULL, 99, 0, NULL, '2026-02-18 15:22:14', '2026-04-08 18:36:55', NULL),
('f077b662-ea59-4f6d-801a-febfeddf979e', 'Infusion d\'absinthe biologique Yawoum village', 1, 39.99, NULL, 'products/infusion-dabsinthe-biologique-yawoum-village-f077b/main/00ezBvuDuSUJTIitCJZ9AKHCuWWvSHwJSxZ7XJfH.png', 'Tonique et stimulante, antiseptique.\r\n\r\nCombat la fièvre,.\r\n\r\nRégularise le cycle et soulage les douleurs menstruels.\r\n\r\nStimule la sécrétion de bile.\r\nElle contient également des tanins et de la vitamine C.\r\nPossède des vertus antigrippales', NULL, 'En tisane, il faut compter 2 cuillerées pour un demi-litre d\'eau bouillante. Buvez au maximum 3 tasses par jour. L\'absinthe étant très amère, il faut sucrer la tisane au miel', '[\"\\u00e9liminer les parasites intestinaux\",\"r\\u00e9gulariser les premi\\u00e8res r\\u00e8gles chez les jeunes filles.\"]', 100, 0, NULL, '2026-02-17 21:28:34', '2026-02-17 21:28:34', NULL),
('f4960b09-bfb5-40b7-82b7-8a18a6ca41e5', 'Infusion de cardamone biologique Yawoum village', 1, 21.99, NULL, 'products/infusion-de-cardamone-biologique-yawoum-village-f4960/main/M1ahqWglz3qf4jRo0B8lijbjfbORmScQ7ciKVTPF.png', 'C\'est un anti-inflammatoire et un stimulant naturel qui serait bénéfique, voire même un traitement contre le paludisme.\r\n\r\nPossède des vertus diurétiques permettant un bon fonctionnement rénal et de lutter contre les calculs.', NULL, 'Faites bouillir l’eau, ajoutez 10 graines de cardamome pour 1 litre, laissez infuser 10 minutes à couvert, filtrez et ajoutez du miel si désiré.', '[\"Diur\\u00e9tique\",\"antiseptique\",\"anti-inflammatoire\",\"R\\u00e9duis les ballonnements\",\"soulage les aigreurs d\'estomac.\"]', 100, 0, NULL, '2026-02-18 11:33:27', '2026-02-18 11:33:27', NULL),
('f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', 'Bain de désenvoutement d\'excellence Yawoum Village', 1, 80.00, NULL, 'products/bain-de-desenvoutement-dexcellence-yawoum-village-f651f/main/4qXZCcn7jwnbFwO1KJmIwBGexk2W1FqMp7CixfTd.png', 'Recette entièrement naturelle qui  contient des herbes traditionnelles sacrées biologiques venant pour la plupart de nos cultivateurs de la région du Noun qui respecte les méthodes ancestrales de plantations et de ceuillettes ,  ainsi que la nature.\r\n\r\nNous trouvons les meilleurs ingrédients pour ce bain dont  certaines', NULL, 'Il faut faire ce bain durant diverses période suivant la gravité de l\'envoutement sois : 7 jours , 9 jours , 21 jours , 40 jours.', NULL, 99, 0, NULL, '2026-02-17 20:15:35', '2026-04-08 18:36:55', NULL),
('f7e0b4da-0b3b-454b-8198-34cc05518ff7', 'Tisane de feuilles d\'Angélique biologique Yawoum village', 1, 15.99, NULL, 'products/tisane-de-feuilles-dangelique-biologique-yawoum-village-f7e0b/main/D3xodBNV3ZHrcieZCmNkInt9tdDxsie8rzqhtlAx.png', 'Utilisée pour lutter contre de nombreuses maladies , elle agit comme un fortifiant et un tonique général. \r\nContribue à lutter contre les états de grande fatigue, et ainsi à soutenir les défenses de l\'organisme.', NULL, '10 grammes par tasse de 25 cl d\'eau , laisser infuser 10 minutes.', '[\"Facilite la digestion\",\"soulage les spasmes digestifs\",\"Traitela toux\",\"la bronchite\",\"le rhume\",\"les douleurs rhumatismales (usage externe avec des compresses chaudes).\"]', 100, 0, NULL, '2026-02-18 10:55:28', '2026-03-08 20:05:56', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` char(36) NOT NULL,
  `path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `path`, `created_at`, `updated_at`) VALUES
(1, '0fee0ec3-b92e-453b-8f25-03121994c49b', 'products/infusion-de-racines-de-pissenlit-biologique-yawoum-village-0fee0/gallery/z2UgEvIjSEBBqse6N0bnkyDUWEHvzrs1tCNrZNVo.png', '2026-04-08 18:30:12', '2026-04-08 18:30:12'),
(2, '0fee0ec3-b92e-453b-8f25-03121994c49b', 'products/infusion-de-racines-de-pissenlit-biologique-yawoum-village-0fee0/gallery/gtMyStJ3FtwAzLMWyBEJTufiewOOEsIDFbF0x2UO.png', '2026-04-08 18:30:12', '2026-04-08 18:30:12');

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` char(36) NOT NULL,
  `order_id` char(36) DEFAULT NULL,
  `movement_type` enum('in','out') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reason` enum('order_creation','order_cancellation') NOT NULL,
  `new_stock` varchar(255) NOT NULL,
  `unit_price_at_time` decimal(10,2) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `product_id`, `order_id`, `movement_type`, `quantity`, `reason`, `new_stock`, `unit_price_at_time`, `metadata`, `created_at`, `updated_at`) VALUES
(1, '0564789e-6aa3-41f4-8735-d98baf9b4c07', '019c9f08-4ec6-72e1-8c49-40ee40133780', 'out', 1, 'order_creation', '99', 12.00, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00001\",\"product_name\":\"Gingembre biologique en poudre Yawoum village\"}', '2026-03-03 22:00:16', '2026-03-03 22:00:16'),
(2, 'ab5b069d-c453-47da-86a1-c4b2942383b1', '019c9f08-4ec6-72e1-8c49-40ee40133780', 'out', 1, 'order_creation', '99', 80.00, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00001\",\"product_name\":\"Elixir amaigrissant Yawoum Village\"}', '2026-03-03 22:00:16', '2026-03-03 22:00:16'),
(3, 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', '019c9f08-4ec6-72e1-8c49-40ee40133780', 'out', 1, 'order_creation', '99', 80.00, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00001\",\"product_name\":\"Bain de d\\u00e9senvoutement d\'excellence Yawoum Village\"}', '2026-03-03 22:00:16', '2026-03-03 22:00:16'),
(4, 'f7e0b4da-0b3b-454b-8198-34cc05518ff7', '019c9f08-4ec6-72e1-8c49-40ee40133780', 'out', 1, 'order_creation', '99', 15.99, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00001\",\"product_name\":\"Tisane de feuilles d\'Ang\\u00e9lique biologique Yawoum village\"}', '2026-03-03 22:00:16', '2026-03-03 22:00:16'),
(5, 'f7e0b4da-0b3b-454b-8198-34cc05518ff7', NULL, 'out', 1, 'order_creation', '98', 15.99, '{\"old_stock\":99,\"order_reference\":\"ORD-2026-00002\",\"product_name\":\"Tisane de feuilles d\'Ang\\u00e9lique biologique Yawoum village\"}', '2026-03-04 14:42:55', '2026-03-04 14:42:55'),
(6, '6542aed0-1c86-4fa8-add4-4ff6d7377d4f', NULL, 'out', 1, 'order_creation', '99', 14.99, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00002\",\"product_name\":\"feuilles de myrte ( encens) Yawoum village\"}', '2026-03-04 14:42:55', '2026-03-04 14:42:55'),
(7, 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', NULL, 'out', 1, 'order_creation', '98', 80.00, '{\"old_stock\":99,\"order_reference\":\"ORD-2026-00002\",\"product_name\":\"Bain de d\\u00e9senvoutement d\'excellence Yawoum Village\"}', '2026-03-04 14:42:55', '2026-03-04 14:42:55'),
(8, 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'out', 4, 'order_creation', '94', 80.00, '{\"old_stock\":98,\"order_reference\":\"ORD-2026-00003\",\"product_name\":\"Bain de d\\u00e9senvoutement d\'excellence Yawoum Village\"}', '2026-03-06 00:11:38', '2026-03-06 00:11:38'),
(9, 'be1807a8-6927-4a2b-aa3b-ae486f9d8e1b', '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'out', 2, 'order_creation', '98', 11.99, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00003\",\"product_name\":\"Tisane de souci officinal biologique Yawoum village\"}', '2026-03-06 00:11:38', '2026-03-06 00:11:38'),
(10, '0564789e-6aa3-41f4-8735-d98baf9b4c07', '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'out', 1, 'order_creation', '98', 12.00, '{\"old_stock\":99,\"order_reference\":\"ORD-2026-00003\",\"product_name\":\"Gingembre biologique en poudre Yawoum village\"}', '2026-03-06 00:11:38', '2026-03-06 00:11:38'),
(11, '07e97fa8-8773-4c98-9e85-347a60cb26bd', '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'out', 1, 'order_creation', '99', 55.00, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00003\",\"product_name\":\"Maison de vie , sirop \\u00e9lixir contre les troubles sexuel de Yawoum village\"}', '2026-03-06 00:11:38', '2026-03-06 00:11:38'),
(12, 'f7e0b4da-0b3b-454b-8198-34cc05518ff7', '019cc0b7-5a30-719e-9040-932283f501a1', 'out', 1, 'order_creation', '97', 15.99, '{\"old_stock\":98,\"order_reference\":\"ORD-2026-00004\",\"product_name\":\"Tisane de feuilles d\'Ang\\u00e9lique biologique Yawoum village\"}', '2026-03-06 00:16:07', '2026-03-06 00:16:07'),
(13, 'f7e0b4da-0b3b-454b-8198-34cc05518ff7', '019cc0b7-5a30-719e-9040-932283f501a1', 'in', 1, 'order_cancellation', '98', 15.99, '{\"order_reference\":\"ORD-2026-00004\",\"cancelled_at\":\"2026-03-08T21:05:23.000000Z\",\"product_name\":\"Tisane de feuilles d\'Ang\\u00e9lique biologique Yawoum village\",\"old_stock\":97}', '2026-03-08 20:05:23', '2026-03-08 20:05:23'),
(14, 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'in', 4, 'order_cancellation', '98', 80.00, '{\"order_reference\":\"ORD-2026-00003\",\"cancelled_at\":\"2026-03-08T21:05:30.000000Z\",\"product_name\":\"Bain de d\\u00e9senvoutement d\'excellence Yawoum Village\",\"old_stock\":94}', '2026-03-08 20:05:31', '2026-03-08 20:05:31'),
(15, 'be1807a8-6927-4a2b-aa3b-ae486f9d8e1b', '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'in', 2, 'order_cancellation', '100', 11.99, '{\"order_reference\":\"ORD-2026-00003\",\"cancelled_at\":\"2026-03-08T21:05:30.000000Z\",\"product_name\":\"Tisane de souci officinal biologique Yawoum village\",\"old_stock\":98}', '2026-03-08 20:05:31', '2026-03-08 20:05:31'),
(16, '0564789e-6aa3-41f4-8735-d98baf9b4c07', '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'in', 1, 'order_cancellation', '99', 12.00, '{\"order_reference\":\"ORD-2026-00003\",\"cancelled_at\":\"2026-03-08T21:05:30.000000Z\",\"product_name\":\"Gingembre biologique en poudre Yawoum village\",\"old_stock\":98}', '2026-03-08 20:05:31', '2026-03-08 20:05:31'),
(17, '07e97fa8-8773-4c98-9e85-347a60cb26bd', '019cc0b3-3fe9-7156-b2df-b8ae2d5d1517', 'in', 1, 'order_cancellation', '100', 55.00, '{\"order_reference\":\"ORD-2026-00003\",\"cancelled_at\":\"2026-03-08T21:05:30.000000Z\",\"product_name\":\"Maison de vie , sirop \\u00e9lixir contre les troubles sexuel de Yawoum village\",\"old_stock\":99}', '2026-03-08 20:05:31', '2026-03-08 20:05:31'),
(18, '6542aed0-1c86-4fa8-add4-4ff6d7377d4f', NULL, 'in', 1, 'order_cancellation', '100', 14.99, '{\"order_reference\":\"ORD-2026-00002\",\"cancelled_at\":\"2026-03-08T21:05:42.000000Z\",\"product_name\":\"feuilles de myrte ( encens) Yawoum village\",\"old_stock\":99}', '2026-03-08 20:05:42', '2026-03-08 20:05:42'),
(19, 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', NULL, 'in', 1, 'order_cancellation', '99', 80.00, '{\"order_reference\":\"ORD-2026-00002\",\"cancelled_at\":\"2026-03-08T21:05:42.000000Z\",\"product_name\":\"Bain de d\\u00e9senvoutement d\'excellence Yawoum Village\",\"old_stock\":98}', '2026-03-08 20:05:42', '2026-03-08 20:05:42'),
(20, 'f7e0b4da-0b3b-454b-8198-34cc05518ff7', NULL, 'in', 1, 'order_cancellation', '99', 15.99, '{\"order_reference\":\"ORD-2026-00002\",\"cancelled_at\":\"2026-03-08T21:05:42.000000Z\",\"product_name\":\"Tisane de feuilles d\'Ang\\u00e9lique biologique Yawoum village\",\"old_stock\":98}', '2026-03-08 20:05:42', '2026-03-08 20:05:42'),
(21, '0564789e-6aa3-41f4-8735-d98baf9b4c07', '019c9f08-4ec6-72e1-8c49-40ee40133780', 'in', 1, 'order_cancellation', '100', 12.00, '{\"order_reference\":\"ORD-2026-00001\",\"cancelled_at\":\"2026-03-08T21:05:56.000000Z\",\"product_name\":\"Gingembre biologique en poudre Yawoum village\",\"old_stock\":99}', '2026-03-08 20:05:56', '2026-03-08 20:05:56'),
(22, 'ab5b069d-c453-47da-86a1-c4b2942383b1', '019c9f08-4ec6-72e1-8c49-40ee40133780', 'in', 1, 'order_cancellation', '100', 80.00, '{\"order_reference\":\"ORD-2026-00001\",\"cancelled_at\":\"2026-03-08T21:05:56.000000Z\",\"product_name\":\"Elixir amaigrissant Yawoum Village\",\"old_stock\":99}', '2026-03-08 20:05:56', '2026-03-08 20:05:56'),
(23, 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', '019c9f08-4ec6-72e1-8c49-40ee40133780', 'in', 1, 'order_cancellation', '100', 80.00, '{\"order_reference\":\"ORD-2026-00001\",\"cancelled_at\":\"2026-03-08T21:05:56.000000Z\",\"product_name\":\"Bain de d\\u00e9senvoutement d\'excellence Yawoum Village\",\"old_stock\":99}', '2026-03-08 20:05:56', '2026-03-08 20:05:56'),
(24, 'f7e0b4da-0b3b-454b-8198-34cc05518ff7', '019c9f08-4ec6-72e1-8c49-40ee40133780', 'in', 1, 'order_cancellation', '100', 15.99, '{\"order_reference\":\"ORD-2026-00001\",\"cancelled_at\":\"2026-03-08T21:05:56.000000Z\",\"product_name\":\"Tisane de feuilles d\'Ang\\u00e9lique biologique Yawoum village\",\"old_stock\":99}', '2026-03-08 20:05:56', '2026-03-08 20:05:56'),
(25, '917af3f5-67c3-4489-bda9-7d3542824c00', '019cde8b-9d67-73f0-b0d7-95e5b3f73bcf', 'out', 1, 'order_creation', '99', 60.00, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00005\",\"product_name\":\"Tisane d\\u00e9tox minceur de Yawoum Village\"}', '2026-03-11 19:16:57', '2026-03-11 19:16:57'),
(26, '0fee0ec3-b92e-453b-8f25-03121994c49b', '019d6e99-0676-7347-a816-c768b8a9ba0d', 'out', 2, 'order_creation', '98', 18.00, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00006\",\"product_name\":\"Infusion de racines de pissenlit biologique yawoum village\"}', '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(27, 'be1807a8-6927-4a2b-aa3b-ae486f9d8e1b', '019d6e99-0676-7347-a816-c768b8a9ba0d', 'out', 1, 'order_creation', '99', 11.99, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00006\",\"product_name\":\"Tisane de souci officinal biologique Yawoum village\"}', '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(28, 'eccbf4ec-f120-488a-b973-e5078462364a', '019d6e99-0676-7347-a816-c768b8a9ba0d', 'out', 1, 'order_creation', '99', 29.99, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00006\",\"product_name\":\"Bois de santal biologique Yawoum village\"}', '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(29, 'ed4e5093-1151-4849-af0f-fe2a0f7e4a90', '019d6e99-0676-7347-a816-c768b8a9ba0d', 'out', 1, 'order_creation', '99', 15.99, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00006\",\"product_name\":\"Infusion de thym biologique Yawoum village\"}', '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(30, 'f651fd40-1735-4ad8-a3e0-7bfd742a5cdc', '019d6e99-0676-7347-a816-c768b8a9ba0d', 'out', 1, 'order_creation', '99', 80.00, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00006\",\"product_name\":\"Bain de d\\u00e9senvoutement d\'excellence Yawoum Village\"}', '2026-04-08 18:36:55', '2026-04-08 18:36:55'),
(31, '0564789e-6aa3-41f4-8735-d98baf9b4c07', '019d6e9a-3e5c-72b3-90d8-64bb50c230f6', 'out', 1, 'order_creation', '99', 12.00, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00007\",\"product_name\":\"Gingembre biologique en poudre Yawoum village\"}', '2026-04-08 18:38:15', '2026-04-08 18:38:15'),
(32, '0fee0ec3-b92e-453b-8f25-03121994c49b', '019d6e9a-3e5c-72b3-90d8-64bb50c230f6', 'out', 1, 'order_creation', '97', 18.00, '{\"old_stock\":98,\"order_reference\":\"ORD-2026-00007\",\"product_name\":\"Infusion de racines de pissenlit biologique yawoum village\"}', '2026-04-08 18:38:15', '2026-04-08 18:38:15'),
(33, '4e9dc16c-8c1b-4b7c-8c81-dcd9abceb794', '019d6e9a-3e5c-72b3-90d8-64bb50c230f6', 'out', 1, 'order_creation', '99', 4.99, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00007\",\"product_name\":\"Tisane de feuilles d\'artichaut biologique Yawoum village\"}', '2026-04-08 18:38:15', '2026-04-08 18:38:15'),
(34, '917af3f5-67c3-4489-bda9-7d3542824c00', '019d6e9a-3e5c-72b3-90d8-64bb50c230f6', 'out', 1, 'order_creation', '98', 60.00, '{\"old_stock\":99,\"order_reference\":\"ORD-2026-00007\",\"product_name\":\"Tisane d\\u00e9tox minceur de Yawoum Village\"}', '2026-04-08 18:38:15', '2026-04-08 18:38:15'),
(35, '11033c83-5cd5-4c89-9b53-2d76d6430181', '019d79b0-be14-703f-9dc2-d66392095a10', 'out', 1, 'order_creation', '99', 55.00, '{\"old_stock\":100,\"order_reference\":\"ORD-2026-00008\",\"product_name\":\"Elixir bien-\\u00eatre\"}', '2026-04-10 22:18:39', '2026-04-10 22:18:39'),
(36, '11033c83-5cd5-4c89-9b53-2d76d6430181', '019d79b0-e0d8-721b-844f-f75de22c8db3', 'out', 1, 'order_creation', '98', 55.00, '{\"old_stock\":99,\"order_reference\":\"ORD-2026-00009\",\"product_name\":\"Elixir bien-\\u00eatre\"}', '2026-04-10 22:18:48', '2026-04-10 22:18:48');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `role` enum('admin','gestionnaire','client') NOT NULL DEFAULT 'client',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `phone`, `email`, `password`, `is_locked`, `role`, `remember_token`, `created_at`, `updated_at`, `google_id`) VALUES
(1, 'Admin', 'User', '696063115', 'admin@example.com', '$2y$12$4WNCPMdnmBNU8h//wUK.zeHMo82a//h4/K8PIrrhfTEvaQx6Rrh4m', 0, 'admin', NULL, '2026-02-26 09:54:00', '2026-04-10 07:59:10', NULL),
(2, 'Gestionnaire', 'User', '35382008818626', 'gestionnaire@example.com', '$2y$12$tDE4RrXK6BCL7yF1.Mi9/ebI29hwb4BkZsRHQpC9Px6aXFMfRTJYW', 0, 'gestionnaire', NULL, '2026-02-26 09:54:00', '2026-02-27 00:19:46', NULL),
(3, 'Client', 'User', NULL, 'client@example.com', '$2y$12$SqZInc32lT6C6MaY3ed8O.o.BFCiFqOJqn5Zg70o7HycJmm9NRosO', 0, 'client', NULL, '2026-02-26 09:54:01', '2026-02-26 09:54:01', NULL),
(5, 'Taylor', 'Ryan', '657140688', 'sethryan707@gmail.com', '$2y$12$MiihehKDJ2itZvhBM1Bk/.AEgxeiRYUj0O2GQWwZvP65GMIHrfz4u', 0, 'client', NULL, '2026-03-06 00:08:21', '2026-03-06 00:08:21', NULL),
(6, 'Nyambang', 'Tresor', '+237656249695', 'nyambangetresor@gmail.com', '$2y$12$z/JOHKoU1s43OEdFNRiqo.2Ss3qta0AUNS1UJrN/FCtAN0Ba3zCWG', 0, 'client', NULL, '2026-03-06 00:08:40', '2026-03-06 00:08:40', NULL),
(7, 'Christian', 'MPONDO EPO', '298603', 'mpchristian703@gmail.com', '$2y$12$ehbrBiCsre9C9MiOjMeN4.aAU7t5BuEtNOQXdvxu/zoxDC3O/qJkK', 0, 'gestionnaire', NULL, '2026-03-09 10:24:07', '2026-03-09 10:24:07', NULL),
(10, 'Mc', 'Soltice', '69606311555', 'mcsoltice@gmail.com', '$2y$12$2jv/fsenL3eHZIKbA08RmuBsP0UEvxAphU1wUYv3MNmeMfF8a.LVO', 0, 'client', NULL, '2026-04-09 14:45:50', '2026-04-10 09:10:08', '107485233594049546836');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject` (`subject_type`,`subject_id`),
  ADD KEY `causer` (`causer_type`,`causer_id`),
  ADD KEY `activity_log_log_name_index` (`log_name`);

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Index pour la table `delivery_options`
--
ALTER TABLE `delivery_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `delivery_options_is_active_order_index` (`is_active`,`order`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `login_attempts_user_id_foreign` (`user_id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Index pour la table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_reference_unique` (`reference`),
  ADD KEY `orders_delivery_option_id_foreign` (`delivery_option_id`),
  ADD KEY `orders_status_created_at_index` (`status`,`created_at`),
  ADD KEY `orders_user_id_created_at_index` (`user_id`,`created_at`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`),
  ADD KEY `order_items_order_id_product_id_index` (`order_id`,`product_id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_category_id_foreign` (`category_id`);

--
-- Index pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_images_product_id_foreign` (`product_id`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Index pour la table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_movements_product_id_created_at_index` (`product_id`,`created_at`),
  ADD KEY `stock_movements_order_id_movement_type_index` (`order_id`,`movement_type`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `delivery_options`
--
ALTER TABLE `delivery_options`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT pour la table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD CONSTRAINT `login_attempts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_delivery_option_id_foreign` FOREIGN KEY (`delivery_option_id`) REFERENCES `delivery_options` (`id`),
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Contraintes pour la table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Contraintes pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `stock_movements_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
