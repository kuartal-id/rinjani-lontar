<?php
// Final quick test after server restart
sleep(2);

$url = 'http://localhost:8000/api/admin/lontars';
$boundary = '----FinalTest' . uniqid();
$data = "--$boundary\r\nContent-Disposition: form-data; name=\"judul\"\r\n\r\nFinal Test Naskah\r\n--$boundary\r\nContent-Disposition: form-data; name=\"kode_naskah\"\r\n\r\nFINAL-001\r\n--$boundary\r\nContent-Disposition: form-data; name=\"kondisi\"\r\n\r\nBaik\r\n--$boundary\r\nContent-Disposition: form-data; name=\"kategori\"\r\n\r\nSejarah\r\n--$boundary--\r\n";

$ctx = stream_context_create(['http' => [
    'header'  => ["Content-Type: multipart/form-data; boundary=$boundary", "Accept: application/json"],
    'method'  => 'POST',
    'content' => $data,
    'ignore_errors' => true,
    'timeout' => 10,
]]);

$result = @file_get_contents($url, false, $ctx);
preg_match('/HTTP\/[\d.]+ (\d+)/', $http_response_header[0] ?? '', $m);
$status = (int)($m[1] ?? 0);

if ($status === 201) {
    $decoded = json_decode($result, true);
    $id = $decoded['data']['id'];
    echo "✅ Server berjalan dengan konfigurasi baru! ID: $id\n";
    
    // Cleanup
    $ctx2 = stream_context_create(['http' => [
        'header' => "Accept: application/json\r\n",
        'method' => 'DELETE',
        'ignore_errors' => true,
    ]]);
    @file_get_contents("http://localhost:8000/api/admin/lontars/$id", false, $ctx2);
    echo "✅ Cleanup berhasil\n";
} else {
    echo "❌ Error: Status $status\n";
    echo "Response: " . substr($result, 0, 300) . "\n";
}
