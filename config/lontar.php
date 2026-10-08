<?php

return [
    'name' => env('APP_NAME', 'Lontar Digital Archive'),

    // The Rinjani-Lombok family of sites (header links, footer).
    'family' => [
        'midas' => env('RINJANI_MIDAS_URL', 'https://rinjanilombok.org'),
        'geopark' => env('RINJANI_GEOPARK_URL', 'https://geopark.rinjanilombok.org'),
        'biosphere' => env('RINJANI_BIOSPHERE_URL', 'https://biosphere.rinjanilombok.org'),
        'map' => env('RINJANI_MAP_URL', 'https://map.rinjanilombok.org'),
    ],

    // Manuscript categories offered in the admin editor and public filter.
    'categories' => ['Cerita Rakyat', 'Adat Istiadat', 'Agama', 'Sejarah', 'Pertanian', 'Astronomi'],

    // Page / cover image uploads (admin).
    'upload_extensions' => ['jpg', 'jpeg', 'png', 'webp'],
    'upload_max_kb' => (int) env('UPLOAD_MAX_KB', 8192),
];
