-- 1. CRIAR BANCO (rode no terminal, depois conecte ao banco)
CREATE DATABASE nighthawks_agrirslab;
 
-- Depois, conecte ao banco 'nighthawks_agrirslab'
-- No psql, faça: \c nighthawks_agrirslab
 
-- 2. CRIAR TABELAS
 
CREATE TABLE cargo (
    id_cargo SERIAL PRIMARY KEY,
    ca_nome_cargo VARCHAR(100) NOT NULL
);

CREATE TABLE status (
    id_status SERIAL PRIMARY KEY,
    st_nome_status VARCHAR(100) NOT NULL
);
 
CREATE TABLE membros (
    id_membro SERIAL PRIMARY KEY,
    me_nome VARCHAR(100) NOT NULL,
    me_cpf VARCHAR(14) UNIQUE NOT NULL,
    me_email VARCHAR(100) UNIQUE NOT NULL,
    me_descricao TEXT,
    me_lattes VARCHAR(255),
    me_senha TEXT NOT NULL,
    me_imagem TEXT,
    me_administrador BOOLEAN DEFAULT FALSE,
    me_cargo INTEGER REFERENCES cargo(id_cargo) ON DELETE SET NULL
);
 
CREATE TABLE tipo_conteudo (
    id_tipo_conteudo SERIAL PRIMARY KEY,
    tc_conteudo VARCHAR(50) NOT NULL
);
 
CREATE TABLE conteudo (
    id_conteudo SERIAL PRIMARY KEY,
    co_titulo VARCHAR(255),
    co_publicante INTEGER REFERENCES membros(id_membro) ON DELETE SET NULL,
    co_autor VARCHAR(255),
    co_pdf TEXT,
    co_citacao TEXT,
    co_doi VARCHAR(100),
    co_data DATE,
    co_lide TEXT,
    co_status INTEGER REFERENCES status(id_status) ON DELETE SET NULL,
    co_data_inicio DATE,
    co_data_termino DATE,
    co_objetivo TEXT,
    co_requisitos TEXT,
    co_plano_trabalho TEXT,
    co_atividades TEXT,
    co_tipo_conteudo INTEGER REFERENCES tipo_conteudo(id_tipo_conteudo) ON DELETE SET NULL,
    co_conteudo TEXT,
    co_imagem VARCHAR(255)
);


 
-- 3. INSERIR DADOS
 
-- CARGOS
INSERT INTO cargo (ca_nome_cargo) VALUES
  ('Pesquisador'),
  ('Coordenador'),
  ('Bolsista'),
  ('Doutorando'),
  ('Mestrando');
--STATUS
INSERT INTO status (st_nome_status) VALUES
  ('Concluído'),
  ('Em andamento'),
  ('Agendado');
 
-- TIPOS DE CONTEÚDO
INSERT INTO tipo_conteudo (tc_conteudo) VALUES
  ('Publicação'),
  ('Notícia'),
  ('Projeto'),
  ('Vaga');
 
-- MEMBROS
INSERT INTO membros (
    me_nome, me_cpf, me_email, me_descricao, me_lattes,
    me_senha, me_imagem, me_administrador, me_cargo
) VALUES
  ('Ana Pereira',    '111.111.111-11', 'ana.pereira@uni.edu.br', 'Pesquisadora em sensores remotos.', 'http://lattes.cnpq.br/1111', 'senhaAna', 'ana.jpg', FALSE, 1),
  ('Bruno Costa',    '222.222.222-22', 'bruno.costa@uni.edu.br', 'Coordena projetos de extensão.', 'http://lattes.cnpq.br/2222', 'senhaBruno', 'bruno.png', FALSE, 2),
  ('Carla Moreira',  '333.333.333-33', 'carla.moreira@uni.edu.br', 'Técnica de laboratório.', NULL, 'senhaCarla', NULL, FALSE, 3),
  ('Diego Alves',    '444.444.444-44', 'diego.alves@uni.edu.br', 'Administrador do sistema.', NULL, 'senhaDiego', NULL, TRUE, 1),
  ('Eduardo Lima',   '555.555.555-55', 'eduardo.lima@uni.edu.br', 'Doutorando em agronomia.', 'http://lattes.cnpq.br/5555', 'senhaEduardo', 'eduardo.jpg', FALSE, 1),
  ('Fernanda Rocha', '666.666.666-66', 'fernanda.rocha@uni.edu.br', 'Jornalista responsável por notícias.', NULL, 'senhaFernanda', 'fernanda.png', FALSE, 2);
 
-- CONTEÚDOS

-- Publicações

