
CREATE DATABASE IF NOT EXISTS `fika`;
USE `fika`;


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;


DROP TABLE IF EXISTS `commandes`;
CREATE TABLE IF NOT EXISTS `commandes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int DEFAULT NULL,
  `date_commande` datetime DEFAULT CURRENT_TIMESTAMP,
  `statut` enum('en cours','terminée','annulée') COLLATE utf8mb3_bin DEFAULT 'en cours',
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;


DROP TABLE IF EXISTS `details_commande`;
CREATE TABLE IF NOT EXISTS `details_commande` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commande_id` int DEFAULT NULL,
  `plat_id` int DEFAULT NULL,
  `quantite` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `commande_id` (`commande_id`),
  KEY `plat_id` (`plat_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

DROP TABLE IF EXISTS `plats`;
CREATE TABLE IF NOT EXISTS `plats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `description` text COLLATE utf8mb3_bin,
  `prix` decimal(10,2) NOT NULL,
  `categorie_id` int DEFAULT NULL,
  `promotion` tinyint(1) DEFAULT '0',
  `image` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categorie_id` (`categorie_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

INSERT INTO `categories` (`nom`) 
VALUES 
('Salade Y-novante'), 
('Plats chaud Y-novant'), 
('Y-Dessert'), 
('Y-snack');

INSERT INTO `plats` (`nom`, `description`, `prix`, `categorie_id`, `promotion`, `image`) 
VALUES 
('Salade César', 'Salade, poulet, parmesan, croutons, sauce César', 12.50, 1, 0, 'salade_cesar.jpg'),
('Salade Niçoise', 'Salade, thon, œufs, olives, haricots verts, tomates', 13.00, 1, 0, 'salade_nicoise.jpg'),
('Poke Bowl Saumon', 'Riz, saumon frais, avocat, concombre, edamame', 15.99, 1, 0, 'poke_saumon.jpg'),
('Poke Bowl Poulet', 'Riz, poulet mariné, avocat, concombre, edamame', 14.99, 1, 0, 'poke_poulet.jpg'),
('Burger Poulet', 'Pain, poulet, fromage, salade, tomate, sauce', 10.50, 2, 0, 'burger_poulet.jpg'),
('Wrap Poulet', 'Tortilla, poulet, fromage, salade, tomate, sauce', 8.50, 2, 0, 'wrap_poulet.jpg'),
('Wrap Saumon', 'Tortilla, saumon fumé, fromage, salade, tomate, sauce', 9.50, 2, 0, 'wrap_saumon.jpg'),
('Pizza Margherita', 'Tomate, mozzarella, basilic', 9.50, 2, 0, 'pizza_margherita.jpg'),
('Pizza Reine', 'Tomate, mozzarella, jambon, champignons', 11.00, 2, 0, 'pizza_reine.jpg'),
('Lasagnes', 'Pâtes, bœuf, tomate, béchamel, fromage', 12.00, 2, 0, 'lasagnes.jpg'),
('Tiramisu', 'Café, mascarpone, cacao, biscuits', 6.50, 3, 0, 'tiramisu.jpg'),
('Tiramisu Kinder Bueno', 'Café, mascarpone, cacao, biscuits', 6.50, 3, 0, 'tiramisu_buenos.jpg'),
('Fondant au Chocolat', 'Chocolat, beurre, œufs, sucre, farine', 7.00, 3, 0, 'fondant_chocolat.jpg'),
('Cheesecake', 'Fromage frais, biscuits, sucre, œufs', 6.50, 3, 0, 'cheesecake.jpg'),
('Muffin Myrtille', 'Farine, sucre, œufs, myrtilles', 3.50, 4, 0, 'muffin_myrtille.jpg'),
('Cookie Chocolat', 'Farine, sucre, œufs, pépites de chocolat', 2.50, 4, 0, 'cookie_chocolat.jpg'),
('Brownie', 'Chocolat, beurre, œufs, sucre, farine', 3.00, 4, 0, 'brownie.jpg'),
('Fondant Chocolat', 'Chocolat, beurre, œufs, sucre, farine', 3.00, 4, 0, 'fondant_chocolat.jpg');


DROP TABLE IF EXISTS `statistiques`;
CREATE TABLE IF NOT EXISTS `statistiques` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `ventes` decimal(10,2) NOT NULL,
  `plats_populaires` text COLLATE utf8mb3_bin,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;



DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `mot_de_passe` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `role` enum('client','admin') COLLATE utf8mb3_bin DEFAULT 'client',
  `prenom` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  `adresse` varchar(255) COLLATE utf8mb3_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;
COMMIT;
  INSERT INTO `utilisateurs` (`nom`, `email`, `mot_de_passe`, `role`) 
  VALUES ('Admin', 'admin@example.com', 'adminpassword', 'admin');

CREATE TABLE IF NOT EXISTS `panier` (
    `id` int NOT NULL AUTO_INCREMENT,
    `utilisateur_id` int NOT NULL,
    `plat_id` int NOT NULL,
    `quantite` int NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`),
    FOREIGN KEY (`plat_id`) REFERENCES `plats`(`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;