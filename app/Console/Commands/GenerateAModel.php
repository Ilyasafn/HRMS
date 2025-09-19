<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

class GenerateAModel extends Command
{
    protected $signature = 'generate:amodel {name} {--s|softDelete} {--fields=} {--m|media}';
    protected $description = 'Generate model, factory, seeder, requests, and migration for a given name';

    public function handle()
    {
        $Name = Str::studly($this->argument('name')); // ex: User
        $name = Str::camel($Name);                   // ex: user
        $Names = Str::pluralStudly($Name);           // ex: Users
        $names = Str::camel($Names);                 // ex: users
        $tableName = Str::snake($Names);             // ex: users

        $softDelete = $this->option('softDelete');
        $withMedia = $this->option('media');
        $fieldsOption = $this->option('fields'); // ex: "title:string, body:text , is_active:boolean"
        $fields = [];

        if ($fieldsOption) {
            foreach (explode(',', $fieldsOption) as $field) {
                // trim setiap field dulu
                $field = trim($field);

                // pecah name:type, fallback ke 'string' kalau ga ada type
                [$fname, $ftype] = array_pad(explode(':', $field), 2, 'string');

                // trim lagi supaya bersih
                $fname = trim($fname);
                $ftype = trim($ftype);

                $fields[$fname] = $ftype;
            }
        }

        // Path Laravel bawaan
        $paths = [
            "app/Models/{$Name}.php" => "resources/stubs/php-stubs/model.stub",
            "database/factories/{$Name}Factory.php" => "resources/stubs/php-stubs/factory.stub",
            "database/seeders/{$Name}Seeder.php" => "resources/stubs/php-stubs/seeder.stub",
            "app/Http/Requests/Store{$Name}Request.php" => "resources/stubs/php-stubs/store-request.stub",
            "app/Http/Requests/Update{$Name}Request.php" => "resources/stubs/php-stubs/update-request.stub",
            "app/Http/Requests/BulkUpdate{$Name}Request.php" => "resources/stubs/php-stubs/bulk-update-request.stub",
            "app/Http/Requests/BulkDelete{$Name}Request.php" => "resources/stubs/php-stubs/bulk-delete-request.stub",
            "app/Http/Controllers/{$Name}Controller.php" => "resources/stubs/php-stubs/controller.stub",
        ];

        if ($withMedia) {
            $paths["app/Http/Requests/Upload{$Name}MediaRequest.php"] = "resources/stubs/php-stubs/upload-request.stub";
        }

        foreach ($paths as $file => $stub) {
            $this->makeFromStub($file, $stub, [
                '{{ name }}'  => $name,
                '{{ Name }}'  => $Name,
                '{{ names }}' => $names,
                '{{ Names }}' => $Names,
                '{{ table }}' => $tableName,
                // soft delete
                '{{ softDeleteImport }}' => $softDelete ? "use Illuminate\\Database\\Eloquent\\SoftDeletes;\n" : "",
                '{{ softDeleteTrait }}'  => $softDelete ? "use SoftDeletes;\n" : "",
                '{{ softDeleteMethods }}'  => $softDelete ? $this->generateSoftDeleteMethods($softDelete, $Name, $name, $names) : "",
                // has media
                '{{ hasMediaImport }}' => $this->generateHasMediaImports($withMedia),
                '{{ hasMediaTrait }}' => $withMedia ? "use InteractsWithMedia;\n" : "",
                '{{ hasMediaMethods }}' => $withMedia ? $this->generateHasMediaMethods($withMedia) : "",
                '{{ hasMediaImplement }}' => $withMedia ? "implements HasMedia" : "",
                '{{ hasMediaControllerMethods }}' => $withMedia ? $this->generateHasMediaControllerMethods($withMedia, $name, $Name) : "",
                '{{ hasMediaControllerMethodsImport }}' => $withMedia ? "use App\\Http\\Requests\\Upload{$Name}MediaRequest;\n" : "",
                // fillable, factory, request, migration
                '{{ fillable }}' => $this->generateFillable($fields),
                '{{ factory }}' => $this->generateFactory($fields),
                '{{ factoryImport }}' => $this->generateFactoryImport($fields),
                '{{ request }}' => $this->generateRequest($fields),
                '{{ migrationFields }}' => $this->generateMigrationFields($fields, $softDelete),
            ]);
        }

        // Migration
        $migrationName = date('Y_m_d_His') . "_create_{$tableName}_table.php";
        $migrationPath = database_path("migrations/{$migrationName}");
        $this->makeFromStub($migrationPath, "resources/stubs/php-stubs/migration.stub", [
            '{{ name }}'  => $name,
            '{{ Name }}'  => $Name,
            '{{ Names }}' => $Names,
            '{{ table }}' => $tableName,
            '{{ softDeleteColumn }}' => $softDelete ? "\$table->softDeletes();\n" : "",
            '{{ migrationFields }}' => $this->generateMigrationFields($fields, $softDelete),
        ]);

        $this->info("✅ {$Name} model + related files generated successfully!");
        if ($softDelete) {
            $this->info("🗑️  SoftDeletes enabled for {$name}");
        }

        // Add router to web.php
        $this->addRoute($softDelete, $withMedia, $name, $Name);
    }