INSERT INTO conteudo (co_titulo, co_publicante, co_autor, co_pdf, co_citacao, co_doi, co_data, co_tipo_conteudo) VALUES
('Impactos da Inteligência Artificial na Educação', 1, 'Ana Souza', '/pdfs/ia_educacao.pdf', 'Souza, A. (2025). Impactos da IA na Educação.', '10.1000/ed.2025.001', '2025-01-12', 1),
('Sustentabilidade Urbana e Mobilidade Verde', 2, 'Carlos Lima', '/pdfs/mobilidade_verde.pdf', 'Lima, C. (2025). Mobilidade Verde nas Cidades.', '10.1000/env.2025.002', '2025-02-20', 1),
('Novas Tendências em Computação Quântica', 3, 'Beatriz Santos', '/pdfs/computacao_quantica.pdf', 'Santos, B. (2025). Computação Quântica e Futuro.', '10.1000/tech.2025.003', '2025-03-10', 1),
('Gestão de Projetos Ágeis em Organizações Públicas', 4, 'João Ribeiro', '/pdfs/agile_publico.pdf', 'Ribeiro, J. (2025). Projetos Ágeis no Setor Público.', '10.1000/mgmt.2025.004', '2025-04-02', 1),
('Energias Renováveis e Políticas Sustentáveis', 5, 'Luciana Alves', '/pdfs/energias_renovaveis.pdf', 'Alves, L. (2025). Energias Renováveis e Sociedade.', '10.1000/env.2025.005', '2025-05-18', 1),
('Avanços em Medicina Regenerativa', 1, 'Fernanda Costa', '/pdfs/medicina_regenerativa.pdf', 'Costa, F. (2025). Avanços em Medicina Regenerativa.', '10.1000/med.2025.006', '2025-06-25', 1),
('A Economia Circular e os Novos Mercados', 2, 'Pedro Martins', '/pdfs/economia_circular.pdf', 'Martins, P. (2025). Economia Circular.', '10.1000/econ.2025.007', '2025-07-15', 1),
('Tecnologias de Blockchain Aplicadas à Educação', 3, 'Renata Nunes', '/pdfs/blockchain_educacao.pdf', 'Nunes, R. (2025). Blockchain Educacional.', '10.1000/tech.2025.008', '2025-08-01', 1),
('Psicologia do Trabalho na Era Digital', 4, 'Roberto Dias', '/pdfs/psicologia_trabalho.pdf', 'Dias, R. (2025). Psicologia do Trabalho.', '10.1000/soc.2025.009', '2025-09-12', 1),
('Inclusão e Diversidade em Ambientes Corporativos', 5, 'Juliana Ferreira', '/pdfs/inclusao_diversidade.pdf', 'Ferreira, J. (2025). Diversidade nas Empresas.', '10.1000/soc.2025.010', '2025-10-30', 1);

-- Notícias

INSERT INTO conteudo (co_titulo, co_lide, co_conteudo, co_data, co_autor, co_publicante, co_tipo_conteudo) VALUES
('Universidade lança novo programa de bolsas', 'Programa visa apoiar estudantes de baixa renda.', 'O novo programa oferecerá 200 bolsas integrais a partir de 2026.', '2025-01-05', 'Ana Souza', 1, 2),
('Evento sobre IA reúne especialistas internacionais', 'Congresso discute impactos da inteligência artificial.', 'O evento ocorreu em São Paulo e contou com mais de 50 palestrantes.', '2025-02-18', 'Carlos Lima', 2, 2),
('Prefeitura inaugura parque ecológico', 'Novo espaço verde é aberto ao público.', 'O parque possui trilhas, lago e áreas para piquenique.', '2025-03-11', 'Beatriz Santos', 3, 2),
('Estudantes desenvolvem app de reciclagem', 'Projeto incentiva práticas sustentáveis.', 'O aplicativo foi criado por alunos do curso de engenharia ambiental.', '2025-04-22', 'João Ribeiro', 4, 2),
('Pesquisa aponta crescimento de startups verdes', 'Empresas sustentáveis estão em alta.', 'Estudo mostra aumento de 30% em novos empreendimentos ecológicos.', '2025-05-14', 'Luciana Alves', 5, 2),
('Curso de programação tem recorde de inscrições', 'Mais de 5 mil pessoas se inscreveram.', 'O curso gratuito será oferecido online durante todo o ano.', '2025-06-10', 'Fernanda Costa', 1, 2),
('Hospital público inaugura centro de inovação', 'Espaço irá desenvolver novas tecnologias médicas.', 'O centro contará com laboratórios e parcerias com universidades.', '2025-07-03', 'Pedro Martins', 2, 2),
('Museu lança exposição de arte digital', 'Mostra reúne artistas de todo o país.', 'A exposição estará aberta até o fim de setembro.', '2025-08-09', 'Renata Nunes', 3, 2),
('Nova lei incentiva uso de energia solar', 'Governo aprova incentivos fiscais para energia limpa.', 'A medida deve impulsionar o setor nos próximos anos.', '2025-09-21', 'Roberto Dias', 4, 2),
('Festival cultural celebra diversidade', 'Evento reuniu milhares de pessoas no centro da cidade.', 'A programação incluiu apresentações musicais e gastronômicas.', '2025-10-16', 'Juliana Ferreira', 5, 2);

