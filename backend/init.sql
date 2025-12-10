SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

DROP TABLE IF EXISTS animais;
DROP TABLE IF EXISTS racas; 



CREATE TABLE IF NOT EXISTS voluntarios (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  vlt_nome VARCHAR(200) NOT NULL,
  vlt_cpf VARCHAR(200) NOT NULL,
  vlt_telefone VARCHAR(200) NOT NULL,
  vlt_tel_Residencial VARCHAR(200) NOT NULL,
  vlt_email VARCHAR(200) NOT NULL,
  vlt_disponibilidade VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_vlt_email ON voluntarios(vlt_email);

INSERT INTO voluntarios (vlt_nome, vlt_cpf, vlt_telefone, vlt_tel_Residencial, vlt_email, vlt_disponibilidade) VALUES
('Ana Carolina Silva', '123.456.789-00', '(18) 99876-5432', '(18) 3221-4567', 'ana.silva@email.com', 'Segunda a Sexta - Manhã'),
('Carlos Eduardo Santos', '234.567.890-11', '(18) 98765-4321', '(18) 3222-5678', 'carlos.santos@email.com', 'Sábados e Domingos');


CREATE TABLE IF NOT EXISTS funcoes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  permissoes JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO funcoes (nome, permissoes) VALUES
('Administrador', '["Gerenciar usuários", "Gerenciar produtos", "Gerenciar voluntários", "Gerenciar veterinários", "Gerenciar animais"]'),
('Atendente', '["Gerenciar animais", "Gerenciar voluntários"]');


CREATE TABLE IF NOT EXISTS usuarios (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  funcao_id INT NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  disponibilidade VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (funcao_id) REFERENCES funcoes(id) ON DELETE RESTRICT ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO usuarios (id, nome, funcao_id, telefone, email, disponibilidade, senha) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ana Silva', 1, '(11) 98765-4321', 'ana.silva@protegepet.org', 'Segunda a Sexta - Manhã', '123456');

CREATE TABLE IF NOT EXISTS racas (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  especie ENUM('CANINA', 'FELINA', 'AVE', 'OUTRO') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO racas (nome, especie) VALUES
('Labrador', 'CANINA'), 
('Persa', 'FELINA'), 
('Pastor Alemão', 'CANINA'), 
('Siamês', 'FELINA'), 
('Vira-lata', 'CANINA'); 

CREATE TABLE IF NOT EXISTS animais (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raca_id INT, 
  pelagem VARCHAR(100),
  sexo VARCHAR(20) NOT NULL,
  data_nascimento DATE,
  data_ocorrencia DATE,
  local_resgate VARCHAR(255),
  porte VARCHAR(20),
  peso VARCHAR(20),
  status VARCHAR(50) DEFAULT 'Apto',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (raca_id) REFERENCES racas(id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO animais (nome, especie, raca_id, pelagem, sexo, data_nascimento, data_ocorrencia, local_resgate, porte, peso, status) VALUES
('Rex', 'Canina', 1, 'Dourada', 'Macho', '2022-03-15', '2024-01-10', 'Av. Brasil, 1500 - Centro', 'Grande', '28kg', 'Apto'),
('Mimi', 'Felina', 4, 'Bege com pontas escuras', 'Fêmea', '2023-06-20', '2024-02-05', 'Rua das Flores, 230', 'Pequeno', '4kg', 'Apto');

CREATE TABLE IF NOT EXISTS categorias_produtos (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO categorias_produtos (nome, descricao) VALUES
('Acessório', 'Coleiras, guias, camas...'),
('Ração', 'Rações secas e úmidas...');

CREATE TABLE IF NOT EXISTS produtos (
  id VARCHAR(100) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sku VARCHAR(80) NOT NULL UNIQUE,
  quantidade INT DEFAULT 0,
  categoria_id INT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_produto_categoria
  FOREIGN KEY (categoria_id) REFERENCES categorias_produtos(id) ON DELETE RESTRICT ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO produtos (id, nome, sku, quantidade, categoria_id, descricao) VALUES
('p1', 'Ração Premium Gatos 1KG', '1507089', 10, 2, 'Ração seca para gatos adultos');


CREATE TABLE IF NOT EXISTS veterinarios (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sobrenome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  crmv VARCHAR(20) NOT NULL,
  disponibilidade VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;