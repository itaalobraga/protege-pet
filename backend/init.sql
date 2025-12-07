SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

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
CREATE INDEX idx_vlt_nome ON voluntarios(vlt_nome);
CREATE INDEX idx_vlt_cpf ON voluntarios(vlt_cpf);

INSERT INTO voluntarios (vlt_nome, vlt_cpf, vlt_telefone, vlt_tel_Residencial, vlt_email, vlt_disponibilidade) VALUES
('Ana Carolina Silva', '123.456.789-00', '(18) 99876-5432', '(18) 3221-4567', 'ana.silva@email.com', 'Segunda a Sexta - Manhã'),
('Carlos Eduardo Santos', '234.567.890-11', '(18) 98765-4321', '(18) 3222-5678', 'carlos.santos@email.com', 'Sábados e Domingos'),
('Fernanda Oliveira Costa', '345.678.901-22', '(18) 97654-3210', '(18) 3223-6789', 'fernanda.costa@email.com', 'Terça e Quinta - Tarde'),
('João Pedro Almeida', '456.789.012-33', '(18) 96543-2109', '(18) 3224-7890', 'joao.almeida@email.com', 'Segunda a Sexta - Noite'),
('Mariana Lima Pereira', '567.890.123-44', '(18) 95432-1098', '(18) 3225-8901', 'mariana.lima@email.com', 'Finais de Semana - Integral');

