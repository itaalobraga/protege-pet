SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS voluntarios (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  vlt_nome VARCHAR(200) NOT NULL,
  vlt_cpf VARCHAR(200) NOT NULL,
  vlt_telefone VARCHAR(200) NOT NULL,
  vlt_tel_residencial VARCHAR(200) NOT NULL,
  vlt_email VARCHAR(200) NOT NULL,
  vlt_disponibilidade VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_vlt_email ON voluntarios(vlt_email);
CREATE INDEX idx_vlt_nome ON voluntarios(vlt_nome);
CREATE INDEX idx_vlt_cpf ON voluntarios(vlt_cpf);

INSERT INTO voluntarios (vlt_nome, vlt_cpf, vlt_telefone, vlt_tel_residencial, vlt_email, vlt_disponibilidade) VALUES
('Ana Carolina Silva', '123.456.789-00', '(18) 99876-5432', '(18) 3221-4567', 'ana.silva@email.com', 'Segunda a Sexta - Manhã'),
('Carlos Eduardo Santos', '234.567.890-11', '(18) 98765-4321', '(18) 3222-5678', 'carlos.santos@email.com', 'Sábados e Domingos'),
('Fernanda Oliveira Costa', '345.678.901-22', '(18) 97654-3210', '(18) 3223-6789', 'fernanda.costa@email.com', 'Terça e Quinta - Tarde'),
('João Pedro Almeida', '456.789.012-33', '(18) 96543-2109', '(18) 3224-7890', 'joao.almeida@email.com', 'Segunda a Sexta - Noite'),
('Mariana Lima Pereira', '567.890.123-44', '(18) 95432-1098', '(18) 3225-8901', 'mariana.lima@email.com', 'Finais de Semana - Integral');

DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS funcoes_permissoes;
DROP TABLE IF EXISTS funcoes;
DROP TABLE IF EXISTS permissoes;

CREATE TABLE IF NOT EXISTS permissoes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_permissao_nome ON permissoes(nome);

INSERT INTO permissoes (nome) VALUES
('Gerenciar usuários'),
('Gerenciar produtos'),
('Gerenciar voluntários'),
('Gerenciar veterinários'),
('Gerenciar animais');

CREATE TABLE IF NOT EXISTS funcoes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_funcao_nome ON funcoes(nome);

INSERT INTO funcoes (nome) VALUES
('Administrador'),
('Gerente de Estoque'),
('Coordenador de Voluntários'),
('Veterinário Responsável'),
('Atendente');

CREATE TABLE IF NOT EXISTS funcoes_permissoes (
  funcao_id INT NOT NULL,
  permissao_id INT NOT NULL,
  PRIMARY KEY (funcao_id, permissao_id),
  CONSTRAINT fk_funcoes_permissoes_funcao
    FOREIGN KEY (funcao_id) REFERENCES funcoes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_funcoes_permissoes_permissao
    FOREIGN KEY (permissao_id) REFERENCES permissoes(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO funcoes_permissoes (funcao_id, permissao_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 2),
(3, 3), (3, 5),
(4, 4), (4, 5),
(5, 5), (5, 3);

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
  CONSTRAINT fk_usuario_funcao
    FOREIGN KEY (funcao_id) REFERENCES funcoes(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_usuario_nome ON usuarios(nome);
CREATE INDEX idx_usuario_funcao ON usuarios(funcao_id);

INSERT INTO usuarios (id, nome, funcao_id, telefone, email, disponibilidade, senha)
SELECT UUID(), 'Roberto Mendes', f.id, '(18) 99999-0000', 'admin@protegepet.com.br', 'Integral', '$2b$10$CRIwsNJRmxEe3QCThfCYEux8sKoxAvz2L09pc7dAgWkJPofKr3TS6'
FROM funcoes f WHERE f.nome = 'Administrador' LIMIT 1;
INSERT INTO usuarios (id, nome, funcao_id, telefone, email, disponibilidade, senha)
SELECT UUID(), 'Ana Silva', f.id, '(18) 98765-4321', 'ana.silva@protegepet.com.br', 'Segunda a Sexta - Manhã', '$2b$10$CRIwsNJRmxEe3QCThfCYEux8sKoxAvz2L09pc7dAgWkJPofKr3TS6'
FROM funcoes f WHERE f.nome = 'Atendente' LIMIT 1;
INSERT INTO usuarios (id, nome, funcao_id, telefone, email, disponibilidade, senha)
SELECT UUID(), 'Carlos Santos', f.id, '(18) 97654-3210', 'carlos.santos@protegepet.com.br', 'Plantão', '$2b$10$CRIwsNJRmxEe3QCThfCYEux8sKoxAvz2L09pc7dAgWkJPofKr3TS6'
FROM funcoes f WHERE f.nome = 'Veterinário Responsável' LIMIT 1;
INSERT INTO usuarios (id, nome, funcao_id, telefone, email, disponibilidade, senha)
SELECT UUID(), 'Fernanda Costa', f.id, '(18) 96543-2109', 'fernanda.costa@protegepet.com.br', 'Sábados e Domingos', '$2b$10$CRIwsNJRmxEe3QCThfCYEux8sKoxAvz2L09pc7dAgWkJPofKr3TS6'
FROM funcoes f WHERE f.nome = 'Coordenador de Voluntários' LIMIT 1;
INSERT INTO usuarios (id, nome, funcao_id, telefone, email, disponibilidade, senha)
SELECT UUID(), 'João Oliveira', f.id, '(18) 95432-1098', 'joao.oliveira@protegepet.com.br', 'Segunda a Sexta - Tarde', '$2b$10$CRIwsNJRmxEe3QCThfCYEux8sKoxAvz2L09pc7dAgWkJPofKr3TS6'
FROM funcoes f WHERE f.nome = 'Gerente de Estoque' LIMIT 1;
INSERT INTO usuarios (id, nome, funcao_id, telefone, email, disponibilidade, senha)
SELECT UUID(), 'Mariana Lima', f.id, '(18) 94321-0987', 'mariana.lima@protegepet.com.br', 'Noturno', '$2b$10$CRIwsNJRmxEe3QCThfCYEux8sKoxAvz2L09pc7dAgWkJPofKr3TS6'
FROM funcoes f WHERE f.nome = 'Atendente' LIMIT 1;

DROP TABLE IF EXISTS animais;
DROP TABLE IF EXISTS racas;

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
  CONSTRAINT fk_animal_raca
    FOREIGN KEY (raca_id) REFERENCES racas(id)
    ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_animal_nome ON animais(nome);
CREATE INDEX idx_animal_especie ON animais(especie);

INSERT INTO animais (nome, especie, raca_id, pelagem, sexo, data_nascimento, data_ocorrencia, local_resgate, porte, peso, status) VALUES
('Rex', 'Canina', 1, 'Dourada', 'Macho', '2022-03-15', '2024-01-10', 'Av. Brasil, 1500 - Centro', 'Grande', '28kg', 'Apto'),
('Mimi', 'Felina', 4, 'Bege com pontas escuras', 'Fêmea', '2023-06-20', '2024-02-05', 'Rua das Flores, 230', 'Pequeno', '4kg', 'Apto'),
('Thor', 'Canina', 3, 'Preta e marrom', 'Macho', '2021-11-08', '2024-01-25', 'Praça Central', 'Grande', '35kg', 'Em tratamento'),
('Luna', 'Felina', 2, 'Branca', 'Fêmea', '2022-09-12', '2024-03-01', 'Condomínio Solar, Bloco B', 'Médio', '5kg', 'Apto'),
('Bob', 'Canina', 5, 'Caramelo', 'Macho', '2023-01-01', '2024-02-20', 'Terminal Rodoviário', 'Médio', '15kg', 'Apto');

CREATE TABLE IF NOT EXISTS categorias_produtos (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_categoria_produto_nome ON categorias_produtos(nome);

INSERT INTO categorias_produtos (nome, descricao) VALUES
('Acessório', 'Coleiras, guias, camas, casinhas e outros acessórios para pets'),
('Brinquedo', 'Brinquedos e mordedores para cães e gatos'),
('Higiene', 'Produtos de higiene, limpeza e cuidados pessoais para animais'),
('Ração', 'Rações secas e úmidas para cães e gatos'),
('Remédios', 'Medicamentos, vermífugos e produtos veterinários'),
('Petisco', 'Petiscos, snacks e recompensas para pets'),
('Outros', 'Outros produtos diversos para animais de estimação');

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
    FOREIGN KEY (categoria_id) REFERENCES categorias_produtos(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_produto_nome ON produtos(nome);
CREATE INDEX idx_produto_sku ON produtos(sku);
CREATE INDEX idx_produto_categoria_id ON produtos(categoria_id);

INSERT INTO produtos (id, nome, sku, quantidade, categoria_id, descricao) VALUES
('p1', 'Ração Premium Gatos 1KG', '1507089', 10, 4, 'Ração seca para gatos adultos'),
('p2', 'Mordedor para Cães - Pequeno', '1907052', 0, 2, 'Mordedor resistente para cães pequenos'),
('p3', 'Areia Sanitária Pipcat 4KG', '5587456', 3, 3, 'Areia sanitária para gatos'),
('p4', 'Ração Golden Gatos Castrados 3KG', '8701254', 12, 4, 'Ração premium para gatos castrados'),
('p5', 'Ração Golden Cães Filhotes 1KG', '4509978', 20, 4, 'Para filhotes de raças pequenas'),
('p6', 'Parede de Arranhador para Gatos', '3301874', 7, 2, 'Arranhador compacto para gatos'),
('p7', 'Shampoo Neutro para Cães 500ml', '9985320', 8, 3, 'Shampoo neutro para todos os tipos de pelagem'),
('p8', 'Cama Pet Super Macia M', '7765011', 4, 1, 'Cama macia tamanho médio'),
('p9', 'Guia Retrátil 3m Azul', '2234987', 9, 1, 'Guia retrátil para cães até 10kg'),
('p10', 'Coleira Antipulgas Gatos', '8801655', 6, 3, 'Coleira antipulgas com duração de 2 meses'),
('m1', 'Vermífugo Drontal Gatos 2 comprimidos', '9901001', 15, 5, 'Antiparasitário oral para gatos'),
('m2', 'Antibiótico Enrofloxacina 50mg 10cp', '9901002', 12, 5, 'Antibiótico de amplo espectro'),
('m3', 'Anti-inflamatório Carprofeno 25mg 20cp', '9901003', 20, 5, 'Anti-inflamatório para cães');

CREATE TABLE IF NOT EXISTS veterinarios (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sobrenome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  crmv VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_veterinario_nome ON veterinarios(nome);
CREATE INDEX idx_veterinario_email ON veterinarios(email);
CREATE INDEX idx_veterinario_crmv ON veterinarios(crmv);

INSERT INTO veterinarios (nome, sobrenome, telefone, email, crmv) VALUES
('Ricardo', 'Mendes', '(11) 99876-5432', 'ricardo.mendes@protegepet.com.br', 'CRMV-SP 12345'),
('Juliana', 'Santos', '(11) 98765-4321', 'juliana.santos@protegepet.com.br', 'CRMV-SP 23456'),
('Fernando', 'Costa', '(11) 97654-3210', 'fernando.costa@protegepet.com.br', 'CRMV-SP 34567'),
('Camila', 'Oliveira', '(11) 96543-2109', 'camila.oliveira@protegepet.com.br', 'CRMV-SP 45678'),
('Bruno', 'Lima', '(11) 95432-1098', 'bruno.lima@protegepet.com.br', 'CRMV-SP 56789');

CREATE TABLE IF NOT EXISTS disponibilidades_veterinarios (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  veterinario_id INT NOT NULL,
  dow TINYINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_disp_vet_dow ON disponibilidades_veterinarios(veterinario_id, dow);
CREATE INDEX idx_disp_vet_time ON disponibilidades_veterinarios(veterinario_id, start_time, end_time);

INSERT INTO disponibilidades_veterinarios (veterinario_id, dow, start_time, end_time) VALUES
(1, 1, '08:00:00', '12:00:00'),
(1, 2, '08:00:00', '12:00:00'),
(1, 3, '08:00:00', '12:00:00'),
(1, 4, '08:00:00', '12:00:00'),
(1, 5, '08:00:00', '12:00:00'),
(2, 1, '08:00:00', '18:00:00'),
(2, 2, '08:00:00', '18:00:00'),
(2, 3, '08:00:00', '18:00:00'),
(2, 4, '08:00:00', '18:00:00'),
(2, 5, '08:00:00', '18:00:00'),
(3, 6, '08:00:00', '18:00:00'),
(3, 7, '08:00:00', '18:00:00'),
(4, 1, '13:00:00', '18:00:00'),
(4, 2, '13:00:00', '18:00:00'),
(4, 3, '13:00:00', '18:00:00'),
(4, 4, '13:00:00', '18:00:00'),
(4, 5, '13:00:00', '18:00:00'),
(5, 1, '18:00:00', '22:00:00'),
(5, 2, '18:00:00', '22:00:00'),
(5, 3, '18:00:00', '22:00:00'),
(5, 4, '18:00:00', '22:00:00'),
(5, 5, '18:00:00', '22:00:00');

CREATE TABLE IF NOT EXISTS consultas_veterinarias (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  veterinario_id INT NOT NULL,
  animal_id INT NOT NULL,
  data_consulta DATETIME NOT NULL,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE RESTRICT,
  FOREIGN KEY (animal_id) REFERENCES animais(id) ON DELETE RESTRICT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_consulta_veterinario_data ON consultas_veterinarias(veterinario_id, data_consulta);
CREATE INDEX idx_consulta_animal_data ON consultas_veterinarias(animal_id, data_consulta);

CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id VARCHAR(36) PRIMARY KEY,
  produto_id VARCHAR(100) NOT NULL,
  tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
  quantidade INT NOT NULL,
  motivo VARCHAR(100) NOT NULL,
  observacao TEXT,
  responsavel VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_movimentacao_produto
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX idx_movimentacao_produto_id ON movimentacoes_estoque(produto_id);
CREATE INDEX idx_movimentacao_tipo ON movimentacoes_estoque(tipo);
CREATE INDEX idx_movimentacao_motivo ON movimentacoes_estoque(motivo);
CREATE INDEX idx_movimentacao_created_at ON movimentacoes_estoque(created_at);

INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'ENTRADA', 50, 'DOACAO', 'Empresa Alimento Pet - Campanha de doação', 'João Oliveira'
FROM produtos p WHERE p.sku = '1507089' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'ENTRADA', 24, 'DOACAO', 'Doação anônima', 'João Oliveira'
FROM produtos p WHERE p.sku = '8701254' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'ENTRADA', 30, 'COMPRA', 'Aquisição para estoque mensal', 'João Oliveira'
FROM produtos p WHERE p.sku = '9901001' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'SAIDA', 5, 'USO_DIARIO', 'Refeição dos gatos do setor B', 'Mariana Lima'
FROM produtos p WHERE p.sku = '1507089' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'SAIDA', 3, 'USO_DIARIO', 'Filhotes em recuperação', 'Mariana Lima'
FROM produtos p WHERE p.sku = '4509978' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'SAIDA', 4, 'TRATAMENTO', 'Vermifugação dos animais novos', 'Carlos Santos'
FROM produtos p WHERE p.sku = '9901001' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'ENTRADA', 20, 'DOACAO', 'Marca Pipcat - parceiro', 'João Oliveira'
FROM produtos p WHERE p.sku = '5587456' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'SAIDA', 2, 'TRATAMENTO', 'Banho dos animais para adoção', 'Ana Silva'
FROM produtos p WHERE p.sku = '9985320' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'SAIDA', 1, 'ADOCAO', 'Kit adoção - Rex', 'Fernanda Costa'
FROM produtos p WHERE p.sku = '2234987' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'SAIDA', 1, 'TRATAMENTO', 'Thor - infecção bacteriana', 'Carlos Santos'
FROM produtos p WHERE p.sku = '9901002' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'ENTRADA', 12, 'COMPRA', 'Reposição antipulgas', 'João Oliveira'
FROM produtos p WHERE p.sku = '8801655' LIMIT 1;
INSERT INTO movimentacoes_estoque (id, produto_id, tipo, quantidade, motivo, observacao, responsavel)
SELECT UUID(), p.id, 'ENTRADA', 15, 'DOACAO', 'Brinquedos para enriquecimento', 'João Oliveira'
FROM produtos p WHERE p.sku = '1907052' LIMIT 1;
