<?php
// config/absensi.php

return [
    'jam_kerja' => [
        'masuk' => '08:00:00',
        'keluar' => '17:00:00',
        ],

    'status_kehadiran' => [
        'hadir' => 'Hadir',
        'telat' => 'Telat',
        'sakit' => 'Sakit',
        'izin' => 'Izin',
        'cuti' => 'Cuti',
        'alpha' => 'Alpha',
    ],

    'batas_waktu' => [
        'toleransi_menit' => 15,
    ],
];