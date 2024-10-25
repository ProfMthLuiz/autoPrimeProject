-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 25/10/2024 às 12:35
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `autoprimebd`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `carros`
--

CREATE TABLE `carros` (
  `id_cars` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `ano` int(11) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `descricao` text DEFAULT NULL,
  `imagens` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `carros`
--

INSERT INTO `carros` (`id_cars`, `marca`, `modelo`, `ano`, `preco`, `descricao`, `imagens`) VALUES
(1, 'Toyota', 'Corolla', 2021, 90000.00, 'Sedan confortável e econômico.', 'url_imagem_toyota'),
(2, 'Honda', 'Civic', 2020, 85000.00, 'Estilo e performance em um único carro.', 'url_imagem_honda'),
(3, 'Ford', 'Mustang', 2022, 150000.00, 'Um ícone de esportividade e potência.', 'url_imagem_ford'),
(4, 'Toyota', 'Corolla', 1999, 100000.00, 'Corolla Prata!', '[\"1729078595933.jpg\",\"1729078595941.jpg\",\"1729078595950.jfif\"]');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id_users` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `sobrenome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `celular` varchar(15) DEFAULT NULL,
  `cpf` varchar(11) NOT NULL,
  `rg` varchar(15) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cep` varchar(50) DEFAULT NULL,
  `rua` varchar(100) DEFAULT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `bairro` varchar(50) DEFAULT NULL,
  `cidade` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id_users`, `nome`, `sobrenome`, `email`, `celular`, `cpf`, `rg`, `senha`, `cep`, `rua`, `numero`, `bairro`, `cidade`) VALUES
(1, 'João', 'Silva', 'joao.silva@email.com', '11987654321', '12345678901', 'MG1234567', 'senha123', '12345-678', 'Rua das Flores', '100', 'Centro', 'São Paulo'),
(2, 'Maria', 'Oliveira', 'maria.oliveira@email.com', '11987654322', '10987654321', 'MG2345678', 'senha456', '98765-432', 'Avenida Brasil', '200', 'Jardins', 'Rio de Janeiro'),
(3, 'Carlos', 'Souza', 'carlos.souza@email.com', '11987654323', '98765432100', 'MG3456789', 'senha789', '54321-098', 'Praça da Liberdade', '300', 'Liberdade', 'Belo Horizonte'),
(4, 'Thiago', 'Denadai', 'thiagodenadai@teste.com', '$2b$10$yD04wqQS', '(00) 00000-', '000.000.000-00', '00.000.000-0', '13172-705', 'Avenida Ivo Trevisan', '00', 'Jardim Consteca', 'Sumaré'),
(5, 'Guilherme', 'Restio', 'guirestio@gmail.com', '(99) 99999-9999', '111.111.111', '22.222.222-2', '$2b$10$Du3qm.kVcJzWd/hyxdZ.Hutyj2ZYsVFw/G14OqR7gUqWJRvrL1y.O', '13172-705', 'Avenida Ivo Trevisan', '222', 'Jardim Consteca', 'Sumaré');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios_carros`
--

CREATE TABLE `usuarios_carros` (
  `id` int(11) NOT NULL,
  `id_cars` int(11) DEFAULT NULL,
  `id_users` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios_carros`
--

INSERT INTO `usuarios_carros` (`id`, `id_cars`, `id_users`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 1, 3);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `carros`
--
ALTER TABLE `carros`
  ADD PRIMARY KEY (`id_cars`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_users`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `rg` (`rg`);

--
-- Índices de tabela `usuarios_carros`
--
ALTER TABLE `usuarios_carros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cars` (`id_cars`),
  ADD KEY `id_users` (`id_users`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `carros`
--
ALTER TABLE `carros`
  MODIFY `id_cars` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `usuarios_carros`
--
ALTER TABLE `usuarios_carros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `usuarios_carros`
--
ALTER TABLE `usuarios_carros`
  ADD CONSTRAINT `usuarios_carros_ibfk_1` FOREIGN KEY (`id_cars`) REFERENCES `carros` (`id_cars`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuarios_carros_ibfk_2` FOREIGN KEY (`id_users`) REFERENCES `usuarios` (`id_users`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
