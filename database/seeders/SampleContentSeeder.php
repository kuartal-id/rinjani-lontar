<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Lontar;
use App\Models\LontarPage;
use App\Models\Reader;
use Illuminate\Database\Seeder;

/**
 * One clearly-labelled sample manuscript so the archive is not empty on first
 * deploy: 3 SVG placeholder leaves (uploaded like real scans would be), one
 * sample reader, and the configured category list in the categories table.
 * Everything carries is_sample = true / "Contoh" labelling where applicable.
 */
class SampleContentSeeder extends Seeder
{
    public function run(): void
    {
        foreach (config('lontar.categories') as $name) {
            Category::firstOrCreate(['name' => $name]);
        }

        Reader::firstOrCreate(
            ['nama' => 'Contoh Pembaca'],
            ['keahlian' => 'Contoh/Sample — pembaca tradisional (data contoh)', 'asal' => 'Bayan', 'deskripsi' => 'Contoh/Sample: data pembaca akan diisi dari data asli.']
        );

        $lontar = Lontar::firstOrCreate(
            ['kode_naskah' => 'CONT-001'],
            [
                'judul' => 'Contoh Naskah Lontar',
                'judul_en' => 'Sample Lontar Manuscript',
                'slug' => 'contoh-naskah-lontar',
                'desa_asal' => 'Bayan',
                'perkiraan_tahun' => '±1900 (contoh)',
                'bahasa' => 'Sasak (aksara Sasak)',
                'kondisi' => 'Contoh/Sample',
                'kategori' => config('lontar.categories')[0],
                'ringkasan' => 'Contoh/Sample: ini adalah naskah contoh untuk menampilkan tampilan arsip. Isi asli akan menggantikan halaman-halaman ini.',
                'ringkasan_en' => 'Sample: this is a placeholder manuscript to demonstrate the archive. Real content will replace these leaves.',
                'is_sample' => true,
            ]
        );

        if ($lontar->pages()->count() === 0) {
            foreach ([1, 2, 3] as $n) {
                $svg = $this->placeholderSvg($n);
                $name = "sample_leaf_{$n}.svg";
                \Illuminate\Support\Facades\Storage::disk('local')->put("uploads/{$name}", $svg);

                $lontar->pages()->create([
                    'nomor_lembar' => $n,
                    'judul_halaman' => "Contoh Lembar {$n}",
                    'judul_halaman_en' => "Sample Leaf {$n}",
                    'kondisi' => 'Contoh/Sample',
                    'status_verifikasi' => 'Belum diverifikasi',
                    'penjelasan' => 'Contoh/Sample: transkripsi dan terjemahan akan muncul di sini.',
                    'penjelasan_en' => 'Sample: transcription and translation will appear here.',
                    'foto_halaman' => "uploads/{$name}",
                ]);
            }
        }
    }

    private function placeholderSvg(int $n): string
    {
        $lines = implode('', array_map(
            fn ($i) => '<rect x="140" y="'.(200 + $i * 60).'" rx="10" ry="28" width="520" height="22" fill="#8a6f4d" opacity="'.(0.75 - $i * 0.07).'"/>',
            range(0, 6)
        ));

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
  <rect width="800" height="1100" fill="#efe6d2"/>
  <rect x="30" y="30" width="740" height="1040" rx="26" fill="#e6d9bd" stroke="#b39b6d" stroke-width="4"/>
  <rect x="70" y="70" width="660" height="960" rx="14" fill="#f6efdd" stroke="#cbb27f" stroke-width="2"/>
  <line x1="100" y1="120" x2="700" y2="120" stroke="#7a5c36" stroke-width="10" stroke-linecap="round"/>
  {$lines}
  <text x="400" y="1020" text-anchor="middle" font-family="serif" font-size="40" fill="#7a5c36">Contoh / Sample — {$n}</text>
</svg>
SVG;
    }
}
