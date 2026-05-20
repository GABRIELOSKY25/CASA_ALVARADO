-- =========================================
-- ELIMINAR BASE DE DATOS SI EXISTE
-- =========================================
DROP DATABASE IF EXISTS Casa_Alvarado;

-- =========================================
-- CREAR BASE DE DATOS
-- =========================================
CREATE DATABASE Casa_Alvarado
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE Casa_Alvarado;

-- =========================================
-- TABLA FAMILIA
-- =========================================
CREATE TABLE Familia (
    id_familia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================================
-- TABLA CATEGORIA
-- =========================================
CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    id_familia INT NOT NULL,

    CONSTRAINT fk_categoria_familia
    FOREIGN KEY (id_familia)
    REFERENCES Familia(id_familia)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- TABLA MARCA
-- =========================================
CREATE TABLE Marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    imagen TEXT NOT NULL,
    prioridad ENUM('1','2','3') NOT NULL DEFAULT '3',
    id_categoria INT NOT NULL,

    CONSTRAINT fk_marca_categoria
    FOREIGN KEY (id_categoria)
    REFERENCES Categoria(id_categoria)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- TABLA GAMMA
-- =========================================
CREATE TABLE Gamma (
    id_gamma INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================================
-- TABLA TIPO
-- =========================================
CREATE TABLE Tipo (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================================
-- TABLA PRODUCTO
-- =========================================
CREATE TABLE Producto (
    modelo VARCHAR(45) PRIMARY KEY,
    imagen TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    novedad ENUM('Si','No') NOT NULL DEFAULT 'No',

    id_marca INT NOT NULL,
    id_gamma INT NOT NULL,
    id_tipo INT NOT NULL,

    CONSTRAINT fk_producto_marca
    FOREIGN KEY (id_marca)
    REFERENCES Marca(id_marca)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_producto_gamma
    FOREIGN KEY (id_gamma)
    REFERENCES Gamma(id_gamma)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_producto_tipo
    FOREIGN KEY (id_tipo)
    REFERENCES Tipo(id_tipo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- TABLA USUARIO
-- =========================================
CREATE TABLE Usuario (
    correo VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    contrasena TEXT NOT NULL,
    telefono VARCHAR(10) NOT NULL
) ENGINE=InnoDB;

-- =========================================
-- TABLA CALIFICACION
-- =========================================
CREATE TABLE Calificacion (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,

    estrellas INT NOT NULL CHECK(estrellas BETWEEN 1 AND 5),
    fecha DATE NOT NULL,

    modelo VARCHAR(45) NOT NULL,
    correo VARCHAR(100) NOT NULL,

    CONSTRAINT fk_calificacion_producto
    FOREIGN KEY (modelo)
    REFERENCES Producto(modelo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_calificacion_usuario
    FOREIGN KEY (correo)
    REFERENCES Usuario(correo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

USE Casa_Alvarado;

-- =========================================
-- INSERTAR DATOS EN FAMILIA
-- =========================================
INSERT INTO Familia (nombre) 
VALUES ('Audio'),
       ('Instrumentos'),
       ('Percusion'),
       ('Viento'),
       ('Teclado'),
       ('Iluminación LED');

-- =========================================
-- INSERTAR DATOS EN CATEGORIA
-- =========================================
INSERT INTO Categoria (nombre, id_familia) VALUES 
('Microfono', 1), -- Categoría principal para los productos existentes

-- Audio (id_familia = 1)
('Bafles', 1),
('Mezcladora', 1),
('Bocina', 1),

-- Instrumentos (id_familia = 2)
('Cuerda', 2),
('Guitarra', 2),
('Bajos', 2),
('Violines', 2),
('Docerola', 2),

-- Percusion (id_familia = 3)
('Bateria', 3),
('Congos', 3),
('Tarola', 3),
('Bongos', 3),
('Timbales', 3),
('Panderos', 3),
('Cencerro', 3),

-- Viento (id_familia = 4)
('Saxofón', 4),
('Trompeta', 4),
('Trombón', 4),
('Flauta', 4),

-- Teclado (id_familia = 5)
('Teclado', 5),

-- Iluminación LED (id_familia = 6)
('Par LED', 6),
('Cabeza Robótica', 6),
('Láser', 6),
('Estrobo', 6),
('Cámara de Humo', 6);

-- =========================================
-- INSERTAR DATOS EN MARCA
-- =========================================
-- Nota: id_categoria = 1 (Microfono), prioridad = '3' (valor por defecto)
INSERT INTO Marca (nombre, imagen, prioridad, id_categoria) VALUES
('superbright', 'https://media.licdn.com/dms/image/v2/C4E0BAQEvm2HIxgnWvw/company-logo_200_200/company-logo_200_200/0/1630647494969/superbrightvr_logo?e=2147483647&v=beta&t=_OcFBTPVAxoZJb0i7-p7VuIhRzTarIwmhdYxvHTfQwo', '3', 1),
('ROMMS', 'https://cdn.shopify.com/s/files/1/1610/5893/collections/romms.jpg?v=1723913840', '3', 1),
('radox', 'https://tse4.mm.bing.net/th/id/OIP.xKmLget9_c5szIEaasEkrAAAAA?cb=thfvnextfalcon&rs=1&pid=ImgDetMain&o=7&rm=3', '3', 1),
('AKG', 'https://logos-marcas.com/wp-content/uploads/2020/03/AKG-Emblema.jpg', '3', 1),
('sondtrack', 'https://cdn.cyberpuerta.mx/storage/brands/SOUNDTRACK.png', '3', 1),
('xxs j&b', 'https://static.vecteezy.com/system/resources/previews/009/125/369/non_2x/jyb-logo-jyb-letter-jyb-letter-logo-design-initials-jyb-logo-linked-with-circle-and-uppercase-monogram-logo-jyb-typography-for-technology-business-and-real-estate-brand-vector.jpg', '3', 1),
('KAPTON', 'https://kapton-pa.com/wp-content/uploads/2024/05/LOGOTIPO-KAPTON.png', '3', 1),
('TAIKA', 'https://cdn.shopify.com/s/files/1/1610/5893/collections/taika_logo.png?v=1602780992', '3', 1),
('krack', 'https://http2.mlstatic.com/D_NQ_NP_876362-MLA75268035467_032024-F.jpg', '3', 1),
('lennon', 'https://http2.mlstatic.com/D_NQ_NP_685043-MLA79346174970_092024-O.webp', '3', 1),
('KRIEG', 'https://testedinidaho.com/wp-content/uploads/2017/08/krieg-logo-1.png', '3', 1),
('STAGG', 'https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/a/AmazonStores/ATVPDKIKX0DER/ae6813d4f6e492ae97bf6fc70284288a.w3000.h861.png', '3', 1);

-- =========================================
-- INSERTAR DATOS EN TIPO
-- =========================================
INSERT INTO Tipo (nombre) VALUES 
('Alambrico'), 
('Inalambrico'), 
('Bateria'), 
('Solapa');

-- =========================================
-- INSERTAR DATOS EN GAMMA
-- =========================================
INSERT INTO Gamma (nombre) VALUES 
('Profesional'),
('Semi Profesional'),
('Básico'),
('Estudio');

-- =========================================
-- INSERTAR DATOS EN PRODUCTO
-- =========================================
-- Orden correcto: modelo, imagen, descripcion, novedad, id_marca, id_tipo, id_gamma
USE Casa_Alvarado;

-- =========================================
-- INSERTAR DATOS EN PRODUCTO (CON id_marca CORREGIDOS)
-- =========================================
-- Orden: modelo, imagen, descripcion, novedad, id_marca, id_tipo, id_gamma

INSERT INTO Producto (modelo, imagen, descripcion, novedad, id_marca, id_tipo, id_gamma) VALUES

-- NOTA: Los productos SHURE no tienen marca en tu tabla Marca
-- Asignando temporalmente a 'superbright' (id_marca=1) como placeholder
-- Deberás agregar la marca 'SHURE' a la tabla Marca

('SV100', 'https://tse2.mm.bing.net/th/id/OIP.J8k4NTtDaFQGtF4BzBOLegHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'micrófono de voz cardioide reduce la retroalimentación y ofrece una excelente calidad de sonido', 'No', 1, 1, 1),
('SV200', 'https://superaudio.com.co/wp-content/uploads/2024/10/SV200-SHURE-MICROFONODINAMICO-1-1.jpg', 'Micrófono de voz cardioide que reduce la retroalimentación y ofrece un sonido nítido y vibrante.', 'No', 1, 1, 1),
('PGA48-XLR', 'https://d28i4xct2kl5lp.cloudfront.net/product_images/1581342495.2634082.jpg', 'Micrófono vocal dinámico cardioide', 'No', 1, 1, 1),
('PGA58-XLR', 'https://tse4.mm.bing.net/th/id/OIP.kp-8_sqP8_MH25FkBQLeQAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'PGA58 Micrófono vocal dinámico cardioide', 'No', 1, 1, 1),
('SM57-LC', 'https://tse4.mm.bing.net/th/id/OIP.f5mTwjEVONgrd56tO2aazwHaKX?rs=1&pid=ImgDetMain&o=7&rm=3', 'Micrófono dinámico para instrumentos SM57', 'No', 1, 1, 1),
('SM58-LC', 'https://th.bing.com/th/id/R.a0ed328aa5b77b694d6ad9901f2161cb?rik=wbUjKafwcpAw%2bA&pid=ImgRaw&r=0', 'Micrófono de alto rendimiento más popular del mundo', 'No', 1, 1, 1),
('BETA 58A', 'https://tse4.mm.bing.net/th/id/OIP.JwiF3Cp2Ze8Hv_yRNnjfuAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Micrófono vocal dinámico BETA 58A', 'No', 1, 1, 1),
('SM58-GLX-DUAL', 'https://tse3.mm.bing.net/th/id/OIP.vHCbT7O-B9_rs1U92VHq_gHaFj?rs=1&pid=ImgDetMain&o=7&rm=3', 'Transmisor de mano inalámbrico digital Dual Band con micrófono vocal SM58', 'No', 1, 2, 1),
('BLX-PG58', 'https://tse2.mm.bing.net/th/id/OIP.6a-mBApXzcA76UqwiOjaGgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Sistema Vocal Doble Inalámbrico con dos Transmisores de Mano PG58', 'No', 1, 2, 1),
('BLX-PG58-PGA31', 'https://tse2.mm.bing.net/th/id/OIP.F1AF6TO7Ou_OKxxbfyFy-gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Sistema Combinado Inalámbrico con PG58 de Mano y PGA31 Auricular', 'No', 1, 2, 1),
('BLX14', 'https://audiomusic.mx/wp-content/uploads/2022/06/Microfono-inalambrico-para-instrumento-de-viento-Shure.-Microfono-BLX14-B98-Audio-Music-3.jpeg', 'Sistema inalámbrico para guitarras', 'No', 1, 2, 1),
('PGADRUMKITS', 'https://d1abyhu02s963u.cloudfront.net/wp-content/uploads/2020/02/Shure-PGADRUMKIT5.jpg', 'PGADRUMKIT5 Kit de Micrófono de Bombo', 'No', 1, 3, 1),
('PGADRUMKIT7', 'https://th.bing.com/th/id/OIP.s946GJN61KSI54hgBiiA_wHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', 'PGADRUMKIT7 7PC KIT DE BOMBO PGA52, 57, 56(X3), 81(X2)', 'No', 1, 3, 1),
('BETA-52A', 'https://th.bing.com/th/id/R.6a78fd56ba6c5c1175ce2d3e10dd53b2?rik=GJEiM6lFvAYukA&pid=ImgRaw&r=0', 'BETA 52A Micrófono de bombo', 'No', 1, 3, 1),

-- Marca superbright (id_marca=1) - Productos que ya pertenecen a superbright
('PRO-300', 'https://tse1.mm.bing.net/th/id/OIP.JpY8IB_1s4FldGH4yJ3IZwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'El PRO-300 es un sistema de micrófono inalámbrico de excelente diseño y desarrollo', 'No', 1, 2, 1),
('PRO-400', 'https://tse3.mm.bing.net/th/id/OIP.u3t8_fuxJyntd6jK7eSoBAHaFr?rs=1&pid=ImgDetMain&o=7&rm=3', 'El Pro-400 es un sistema de micrófono inalámbrico de práctico diseño y desarrollo', 'No', 1, 2, 1),
('PRO-500', 'https://audioshop.com.pe/wp-content/uploads/2025/08/FBR-K500-PRO.jpg', 'El PRO-500 es un sistema de micrófono inalámbrico de práctico diseño y desarrollo', 'No', 1, 2, 1),
('PRO-2', 'https://tse1.mm.bing.net/th/id/OIP._VV09n9VI5GUHyZDjRTGxgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono Super Bright Inalambrico De Mano Pro-2 Estuche Msi Color Negro', 'No', 1, 2, 1),
('PRO-3', 'https://tse1.mm.bing.net/th/id/OIP.u2zef6EHhav51Lf7eE9HawHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'El PRO-3 de SBPRO es un sistema inalámbrico UHF DUAL', 'No', 1, 2, 1),
('PRO-1', 'https://tse4.mm.bing.net/th/id/OIP.hjmNPI2J9Ewfo3sg0GK3LgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono Super Bright Inalambrico De Mano Pro-1 Estuche Msi Color Negro', 'No', 1, 2, 1),
('D-930', 'https://www.musicalesdoris.com/cdn/shop/files/086611b3369d07c2609cf52d60ecb85f-microfono-superbright-alambrico-ccable-y-clip-d-930_1280x.jpg?v=1712879409', 'Micrófono dinámico unidireccional D-930', 'No', 1, 1, 1),
('D-903', 'https://www.musicalesdoris.com/cdn/shop/files/13c1ce5bccd88fefde476a47e08a1c05-microfono-superbright-alambrico-set-3-pzas-d-903_1280x.jpg?v=1712949839', 'Microfono Superbright D-903 Set 3 Piezas Alambrico', 'No', 1, 1, 1),

-- Marca radox (id_marca=3)
('K-068', 'https://th.bing.com/th/id/R.7d82bb7f35ac26a48cad5cda2d244b97?rik=e%2fOdkzqbp2IvgQ&riu=http%3a%2f%2fisky.com.sg%2fwp-content%2fuploads%2f2017%2f08%2fK068-Mini-Karaoke-Wireless-Bluetooth-Microphone-with-Mic-Speaker2.jpg&ehk=vpUJ1uRurVgxSDqx9XoyjvNCt4bkPHLQ%2fnWJ9jZxvE4%3d&risl=&pid=ImgRaw&r=0', 'Microfono de karaoke inalambrico', 'No', 3, 2, 1),
('KD332', 'https://www.mercadolibre.com.mx/microfonos-krieg-kd332-cardioide-color-negro/p/MLM29698876', 'Micrófonos Krieg KD332 Cardioide color negro', 'No', 3, 2, 1),
('KMMB18', 'https://tse3.mm.bing.net/th/id/OIP.K1RyNCKrKDRaOkB-Npi-YgHaIV?rs=1&pid=ImgDetMain&o=7&rm=3', 'El modelo KMMB18 de KRIEG es un juego de gama media pensado para el grupo musical promedio', 'No', 3, 3, 1),
('KMMB3', 'https://tse3.mm.bing.net/th/id/OIP.RWZw7VV0Ma1K9A5DPrfVCgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'La serie KMMB de Krieg es una familia compuesta por juegos de micrófonos para batería', 'No', 3, 3, 1),
('K513', 'https://tse3.mm.bing.net/th/id/OIP.zh1OPJX4XIwjhGg0eolzAwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Micrófonos dinámicos de mano del tipo multi propósito de bajo costo', 'No', 3, 1, 1),
('K511', 'https://tse2.mm.bing.net/th/id/OIP.8XtE1XpUui0tVAndv1_AMAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'La familia K500 de Krieg, son micrófonos dinámicos de mano del tipo multi propósito de bajo costo.', 'No', 3, 1, 1),
('K511 PAQ', 'https://tse3.mm.bing.net/th/id/OIP.4JbK9cOYH0VrQZ1bhtHlGAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', 'Estuche para mano para voz K511 PAQ', 'No', 3, 1, 1),
('KHD1', 'https://th.bing.com/th/id/R.3b5239bc277932aa7365511f533e472c?rik=AAb4r4gk%2b3dxHA&riu=http%3a%2f%2fkrieg.mx%2fimages%2fKHD1.png&ehk=DppfuY5zY2MMVCgfJmURERF56J%2fL2XaiqD5WeB3eztk%3d&risl=&pid=ImgRaw&r=0', 'KRIEG presenta su micrófono de diadema inalámbrico', 'No', 3, 2, 1),
('KM15Di', 'https://krieg.mx/km15di.html', 'El micrófono inalámbrico mas fácil de usar', 'No', 3, 2, 1),
('GOOS-332', 'https://tse1.mm.bing.net/th/id/OIP.aSPx6IrAiffpNhUQ9YxdLAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono para conferencia', 'No', 3, 2, 1),
('KMV2', 'https://krieg.mx/images/KMV2.png', 'KRIEG presenta su micrófono para saxofón inalámbrico', 'No', 3, 2, 1),
('TR-40/REC-4', 'https://tse1.mm.bing.net/th/id/OIP.jK14UtPwrbrrDt6UdmVaKAHaE5?rs=1&pid=ImgDetMain&o=7&rm=3', 'Monitor personal', 'No', 3, 2, 1),
('KC06B', 'https://krieg.mx/gallery/KC06B_3.png', 'Microfono de condensador', 'No', 3, 1, 1),
('K917', 'https://krieg.mx/gallery/K917_1_p1i6mk1r.png', 'Microfono RTA', 'No', 3, 1, 1),
('K108', 'https://krieg.mx/images/galeria108.png', 'Micrófonos de mano profesionales de uso general.', 'No', 3, 1, 1),
('KTM9', 'https://krieg.mx/images/galeriaKTM9.png', 'El modelo KTM9 de Krieg, es un micrófono de condensador para estudio.', 'No', 3, 1, 1),

-- Marca ROMMS (id_marca=2)
('MC-380D', 'https://www.cyberpuerta.mx/img/product/XL/CP-ROMMS-MC-380D-9a51ef.jpg', 'Micrófono de diadema inalámbrico que mejora la comunicación', 'No', 2, 2, 1),
('MC-324', 'https://http2.mlstatic.com/D_NQ_NP_2X_673237-MLM47589800908_092021-F.webp', 'Su dinamismo lo hace ideal para vocalistas e instrumentos.', 'No', 2, 2, 1),
('MC-630LD', 'https://www.cyberpuerta.mx/img/product/XL/CP-ROMMS-MC-630LD-ba3454.jpg', 'El micrófono Romms MC-630LD aprovecha la conectividad alámbrica', 'No', 2, 2, 1),
('MC-630L', 'https://www.cyberpuerta.mx/img/product/XL/CP-ROMMS-MC-630L-b72d85.jpg', 'El micrófono alámbrico MC-630L es una herramienta ideal', 'No', 2, 2, 1),
('MC-380M', 'https://http2.mlstatic.com/D_NQ_NP_2X_978922-MLA79481386912_102024-F.webp', 'Opera con diversos equipos de audio como amplificadores', 'No', 2, 2, 1),
('MC-318', 'https://http2.mlstatic.com/D_NQ_NP_2X_934345-MLA99954026649_112025-F.webp', 'Su dinamismo lo hace ideal para vocalistas e instrumentos.', 'No', 2, 2, 1),
('MC-328', 'https://http2.mlstatic.com/D_NQ_NP_2X_631655-MLA99937542557_112025-F.webp', 'Su dinamismo lo hace ideal para vocalistas e instrumentos.', 'No', 2, 2, 1),
('MC-380L', 'https://www.cyberpuerta.mx/img/product/XL/CP-ROMMS-MC-380L-0ccaf1.jpg', 'Micrófono inalámbrico UHF de solapa (Lavalier) ROMMS MC-380L', 'No', 2, 2, 1),
('MC-58S', 'https://http2.mlstatic.com/D_NQ_NP_2X_931714-MLU74163702187_012024-F.webp', 'Su patrón polar cardioide ofrece una mayor sensibilidad hacia los sonidos frontales', 'No', 2, 1, 1),
('MC-58A', 'https://www.herguimusical.com/cdn/shop/products/MC-58A_570x570_crop_top.png?v=1629816350', 'Micrófono dinámico super cardiode de salida alta', 'No', 2, 1, 1),

-- Marca radox (id_marca=3) - Continuación
('490-357', 'https://http2.mlstatic.com/D_NQ_NP_2X_741620-MLM50897663833_072022-F.webp', 'Microfono Diadema Y Solapa Uhf Radox 490-357 Inalambric', 'No', 3, 2, 1),
('490-140', 'https://http2.mlstatic.com/D_NQ_NP_2X_624064-MLA99476917820_112025-F.webp', 'Microfono Alambrico Recepción unidireccional', 'No', 3, 2, 1),
('490-150', 'https://http2.mlstatic.com/D_NQ_NP_2X_614847-MLM83017510517_032025-F.webp', 'Micrófono Dinámico Unidireccional Radox Mod: 490-150', 'No', 3, 1, 1),
('490-220', 'https://http2.mlstatic.com/D_NQ_NP_2X_930312-MLU75174615538_032024-F.webp', 'El micrófono Radox 490-220 Dinámico es la elección perfecta', 'No', 3, 1, 1),
('490-236', 'https://http2.mlstatic.com/D_NQ_NP_2X_834159-MLM92337187903_092025-F.webp', 'Micrófono Dinámico Unidireccional 490-236 Radox', 'No', 3, 1, 1),
('490-330', 'https://http2.mlstatic.com/D_NQ_NP_2X_864216-MLM92295729948_092025-F.webp', 'Micrófono Dinámico Unidireccional 490-330', 'No', 3, 1, 1),
('490-336', 'https://http2.mlstatic.com/D_NQ_NP_2X_873783-MLA105618732915_012026-F.webp', 'Microfono Radox 490-336 Con Estuche Reforzado', 'No', 3, 1, 1),
('490-471', 'https://http2.mlstatic.com/D_NQ_NP_2X_960439-MLM73077402859_112023-F.webp', 'Sistema De 2 Micrófonos Inalámbricos Uhf Radox 490-471', 'No', 3, 2, 1),
('490-334', 'https://http2.mlstatic.com/D_NQ_NP_2X_811466-MLM77981929958_082024-F.webp', 'Microfono Radox Para Voz Con Switch/apagado/encendido 490334', 'No', 3, 1, 1),
('490-146', 'https://www.herguimusical.com/cdn/shop/products/490-146_6e117a08-b918-4f85-a5d4-135f6d924e3c_570x570_crop_top.jpg?v=1598768913', 'MICROFONO DINAMICO UNID. METALICO (ESTUCHE NEGRO) RADOX 490-146', 'No', 3, 1, 1),
('490-125', 'https://http2.mlstatic.com/D_NQ_NP_2X_687687-MLM89050029547_072025-F.webp', 'Microfono Alambrico Radox 490-125', 'No', 3, 1, 1),
('490-601', 'https://http2.mlstatic.com/D_NQ_NP_2X_882548-MLM93230056370_092025-F.webp', 'Micrófono Vocal Unidireccional De Estudio Radox 490-601', 'No', 3, 1, 1),

-- Marca xxs j&b (id_marca=6)
('MC113', 'https://http2.mlstatic.com/D_NQ_NP_2X_935996-MLM93257678220_092025-F.webp', 'Jgo. De 2 Micrófonos De Mano Uhf, Blanco Xss Mc-113w', 'No', 6, 2, 1),
('CM106', 'https://xsspro.com/wp-content/uploads/2021/09/CM106SF2-1.jpg', '2 MICRÓFONOS UHF RECARGABLES 16 FREQ. POR MICRO', 'No', 6, 2, 1),
('MC144', 'https://electronicaremberg.com/wp-content/uploads/2016/08/MC144_4adca7f0ea28d-768x768.jpg', 'Micrófono profesional inalámbrico UHF', 'No', 6, 2, 1),
('CM107', 'https://http2.mlstatic.com/D_NQ_NP_2X_980950-MLM82089737175_012025-F.webp', 'Sistema Xss Cm107 De Microfóno, Transmisor Y Receptor Uhf', 'No', 6, 2, 1),
('CM158S', 'https://http2.mlstatic.com/D_NQ_NP_2X_715471-MLM74361119124_022024-F.webp', 'Micrófono Alámbrico Vocal Xss Profesional Cm 158s', 'No', 6, 1, 1),
('CM-157', 'https://www.cyberpuerta.mx/img/product/XL/CP-XSS-CM157-91c9eb.jpg', 'XSS Micrófono CM-157, Alámbrico, 600 Ohmios', 'No', 6, 1, 1),
('CM-158B', 'https://http2.mlstatic.com/D_NQ_NP_2X_998965-MLM52716237663_122022-F.webp', 'Microfono Alambrico Xss Cm-158b Para Grabacion Profesional Color Gris', 'No', 6, 1, 1),
('CM158', 'https://xsspro.com/wp-content/uploads/2021/09/CM-158-1.jpg', 'MICRÓFONO DINÁMICO VOCAL UNIDIRECCIONAL (CARDIOIDE)', 'No', 6, 1, 1),

-- Marca AKG (id_marca=4)
('DRUM SET SESSION', 'https://olartesound.com/wp-content/uploads/2023/10/DRUM-SET-SESSION-I-2.png', 'Set de Micrófonos para Batería DRUM SET SESSION I AKG', 'No', 4, 3, 1),

-- Marca radox (id_marca=3) - Más productos
('KMMB91', 'https://krieg.mx/images/Capa-163.png', 'Set de micrófonos para batería', 'No', 3, 3, 1),
('KMMB19', 'https://krieg.mx/gallery/KMMB19_1.png', 'Set de micrófonos para batería', 'No', 3, 3, 1),

-- Marca KAPTON (id_marca=7)
('KMI-06', 'https://http2.mlstatic.com/D_NQ_NP_2X_880203-MLA99508685346_112025-F.webp', 'Micrófono Dinámico Kapton KMI-06 XLR Cardioide Unidireccional 5m', 'No', 7, 1, 1),
('KMI-90', 'https://http2.mlstatic.com/D_NQ_NP_2X_762105-MLA105988052491_012026-F.webp', 'Micrófono Kapton Kmi-90 Para Conferencias Cuello Cisne Color Negro', 'No', 7, 1, 1),
('KMI-11', 'https://www.cyberpuerta.mx/img/product/XL/CP-KAPTON-KMI-11-495e5f.jpg', 'Kapton Micrófono KMI-11, Alámbrico', 'No', 7, 1, 1),
('KMI-18', 'https://kapton-pa.com/wp-content/uploads/2026/03/KMI-18_1.jpg', 'MICRÓFONO DINÁMICO COLOR AZUL', 'No', 7, 1, 1),
('KMI-19', 'https://kapton-pa.com/wp-content/uploads/2026/03/KMI-19_1.jpg', 'MICRÓFONO DINÁMICO COLOR ROSA', 'No', 7, 1, 1),
('KMI-14', 'https://kapton-pa.com/wp-content/uploads/2024/10/KMI-14.png', 'MICRÓFONO ALÁMBRICO COLOR MORADO', 'No', 7, 1, 1),
('KMI-12', 'https://kapton-pa.com/wp-content/uploads/2024/09/KMI-12_1.1.png', 'MICRÓFONO ALÁMBRICO COLOR ROSA', 'No', 7, 1, 1),
('KMI-63', 'https://kapton-pa.com/wp-content/uploads/2025/09/KMI-63_1.jpg', 'KIT DE MICRÓFONOS ALAMBRICOS', 'No', 7, 1, 1),
('KMI-07', 'https://kapton-pa.com/wp-content/uploads/2024/10/KMI-07_1-1.png', 'MICRÓFONO ALÁMBRICO COLOR NEGRO', 'No', 7, 1, 1),
('KMI-08', 'https://kapton-pa.com/wp-content/uploads/2024/10/KMI-08_3.1.png', 'MICRÓFONO ALÁMBRICO COLOR AMARILLO', 'No', 7, 1, 1),
('KMI-58A', 'https://kapton-pa.com/wp-content/uploads/2024/10/KMI-58A_1.png', 'MICRÓFONO ALÁMBRICO', 'No', 7, 1, 1),
('KMI-15', 'https://kapton-pa.com/wp-content/uploads/2024/09/KMI-15_1.png', 'MICRÓFONO ALÁMBRICO', 'No', 7, 1, 1),
('KMI-83', 'https://kapton-pa.com/wp-content/uploads/2025/09/KMI-83_1.jpg', 'KIT DE MICRÓFONOS ALAMBRICOS', 'No', 7, 1, 1),
('KMI-73', 'https://kapton-pa.com/wp-content/uploads/2025/09/kmi-73.jpg', 'KIT DE MICROFONOS ALAMBRICOS', 'No', 7, 1, 1),

-- Marca sondtrack (id_marca=5)
('STW-23HU2', 'https://www.cyberpuerta.mx/img/product/XL/CP-SOUNDTRACK-STW-23HU2-9c7783.jpg', 'Soundtrack Micrófono STW-23HU2, Inalámbrico', 'No', 5, 2, 1),
('DMR-7', 'https://www.cyberpuerta.mx/img/product/XL/CP-SOUNDTRACK-DRM-7-e1d439.jpg', 'Soundtrack Kit Micrófonos para Batería DRM-7, Alámbrico, Negro, incluye 7 Micrófonos', 'No', 5, 3, 1),
('STW-401F', 'https://m.media-amazon.com/images/I/51JqCoKS9CL._AC_SL1050_.jpg', 'SOUNDTRACK Sistema micrófonos inalámbricos STW-401F', 'No', 5, 2, 1),
('STW-28HUL', 'https://m.media-amazon.com/images/I/31Hbaaxy5aL._AC_.jpg', 'SOUNDTRACK STW28HUL Micrófono de Diadema, Mano y Solapa', 'No', 5, 2, 1),
('STW-28HU2', 'https://www.cyberpuerta.mx/img/product/XL/CP-SOUNDTRACK-STW-28HU2-5fccce.jpg', 'Soundtrack Set Micrófonos STW-28HU2, Inalámbricos, 350mA', 'No', 5, 2, 1),
('STW-56HU2', 'https://http2.mlstatic.com/D_NQ_NP_2X_977003-MLA100022264957_122025-F.webp', 'Micrófonos Inalámbricos Soundtrack Stw-56hu2 De Mano/cardiod Color Negro', 'No', 5, 2, 1),
('STW-33HU2', 'https://audiomundo.com.mx/cdn/shop/files/STW-33HU2_700x.jpg?v=1761761243', 'Micrófono Inalámbrico de Mano Soundtrack STW-33HU2', 'No', 5, 2, 1),
('STW-28HLL', 'https://audiomundo.com.mx/cdn/shop/files/STW28HLL__1_700x.jpg?v=1758642497', 'Micrófonos inalámbricos SOUNDTRACK STW-28HLL Diadema y Solapa UHF Frecuencias Fijas', 'No', 5, 2, 1),
('PRO-600X3', 'https://http2.mlstatic.com/D_NQ_NP_2X_919487-MLM50161401702_062022-F.webp', 'Microfonos Prof.dinamico Baja Impedancia Pro600x3 Soun... Color Negro', 'No', 5, 1, 1),
('DM-430', 'https://audiomundo.com.mx/cdn/shop/products/DM430__1_700x.jpg?v=1604525772', 'Micrófono Cuello Ganso SOUNDTRACK DM-430 Conferencias Podiums', 'No', 5, 1, 1),
('M-6', 'https://soundtrackmexico.com/storage/2025/09/producto-m6-0001.png', 'M6-Micrófono de solapa para dispositivos móviles', 'No', 5, 4, 1),

-- Marca TAIKA (id_marca=8)
('TK-M200', 'https://http2.mlstatic.com/D_NQ_NP_2X_985299-MLM92687589227_092025-F.webp', 'Microfono De Plastico Dinamico Unidireccional Taika Tk-m200', 'No', 8, 1, 1),
('TKM-220', 'https://http2.mlstatic.com/D_NQ_NP_2X_845922-MLA99917088247_112025-F.webp', 'Micrófono Dinámico Unidireccional Taika TK-M220 Negro Para Conferencias y Canto', 'No', 8, 1, 1),
('TK-M400', 'https://http2.mlstatic.com/D_NQ_NP_2X_881257-MLM91930994692_092025-F.webp', 'Microfono De Plastico Dinamico Unidireccional Taika Tk-m400', 'No', 8, 1, 1),
('TKM-420', 'https://http2.mlstatic.com/D_NQ_NP_2X_717825-MLA99972018097_112025-F.webp', 'Micrófono Dinámico Unidireccional Taika TK-M420 Para Cantar e Instrumentos', 'No', 8, 1, 1),
('TK-M625U', 'https://http2.mlstatic.com/D_NQ_NP_2X_985847-MLM92240780332_092025-F.webp', 'Microfonos Uhf Inalambrico Taika Tk-m625u', 'No', 8, 2, 1),

-- Marca lennon (id_marca=10)
('LN202U', 'https://http2.mlstatic.com/D_NQ_NP_2X_786591-MLM80722860943_112024-F.webp', 'Micrófono Lennon Inalámbrico Uhf Doble De Mano Mod. Ln202u', 'No', 10, 2, 1),
('LN102U', 'https://http2.mlstatic.com/D_NQ_NP_2X_940115-MLA80807735224_112024-F.webp', 'Kit De 2 Microfonos Inalambricos De Metal Uhf Lennon Ln102u Color Negro', 'No', 10, 2, 1),
('LN-M88', 'https://http2.mlstatic.com/D_NQ_NP_2X_820471-MLA84843350975_052025-F.webp', 'Micrófono Dinámico Lennon Profesional Ln-m88 Cable Color Negro', 'No', 10, 1, 1),

-- Marca krack (id_marca=9)
('KMIC-68UHF', 'https://http2.mlstatic.com/D_NQ_NP_2X_617899-MLM98446816364_112025-F.webp', 'Sistema De Mirófono Inlambrico Doble Krack Kmic-68uhf', 'No', 9, 2, 1),
('KMIC-6XP', 'https://http2.mlstatic.com/D_NQ_NP_2X_995143-MLM92759588782_092025-F.webp', 'Micrófonos Inalámbricos Profesionales Uhf Krack Kmic-6xp', 'No', 9, 2, 1),
('KMIC-58', 'https://http2.mlstatic.com/D_NQ_NP_2X_822280-MLM89844826202_082025-F.webp', 'Micrófono Alambrico Voz Instrumentos Krack Audio Kmic-58', 'No', 9, 1, 1),
('KMIC-6UHF', 'https://http2.mlstatic.com/D_NQ_NP_2X_649469-MLM92759293544_092025-F.webp', 'Sistema De Microfono Inalabrico De Diadema Krack Kmic-6uhf', 'No', 9, 2, 1),

-- Marca STAGG (id_marca=12)
('SDM60', 'https://http2.mlstatic.com/D_NQ_NP_2X_691569-MLA99529535718_122025-F.webp', 'Stagg SDM60 Micrófono Dinámico Con Estuche', 'No', 12, 2, 1),
('SDM70', 'https://m.media-amazon.com/images/I/418oxg-7jWL._AC_SL1000_.jpg', 'Stagg SDM70 Micrófono dinámico cardioide Profesional con Cartucho, Negro', 'No', 12, 2, 1),
('SDM80', 'https://http2.mlstatic.com/D_NQ_NP_2X_665151-MLA99963203477_112025-F.webp', 'Micrófono Stagg Sdm80 Cardioide Dinámico XLR con funda Cable de 5 m', 'No', 12, 2, 1),
('SDMP10', 'https://m.media-amazon.com/images/I/5156eMnnI5L._AC_SL1200_.jpg', 'Stagg SDMP10 Micrófono dinámico Multiusos', 'No', 12, 1, 1),
('SDMP15', 'https://http2.mlstatic.com/D_NQ_NP_2X_651506-MLU76248543099_052024-F.webp', 'Micrófono Dinámico Stagg Sdmp15 Con Cable Negro', 'No', 12, 1, 1),

-- Marca radox (id_marca=3) - Solapa
('490-351', 'https://example.com/490-351.jpg', 'RADOX 490-351 Micrófono de Diadema con Plug 3.5mm Mono, Repuesto', 'No', 3, 4, 1),
('490-352', 'https://example.com/490-352.jpg', 'RADOX 490-352 Micrófono de Diadema con Jack Mini XLR Canon, Repuesto', 'No', 3, 4, 1);