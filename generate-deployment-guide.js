const { Document, Packer, Paragraph, TextRun, Header, Footer,
        AlignmentType, HeadingLevel, PageNumber, BorderStyle,
        Table, TableRow, TableCell, WidthType, ShadingType,
        TableOfContents, PageBreak } = require("docx");
const fs = require("fs");

// Palette - Tech/Digital
const P = {
  primary: "#0A1628",
  body: "#1A2B40",
  secondary: "#6878A0",
  accent: "#5B8DB8",
  surface: "#F4F8FC",
};

const c = (hex) => hex.replace("#", "");

// Helper functions
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

function bodyText(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 22, color: c(P.body) })],
  });
}

function boldText(text) {
  return new TextRun({ text, bold: true, size: 22, color: c(P.primary) });
}

function normalText(text) {
  return new TextRun({ text, size: 22, color: c(P.body) });
}

function codeBlock(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 280 },
    indent: { left: 360 },
    children: [new TextRun({ text, font: "Consolas", size: 18, color: c(P.accent) })],
  });
}

function bulletPoint(text, isBold = false) {
  return new Paragraph({
    spacing: { line: 312, after: 60 },
    indent: { left: 720, hanging: 360 },
    children: [
      new TextRun({ text: "\u2022  ", size: 22, color: c(P.accent) }),
      isBold ? boldText(text) : normalText(text),
    ],
  });
}

function numberedPoint(num, text) {
  return new Paragraph({
    spacing: { line: 312, after: 60 },
    indent: { left: 720, hanging: 360 },
    children: [
      new TextRun({ text: `${num}.  `, bold: true, size: 22, color: c(P.accent) }),
      normalText(text),
    ],
  });
}

function stepTitle(num, text) {
  return new Paragraph({
    spacing: { before: 240, after: 80, line: 312 },
    children: [
      new TextRun({ text: `Langkah ${num}: `, bold: true, size: 24, color: c(P.accent) }),
      new TextRun({ text, bold: true, size: 24, color: c(P.primary) }),
    ],
  });
}

function separator() {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" } },
    children: [],
  });
}

