CREATE TABLE Usuarios(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    emaileducacional VARCHAR(50),
    senha VARCHAR(50),
    foto blob
);

CREATE TABLE Categoria(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(160)
);

CREATE TABLE Editores(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(160),
    emaileducacinal VARCHAR(100)
);

CREATE TABLE Imagem(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    urlImagem VARCHAR(500),
    legenda VARCHAR(100),
    imagem blob,
    creditos VARCHAR(50)
);

CREATE TABLE Video(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    urlVideo VARCHAR(500),
    legenda VARCHAR(100),
    video blob,
    creditos VARCHAR(50)
);

CREATE TABLE Noticias(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    editoresid INTEGER, 
    categoriaid INTEGER,
    imagemid INTEGER,
    videoid INTEGER,
    numComentarios BIGINT,
    numVisualizacoes BIGINT,
    titulo VARCHAR(50),
    dataPublicao DATETIME,
    corpoTexto VARCHAR(60),
    resumo VARCHAR(50),
    FOREIGN KEY (categoriaid) REFERENCES categoria(id),
    FOREIGN KEY (editoresid) REFERENCES editores(id),
    FOREIGN KEY (imagemid) REFERENCES imagem(id),
    FOREIGN KEY (videoid) REFERENCES video(id)
    
);

use jornalvirtual;
CREATE TABLE comentarios(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    noticiaid INTEGER,
    usuarioid INTEGER,
    textoComentario VARCHAR(70),
    dataComentario DATETIME,
    FOREIGN KEY (noticiaid) REFERENCES noticias(id),
    FOREIGN KEY (usuarioid) REFERENCES usuarios(id)
);



INFORMAÇÔES DO BANCO DE DADOS

INSERT INTO usuarios
VALUES (DEFAULT, "Joao", "joao.silva@portalsesisp.org.br", "123456", "FOTO");

INSERT INTO usuarios
VALUES (DEFAULT, "Luiza", "Luiza.corazin@portalsesisp.org.br", "34589", "FOTO");SELECT * FROM `usuarios` WHERE 1


INSERT INTO video
VALUES (DEFAULT, "", "Noticia3", "VIDEO", "by julia");SELECT * FROM `usuarios` WHERE 1

INSERT INTO categoria
VALUES (DEFAULT, "fisica");SELECT * FROM `usuarios` WHERE 1

INSERT INTO editores
VALUES (DEFAULT, "Luiza", "Luiza.corazin@portalsesisp.org.br");SELECT * FROM `usuarios` WHERE 1