CREATE TABLE IF NOT EXISTS usuarios (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  funcao VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  disponibilidade VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuario_nome ON usuarios(nome);

INSERT INTO usuarios (id, nome, funcao, telefone, email, disponibilidade, senha) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ana Silva', 'Administração', '(11) 98765-4321', 'ana.silva@protegepet.org', 'Segunda a Sexta', '123456'),
('550e8400-e29b-41d4-a716-446655440002', 'Carlos Santos', 'Veterinário', '(11) 97654-3210', 'carlos.santos@protegepet.org', 'Plantão', '123456'),
('550e8400-e29b-41d4-a716-446655440003', 'Fernanda Costa', 'Voluntariado', '(11) 96543-2109', 'fernanda.costa@protegepet.org', 'Final de Semana', '123456'),
('550e8400-e29b-41d4-a716-446655440004', 'João Oliveira', 'Financeiro', '(11) 95432-1098', 'joao.oliveira@protegepet.org', 'Segunda a Sexta', '123456'),
('550e8400-e29b-41d4-a716-446655440005', 'Mariana Lima', 'Comunicação', '(11) 94321-0987', 'mariana.lima@protegepet.org', 'Dias Alternados', '123456');

CREATE TABLE IF NOT EXISTS animais (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raca VARCHAR(100),
  pelagem VARCHAR(100),
  sexo VARCHAR(20) NOT NULL,
  data_nascimento DATE,
  data_ocorrencia DATE,
  local_resgate VARCHAR(255),
  porte VARCHAR(20),
  peso VARCHAR(20),
  status VARCHAR(50) DEFAULT 'Apto',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_animal_nome ON animais(nome);
CREATE INDEX idx_animal_especie ON animais(especie);

INSERT INTO animais (nome, especie, raca, pelagem, sexo, data_nascimento, data_ocorrencia, local_resgate, porte, peso, status) VALUES
('Rex', 'Canina', 'Labrador', 'Dourada', 'Macho', '2022-03-15', '2024-01-10', 'Av. Brasil, 1500 - Centro', 'Grande', '28kg', 'Apto'),
('Mimi', 'Felina', 'Siamês', 'Bege com pontas escuras', 'Fêmea', '2023-06-20', '2024-02-05', 'Rua das Flores, 230', 'Pequeno', '4kg', 'Apto'),
('Thor', 'Canina', 'Pastor Alemão', 'Preta e marrom', 'Macho', '2021-11-08', '2024-01-25', 'Praça Central', 'Grande', '35kg', 'Em tratamento'),
('Luna', 'Felina', 'Persa', 'Branca', 'Fêmea', '2022-09-12', '2024-03-01', 'Condomínio Solar, Bloco B', 'Médio', '5kg', 'Apto'),
('Bob', 'Canina', 'Vira-lata', 'Caramelo', 'Macho', '2023-01-01', '2024-02-20', 'Terminal Rodoviário', 'Médio', '15kg', 'Apto');

CREATE TABLE IF NOT EXISTS produtos (
  id VARCHAR(100) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sku VARCHAR(80) NOT NULL UNIQUE,
  quantidade INT DEFAULT 0,
  categoria VARCHAR(80),
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_produto_nome ON produtos(nome);
CREATE INDEX idx_produto_sku ON produtos(sku);
CREATE INDEX idx_produto_categoria ON produtos(categoria);

INSERT INTO produtos (id, nome, sku, quantidade, categoria, descricao) VALUES
('p1', 'Ração Premium Gatos 1KG', '1507089', 10, 'Ração', 'Ração seca para gatos adultos'),
('p2', 'Mordedor para Cães - Pequeno', '1907052', 0, 'Brinquedo', 'Mordedor resistente para cães pequenos'),
('p3', 'Areia Sanitária Pipcat 4KG', '5587456', 3, 'Higiene', 'Areia sanitária para gatos'),
('p4', 'Ração Golden Gatos Castrados 3KG', '8701254', 12, 'Ração', 'Ração premium para gatos castrados'),
('p5', 'Ração Golden Cães Filhotes 1KG', '4509978', 20, 'Ração', 'Para filhotes de raças pequenas'),
('p6', 'Parede de Arranhador para Gatos', '3301874', 7, 'Brinquedo', 'Arranhador compacto para gatos'),
('p7', 'Shampoo Neutro para Cães 500ml', '9985320', 8, 'Higiene', 'Shampoo neutro para todos os tipos de pelagem'),
('p8', 'Cama Pet Super Macia M', '7765011', 4, 'Acessório', 'Cama macia tamanho médio'),
('p9', 'Guia Retrátil 3m Azul', '2234987', 9, 'Acessório', 'Guia retrátil para cães até 10kg'),
('p10', 'Coleira Antipulgas Gatos', '8801655', 6, 'Higiene', 'Coleira antipulgas com duração de 2 meses'),
('m1', 'Vermífugo Drontal Gatos 2 comprimidos', '9901001', 15, 'Remédios', 'Antiparasitário oral para gatos'),
('m2', 'Antibiótico Enrofloxacina 50mg 10cp', '9901002', 12, 'Remédios', 'Antibiótico de amplo espectro'),
('m3', 'Anti-inflamatório Carprofeno 25mg 20cp', '9901003', 20, 'Remédios', 'Anti-inflamatório para cães');

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

CREATE INDEX idx_veterinario_nome ON veterinarios(nome);
CREATE INDEX idx_veterinario_email ON veterinarios(email);
CREATE INDEX idx_veterinario_crmv ON veterinarios(crmv);

INSERT INTO veterinarios (nome, sobrenome, telefone, email, crmv, disponibilidade) VALUES
('Ricardo', 'Mendes', '(11) 99876-5432', 'ricardo.mendes@protegepet.org', 'CRMV-SP 12345', 'Segunda a Sexta - Manhã'),
('Juliana', 'Santos', '(11) 98765-4321', 'juliana.santos@protegepet.org', 'CRMV-SP 23456', 'Plantão'),
('Fernando', 'Costa', '(11) 97654-3210', 'fernando.costa@protegepet.org', 'CRMV-SP 34567', 'Sábados e Domingos'),
('Camila', 'Oliveira', '(11) 96543-2109', 'camila.oliveira@protegepet.org', 'CRMV-SP 45678', 'Segunda a Sexta - Tarde'),
('Bruno', 'Lima', '(11) 95432-1098', 'bruno.lima@protegepet.org', 'CRMV-SP 56789', 'Noturno');