    protected function makeFromStub($filePath, $stubPath, $replacements)
    {
        $dir = dirname($filePath);
        if (!File::exists($dir)) {
            File::makeDirectory($dir, 0755, true);
            $this->info("📂 Created directory: {$dir}");
        }

        if (!File::exists($filePath)) {
            $stubFullPath = base_path($stubPath);
            $content = File::exists($stubFullPath) ? File::get($stubFullPath) : "// Stub not found";
            $content = str_replace(array_keys($replacements), array_values($replacements), $content);

            File::put($filePath, $content);
            $this->info("📝 Created file: {$filePath}");
        } else {
            $this->warn("⚠️ File already exists: {$filePath}");
        }
    }

    protected function addRoute(bool $softDelete, bool $withMedia, $name, $Name)
    {
        $webPath = base_path('routes/web.php');

        $useLine   = "use App\\Http\\Controllers\\{$Name}Controller;\n";
        $routeLine  = "    Route::put('" . Str::camel($name) . "/bulk', [{$Name}Controller::class, 'bulkUpdate'])->name('" . Str::camel($name) . ".bulk.update');\n";
        $routeLine .= "    Route::delete('" . Str::camel($name) . "/bulk', [{$Name}Controller::class, 'bulkDelete'])->name('" . Str::camel($name) . ".bulk.destroy');\n";

        // Tambahin routes kalau pakai softDelete
        if ($softDelete) {
            $routeLine .= "    Route::get('" . Str::camel($name) . "/archived', [{$Name}Controller::class, 'archived'])->name('" . Str::camel($name) . ".archived');\n";
            $routeLine .= "    Route::put('" . Str::camel($name) . "/{" . Str::camel($name) . "}/restore', [{$Name}Controller::class, 'restore'])->name('" . Str::camel($name) . ".restore');\n";
            $routeLine .= "    Route::delete('" . Str::camel($name) . "/{" . Str::camel($name) . "}/force-delete', [{$Name}Controller::class, 'forceDelete'])->name('" . Str::camel($name) . ".force-delete');\n";
        }
        
        if($withMedia) {
            $routeLine .= "    Route::post('" . Str::camel($name) . "/{" . Str::camel($name) . "}/upload-media', [{$Name}Controller::class, 'uploadMedia'])->name('" . Str::camel($name) . ".upload-media');\n";
        }

        $routeLine .= "    Route::apiResource('" . Str::camel($name) . "', {$Name}Controller::class);\n";


        if (File::exists($webPath)) {
            $content = File::get($webPath);

            // ✅ Tambahin use kalau belum ada
            if (!Str::contains($content, "use App\\Http\\Controllers\\{$Name}Controller;")) {
                // cari posisi terakhir "use " terus sisipin di bawahnya
                if (preg_match_all('/^use\s.+;$/m', $content, $matches, PREG_OFFSET_CAPTURE)) {
                    $lastUse = end($matches[0]);
                    $pos = $lastUse[1] + strlen($lastUse[0]);
                    $content = substr($content, 0, $pos) . "\n{$useLine}" . substr($content, $pos);
                } else {
                    // fallback kalau gak ada use
                    $content = "<?php\n\n{$useLine}" . $content;
                }
                File::put($webPath, $content);
                $this->info("📌 Added import: {$useLine}");
            }

            // ✅ Tambahin route ke dalam middleware group
            if (Str::contains($content, "Route::middleware(['auth', 'verified'])->group(function () {")) {
                // sisipkan sebelum "});"
                $content = preg_replace(
                    "/(Route::middleware\(\['auth', 'verified'\]\)->group\(function\s*\(\)\s*{\n)([\s\S]*?)(^\s*}\);)/m",
                    "$1$2$routeLine$3",
                    $content,
                    1,
                    $count
                );

                if ($count > 0) {
                    File::put($webPath, $content);
                    $this->info("🌐 Added route to middleware group: {$routeLine}");
                } else {
                    $this->warn("⚠️ Could not insert route inside middleware group, fallback to bottom.");
                    if (!Str::contains($content, $routeLine)) {
                        File::append($webPath, $routeLine);
                    }
                }
            } else {
                // fallback kalau ga ada group
                if (!Str::contains($content, $routeLine)) {
                    File::append($webPath, $routeLine);
                    $this->info("🌐 Added route to bottom: {$routeLine}");
                }
            }
        }
    }

    protected function generateFillable(array $fields): string
    {
        if (empty($fields)) return '';
        $items = array_map(fn($f) => "'$f'", array_keys($fields));
        return implode(",\n        ", $items);
    }

