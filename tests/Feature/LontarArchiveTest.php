<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\Lontar;
use Database\Seeders\SampleContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LontarArchiveTest extends TestCase
{
    use RefreshDatabase;

    private function makeAdmin(): AdminUser
    {
        return AdminUser::create([
            'username' => 'admin',
            'email' => 'admin@rinjanilombok.org',
            'password_hash' => Hash::make('secret123'),
            'nama_lengkap' => 'Admin',
            'is_active' => true,
        ]);
    }

    public function test_home_about_and_api_are_public(): void
    {
        $this->seed(SampleContentSeeder::class);

        $this->get('/')->assertOk();
        $this->get('/about')->assertOk();

        $this->get('/api/lontars')->assertOk()->assertJsonCount(1)
            ->assertJsonPath('0.kode_naskah', 'CONT-001');
        $this->get('/api/health')->assertOk();
    }

    public function test_detail_page_and_404(): void
    {
        $this->seed(SampleContentSeeder::class);

        $this->get('/naskah/contoh-naskah-lontar')->assertOk()
            ->assertSee('Contoh Naskah Lontar')
            ->assertSee('Contoh/Sample');

        $this->get('/naskah/tidak-ada')->assertNotFound();
    }

    public function test_search_and_category_filter(): void
    {
        $this->seed(SampleContentSeeder::class);
        Lontar::create(['judul' => 'Babad Lombok', 'slug' => 'babad-lombok', 'desa_asal' => 'Sembalun']);

        $this->get('/?q=babad')->assertOk()->assertSee('Babad Lombok')->assertDontSee('Contoh Naskah');
        $this->get('/?kategori='.urlencode(config('lontar.categories')[0]))->assertOk()->assertSee('Contoh Naskah Lontar');
    }

    public function test_upload_route_blocks_traversal_and_missing(): void
    {
        $this->get('/media/nonexistent.jpg')->assertNotFound();
        $this->get('/media/..%2F.env')->assertNotFound();
        $this->get('/media/.htaccess')->assertNotFound();
    }

    public function test_admin_requires_auth(): void
    {
        foreach (['/admin/dashboard', '/admin/lontars', '/admin/readers', '/admin/categories'] as $path) {
            $this->get($path)->assertRedirect(route('login'));
        }
    }

    public function test_login_flow(): void
    {
        $this->makeAdmin();

        $this->get('/auth/login')->assertOk();

        $this->post('/auth/login', ['username' => 'admin', 'password' => 'wrong'])
            ->assertSessionHas('danger');

        $this->post('/auth/login', ['username' => 'admin', 'password' => 'secret123'])
            ->assertRedirect(route('admin.dashboard'));

        $this->get('/admin/dashboard')->assertOk();
        $this->get('/auth/logout')->assertRedirect(route('login'));
    }

    public function test_admin_can_create_and_manage_lontar(): void
    {
        $this->makeAdmin();
        $this->post('/auth/login', ['username' => 'admin', 'password' => 'secret123']);

        $this->post('/admin/lontars/create', [
            'judul' => 'Usada Bali',
            'desa_asal' => 'Bayan',
            'kategori' => config('lontar.categories')[0],
        ])->assertRedirect(route('admin.lontars.index'));

        $lontar = Lontar::where('judul', 'Usada Bali')->firstOrFail();
        $this->assertSame('usada-bali', $lontar->slug);

        // Slug must be unique on second create.
        $this->post('/admin/lontars/create', ['judul' => 'Usada Bali'])->assertRedirect(route('admin.lontars.index'));
        $this->assertSame(2, Lontar::where('judul', 'Usada Bali')->count());
        $this->assertNotSame(
            Lontar::where('judul', 'Usada Bali')->pluck('slug')->first(),
            Lontar::where('judul', 'Usada Bali')->pluck('slug')->last(),
        );

        // Add a leaf.
        $this->post("/admin/lontars/{$lontar->id}/pages/create", ['nomor_lembar' => 1, 'judul_halaman' => 'Lembar 1'])
            ->assertRedirect(route('admin.pages.index', $lontar));
        $this->assertSame(1, $lontar->pages()->count());

        // Delete the manuscript cascades the leaf.
        $this->post("/admin/lontars/{$lontar->id}/delete")->assertRedirect(route('admin.lontars.index'));
        $this->assertNull(Lontar::find($lontar->id));
    }

    public function test_legacy_password_hash_gets_a_clear_message(): void
    {
        AdminUser::create([
            'username' => 'old',
            'email' => 'old@x.id',
            'password_hash' => 'scrypt:32768:8:1$abc$def',
            'is_active' => true,
        ]);

        $this->post('/auth/login', ['username' => 'old', 'password' => 'whatever'])
            ->assertSessionHas('danger');
    }
}
