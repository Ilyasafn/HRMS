<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use function Laravel\Prompts\multiselect;
use function Laravel\Prompts\select;
use function Laravel\Prompts\text;
use function Laravel\Prompts\textarea;

class GenerateRModel extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    // protected $signature = 'generate:rmodel {name} {--s|softDelete} {--fields=} {--m|media}';
    protected $signature = 'generate:rmodel {name?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Laravel model + React view secara berurutan (amodel + rview)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $feature = $this->argument('name')
            ?: text(
                label: 'Nama Model atau type yang mau lo buat',
                placeholder: 'E.g. Customer',
                required: true,
            );

        $opsi = multiselect(
            label: 'Option apa aja nih yang mau di pakai?',
            options: ['soft delete', 'media'],
            hint: 'Pilihlah pilihan yang mau di pakai, soft delete akan nambahin fitur soft delete di model dan controller, media akan nambahin fitur upload media'
        );

        $kolom = textarea(
            label: 'Kolom apa aja yang mau di buat?',
            placeholder: 'E.g. name:string',
            required: true,
            default: 'name:string',
            hint: 'gunakan format name:type. Pisahin pakai enter'
        );

        $name = Str::snake($feature); // article
        $Name = Str::studly($feature); // Article

        $softDelete = in_array('soft delete', $opsi);
        $fields = explode(PHP_EOL, $kolom);
        $media = in_array('media', $opsi);

        $this->info("🚀 Running generate:amodel {$Name} ...");
        $this->call('generate:amodel', [
            'name' => $Name,
            '--softDelete' => $softDelete,
            '--fields' => implode(',', $fields),
            '--media' => $media,
        ]);
        
        $this->info("🎨 Running generate:rview {$name} ...");
        $this->call('generate:rview', [
            'name' => $name,
            '--softDelete' => $softDelete,
            '--fields' => implode(',', $fields),
            '--media' => $media,
        ]);

        $this->info("✅ Done! {$Name} model + React view generated successfully!");
    }
}
