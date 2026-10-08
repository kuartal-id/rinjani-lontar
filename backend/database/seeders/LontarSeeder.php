<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use App\Models\Lontar;
use App\Models\LontarPage;

class LontarSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan data lama (nonaktifkan FK constraint sementara)
        Schema::disableForeignKeyConstraints();
        LontarPage::truncate();
        Lontar::truncate();
        Schema::enableForeignKeyConstraints();

        // Siapkan direktori demo
        if (!Storage::disk('public')->exists('demo')) {
            Storage::disk('public')->makeDirectory('demo');
        }

        $sourceFiles = [
            '1-2,1.jpg.jpeg', '2,1-3,1.jpg.jpeg', '3,2-4,1.jpg.jpeg',
            '4,2-5,1.jpg.jpeg', '5,2-6,1.jpg.jpeg', '6,2-7,1.jpg.jpeg',
            '7,2-8,1.jpg.jpeg', '8,2-9,1.jpg.jpeg'
        ];

        // Copy files dari root c:\PKL ke storage
        foreach($sourceFiles as $file) {
            $sourcePath = base_path('../' . $file);
            if (file_exists($sourcePath)) {
                Storage::disk('public')->put('demo/' . $file, file_get_contents($sourcePath));
            }
        }

        // ── Naskah 1: Asal-usul Desa Pemepek ──────────────────
        $n1 = Lontar::create([
            'kode_naskah'     => 'LMB-001',
            'judul'           => 'Asal-usul Desa Pemepek',
            'desa_asal'       => 'Desa Pemepek, Lombok Tengah',
            'perkiraan_tahun' => 'sekitar 1890',
            'bahasa'          => 'Sasak',
            'kondisi'         => 'Baik',
            'kategori'        => 'Manuskrip',
            'ringkasan'       => 'Naskah ini menceritakan sejarah awal terbentuknya Desa Pemepek beserta tokoh-tokoh yang berperan dalam pembangunannya. Ditulis menggunakan aksara Jejawan dengan bahasa Sasak halus.',
            'foto_sampul'     => '/storage/demo/1-2,1.jpg.jpeg',
        ]);

        LontarPage::create([
            'lontar_id'      => $n1->id,
            'nomor_lembar'   => 1,
            'judul_halaman'  => 'Sejarah Pendirian Desa',
            'foto_halaman'   => '/storage/demo/1-2,1.jpg.jpeg',
            'kondisi'        => 'Baik',
            'penjelasan'     => 'Halaman ini menceritakan sejarah awal terbentuknya Desa Pemepek. Dikisahkan bahwa desa ini didirikan oleh seorang tokoh bernama Raden Junaidi bersama pengikutnya yang datang dari arah barat Lombok. Proses pendirian desa memakan waktu bertahun-tahun dengan berbagai rintangan alam dan sosial.',
            'nama_pembaca'   => 'Lalu Mamiq Sasak',
            'audio_file'     => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'audio_verified' => true,
            'audio_tipe'     => 'rekaman',
        ]);

        LontarPage::create([
            'lontar_id'      => $n1->id,
            'nomor_lembar'   => 2,
            'judul_halaman'  => 'Awal Terbentuknya Komunitas',
            'foto_halaman'   => '/storage/demo/2,1-3,1.jpg.jpeg',
            'kondisi'        => 'Baik',
            'penjelasan'     => 'Halaman ini menggambarkan proses pembentukan komunitas pertama di desa tersebut. Disebutkan beberapa keluarga pendiri yang kemudian menjadi tokoh adat di Desa Pemepek.',
            'catatan'        => 'Terdapat beberapa kata yang sulit dibaca karena kondisi fisik lontar di bagian pojok kanan.',
            'nama_pembaca'   => 'Lalu Mamiq Sasak',
            'audio_verified' => false,
        ]);

        LontarPage::create([
            'lontar_id'      => $n1->id,
            'nomor_lembar'   => 3,
            'judul_halaman'  => 'Tokoh-tokoh Masyarakat',
            'foto_halaman'   => '/storage/demo/3,2-4,1.jpg.jpeg',
            'kondisi'        => 'Perlu Perawatan',
            'penjelasan'     => 'Daftar nama tokoh-tokoh masyarakat yang berperan dalam sejarah pembangunan desa, beserta silsilah keturunannya.',
            'audio_verified' => false,
        ]);

        // ── Naskah 2: Hikayat Rinjani Berapi ──────────────────
        $n2 = Lontar::create([
            'kode_naskah'     => 'LMB-002',
            'judul'           => 'Hikayat Rinjani Berapi',
            'desa_asal'       => 'Desa Sembalun, Lombok Timur',
            'perkiraan_tahun' => 'sekitar 1850',
            'bahasa'          => 'Sasak Kuno',
            'kondisi'         => 'Baik',
            'kategori'        => 'Tradisi Lisan',
            'ringkasan'       => 'Naskah berisi kisah mitologi tentang asal-mula Gunung Rinjani dan makna sakralnya bagi masyarakat Sasak. Menggunakan bahasa Sasak kuno yang kaya akan metafora alam.',
            'foto_sampul'     => '/storage/demo/4,2-5,1.jpg.jpeg',
        ]);

        LontarPage::create([
            'lontar_id'      => $n2->id,
            'nomor_lembar'   => 1,
            'judul_halaman'  => 'Kelahiran Sang Rinjani',
            'foto_halaman'   => '/storage/demo/4,2-5,1.jpg.jpeg',
            'kondisi'        => 'Baik',
            'penjelasan'     => 'Kisah mitologis tentang terciptanya Gunung Rinjani sebagai tempat tinggal para dewa dalam kepercayaan masyarakat Sasak kuno. Dikisahkan bahwa Rinjani lahir dari api suci yang turun dari langit.',
            'nama_pembaca'   => 'Amaq Gede Wirya',
            'audio_file'     => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            'audio_verified' => true,
            'audio_tipe'     => 'rekaman',
        ]);

        LontarPage::create([
            'lontar_id'      => $n2->id,
            'nomor_lembar'   => 2,
            'judul_halaman'  => 'Hubungan Manusia dan Alam',
            'foto_halaman'   => '/storage/demo/5,2-6,1.jpg.jpeg',
            'kondisi'        => 'Baik',
            'penjelasan'     => 'Hubungan harmonis antara manusia Sasak dengan alam semesta, khususnya Gunung Rinjani. Filosofi ini membentuk dasar dari tradisi upacara adat yang masih dilaksanakan hingga kini.',
            'nama_pembaca'   => 'Amaq Gede Wirya',
            'audio_verified' => false,
        ]);

        LontarPage::create([
            'lontar_id'      => $n2->id,
            'nomor_lembar'   => 3,
            'judul_halaman'  => 'Persembahan Suci',
            'foto_halaman'   => '/storage/demo/6,2-7,1.jpg.jpeg',
            'kondisi'        => 'Baik',
            'penjelasan'     => 'Tata cara memberikan persembahan kepada para roh penjaga gunung untuk menjaga keseimbangan alam semesta.',
            'audio_verified' => false,
        ]);

        // ── Naskah 3: Tata Cara Upacara Adat Gawe ──────────────
        $n3 = Lontar::create([
            'kode_naskah'     => 'LMB-003',
            'judul'           => 'Tata Cara Upacara Adat Gawe',
            'desa_asal'       => 'Desa Bayan, Lombok Utara',
            'perkiraan_tahun' => 'sekitar 1920',
            'bahasa'          => 'Sasak',
            'kondisi'         => 'Perlu Perawatan',
            'kategori'        => 'Adat Istiadat',
            'ringkasan'       => 'Naskah yang mendokumentasikan tata cara pelaksanaan upacara adat Gawe, termasuk prosesi, sesajen, mantra-mantra, dan aturan yang harus ditaati.',
            'foto_sampul'     => '/storage/demo/7,2-8,1.jpg.jpeg',
        ]);

        LontarPage::create([
            'lontar_id'      => $n3->id,
            'nomor_lembar'   => 1,
            'judul_halaman'  => 'Persiapan Upacara',
            'foto_halaman'   => '/storage/demo/7,2-8,1.jpg.jpeg',
            'kondisi'        => 'Perlu Perawatan',
            'penjelasan'     => 'Segala persiapan yang harus dilakukan sebelum upacara Gawe dimulai, termasuk pemilihan waktu berdasarkan kalender Sasak, persiapan sesajen, dan pembagian tugas.',
            'catatan'        => 'Beberapa bagian tulisan sudah memudar, perlu dokumentasi lebih lanjut.',
            'audio_verified' => false,
        ]);

        LontarPage::create([
            'lontar_id'      => $n3->id,
            'nomor_lembar'   => 2,
            'judul_halaman'  => 'Prosesi Inti Upacara',
            'foto_halaman'   => '/storage/demo/8,2-9,1.jpg.jpeg',
            'kondisi'        => 'Perlu Perawatan',
            'penjelasan'     => 'Dokumentasi lengkap mengenai prosesi inti upacara Gawe mulai dari pembukaan hingga penutupan. Termasuk mantra-mantra yang dilantunkan dan gerakan ritual yang bermakna.',
            'nama_pembaca'   => 'Inaq Tirta Wangsa',
            'audio_file'     => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            'audio_verified' => false,
            'audio_tipe'     => 'rekaman',
        ]);
    }
}
