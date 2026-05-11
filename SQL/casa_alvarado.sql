-- Eliminar esquema si existe
DROP SCHEMA IF EXISTS Casa_Alvarado;

-- Crear esquema
CREATE SCHEMA IF NOT EXISTS Casa_Alvarado
DEFAULT CHARACTER SET utf8mb4;

USE Casa_Alvarado;

-- =========================================
-- TABLA CATEGORIA
-- =========================================
CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================================
-- TABLA MARCA
-- =========================================
CREATE TABLE Marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    imagen TEXT
) ENGINE=InnoDB;

-- =========================================
-- TABLA SUBCATEGORIA
-- =========================================
CREATE TABLE Sub_categoria (
    id_sub_categoria INT AUTO_INCREMENT PRIMARY KEY,
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
-- TABLA GAMA
-- =========================================
CREATE TABLE Gama (
    id_gama INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================================
-- TABLA PRODUCTO
-- =========================================
CREATE TABLE Producto (
    modelo VARCHAR(45) PRIMARY KEY,
    imagen TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    id_categoria INT NOT NULL,
    id_marca INT NOT NULL,
    id_sub_categoria INT NOT NULL,
    id_tipo INT NOT NULL,
    id_gama INT NOT NULL,

    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
    CONSTRAINT fk_producto_marca FOREIGN KEY (id_marca) REFERENCES Marca(id_marca),
    CONSTRAINT fk_producto_subcategoria FOREIGN KEY (id_sub_categoria) REFERENCES Sub_categoria(id_sub_categoria),
    CONSTRAINT fk_producto_tipo FOREIGN KEY (id_tipo) REFERENCES Tipo(id_tipo),
    CONSTRAINT fk_producto_gama FOREIGN KEY (id_gama) REFERENCES Gama(id_gama)
) ENGINE=InnoDB;

-- =========================================
-- TABLA CALIFICACION
-- =========================================
CREATE TABLE Calificacion (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    estrellas INT NOT NULL,
    fecha DATE,
    modelo VARCHAR(45) NOT NULL,

    CONSTRAINT fk_calificacion_producto FOREIGN KEY (modelo) REFERENCES Producto(modelo)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- POBLAR TABLAS DE REFERENCIA (CATÁLOGOS)
-- =========================================

-- Poblar Categoria
INSERT INTO `Categoria` (`nombre`) VALUES ('Audio');

-- Poblar Sub_categoria
INSERT INTO `Sub_categoria` (`nombre`) VALUES ('Microfono'), ('Bateria'), ('Solapa');

-- Poblar Gamma (Corregido a doble m)
INSERT INTO `Gamma` (`nombre`) VALUES ('Profesional');

-- Poblar Tipo
INSERT INTO `Tipo` (`nombre`) VALUES 
('Alambrico'), 
('Inalambrico'), 
('Bateria'), 
('Solapa'), 
('No especificado');

-- Poblar Marca
INSERT INTO `Marca` (`nombre`) VALUES  
('SHURE'), ('SUPERBRIGHT'), ('KRIEG'), ('ROMMS'), ('RADOX'),  
('XSS J&B'), ('AKG'), ('KAPTON'), ('SOUNDTRACK'), ('TAIKA'),  
('LENNON'), ('Krack'), ('STAGG');

-- =========================================
-- INSERTAR PRODUCTOS
-- =========================================
INSERT INTO `Producto` 
(`modelo`, `imagen`, `descripcion`, `id_categoria`, `id_marca`, `id_sub_categoria`, `id_tipo`, `id_gamma`) 
VALUES 
('SV100', 'https://tse2.mm.bing.net/th/id/OIP.J8k4NTtDaFQGtF4BzBOLegHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono de voz cardioide reduce la retroalimentacion y ofrece una excelente calidad de sonido', 1, 1, 1, 1, 1),
('SV200', 'https://superaudio.com.co/wp-content/uploads/2024/10/SV200-SHURE-MICROFONODINAMICO-1-1.jpg', 'Microfono de voz cardioide que reduce la retroalimentacion y ofrece un sonido nitido y vibrante.', 1, 1, 1, 1, 1),
('PGA48-XLR', 'https://d28i4xct2kl5lp.cloudfront.net/product_images/1581342495.2634082.jpg', 'Microfono vocal dinamico cardioide', 1, 1, 1, 1, 1),
('PGA58-XLR', 'https://tse4.mm.bing.net/th/id/OIP.kp-8_sqP8_MH25FkBQLeQAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'PGA58 Microfono vocal dinamico cardioide', 1, 1, 1, 1, 1),
('SM57-LC', 'https://tse4.mm.bing.net/th/id/OIP.f5mTwjEVONgrd56tO2aazwHaKX?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono dinamico para instrumentos SM57', 1, 1, 1, 1, 1),
('SM58-LC', 'https://th.bing.com/th/id/R.a0ed328aa5b77b694d6ad9901f2161cb?rik=wbUjKafwcpAw%2bA&pid=ImgRaw&r=0', 'Microfono de alto rendimiento mas popular del mundo, muy eficaz para streaming.', 1, 1, 1, 1, 1),
('BETA 58A', 'https://tse4.mm.bing.net/th/id/OIP.JwiF3Cp2Ze8Hv_yRNnjfuAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono vocal dinamico BETA 58A', 1, 1, 1, 1, 1),
('SM58-GLX-DUAL', 'https://tse3.mm.bing.net/th/id/OIP.vHCbT7O-B9_rs1U92VHq_gHaFj?rs=1&pid=ImgDetMain&o=7&rm=3', 'Transmisor de mano inalambrico digital Dual Band con microfono vocal SM58', 1, 1, 1, 2, 1),
('BLX-PG58', 'https://tse2.mm.bing.net/th/id/OIP.6a-mBApXzcA76UqwiOjaGgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Sistema Vocal Doble Inalambrico con dos Transmisores de Mano PG58', 1, 1, 1, 2, 1),
('BLX-PG58-PGA31', 'https://tse2.mm.bing.net/th/id/OIP.F1AF6TO7Ou_OKxxbfyFy-gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Sistema Combinado Inalambrico con PG58 de Mano y PGA31 Auricular', 1, 1, 1, 2, 1),
('BLX14', 'https://audiomusic.mx/wp-content/uploads/2022/06/Microfono-inalambrico-para-instrumento-de-viento-Shure.-Microfono-BLX14-B98-Audio-Music-3.jpeg', 'Sistema inalambrico para guitarras', 1, 1, 1, 2, 1),
('PGADRUMKITS', 'https://d1abyhu02s963u.cloudfront.net/wp-content/uploads/2020/02/Shure-PGADRUMKIT5.jpg', 'PGADRUMKIT5 Kit de Microfono de Bombo', 1, 1, 1, 3, 1),
('PGADRUMKIT7', 'https://th.bing.com/th/id/OIP.s946GJN61KSI54hgBiiA_wHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', 'PGADRUMKIT7 7PC KIT DE BOMBO PGA52, 57, 56(X3), 81(X2)', 1, 1, 1, 3, 1),
('BETA-52A', 'https://th.bing.com/th/id/R.6a78fd56ba6c5c1175ce2d3e10dd53b2?rik=GJEiM6lFvAYukA&pid=ImgRaw&r=0', 'BETA 52A Microfono de bombo', 1, 1, 1, 3, 1),
('PRO-300', 'https://tse1.mm.bing.net/th/id/OIP.JpY8IB_1s4FldGH4yJ3IZwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Sistema de microfono inalambrico de excelente diseño y desarrollo', 1, 2, 1, 2, 1),
('PRO-400', 'https://tse3.mm.bing.net/th/id/OIP.u3t8_fuxJyntd6jK7eSoBAHaFr?rs=1&pid=ImgDetMain&o=7&rm=3', 'Sistema de microfono inalambrico de practico diseño y desarrollo', 1, 2, 1, 2, 1),
('PRO-500', 'https://audioshop.com.pe/wp-content/uploads/2025/08/FBR-K500-PRO.jpg', 'Sistema de microfono inalambrico de practico diseño y desarrollo', 1, 2, 1, 2, 1),
('PRO-2', 'https://tse1.mm.bing.net/th/id/OIP._VV09n9VI5GUHyZDjRTGxgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono Super Bright Inalambrico De Mano Pro-2 Estuche Msi Color Negro', 1, 2, 1, 2, 1),
('PRO-3', 'https://tse1.mm.bing.net/th/id/OIP.u2zef6EHhav51Lf7eE9HawHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'El PRO-3 de SBPRO es un sistema inalambrico UHF DUAL', 1, 2, 1, 2, 1),
('PRO-1', 'https://tse4.mm.bing.net/th/id/OIP.hjmNPI2J9Ewfo3sg0GK3LgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono Super Bright Inalambrico De Mano Pro-1 Estuche Msi Color Negro', 1, 2, 1, 2, 1),
('D-930', 'https://www.musicalesdoris.com/cdn/shop/files/086611b3369d07c2609cf52d60ecb85f-microfono-superbright-alambrico-ccable-y-clip-d-930_1280x.jpg?v=1712879409', 'Microfono dinamico unidireccional D-930', 1, 2, 1, 1, 1),
('D-903', 'https://www.musicalesdoris.com/cdn/shop/files/13c1ce5bccd88fefde476a47e08a1c05-microfono-superbright-alambrico-set-3-pzas-d-903_1280x.jpg?v=1712949839', 'Microfono Superbright D-903 Set 3 Piezas Alambrico', 1, 2, 1, 1, 1),
('K-068', 'https://th.bing.com/th/id/R.7d82bb7f35ac26a48cad5cda2d244b97?rik=e%2fOdkzqbp2IvgQ&riu=http%3a%2f%2fisky.com.sg%2fwp-content%2fuploads%2f2017%2f08%2fK068-Mini-Karaoke-Wireless-Bluetooth-Microphone-with-Mic-Speaker2.jpg&ehk=vpUJ1uRurVgxSDqx9XoyjvNCt4bkPHLQ%2fnWJ9jZxvE4%3d&risl=&pid=ImgRaw&r=0', 'Microfono inalambrico', 1, 3, 1, 2, 1),
('KD332', 'https://musicalesyaee.com/backend/vistas/img/multimedia/krieg-kd332-microfono-inalambrico-doble/A-Micr%C3%B3fono%20Inal%C3%A1mbrico%20Doble%20KD332.jpg', 'Microfonos Krieg KD332 Cardioide color negro', 1, 3, 1, 2, 1),
('KMMB18', 'https://tse3.mm.bing.net/th/id/OIP.K1RyNCKrKDRaOkB-Npi-YgHaIV?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono de bateria', 1, 3, 1, 3, 1),
('KMMB3', 'https://tse3.mm.bing.net/th/id/OIP.RWZw7VV0Ma1K9A5DPrfVCgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'La serie KMMB de Krieg es una familia compuesta por juegos de microfonos para bateria', 1, 3, 1, 3, 1),
('K513', 'https://tse3.mm.bing.net/th/id/OIP.zh1OPJX4XIwjhgG0eolzAwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfonos dinamicos de mano del tipo multi proposito de bajo costo', 1, 3, 1, 1, 1),
('K511', 'https://tse2.mm.bing.net/th/id/OIP.8XtE1XpUui0tVAndv1_AMAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'La familia K500 de Krieg, son microfonos dinamicos de mano del tipo multi proposito', 1, 3, 1, 1, 1),
('K511 PAQ', 'https://tse3.mm.bing.net/th/id/OIP.4JbK9cOYH0VrQZ1bhtHlGAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', 'Estuche para mano para voz K511 PAQ', 1, 3, 1, 1, 1),
('KHD1', 'http://krieg.mx/images/KHD1.png', 'Microfono de diadema inalambrico', 1, 3, 1, 2, 1),
('KM15Di', 'https://krieg.mx/km15di.html', 'El microfono inalambrico mas facil de usar', 1, 3, 1, 2, 1),
('GOOS-332', 'https://tse1.mm.bing.net/th/id/OIP.aSPx6IrAiffpNhUQ9YxdLAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 'Microfono para conferencia', 1, 3, 1, 2, 1),
('KMV2', 'https://krieg.mx/images/KMV2.png', 'KRIEG presenta su microfono para saxofon inalambrico', 1, 3, 1, 2, 1),
('TR-40/REC-4', 'https://tse1.mm.bing.net/th/id/OIP.jK14UtPwrbrrDt6UdmVaKAHaE5?rs=1&pid=ImgDetMain&o=7&rm=3', 'Monitor personal inalambrico', 1, 3, 1, 2, 1),
('KC06B', 'https://krieg.mx/gallery/KC06B_3.png', 'Microfono de condensador', 1, 3, 1, 1, 1),
('K917', 'https://krieg.mx/gallery/K917_1_p1i6mk1r.png', 'Microfono RTA', 1, 3, 1, 1, 1),
('K108', 'https://krieg.mx/images/galeria108.png', 'Microfonos de mano profesionales de uso general.', 1, 3, 1, 1, 1),
('KTM9', 'https://krieg.mx/images/galeriaKTM9.png', 'El modelo KTM9 de Krieg es un microfono de condensador para estudio.', 1, 3, 1, 1, 1),
('MC-380D', 'https://www.cyberpuerta.mx/img/product/XL/CP-ROMMS-MC-380D-9a51ef.jpg', 'Microfono de diadema inalambrico que mejora la comunicacion', 1, 4, 1, 2, 1),
('MC-324', 'https://http2.mlstatic.com/D_NQ_NP_2X_673237-MLM47589800908_092021-F.webp', 'Su dinamismo lo hace ideal para vocalistas e instrumentos.', 1, 4, 1, 2, 1),
('MC-630LD', 'https://www.cyberpuerta.mx/img/product/XL/CP-ROMMS-MC-630LD-ba3454.jpg', 'El microfono Romms MC-630LD aprovecha la conectividad alambrica', 1, 4, 1, 2, 1),
('MC-630L', 'https://www.cyberpuerta.mx/img/product/XL/CP-ROMMS-MC-630L-b72d85.jpg', 'El microfono alambrico MC-630L ofrece claridad y precision', 1, 4, 1, 2, 1),
('MC-380M', 'https://http2.mlstatic.com/D_NQ_NP_2X_978922-MLA79481386912_102024-F.webp', 'Opera con diversos equipos de audio como amplificadores y mezcladoras.', 1, 4, 1, 2, 1),
('MC-318', 'https://http2.mlstatic.com/D_NQ_NP_2X_934345-MLA99954026649_112025-F.webp', 'Su dinamismo lo hace ideal para vocalistas e instrumentos.', 1, 4, 1, 2, 1),
('MC-328', 'https://http2.mlstatic.com/D_NQ_NP_2X_631655-MLA99937542557_112025-F.webp', 'Su dinamismo lo hace ideal para vocalistas e instrumentos.', 1, 4, 1, 2, 1),
('MC-380L', 'https://www.cyberpuerta.mx/img/product/XL/CP-ROMMS-MC-380L-0ccaf1.jpg', 'Microfono inalambrico UHF de solapa (Lavalier)', 1, 4, 1, 2, 1),
('MC-58S', 'https://http2.mlstatic.com/D_NQ_NP_2X_931714-MLU74163702187_012024-F.webp', 'Su patron polar cardioide ofrece mayor sensibilidad frontal.', 1, 4, 1, 1, 1),
('MC-58A', 'https://www.herguimusical.com/cdn/shop/products/MC-58A_570x570_crop_top.png?v=1629816350', 'Microfono dinamico super cardiode de salida alta.', 1, 4, 1, 1, 1),
('490-357', 'https://http2.mlstatic.com/D_NQ_NP_2X_741620-MLM50897663833_072022-F.webp', 'Microfono Diadema Y Solapa Uhf Radox 490-357 Inalambrico', 1, 5, 1, 2, 1),
('490-140', 'https://http2.mlstatic.com/D_NQ_NP_2X_624064-MLA99476917820_112025-F.webp', 'Microfono Alambrico Recepcion unidireccional', 1, 5, 1, 2, 1),
('490-150', 'https://http2.mlstatic.com/D_NQ_NP_2X_614847-MLM83017510517_032025-F.webp', 'Microfono Dinamico Unidireccional Radox Mod: 490-150', 1, 5, 1, 1, 1),
('490-220', 'https://http2.mlstatic.com/D_NQ_NP_2X_930312-MLU75174615538_032024-F.webp', 'Eleccion perfecta para quienes buscan calidad de sonido y durabilidad.', 1, 5, 1, 1, 1),
('490-236', 'https://http2.mlstatic.com/D_NQ_NP_2X_834159-MLM92337187903_092025-F.webp', 'Microfono Dinamico Unidireccional 490-236 Radox', 1, 5, 1, 1, 1),
('490-330', 'https://http2.mlstatic.com/D_NQ_NP_2X_864216-MLM92295729948_092025-F.webp', 'Microfono Dinamico Unidireccional 490-330', 1, 5, 1, 1, 1),
('490-336', 'https://http2.mlstatic.com/D_NQ_NP_2X_873783-MLA105618732915_012026-F.webp', 'Microfono Radox 490-336 Con Estuche Reforzado', 1, 5, 1, 1, 1),
('490-471', 'https://http2.mlstatic.com/D_NQ_NP_2X_960439-MLM73077402859_112023-F.webp', 'Sistema De 2 Microfonos Inalambricos Uhf Radox 490-471', 1, 5, 1, 2, 1),
('490-334', 'https://http2.mlstatic.com/D_NQ_NP_2X_811466-MLM77981929958_082024-F.webp', 'Microfono radox para voz con switch/apagado/encendido 490334', 1, 5, 1, 1, 1),
('490-146', 'https://www.herguimusical.com/cdn/shop/products/490-146_6e117a08-b918-4f85-a5d4-135f6d924e3c_570x570_crop_top.jpg?v=1598768913', 'MICROFONO DINAMICO UNID. METALICO RADOX 490-146', 1, 5, 1, 1, 1),
('490-125', 'https://http2.mlstatic.com/D_NQ_NP_2X_687687-MLM89050029547_072025-F.webp', 'Microfono Alambrico Radox 490-125', 1, 5, 1, 1, 1),
('490-601', 'https://http2.mlstatic.com/D_NQ_NP_2X_882548-MLM93230056370_092025-F.webp', 'Microfono Vocal Unidireccional De Estudio Radox 490-601', 1, 5, 1, 1, 1),
('MC113', 'https://http2.mlstatic.com/D_NQ_NP_2X_935996-MLM93257678220_092025-F.webp', 'Jgo. De 2 Microfonos De Mano Uhf, Blanco Xss Mc-113w', 1, 6, 1, 2, 1),
('CM106', 'https://xsspro.com/wp-content/uploads/2021/09/CM106SF2-1.jpg', '2 MICROFONOS UHF RECARGABLES 16 FREQ. POR MICRO', 1, 6, 1, 2, 1),
('MC144', 'https://electronicaremberg.com/wp-content/uploads/2016/08/MC144_4adca7f0ea28d-768x768.jpg', 'Microfono profesional inalambrico UHF', 1, 6, 1, 2, 1),
('CM107', 'https://http2.mlstatic.com/D_NQ_NP_2X_980950-MLM82089737175_012025-F.webp', 'Sistema Xss Cm107 De Microfóno, Transmisor Y Receptor Uhf', 1, 6, 1, 2, 1),
('CM158S', 'https://http2.mlstatic.com/D_NQ_NP_2X_715471-MLM74361119124_022024-F.webp', 'Microfono Alambrico Vocal Xss Profesional Cm 158s', 1, 6, 1, 1, 1),
('CM-157', 'https://www.cyberpuerta.mx/img/product/XL/CP-XSS-CM157-91c9eb.jpg', 'XSS Microfono CM-157, Alambrico, 600 Ohmios', 1, 6, 1, 1, 1),
('CM-158B', 'https://http2.mlstatic.com/D_NQ_NP_2X_998965-MLM52716237663_122022-F.webp', 'Microfono Alambrico Xss Cm-158b Para Grabacion Profesional', 1, 6, 1, 1, 1),
('CM158', 'https://xsspro.com/wp-content/uploads/2021/09/CM-158-1.jpg', 'MICROFONO DINAMICO VOCAL UNIDIRECCIONAL (CARDIOIDE)', 1, 6, 1, 1, 1),
('DRUM SET SESSION', 'https://olartesound.com/wp-content/uploads/2023/10/DRUM-SET-SESSION-I-2.png', 'Set de Microfonos para Bateria DRUM SET SESSION I AKG', 1, 7, 2, 3, 1),
('KMMB91', 'https://krieg.mx/images/Capa-163.png', 'Microfono de bateria', 1, 3, 2, 3, 1),
('KMMB19', 'https://krieg.mx/gallery/KMMB19_1.png', 'Microfono de bateria', 1, 3, 2, 3, 1),
('KMI-06', 'https://http2.mlstatic.com/D_NQ_NP_2X_880203-MLA99508685346_112025-F.webp', 'Microfono Dinamico Kapton KMI-06 XLR Cardioide', 1, 8, 1, 1, 1),
('KMI-90', 'https://http2.mlstatic.com/D_NQ_NP_2X_762105-MLA105988052491_012026-F.webp', 'Microfono Kapton Kmi-90 Para Conferencias Cuello Cisne', 1, 8, 1, 1, 1),
('KMI-11', 'https://www.cyberpuerta.mx/img/product/XL/CP-KAPTON-KMI-11-495e5f.jpg', 'Kapton Microfono KMI-11, Alambrico', 1, 8, 1, 1, 1),
('KMI-18', 'https://kapton-pa.com/wp-content/uploads/2026/03/KMI-18_1.jpg', 'MICROFONO DINAMICO COLOR AZUL', 1, 8, 1, 1, 1),
('KMI-19', 'https://kapton-pa.com/wp-content/uploads/2026/03/KMI-19_1.jpg', 'MICROFONO DINAMICO COLOR ROSA', 1, 8, 1, 1, 1),
('KMI-14', 'https://kapton-pa.com/wp-content/uploads/2024/10/KMI-14.png', 'MICROFONO ALAMBRICO COLOR MORADO', 1, 8, 1, 1, 1),
('KMI-12', 'https://kapton-pa.com/wp-content/uploads/2024/09/KMI-12_1.1.png', 'MICROFONO ALAMBRICO COLOR ROSA', 1, 8, 1, 1, 1),
('KMI-63', 'https://kapton-pa.com/wp-content/uploads/2025/09/KMI-63_1.jpg', 'KIT DE MICROFONOS ALAMBRICOS', 1, 8, 1, 1, 1),
('KMI-07', 'https://kapton-pa.com/wp-content/uploads/2024/10/KMI-07_1-1.png', 'MICROFONO ALAMBRICO COLOR NEGRO', 1, 8, 1, 1, 1),
('KMI-08', 'https://kapton-pa.com/wp-content/uploads/2024/10/KMI-08_3.1.png', 'MICROFONO ALAMBRICO COLOR AMARILLO', 1, 8, 1, 1, 1),
('KMI-58A', 'https://kapton-pa.com/wp-content/uploads/2024/10/KMI-58A_1.png', 'MICROFONO ALAMBRICO', 1, 8, 1, 1, 1),
('KMI-15', 'https://kapton-pa.com/wp-content/uploads/2024/09/KMI-15_1.png', 'MICROFONO ALAMBRICO', 1, 8, 1, 1, 1),
('KMI-83', 'https://kapton-pa.com/wp-content/uploads/2025/09/KMI-83_1.jpg', 'KIT DE MICROFONOS ALAMBRICOS', 1, 8, 1, 1, 1),
('KMI-73', 'https://kapton-pa.com/wp-content/uploads/2025/09/kmi-73.jpg', 'KIT DE MICROFONOS ALAMBRICOS', 1, 8, 1, 1, 1),
('STW-23HU2', 'https://www.cyberpuerta.mx/img/product/XL/CP-SOUNDTRACK-STW-23HU2-9c7783.jpg', 'Soundtrack Microfono STW-23HU2, Inalambrico', 1, 9, 1, 2, 1),
('DMR-7', 'https://www.cyberpuerta.mx/img/product/XL/CP-SOUNDTRACK-DRM-7-e1d439.jpg', 'Soundtrack Kit Microfonos para Bateria DRM-7', 1, 9, 2, 3, 1),
('STW-401F', 'https://m.media-amazon.com/images/I/51JqCoKS9CL._AC_SL1050_.jpg', 'SOUNDTRACK Sistema microfonos inalambricos STW-401F', 1, 9, 1, 2, 1),
('STW-28HUL', 'https://m.media-amazon.com/images/I/31Hbaaxy5aL._AC_.jpg', 'SOUNDTRACK STW28HUL Microfono de Diadema, Mano y Solapa', 1, 9, 1, 2, 1),
('STW-28HU2', 'https://www.cyberpuerta.mx/img/product/XL/CP-SOUNDTRACK-STW-28HU2-5fccce.jpg', 'Soundtrack Set Microfonos STW-28HU2, Inalambricos', 1, 9, 1, 2, 1),
('STW-56HU2', 'https://http2.mlstatic.com/D_NQ_NP_2X_977003-MLA100022264957_122025-F.webp', 'Microfonos Inalambricos Soundtrack STW-56HU2', 1, 9, 1, 2, 1),
('STW-33HU2', 'https://audiomundo.com.mx/cdn/shop/files/STW-33HU2_700x.jpg?v=1761761243', 'Microfono Inalambrico de Mano Soundtrack STW-33HU2', 1, 9, 1, 2, 1),
('STW-28HLL', 'https://audiomundo.com.mx/cdn/shop/files/STW28HLL__1_700x.jpg?v=1758642497', 'Microfonos inalambricos SOUNDTRACK STW-28HLL', 1, 9, 1, 2, 1),
('PRO-600X3', 'https://http2.mlstatic.com/D_NQ_NP_2X_919487-MLM50161401702_062022-F.webp', 'Microfonos Prof.dinamico Baja Impedancia Pro600x3', 1, 9, 1, 1, 1),
('DM-430', 'https://audiomundo.com.mx/cdn/shop/products/DM430__1_700x.jpg?v=1604525772', 'Microfono Cuello Ganso SOUNDTRACK DM-430', 1, 9, 1, 1, 1),
('M-6', 'https://soundtrackmexico.com/storage/2025/09/producto-m6-0001.png', 'M6-Microfono de solapa para dispositivos moviles', 1, 9, 3, 4, 1),
('TK-M200', 'https://http2.mlstatic.com/D_NQ_NP_2X_985299-MLM92687589227_092025-F.webp', 'Microfono De Plastico Dinamico Unidireccional Taika Tk-m200', 1, 10, 1, 1, 1),
('TKM-220', 'https://http2.mlstatic.com/D_NQ_NP_2X_845922-MLA99917088247_112025-F.webp', 'Microfono Dinamico Unidireccional Taika TK-M220', 1, 10, 1, 1, 1),
('TK-M400', 'https://http2.mlstatic.com/D_NQ_NP_2X_881257-MLM91930994692_092025-F.webp', 'Microfono De Plastico Dinamico Unidireccional Taika Tk-m400', 1, 10, 1, 1, 1),
('TKM-420', 'https://http2.mlstatic.com/D_NQ_NP_2X_717825-MLA99972018097_112025-F.webp', 'Microfono Dinamico Unidireccional Taika TK-M420', 1, 10, 1, 1, 1),
('TK-M625U', 'https://http2.mlstatic.com/D_NQ_NP_2X_985847-MLM92240780332_092025-F.webp', 'Microfonos Uhf Inalambrico Taika Tk-m625u', 1, 10, 1, 2, 1),
('LN202U', 'https://http2.mlstatic.com/D_NQ_NP_2X_786591-MLM80722860943_112024-F.webp', 'Microfono Lennon Inalambrico Uhf Doble De Mano', 1, 11, 1, 2, 1),
('LN102U', 'https://http2.mlstatic.com/D_NQ_NP_2X_940115-MLA80807735224_112024-F.webp', 'Kit De 2 Microfonos Inalambricos De Metal Uhf Lennon', 1, 11, 1, 2, 1),
('LN-M88', 'https://http2.mlstatic.com/D_NQ_NP_2X_820471-MLA84843350975_052025-F.webp', 'Microfono Dinamico Lennon Profesional Ln-m88', 1, 11, 1, 2, 1),
('KMIC-68UHF', 'https://http2.mlstatic.com/D_NQ_NP_2X_617899-MLM98446816364_112025-F.webp', 'Sistema De Mironofo Inlambrico Doble Krack Kmic-68uhf', 1, 12, 1, 2, 1),
('KMIC-6XP', 'https://http2.mlstatic.com/D_NQ_NP_2X_995143-MLM92759588782_092025-F.webp', 'Microfonos Inalambricos Profesionales Uhf Krack Kmic-6xp', 1, 12, 1, 2, 1),
('KMIC-58', 'https://http2.mlstatic.com/D_NQ_NP_2X_822280-MLM89844826202_082025-F.webp', 'Microfono Alambrico Voz Instrumentos Krack Audio Kmic-58', 1, 12, 1, 1, 1),
('KMIC-6UHF', 'https://http2.mlstatic.com/D_NQ_NP_2X_649469-MLM92759293544_092025-F.webp', 'Sistema De Microfono Inalabrico De Diadema Krack Kmic-6uhf', 1, 12, 1, 2, 1),
('SDM60', 'https://http2.mlstatic.com/D_NQ_NP_2X_691569-MLA99529535718_122025-F.webp', 'Microfono Dinamico Stagg Sdm60', 1, 13, 1, 2, 1),
('SDM70', 'https://m.media-amazon.com/images/I/418oxg-7jWL._AC_SL1000_.jpg', 'Stagg SDM70 Microfono dinamico cardioide Profesional', 1, 13, 1, 2, 1),
('SDM80', 'https://http2.mlstatic.com/D_NQ_NP_2X_665151-MLA99963203477_112025-F.webp', 'Microfono Stagg Sdm80 Cardioide Dinamico XLR', 1, 13, 1, 2, 1),
('SDMP10', 'https://m.media-amazon.com/images/I/5156eMnnI5L._AC_SL1200_.jpg', 'Stagg SDMP10 Microfono dinamico Multiusos', 1, 13, 1, 1, 1),
('SDMP15', 'https://http2.mlstatic.com/D_NQ_NP_2X_651506-MLU76248543099_052024-F.webp', 'Microfono Dinamico Stagg Sdmp15 Con Cable Negro', 1, 13, 1, 1, 1),
('490-351', 'https://radox.com.mx/recursos/productos/490-351.jpg', 'Microfono de Diadema con Plug 3.5mm Mono, Repuesto', 1, 5, 1, 5, 1),
('490-352', 'https://radox.com.mx/recursos/productos/490-352.jpg', 'Microfono de Diadema con Jack Mini XLR Canon, Repuesto', 1, 5, 1, 5, 1);

-- =========================================
-- INSERTAR CALIFICACIÓN POR DEFECTO
-- =========================================
INSERT INTO `Calificacion` (`estrellas`, `fecha`, `modelo`) VALUES (5, CURDATE(), 'BETA-52A');