<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use Str;

class GeneratePermissionCommand extends Command
{
    protected $signature = 'generate:permission
        {feature? : Nama fitur tunggal (ex: user)}
        {--f|feature= : List fitur dipisah koma (ex: user,role,customers)}
        {--a|all : Auto generate dari semua model di app/Models}
        {--s|softDelete : Tambahin permission soft delete (archived, restore, force-delete)}
        {--c|crudOnly : Hanya generate CRUD (index, create, update, delete)}
        {--x|add= : Tambahin custom permission tambahan (ex: "toggle active,approve registration")}';

    protected $description = 'Generate default permissions for given features';

    public function handle()
    {
        $features = [];

        // 🔎 ambil semua model
        if ($this->option('all')) {
            $modelPath = app_path('Models');
            $files = scandir($modelPath);

            foreach ($files as $file) {
                if ($file === '.' || $file === '..') continue;
                $className = pathinfo($file, PATHINFO_FILENAME);
                $features[] = strtolower($className); // konsisten lowercase
            }
        } else {
            // 🔎 ambil dari argument tunggal / option -f
            $featuresInput = $this->argument('feature') ?? $this->option('feature');

            if (!$featuresInput) {
                $this->error(implode("\n", [
                    "❌ Harus isi feature. Contoh: ,
                    php artisan generate:permission user ,
                    php artisan generate:permission -f=user,role ,
                    php artisan generate:permission --all",
                ]));
                return;
            }

            $features = explode(',', $featuresInput);
            $features = array_map('trim', $features);
        }

        // daftar permission default
        $defaultPermissions = $this->option('crudOnly')
            ? ['index', 'create', 'update', 'delete']
            : ['index', 'menu', 'show', 'create', 'update', 'delete'];

        $softDeletePermissions = ['archived', 'restore', 'force delete'];

        // loop fitur
        foreach ($features as $feature) {
            if (!$feature) continue;

            $this->info("🔧 Generating permissions for: {$feature}");

            // default perms
            foreach ($defaultPermissions as $perm) {
                $permissionName = "{$perm} {$feature}";
                Permission::updateOrCreate([
                    'group' => $feature,
                    'name' => $permissionName
                ], []);
                $this->line("   ✅ {$permissionName}");
            }

            // softdelete perms
            if ($this->option('softDelete')) {
                $modelClass = "App\\Models\\" . Str::studly($feature);

                if ($this->modelUsesSoftDeletes($modelClass)) {
                    foreach ($softDeletePermissions as $perm) {
                        $permissionName = "{$perm} {$feature}";
                        Permission::updateOrCreate([
                            'group' => $feature,
                            'name' => $permissionName
                        ], []);
                        $this->line("   ✅ {$permissionName}");
                    }
                } else {
                    $this->warn("   ⚠️ {$feature} tidak pakai SoftDeletes, skip soft delete permissions.");
                }
            }
            
            // extra perms from --add
            if ($this->option('add')) {
                $extras = explode(',', $this->option('add'));
                $extras = array_map('trim', $extras);

                foreach ($extras as $perm) {
                    if (!$perm) continue;
                    $permissionName = "{$perm} {$feature}";
                    Permission::updateOrCreate([
                        'group' => $feature,
                        'name' => $permissionName
                    ], []);
                    $this->line("   ✅ {$permissionName}");
                }
            }
        }

        $this->info("🚀 Permission generation completed!");
        
        Artisan::call("db:seed PermissionSeeder");

        $this->info("🚀 Additional permission generation completed!");
    }

    protected function modelUsesSoftDeletes(string $modelClass): bool
    {
        if (!class_exists($modelClass)) {
            return false;
        }

        $traits = class_uses_recursive($modelClass);
        return in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, $traits);
    }
}
