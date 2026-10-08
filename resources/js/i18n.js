/**
 * Indonesian / English chrome toggle (same behaviour and storage key as the
 * family sites: localStorage["geo_lang"], elements with data-i18n are
 * re-labelled). Manuscript body content is bilingual via *_en DB columns;
 * this only translates the interface chrome.
 */
export const TRANSLATIONS = {
    id: {
        familyMap: 'Peta MIDAS',
        familyLontar: 'Arsip Lontar',
        heroEyebrow: 'Warisan tulisan Lombok',
        heroTitle: 'Lontar Digital Archive',
        heroLead: 'Naskah daun lontar masyarakat Lombok yang diarsipkan secara digital — teks, terjemahan, foto lembar, dan rekaman pembacaan dalam satu tempat.',
        searchBtn: 'Cari',
        allCategories: 'Semua',
        emptyArchive: 'Belum ada naskah yang cocok.',
        leaves: 'lembar',
        sampleFlag: 'Contoh',
        backToArchive: 'Kembali ke arsip',
        labelVillage: 'Desa asal',
        labelYear: 'Perkiraan tahun',
        labelLanguage: 'Bahasa',
        labelCondition: 'Kondisi',
        labelCategory: 'Kategori',
        labelLeaves: 'Jumlah lembar',
        aboutManuscript: 'Tentang naskah ini',
        leavesTitle: 'Lembar naskah',
        noLeaves: 'Lembar belum diunggah.',
        noScan: 'Pindaian belum tersedia',
        audioVerified: 'Rekaman terverifikasi',
        toggleTheme: 'Ganti tema terang/gelap',
        aboutEyebrow: 'Arsip Lontar',
        aboutTitle: 'Menjaga tulisan daun kelapa',
        aboutLead: 'Lontar adalah naskah tradisional yang ditulis di atas daun lontar (kelapa siwalan). Arsip ini mendigitalkan koleksi lontar masyarakat Lombok — setiap lembar difoto, diterjemahkan, dan dilengkapi rekaman pembacaan agar tetap hidup bagi generasi berikutnya.',
        readersTitle: 'Para pembaca',
        readersLead: 'Naskah lontar dibacakan oleh pembaca tradisional. Berikut para pembaca yang berkontribusi pada arsip ini.',
        noReaders: 'Belum ada pembaca terdaftar.',
        footerRecognised: 'Diakui sebagai',
        prevLeaf: 'Lembar sebelumnya',
        nextLeaf: 'Lembar berikutnya',
    },
    en: {
        familyMap: 'MIDAS Map',
        familyLontar: 'Lontar Archive',
        heroEyebrow: "Lombok's written heritage",
        heroTitle: 'Lontar Digital Archive',
        heroLead: 'Digitally archived lontar palm-leaf manuscripts from Lombok communities — text, translations, leaf photos, and reading recordings in one place.',
        searchBtn: 'Search',
        allCategories: 'All',
        emptyArchive: 'No manuscripts match yet.',
        leaves: 'leaves',
        sampleFlag: 'Sample',
        backToArchive: 'Back to archive',
        labelVillage: 'Village of origin',
        labelYear: 'Estimated year',
        labelLanguage: 'Language',
        labelCondition: 'Condition',
        labelCategory: 'Category',
        labelLeaves: 'Number of leaves',
        aboutManuscript: 'About this manuscript',
        leavesTitle: 'Manuscript leaves',
        noLeaves: 'No leaves uploaded yet.',
        noScan: 'Scan not available yet',
        audioVerified: 'Verified recording',
        toggleTheme: 'Toggle light/dark theme',
        aboutEyebrow: 'Lontar Archive',
        aboutTitle: 'Keeping palm-leaf writing alive',
        aboutLead: 'Lontar are traditional manuscripts written on palm leaves (siwalan). This archive digitizes Lombok collections — each leaf is photographed, translated, and paired with a reading recording so it stays alive for the next generation.',
        readersTitle: 'The readers',
        readersLead: 'Lontar manuscripts are traditionally read aloud. These are the readers contributing to this archive.',
        noReaders: 'No readers listed yet.',
        footerRecognised: 'Recognised as',
        prevLeaf: 'Previous leaf',
        nextLeaf: 'Next leaf',
    },
};

const KEY = 'geo_lang';

export function currentLang() {
    try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'id'; } catch { return 'id'; }
}

export function applyLang(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.id;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const val = dict[key];
        if (typeof val === 'string') el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const val = dict[el.getAttribute('data-i18n-title')];
        if (typeof val === 'string') { el.title = val; el.setAttribute('aria-label', val); }
    });
    document.querySelectorAll('[data-lang-set]').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-set') === lang));
    });
    document.dispatchEvent(new CustomEvent('geoLangChanged', { detail: { lang } }));
}

export function initI18n() {
    applyLang(currentLang());
    document.querySelectorAll('[data-lang-set]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang-set') === 'en' ? 'en' : 'id';
            try { localStorage.setItem(KEY, lang); } catch {}
            applyLang(lang);
        });
    });
}