-- Projetos

INSERT INTO conteudo (co_titulo, co_atividades, co_status, co_data_inicio, co_data_termino, co_autor, co_publicante, co_tipo_conteudo) VALUES
('Projeto Cidades Inteligentes', 'Instalação de sensores urbanos e análise de dados.', 2, '2025-01-10', '2026-01-10', 'Ana Souza', 1, 3),
('Projeto Escola Verde', 'Educação ambiental e reciclagem nas escolas públicas.', 1, '2024-05-01', '2025-05-01', 'Carlos Lima', 2, 3),
('Projeto Saúde Conectada', 'Desenvolvimento de plataforma de telemedicina.', 2, '2025-02-15', '2025-12-15', 'Beatriz Santos', 3, 3),
('Projeto Mobilidade 360', 'Pesquisa sobre transporte sustentável.', 3, '2025-03-01', '2025-11-30', 'João Ribeiro', 4, 3),
('Projeto Energia do Futuro', 'Criação de laboratório de energia solar.', 2, '2025-04-10', '2026-04-10', 'Luciana Alves', 5, 3),
('Projeto InovaCampus', 'Laboratório de inovação tecnológica em universidades.', 2, '2025-05-15', '2026-05-15', 'Fernanda Costa', 1, 3),
('Projeto Social Conecta', 'Plataforma de voluntariado e ação social.', 2, '2025-06-01', '2025-12-01', 'Pedro Martins', 2, 3),
('Projeto AgroTech', 'Desenvolvimento de sensores para agricultura.', 3, '2025-07-05', '2026-01-05', 'Renata Nunes', 3, 3),
('Projeto Saúde Mental', 'Criação de aplicativo de apoio psicológico.', 2, '2025-08-20', '2026-02-20', 'Roberto Dias', 4, 3),
('Projeto Oceanos Limpos', 'Ações de limpeza e monitoramento de praias.', 1, '2024-09-01', '2025-09-01', 'Juliana Ferreira', 5, 3);


-- Vagas

INSERT INTO conteudo (co_titulo, co_data, co_objetivo, co_requisitos, co_plano_trabalho, co_atividades, co_tipo_conteudo, co_publicante) VALUES
('Estágio em Desenvolvimento Web', '2025-01-15', 'Auxiliar na criação de sistemas web.', 'Conhecimentos em HTML, CSS e JavaScript.', 'Suporte ao time de TI.', 'Desenvolvimento de páginas e manutenção de sites.', 4, 1),
('Analista de Dados Júnior', '2025-02-10', 'Analisar bases de dados corporativos.', 'Formação em Estatística ou áreas correlatas.', 'Relatórios e dashboards.', 'Limpeza e análise de dados.', 4, 2),
('Engenheiro Ambiental Pleno', '2025-03-05', 'Atuar em projetos de sustentabilidade.', 'Formação em Engenharia Ambiental.', 'Supervisão de campo.', 'Elaboração de planos de mitigação.', 4, 3),
('Designer UX/UI', '2025-04-12', 'Melhorar a experiência do usuário.', 'Conhecimento em Figma e design responsivo.', 'Desenvolver protótipos.', 'Criação de interfaces.', 4, 4),
('Estágio em Comunicação Social', '2025-05-20', 'Apoiar atividades de marketing e mídia.', 'Estar cursando Comunicação.', 'Trabalho híbrido.', 'Produção de conteúdo digital.', 4, 5),
('Pesquisador em IA', '2025-06-18', 'Contribuir com estudos sobre inteligência artificial.', 'Pós-graduação em Computação.', 'Projetos de P&D.', 'Desenvolvimento de modelos de IA.', 4, 1),
('Técnico em Energia Solar', '2025-07-30', 'Instalação e manutenção de painéis solares.', 'Curso técnico em elétrica.', 'Trabalho em campo.', 'Manutenção preventiva e corretiva.', 4, 2),
('Gestor de Projetos Sênior', '2025-08-22', 'Liderar times multidisciplinares.', 'Certificação PMP.', 'Gestão ágil.', 'Coordenação de equipes e recursos.', 4, 3),
('Analista de Segurança da Informação', '2025-09-10', 'Proteger dados corporativos e redes.', 'Experiência com cibersegurança.', 'Turno integral.', 'Monitoramento e auditoria de sistemas.', 4, 4),
('Assistente Administrativo', '2025-10-25', 'Dar suporte às atividades do escritório.', 'Ensino médio completo.', 'Rotina de escritório.', 'Organização de documentos e atendimento.', 4, 5);