// Build document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 22, color: c(P.body) },
        paragraph: { spacing: { line: 312 } },
      },
    },
  },
  sections: [
    // Cover Section
    {
      properties: {
        page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: [
        new Paragraph({ spacing: { before: 4000 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "PANDUAN DEPLOYMENT", size: 48, bold: true, color: c(P.accent), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ text: "Website Prakasa - Hosting & Domain Gratis", size: 32, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
        }),
        separator(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: "Vercel + Turso + Cloudinary", size: 24, color: c(P.secondary) })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Platform Gratis untuk Website Next.js", size: 22, color: c(P.secondary) })],
        }),
        new Paragraph({ spacing: { before: 3000 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Versi 1.0 - Mei 2026", size: 20, color: c(P.secondary) })],
        }),
      ],
    },
    // Body Section
    {
      properties: {
        page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: c(P.secondary) })],
          })],
        }),
      },
      children: [
        // === SECTION 1: Overview ===
        heading("Panduan Deploy Website Prakasa ke Internet"),

        bodyText("Dokumen ini menjelaskan langkah-langkah lengkap untuk mempublikasikan website Prakasa (perusahaan konstruksi dan interior) agar dapat diakses oleh semua orang melalui internet, menggunakan layanan hosting dan domain yang sepenuhnya gratis. Website ini dibangun menggunakan Next.js, dan platform terbaik untuk hosting Next.js secara gratis adalah Vercel."),

        bodyText("Karena Vercel menggunakan serverless functions yang tidak memiliki penyimpanan file permanen (read-only filesystem), kita perlu melakukan penyesuaian pada dua komponen utama website: database (menggunakan Turso sebagai cloud SQLite) dan penyimpanan gambar (menggunakan Cloudinary sebagai cloud image storage). Kedua layanan ini memiliki tier gratis yang sangat cukup untuk website perusahaan."),

        heading("Arsitektur Deployment", HeadingLevel.HEADING_2),

        bodyText("Berikut adalah arsitektur deployment yang akan kita gunakan:"),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Komponen", bold: true, size: 21, color: c(P.accent) })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Platform", bold: true, size: 21, color: c(P.accent) })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Tier Gratis", bold: true, size: 21, color: c(P.accent) })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                }),
              ],
            }),
            ...([
              ["Hosting Website", "Vercel", "Unlimited sites, 100GB bandwidth/bulan"],
              ["Database", "Turso (libSQL)", "9GB storage, 1B reads/bulan"],
              ["Penyimpanan Gambar", "Cloudinary", "25GB storage, 25GB bandwidth/bulan"],
              ["Domain", "Vercel (.vercel.app)", "Gratis selamanya"],
              ["Repository Kode", "GitHub", "Unlimited public repos"],
            ].map((row, i) =>
              new TableRow({
                children: row.map(text =>
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text, size: 20, color: c(P.body) })] })],
                    shading: i % 2 === 0 ? { type: ShadingType.CLEAR, fill: "FFFFFF" } : { type: ShadingType.CLEAR, fill: c(P.surface) },
                    margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  })
                ),
              })
            )),
          ],
        }),

        new Paragraph({ spacing: { before: 200 }, children: [] }),

        // === SECTION 2: Prerequisites ===
        heading("Persyaratan Sebelum Mulai"),

        bodyText("Sebelum memulai proses deployment, pastikan Anda memiliki hal-hal berikut:"),

        numberedPoint(1, "Akun GitHub (gratis) - Untuk menyimpan kode dan menghubungkan ke Vercel"),
        numberedPoint(2, "Akun Vercel (gratis) - Untuk hosting website"),
        numberedPoint(3, "Akun Turso (gratis) - Untuk cloud database SQLite"),
        numberedPoint(4, "Akun Cloudinary (gratis) - Untuk penyimpanan gambar"),
        numberedPoint(5, "Browser web (Chrome/Firefox/Edge) - Untuk mengakses semua platform"),
        numberedPoint(6, "Kode website Prakasa yang sudah disiapkan (sudah ada di proyek ini)"),

        bodyText("Semua akun di atas bisa didaftarkan secara gratis tanpa perlu kartu kredit. Cukup gunakan email dan buat password."),

        // === SECTION 3: Step 1 - GitHub ===
        heading("Langkah 1: Upload Kode ke GitHub", HeadingLevel.HEADING_2),

        bodyText("GitHub adalah platform untuk menyimpan kode sumber (source code) Anda. Vercel akan membaca kode dari GitHub untuk membangun dan menjalankan website Anda. Ikuti langkah-langkah berikut:"),

        stepTitle("1.1", "Buat Akun GitHub"),
        bodyText("Buka https://github.com/signup dan buat akun gratis. Isi username, email, dan password. Verifikasi email Anda."),

        stepTitle("1.2", "Buat Repository Baru"),
        bodyText("Setelah login ke GitHub, klik tombol 'New' atau '+' di pojok kanan atas, lalu pilih 'New repository'. Berikan nama repository, misalnya 'prakasa-website'. Pilih 'Private' jika ingin kode tidak terlihat publik, atau 'Public' jika tidak masalah. Klik 'Create repository'."),

        stepTitle("1.3", "Download dan Install GitHub Desktop"),
        bodyText("Buka https://desktop.github.com/ dan download GitHub Desktop untuk sistem operasi Anda (Windows/Mac). Install aplikasinya. Setelah terinstall, buka GitHub Desktop dan login dengan akun GitHub Anda."),

        stepTitle("1.4", "Upload Kode Website"),
        bodyText("Anda perlu mendapatkan kode website dari proyek ini. Cara paling mudah adalah:"),

        numberedPoint(1, "Download seluruh folder proyek website dari environment development ini"),
        numberedPoint(2, "Simpan folder tersebut di komputer Anda (misalnya di Desktop)"),
        numberedPoint(3, "Buka GitHub Desktop, klik 'Add' lalu 'Add existing repository'"),
        numberedPoint(4, "Pilih folder proyek website yang sudah didownload"),
        numberedPoint(5, "Klik 'Publish repository' untuk mengupload ke GitHub"),
        numberedPoint(6, "Pastikan nama repository sesuai, lalu klik 'Publish Repository'"),

        bodyText("Alternatif: Jika Anda terbiasa dengan command line/terminal, Anda bisa menggunakan Git CLI untuk push kode ke GitHub. Namun GitHub Desktop lebih mudah untuk pemula."),

        // === SECTION 4: Step 2 - Turso ===
        heading("Langkah 2: Setup Database Turso", HeadingLevel.HEADING_2),

        bodyText("Turso menyediakan database SQLite berbasis cloud yang kompatibel dengan Prisma. Database ini akan menyimpan semua data website Anda (konten, proyek, pesan kontak, dll) secara permanen di cloud."),

        stepTitle("2.1", "Daftar Akun Turso"),
        bodyText("Buka https://turso.tech/ dan klik 'Get Started' atau 'Sign Up'. Anda bisa mendaftar menggunakan akun GitHub untuk mempercepat proses registrasi."),

        stepTitle("2.2", "Buat Database Baru"),
        bodyText("Setelah login, Anda akan melihat dashboard Turso. Klik 'Create Database'. Berikan nama database, misalnya 'prakasa-db'. Pilih lokasi server terdekat dengan Indonesia (pilih Singapore atau Tokyo untuk latensi terendah). Klik 'Create'."),

        stepTitle("2.3", "Dapatkan URL dan Auth Token"),
        bodyText("Setelah database dibuat, klik pada database tersebut. Anda akan melihat informasi koneksi. Yang Anda perlukan adalah:"),

        bulletPoint("Database URL: Format seperti 'libsql://prakasa-db-your-org.turso.so'"),
        bulletPoint("Auth Token: Klik 'Create Token' untuk membuat token autentikasi baru"),

        bodyText("Salin dan simpan kedua nilai ini. Anda akan membutuhkannya saat konfigurasi Vercel."),

        stepTitle("2.4", "Migrasi Database"),
        bodyText("Anda perlu membuat tabel di database Turso. Cara termudah adalah menggunakan Turso CLI atau shell. Dari dashboard Turso, buka shell database dan jalankan perintah SQL berikut untuk membuat semua tabel yang diperlukan oleh website:"),

        codeBlock("-- Tabel-tabel ini akan dibuat otomatis saat pertama kali website dijalankan"),
        codeBlock("-- melalui Prisma db push. Tidak perlu membuat manual."),

        bodyText("Sebenarnya, Prisma akan otomatis membuat tabel saat Anda menjalankan 'prisma db push' dari komputer lokal. Namun untuk deployment Vercel, tabel harus sudah ada terlebih dahulu di Turso. Anda bisa menggunakan cara berikut dari terminal/komputer Anda:"),

        codeBlock("npx prisma db push"),

        bodyText("Pastikan DATABASE_URL sudah diatur ke URL Turso sebelum menjalankan perintah ini. Setelah tabel dibuat, Anda perlu mengisi data awal (seed) untuk konten website."),

        // === SECTION 5: Step 3 - Cloudinary ===
        heading("Langkah 3: Setup Cloudinary", HeadingLevel.HEADING_2),

        bodyText("Cloudinary menyediakan layanan penyimpanan dan pengelolaan gambar di cloud. Semua foto proyek, logo partner, dan gambar lainnya akan disimpan di Cloudinary, bukan di server website. Ini diperlukan karena Vercel tidak menyediakan penyimpanan file permanen."),

        stepTitle("3.1", "Daftar Akun Cloudinary"),
        bodyText("Buka https://cloudinary.com/users/register_free dan buat akun gratis. Isi formulir registrasi dengan nama, email, dan password. Tidak perlu kartu kredit."),

        stepTitle("3.2", "Dapatkan Credentials"),
        bodyText("Setelah login, Anda akan melihat dashboard Cloudinary. Di halaman dashboard, perhatikan bagian 'Account Details'. Anda akan melihat tiga informasi penting:"),

        bulletPoint("Cloud Name: Nama unik akun Cloudinary Anda"),
        bulletPoint("API Key: Kunci API untuk mengakses Cloudinary"),
        bulletPoint("API Secret: Rahasia API (jangan bagikan ke siapapun)"),

        bodyText("Salin ketiga nilai ini. Anda akan membutuhkannya saat konfigurasi Vercel."),

        stepTitle("3.3", "Konfigurasi Upload Preset (Opsional)"),
        bodyText("Secara default, Cloudinary sudah siap digunakan untuk upload gambar melalui API. Tidak perlu konfigurasi tambahan. Semua gambar akan diunggah ke folder 'prakasa/' secara otomatis oleh kode website."),

        // === SECTION 6: Step 4 - Vercel ===
        heading("Langkah 4: Deploy ke Vercel", HeadingLevel.HEADING_2),

        bodyText("Vercel adalah platform hosting yang dibuat oleh tim yang sama dengan Next.js. Ini adalah pilihan terbaik untuk hosting website Next.js karena performanya yang optimal dan integrasi yang mulus dengan framework ini. Tier gratis Vercel sangat cukup untuk website perusahaan."),

        stepTitle("4.1", "Daftar Akun Vercel"),
        bodyText("Buka https://vercel.com/signup dan daftar menggunakan akun GitHub Anda. Ini akan memudahkan koneksi antara kode di GitHub dan hosting di Vercel. Klik 'Continue with GitHub' dan authorize Vercel untuk mengakses repository GitHub Anda."),

        stepTitle("4.2", "Import Repository"),
        bodyText("Setelah login, Anda akan melihat dashboard Vercel. Klik tombol 'Add New...' lalu pilih 'Project'. Anda akan melihat daftar repository GitHub Anda. Pilih repository 'prakasa-website' yang sudah dibuat di Langkah 1. Klik 'Import'."),

        stepTitle("4.3", "Konfigurasi Project"),
        bodyText("Sebelum deploy, Anda perlu mengatur environment variables. Pada halaman konfigurasi project, scroll ke bagian 'Environment Variables'. Tambahkan variabel berikut satu per satu:"),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Key", bold: true, size: 20, color: c(P.accent) })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true, size: 20, color: c(P.accent) })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                }),
              ],
            }),
            ...([
              ["DATABASE_URL", "file:./db/custom.db (dummy, wajib diisi tapi tidak dipakai)"],
              ["TURSO_DATABASE_URL", "libsql://prakasa-db-anda.turso.so (dari Langkah 2)"],
              ["TURSO_AUTH_TOKEN", "Token autentikasi dari Langkah 2"],
              ["CLOUDINARY_CLOUD_NAME", "Cloud name dari Langkah 3"],
              ["CLOUDINARY_API_KEY", "API key dari Langkah 3"],
              ["CLOUDINARY_API_SECRET", "API secret dari Langkah 3"],
            ].map((row, i) =>
              new TableRow({
                children: row.map(text =>
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text, size: 18, color: c(P.body), font: { ascii: "Consolas" } })] })],
                    shading: i % 2 === 0 ? { type: ShadingType.CLEAR, fill: "FFFFFF" } : { type: ShadingType.CLEAR, fill: c(P.surface) },
                    margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  })
                ),
              })
            )),
          ],
        }),

        new Paragraph({ spacing: { before: 200 }, children: [] }),

        bodyText("Untuk setiap variabel, masukkan Key di kolom kiri dan Value di kolom kanan, lalu klik 'Add'. Pastikan semua 6 variabel sudah ditambahkan sebelum melanjutkan."),

        stepTitle("4.4", "Deploy"),
        bodyText("Setelah semua environment variables ditambahkan, klik tombol 'Deploy'. Vercel akan mulai membangun (build) website Anda dari kode di GitHub. Proses ini biasanya memakan waktu 2-5 menit. Anda akan melihat progress bar dan log build secara real-time."),

        bodyText("Jika build berhasil, Anda akan melihat halaman sukses dengan animasi confetti. Vercel akan memberikan URL website Anda, biasanya berformat:prakasa-website.vercel.app atau nama serupa. URL ini bisa langsung diakses oleh siapapun di internet!"),

        stepTitle("4.5", "Verifikasi Website"),
        bodyText("Buka URL yang diberikan Vercel di browser. Pastikan website berjalan dengan baik:"),

        bulletPoint("Halaman utama (homepage) tampil dengan benar"),
        bulletPoint("Semua section tampil: Hero, About, Services, Portfolio, Active Projects, Contact"),
        bulletPoint("Admin dashboard bisa diakses di /admin"),
        bulletPoint("Upload gambar berfungsi (gambar disimpan ke Cloudinary)"),
        bulletPoint("Form kontak mengirim pesan ke inbox admin"),

        // === SECTION 7: Custom Domain ===
        heading("Langkah 5: Domain Kustom (Opsional)", HeadingLevel.HEADING_2),

        bodyText("Secara default, website Anda akan memiliki domain .vercel.app yang sudah gratis. Namun jika Anda ingin menggunakan domain kustom seperti 'prakasa.co.id' atau 'prakasa.com', Anda bisa mengaturnya di Vercel."),

        heading("Opsi A: Domain Berbayar", HeadingLevel.HEADING_3),
        bodyText("Jika Anda ingin domain profesional seperti .com atau .co.id, Anda perlu membelinya dari registrar domain seperti Niagahoster, Hostinger, Namecheap, atau Google Domains. Harga domain biasanya mulai dari Rp 100.000/tahun untuk .com dan Rp 300.000/tahun untuk .co.id. Setelah membeli domain, tambahkan di Vercel dashboard > Settings > Domains, lalu ikuti instruksi DNS yang diberikan Vercel."),

        heading("Opsi B: Domain Gratis dari Freenom", HeadingLevel.HEADING_3),
        bodyText("Freenom (freenom.com) pernah menyediakan domain gratis (.tk, .ml, .ga, .cf) namun layanan ini sudah tidak aktif. Saat ini, tidak ada penyedia domain gratis yang reliable. Domain .vercel.app dari Vercel adalah pilihan gratis terbaik yang tersedia."),

        heading("Opsi C: Subdomain dari Layanan Lain", HeadingLevel.HEADING_3),
        bodyText("Beberapa layanan menyediakan subdomain gratis yang bisa diarahkan ke Vercel, seperti:"),

        bulletPoint("is-a.dev - Subdomain .is-a.dev gratis untuk developer"),
        bulletPoint("js.org - Subdomain .js.org gratis untuk proyek JavaScript"),
        bulletPoint("Afraid.org - Berbagai subdomain gratis dari Free DNS"),

        bodyText("Untuk menggunakan subdomain ini, daftar di layanan tersebut, kemudian tambahkan CNAME record yang mengarah ke cname.vercel-dns.com. Kemudian tambahkan domain di dashboard Vercel."),

        // === SECTION 8: Maintenance ===
        heading("Pemeliharaan Website", HeadingLevel.HEADING_2),

        bodyText("Setelah website online, berikut hal-hal yang perlu Anda ketahui tentang pemeliharaan:"),

        heading("Update Konten", HeadingLevel.HEADING_3),
        bodyText("Anda bisa mengupdate konten website langsung melalui admin dashboard di URL_ANDA/admin. Login dengan kredensial admin, lalu Anda bisa mengubah konten, menambah proyek baru, mengelola pesan kontak, dan upload foto tanpa perlu coding ulang."),

        heading("Update Kode", HeadingLevel.HEADING_3),
        bodyText("Jika ada perubahan kode yang perlu dilakukan, lakukan perubahan di komputer lokal, lalu push ke GitHub menggunakan GitHub Desktop. Vercel akan otomatis mendeteksi perubahan dan melakukan re-deploy. Proses ini biasanya memakan waktu 2-3 menit."),

        heading("Monitoring", HeadingLevel.HEADING_3),
        bodyText("Vercel menyediakan dashboard monitoring yang menunjukkan jumlah pengunjung, performa website, dan log error. Anda bisa mengaksesnya di dashboard Vercel > tab 'Analytics' dan 'Logs'."),

        heading("Backup Data", HeadingLevel.HEADING_3),
        bodyText("Data website tersimpan di dua tempat:"),

        bulletPoint("Database Turso: Data tersimpan aman di cloud dengan replikasi otomatis"),
        bulletPoint("Gambar Cloudinary: Gambar tersimpan dengan backup otomatis dan CDN global"),

        bodyText("Kedua layanan ini memiliki sistem backup yang reliable, sehingga Anda tidak perlu khawatir kehilangan data."),

        // === SECTION 9: Limits ===
        heading("Batasan Tier Gratis", HeadingLevel.HEADING_2),

        bodyText("Meskipun semua layanan yang digunakan gratis, ada batasan yang perlu diperhatikan. Untuk website perusahaan dengan trafik normal, batasan ini sangat cukup dan kemungkinan besar tidak akan tercapai:"),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.accent) },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Layanan", bold: true, size: 21, color: c(P.accent) })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Batasan", bold: true, size: 21, color: c(P.accent) })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Keterangan", bold: true, size: 21, color: c(P.accent) })] })],
                  shading: { type: ShadingType.CLEAR, fill: c(P.surface) },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                }),
              ],
            }),
            ...([
              ["Vercel Hosting", "100GB bandwidth/bulan", "Cukup untuk ~50.000 pengunjung/bulan"],
              ["Vercel Serverless", "10 detik per request", "Cukup untuk semua halaman website"],
              ["Turso Database", "9GB storage, 1B reads/bulan", "Sangat cukup untuk data perusahaan"],
              ["Cloudinary", "25GB storage, 25GB bandwidth/bulan", "Cukup untuk ~5000 foto proyek"],
            ].map((row, i) =>
              new TableRow({
                children: row.map(text =>
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text, size: 20, color: c(P.body) })] })],
                    shading: i % 2 === 0 ? { type: ShadingType.CLEAR, fill: "FFFFFF" } : { type: ShadingType.CLEAR, fill: c(P.surface) },
                    margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  })
                ),
              })
            )),
          ],
        }),

        new Paragraph({ spacing: { before: 200 }, children: [] }),

        bodyText("Jika suatu saat website Anda melebihi batasan ini, Anda bisa upgrade ke tier berbayar. Vercel Pro mulai dari $20/bulan, Turso Scaler mulai dari $29/bulan, dan Cloudinary Plus mulai dari $89/bulan. Namun untuk website perusahaan dengan trafik normal, tier gratis sudah sangat memadai."),

        // === SECTION 10: Troubleshooting ===
        heading("Pemecahan Masalah", HeadingLevel.HEADING_2),

        bodyText("Berikut masalah yang mungkin terjadi dan cara mengatasinya:"),

        heading("Website Tidak Bisa Diakses", HeadingLevel.HEADING_3),
        bodyText("Jika website tidak bisa diakses, periksa dashboard Vercel untuk melihat status deployment. Pastikan build berhasil dan tidak ada error. Jika ada error, periksa log build untuk mengetahui penyebabnya. Masalah umum termasuk environment variables yang salah atau kode yang error."),

        heading("Upload Gambar Gagal", HeadingLevel.HEADING_3),
        bodyText("Jika upload gambar gagal di admin dashboard, periksa bahwa environment variables Cloudinary sudah dikonfigurasi dengan benar di Vercel. Pastikan Cloud Name, API Key, dan API Secret sesuai dengan yang ada di dashboard Cloudinary. Juga pastikan Anda login ke admin dashboard sebelum mengupload gambar."),

        heading("Data Tidak Tersimpan", HeadingLevel.HEADING_3),
        bodyText("Jika data yang Anda masukkan di admin dashboard tidak tersimpan, periksa koneksi database Turso. Pastikan TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN sudah dikonfigurasi dengan benar. Anda bisa mengecek koneksi database dari Turso CLI dengan perintah: turso db shell prakasa-db."),

        heading("Website Lambat", HeadingLevel.HEADING_3),
        bodyText("Vercel menggunakan CDN global sehingga website seharusnya cepat diakses dari mana saja. Jika terasa lambat, periksa ukuran gambar yang diupload. Cloudinary secara otomatis mengoptimalkan gambar, tapi gambar yang sangat besar (di atas 5MB) mungkin perlu dikompres terlebih dahulu sebelum upload. Juga pastikan jumlah gambar di satu halaman tidak terlalu banyak."),

        heading("Re-deploy Setelah Perubahan", HeadingLevel.HEADING_3),
        bodyText("Setiap kali Anda push perubahan kode ke GitHub, Vercel akan otomatis melakukan re-deploy. Jika perlu melakukan re-deploy manual tanpa mengubah kode, buka dashboard Vercel > tab 'Deployments' > klik '...' di deployment terbaru > pilih 'Redeploy'."),

        // === SECTION 11: Quick Summary ===
        heading("Ringkasan Cepat", HeadingLevel.HEADING_2),

        bodyText("Berikut ringkasan langkah-langkah deployment dari awal sampai website online:"),

        numberedPoint(1, "Daftar GitHub, buat repository, upload kode website"),
        numberedPoint(2, "Daftar Turso, buat database, salin URL dan Auth Token"),
        numberedPoint(3, "Daftar Cloudinary, salin Cloud Name, API Key, dan API Secret"),
        numberedPoint(4, "Daftar Vercel dengan GitHub, import repository"),
        numberedPoint(5, "Tambahkan 6 environment variables di Vercel"),
        numberedPoint(6, "Klik Deploy dan tunggu hingga selesai"),
        numberedPoint(7, "Buka URL website yang diberikan Vercel"),
        numberedPoint(8, "Login admin dashboard dan verifikasi semua fitur"),

        bodyText("Total waktu yang diperlukan: sekitar 30-60 menit untuk pertama kali. Setelah website online, Anda bisa mengelola konten melalui admin dashboard tanpa perlu coding lagi."),

        new Paragraph({ spacing: { before: 400 }, children: [] }),
        separator(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [new TextRun({ text: "Dokumen ini dibuat otomatis oleh Super Z AI Assistant", size: 18, color: c(P.secondary), italics: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Website Prakasa - Mei 2026", size: 18, color: c(P.secondary), italics: true })],
        }),
      ],
    },
  ],
});

// Generate
const OUTPUT = "/home/z/my-project/download/Panduan-Deployment-Website-Prakasa.docx";
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUTPUT, buf);
  console.log("Document generated:", OUTPUT);
});
