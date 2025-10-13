<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Jalankan command alpha:generate setiap hari jam cutoff (default 17:59)
        $schedule->command('absensi:generate-alpha')
            // ->dailyAt(env('ABSENSI_CUTOFF_TIME', '17:59'))
            ->everyFiveSeconds()
            ->timezone('Asia/Makassar')
            ->appendOutputTo(storage_path('logs/scheduler.log')); // biar ada log nya di storage/logs/scheduler.log

        // Contoh tambahan schedule lain (nanti kalo butuh)
        // $schedule->command('backup:run')->dailyAt('23:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        // Load semua command custom di app/Console/Commands
        $this->load(__DIR__ . '/Commands');

        // Bisa juga daftar manual kalau perlu
        require base_path('routes/console.php');
    }
}
