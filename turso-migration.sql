-- ============================================
-- PRAKASA WEBSITE - DATABASE MIGRASI TURSO
-- ============================================
-- CARA PAKAI:
-- 1. Login ke https://turso.tech/
-- 2. Klik database "prakasa-db"
-- 3. Klik tab "Shell" atau "Console"
-- 4. Copy-paste SQL di bawah ini SATU BAGIAN PER SATU BAGIAN
--    (jangan sekaligus, copy per bagian yang ditandai ===)
-- 5. Tekan Enter/Run setelah setiap bagian
-- ============================================

-- ==========================================
-- BAGIAN 1: BUAT TABEL (STRUKTUR DATABASE)
-- ==========================================

CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Post (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    published BOOLEAN NOT NULL DEFAULT 0,
    authorId TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Review (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    project TEXT,
    service TEXT,
    isVerified BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Project (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ProjectImage (
    id TEXT PRIMARY KEY NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    projectId TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Partner (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    logoUrl TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Service (
    id TEXT PRIMARY KEY NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Building2',
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    features TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS SiteContent (
    id TEXT PRIMARY KEY NOT NULL,
    section TEXT NOT NULL UNIQUE,
    data TEXT NOT NULL DEFAULT '{}',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ActiveProject (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Berjalan',
    image TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ContactMessage (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT NOT NULL,
    isRead BOOLEAN NOT NULL DEFAULT 0,
    isStarred BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- BAGIAN 2: ISI DATA AWAL (SEED DATA)
-- ==========================================

-- 2a. Data Layanan (4 layanan utama)
INSERT INTO Service ("id","icon","title","subtitle","description","image","features","order") VALUES ('service-0','Building2','Civil','Construction & Structure','Konstruksi bangunan dengan standar internasional, pondasi yang kokoh, dan struktur yang tahan lama. Kami mengutamakan kualitas material dan presisi pengerjaan di setiap proyek sipil.','/images/civil.jpg','["Struktur Beton Bertulang","Pondasi & Piling","Steel Structure","Renovasi Struktural"]',0);
INSERT INTO Service ("id","icon","title","subtitle","description","image","features","order") VALUES ('service-1','PaintBucket','Interior','Design & Finishing','Desain interior premium yang menggabungkan estetika dan fungsionalitas. Setiap detail diperhatikan untuk menciptakan ruang yang mewah, nyaman, dan mencerminkan kepribadian Anda.','/images/interior.jpg','["Custom Furniture","Luxury Finishing","Smart Home Integration","Lighting Design"]',1);
INSERT INTO Service ("id","icon","title","subtitle","description","image","features","order") VALUES ('service-2','Home','Exterior','Facade & Cladding','Transformasi fasad bangunan dengan material premium dan desain kontemporer. Eksterior kami menciptakan kesan megah pertama yang tak terlupakan dan perlindungan optimal.','/images/exterior.jpg','["Facade Engineering","Glass & Aluminium","Stone Cladding","Waterproofing"]',2);
INSERT INTO Service ("id","icon","title","subtitle","description","image","features","order") VALUES ('service-3','TreePine','Landscape','Garden & Outdoor Living','Rancangan lanskap yang menyatu dengan alam, menciptakan oase hijau di tengah urbanitas. Dari taman tropis hingga zen garden, kami mewujudkan konsep outdoor living impian Anda.','/images/landscape.jpg','["Garden Design","Water Features","Hardscape","Irrigation System"]',3);

-- 2b. Data Mitra/Partner (logo klien)
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-0','AG','/images/partners/ag-logo.png',0);
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-1','ASDP','/images/partners/asdp-logo.png',1);
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-2','AVIP','/images/partners/avip-logo.png',3);
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-3','BCA','/images/partners/bca-logo.png',4);
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-4','Danakar','/images/partners/danakar-logo.png',3);
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-5','DPR RI','/images/partners/dprri-logo.png',5);
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-6','Estetiderma','/images/partners/estetiderma-logo.png',6);
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-7','IHG','/images/partners/ihg-logo.png',7);
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-8','MB','/images/partners/mb-logo.png',8);
INSERT INTO Partner ("id","name","logoUrl","order") VALUES ('partner-9','TC','/images/partners/tc-logo.png',9);

-- 2c. Data Konten Website (hero, about, process, contact, footer)
INSERT INTO SiteContent ("id","section","data") VALUES ('content-hero','hero','{"badge":"*ARCHITECTURE INTERIOR DESIGN*","subtitle":"Mewujudkan visi arsitektur mewah dengan presisi tinggi.\nSpesialis Civil, Interior, Exterior & Landscape","backgroundImage":"/images/hero-bg.png","stat1_number":"15+","stat1_label":"Tahun","stat2_number":"500+","stat2_label":"Proyek","stat3_number":"98%","stat3_label":"Kepuasan"}');
INSERT INTO SiteContent ("id","section","data") VALUES ('content-about','about','{"heading":"Masa Depan","paragraph1":"PRAKASA STUDIO adalah kontraktor premium yang menggabungkan keahlian konstruksi tradisional dengan teknologi AI terdepan. Dengan pengalaman lebih dari 15 tahun, kami telah menyelesaikan lebih dari 500 proyek dengan tingkat kepuasan klien mencapai 98%.","paragraph2":"Misi kami sederhana namun ambisius: menghadirkan solusi konstruksi dan desain yang melampaui ekspektasi. Setiap proyek dikerjakan dengan dedikasi penuh, material berkualitas tertinggi, dan inovasi yang tak henti-hentinya.","image":"/images/about-team.jpg","values":[{"title":"Presisi & Kualitas","description":"Setiap detail dikerjakan dengan presisi tinggi menggunakan material premium dan teknologi terdepan untuk memastikan hasil yang sempurna."},{"title":"Inovasi","description":"Kami memanfaatkan teknologi Artificial Intelligence untuk perencanaan, visualisasi, dan manajemen proyek yang lebih akurat dan efisien."},{"title":"Keberlanjutan","description":"Berkomitmen pada praktik konstruksi hijau dan material ramah lingkungan tanpa mengorbankan kualitas dan estetika."}],"stats":[{"number":15,"suffix":"+","label":"Tahun Pengalaman","icon":"Clock"},{"number":500,"suffix":"+","label":"Proyek Selesai","icon":"Users"},{"number":98,"suffix":"%","label":"Kepuasan Klien","icon":"Award"},{"number":120,"suffix":"+","label":"Tim Profesional","icon":"Shield"}]}');
INSERT INTO SiteContent ("id","section","data") VALUES ('content-process','process','{"heading":"Menuju Sempurna","subheading":"Empat Langkah","description":"Proses terstruktur yang dirancang untuk menghadirkan hasil terbaik dengan efisiensi maksimal.","steps":[{"number":"01","title":"Konsultasi","description":"Diskusi mendalam tentang visi, kebutuhan, dan anggaran proyek Anda.","icon":"Lightbulb"},{"number":"02","title":"Desain & Planning","description":"Tim desainer kami menciptakan konsep visual yang disempurnakan dengan teknologi AI.","icon":"PenTool"},{"number":"03","title":"Eksekusi","description":"Konstruksi dilaksanakan oleh tim berpengalaman dengan pengawasan ketat dan material premium.","icon":"HardHat"},{"number":"04","title":"Serah Terima","description":"Quality inspection menyeluruh sebelum handover disertai garansi pemeliharaan.","icon":"KeyRound"}]}');
INSERT INTO SiteContent ("id","section","data") VALUES ('content-contact','contact','{"address":"Jl. H Soleh 1A No.63 RT.11/RW.3, Sukabumi Selatan, Kebon Jeruk, Jakarta Barat 11560","phone":"+62 857-7560-9498","email":"pt.tigaputraprakasa@gmail.com","workHours":"Senin - Sabtu, 08:00 - 17:00"}');
INSERT INTO SiteContent ("id","section","data") VALUES ('content-footer','footer','{"ctaTitle":"Proyek Impian","ctaDescription":"Dapatkan konsultasi gratis dan estimasi proyek dari tim ahli kami.","brandDescription":"Kontraktor premium spesialis konstruksi, desain & Build interior, exterior."}');

-- 2d. Data Proyek Aktif (yang sedang berjalan)
INSERT INTO ActiveProject ("id","title","category","location","description","progress","status","image","order") VALUES ('ap-1','The Golden Residence','Interior','Jakarta Selatan','Proyek renovasi interior premium untuk rumah tinggal 3 lantai dengan konsep modern luxury.',65,'Berjalan','/images/projects/interior/interior-1.jpg',0);
INSERT INTO ActiveProject ("id","title","category","location","description","progress","status","image","order") VALUES ('ap-2','Menara Sapphire Office','Civil','Jakarta Barat','Pembangunan gedung perkantoran 12 lantai dengan struktur beton bertulang dan fasad kaca modern.',35,'Berjalan','/images/projects/civil/civil-1.jpg',1);
INSERT INTO ActiveProject ("id","title","category","location","description","progress","status","image","order") VALUES ('ap-3','Villa Green Paradise','Landscape','Bali','Desain taman tropis untuk villa mewah dengan kolam renang infinity dan area BBQ outdoor.',80,'Berjalan','/images/projects/landscape/landscape-1.jpg',2);
INSERT INTO ActiveProject ("id","title","category","location","description","progress","status","image","order") VALUES ('ap-4','Residence Cendana Facade','Exterior','Menteng, Jakarta','Transformasi fasad rumah heritage menjadi desain kontemporer dengan material aluminium composite panel.',50,'Berjalan','/images/projects/exterior/exterior-1.jpg',3);

-- 2e. Data Portfolio Proyek (yang sudah selesai)
INSERT INTO Project ("id","title","category","location","year","description","order") VALUES ('proj-1','The Golden Residence','Civil','Jakarta Selatan','2024','Proyek residensial premium dengan struktur beton bertulang dan finishing mewah. Kolam renang infinity, smart home system, dan lanskap tropis yang memukau.',1);
INSERT INTO Project ("id","title","category","location","year","description","order") VALUES ('proj-2','Grand Pacific Tower','Civil','Jakarta CBD','2023','Pembangunan tower komersial 25 lantai dengan teknologi steel structure terdepan.',2);
INSERT INTO Project ("id","title","category","location","year","description","order") VALUES ('proj-3','The Marble Suite','Interior','Bandung','2024','Desain interior ultra-luxury untuk penthouse suite. Material marble import dan custom furniture Italia.',3);
INSERT INTO Project ("id","title","category","location","year","description","order") VALUES ('proj-4','Sky Lounge Residence','Interior','Surabaya','2023','Interior apartemen premium dengan konsep open living. Kitchen set custom dan home theater.',4);
INSERT INTO Project ("id","title","category","location","year","description","order") VALUES ('proj-5','Aurora Office Tower','Exterior','Jakarta CBD','2024','Fasad curtain wall dengan sistem double glazing dan aluminium composite panel premium.',5);
INSERT INTO Project ("id","title","category","location","year","description","order") VALUES ('proj-6','Oceanview Villa','Exterior','Bali','2023','Villa tepi pantai dengan arsitektur tropis modern. Stone cladding dan infinity pool.',6);
INSERT INTO Project ("id","title","category","location","year","description","order") VALUES ('proj-7','Tropical Infinity Resort','Landscape','Lombok','2024','Resort dengan kolam infinity, taman tropis, dan water features yang memukau.',7);
INSERT INTO Project ("id","title","category","location","year","description","order") VALUES ('proj-8','Zen Garden Residence','Landscape','Jakarta Selatan','2023','Taman bergaya zen yang menyatu dengan arsitektur modern. Koi pond dan meditation garden.',8);

-- ==========================================
-- SELESAI! Database sudah siap digunakan.
-- ==========================================
-- Setelah ini, lanjutkan ke Langkah 3 (Cloudinary)
-- ==========================================