    protected function generateFactory(array $fields): string
    {
        $fakerMap = [
            'string' => 'fake()->sentence()',
            'text' => 'fake()->paragraph()',
            'boolean' => 'fake()->boolean()',
            'integer' => 'fake()->randomNumber()',
            'datetime' => 'fake()->dateTime()'
        ];

        $out = [];
        if (count($fields) == 0) $fields = ['name' => 'string'];
        foreach ($fields as $f => $t) {
            $faker = $fakerMap[$t] ?? 'fake()->word()';
            if (in_array($t, ['fk', 'nfk'])) {
                $modelName = Str::studly(Str::singular(Str::replaceLast('_id', '', $f)));
                $out[] = "'$f' => $modelName::pluck('id')->random(),";
            }
            else{
                $out[] = "'$f' => $faker,";
            }
        }
        return implode("\n            ", $out);
    }

    protected function generateFactoryImport(array $fields): string
    {
        $out = [];
        foreach ($fields as $f => $t) {
            if (in_array($t, ['fk', 'nfk'])) {
                $modelName = Str::studly(Str::singular(Str::replaceLast('_id', '', $f)));
                $out[] = "use App\Models\\$modelName;";
            }
        }
        return implode("\n", $out);
    }

    protected function generateMigrationFields(array $fields, bool $softDelete): string
    {
        $out = [];

        foreach ($fields as $f => $t) {
            if ($t === 'fk') {
                $foreignTableName = Str::plural(Str::lower(Str::replace('_id', '', $f)));
                $out[] = "\$table->foreignId('$f')->constrained('$foreignTableName')->cascadeOnDelete();";
            } elseif ($t === 'nfk') {
                $foreignTableName = Str::plural(Str::lower(Str::replace('_id', '', $f)));
                $out[] = "\$table->foreignId('$f')->nullable()->constrained('$foreignTableName')->nullOnDelete();";
            } else {
                $out[] = "\$table->$t('$f');";
            }
        }

        if (empty($fields)) {
            $out[] = "\$table->string('name');";
        }

        if ($softDelete) {
            $out[] = "\$table->softDeletes();";
        }

        $out[] = "\$table->timestamps();";

        return implode("\n            ", $out);
    }

    protected function generateRequest(array $fields): string
    {
        $fieldMap = [
            'string' => "'required|string|max:255'",
            'text' => "'required|string'",
            'boolean' => "'required|boolean'",
            'integer' => "'required|numeric'",
            'datetime' => "'required|string'",
        ];

        $out = [];
        if (count($fields) == 0) $fields = ['name' => 'string'];
        foreach ($fields as $f => $t) {
            $field = $fieldMap[$t] ?? "'nullable'";
            $out[] = "'$f' => $field,";
        }
        return implode("\n            ", $out);
    }

    protected function generateSoftDeleteMethods(bool $softDelete, string $Name, string $name, string $names): string
    {
        if (!$softDelete) return '';

        return <<<PHP
        /**
             * View archived resource from storage.
             */
            public function archived()
            {
                \$this->pass("archived {$name}");

                return Inertia::render('{$name}/archived', [
                    '{$names}' => {$Name}::onlyTrashed()->get(),
                ]);
            }

            /**
             * Restore the specified resource from storage.
             */
            public function restore(\$id)
            {
                \$this->pass("restore {$name}");

                \$model = {$Name}::onlyTrashed()->findOrFail(\$id);
                \$model->restore();
            }

            /**
             * Force delete the specified resource from storage.
             */
            public function forceDelete(\$id)
            {
                \$this->pass("force delete {$name}");

                \$model = {$Name}::onlyTrashed()->findOrFail(\$id);
                \$model->forceDelete();
            }
        PHP;
    }

    protected function generateHasMediaImports(bool $withMedia)
    {
        if (!$withMedia) return '';

        return <<<'PHP'
        use Spatie\Image\Enums\Fit;
        use Spatie\MediaLibrary\HasMedia;
        use Spatie\MediaLibrary\InteractsWithMedia;
        use Spatie\MediaLibrary\MediaCollections\Models\Media;
        PHP;
    }

    protected function generateHasMediaControllerMethods(bool $withMedia, string $name, string $Name): string
    {
        if (!$withMedia) return '';

        return <<<PHP
        /**
             * Register media conversions.
             */
            public function uploadMedia(Upload{$Name}MediaRequest \$request, {$Name} \${$name})
            {
                \$this->pass("update {$name}");

                \$data = \$request->validated();
                \${$name}->addMedia(\$data['file'])->toMediaCollection();
            }
        PHP;
    }

    protected function generateHasMediaMethods(bool $withMedia): string
    {
        if (!$withMedia) return '';

        return <<<'PHP'
        /**
             * Register media conversions.
             */
            public function registerMediaConversions(?Media $media = null): void
            {
                $this->addMediaConversion('preview')
                    ->fit(Fit::Contain, 300, 300)
                    ->nonQueued();
            }
        PHP;
    }

}
