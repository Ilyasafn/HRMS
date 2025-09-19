<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class GenerateRView extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:rview {name} {--s|softDelete} {--fields=} {--m|media}';


    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate React view structure under resources/js/pages/{name}';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = strtolower($this->argument('name'));
        $Name = Str::studly($name);
        $Names = Str::plural($name);
        $basePath = config("template-starter.generated-react-files-path") . "/{$name}";

        $isSoftDelete = $this->option('softDelete') ?? false;
        $withMedia = $this->option('media') ?? false;

        // Struktur file default
        $files = [
            "index.tsx" => "resources/stubs/react-stubs/index.stub",
            "show.tsx" => "resources/stubs/react-stubs/show.stub",
            "components/{$name}-delete-dialog.tsx" => "resources/stubs/react-stubs/delete-dialog.stub",
            "components/{$name}-filter-sheet.tsx" => "resources/stubs/react-stubs/filter-sheet.stub",
            "components/{$name}-form-sheet.tsx" => "resources/stubs/react-stubs/form-sheet.stub",
            "components/{$name}-bulk-edit-sheet.tsx" => "resources/stubs/react-stubs/bulk-edit-sheet.stub",
            "components/{$name}-bulk-delete-dialog.tsx" => "resources/stubs/react-stubs/bulk-delete-dialog.stub",
            "components/{$name}-item-card.tsx" => "resources/stubs/react-stubs/item-card.stub",
            "../../types/{$name}.d.ts" => "resources/stubs/react-stubs/type.stub",
        ];

        // Tambahin archived kalau ada flag --softDelete
        if ($isSoftDelete) {
            $files["archived.tsx"] = "resources/stubs/react-stubs/archived.stub";
        }

        if ($withMedia) {
            $files["components/{$name}-upload-sheet.tsx"] = "resources/stubs/react-stubs/upload-sheet.stub";
        }

        foreach ($files as $file => $stub) {
            $filePath = $basePath . '/' . $file;
            $dir = dirname($filePath);

            if (!File::exists($dir)) {
                File::makeDirectory($dir, 0755, true);
                $this->info("Created directory: {$dir}");
            }

            if (!File::exists($filePath)) {
                $stubPath = base_path($stub);
                if (File::exists($stubPath)) {
                    $content = File::get($stubPath);

                    // Archived button inject
                    $archivedButton = $isSoftDelete
                        ? <<<EOT
                        <Button variant={'destructive'} size={'icon'} asChild>
                            <Link href={route('{$name}.archived')}>
                                <FolderArchive />
                            </Link>
                        </Button>
                        EOT
                        : '';

                    $uploadButton = $withMedia
                        ? <<<EOT
                        <{$Name}UploadMediaSheet {$name}={{$name}}>
                            <Button variant={'ghost'} size={'icon'}>
                                <Image />
                            </Button>
                        </{$Name}UploadMediaSheet>
                        EOT
                        : '';

                    $content = str_replace(
                        ['{{ name }}', '{{ Name }}', '{{ names }}', '{{ Names }}', '{{ archivedButton }}', '{{ uploadButton }}'],
                        [$name, $Name, $Names, Str::pluralStudly($Name), $archivedButton, $uploadButton],
                        $content
                    );
                } else {
                    $content = "// {$Name} - " . basename($filePath);
                }

                File::put($filePath, $content);
                $this->info("Created file: {$filePath}");
            } else {
                $this->warn("File already exists: {$filePath}");
            }
        }

        // Tambahin fields ke type.d.ts kalau ada --fields
        $fieldsOption = $this->option('fields');
        if (!$fieldsOption) {
            $fields = ['name:string'];
        } else {
            $fields = explode(',', $fieldsOption); // ex: ["title:string"," body:text"]
            $fields = array_map('trim', $fields); // <-- hapus spasi ekstra
        }

        $typeLines = [];
        $imports = [];

        foreach ($fields as $field) {
            [$fieldName, $fieldType] = array_pad(explode(':', $field), 2, 'string');
            $fieldType = strtolower($fieldType);

            $tsType = match ($fieldType) {
                'string', 'text' => 'string',
                'boolean' => 'boolean',
                'integer' => 'number',
                'datetime' => 'string',
                default => 'string',
            };

            if ($withMedia) {
                $typeLines[] = "  media: Media[];";
            }

            if (in_array($fieldType, ['fk', 'nfk'])) {
                $related = Str::studly(Str::replaceLast('_id', '', $fieldName)); // post_id -> Post
                $propName = Str::replaceLast('_id', '', $fieldName);

                if ($fieldType === 'fk') {
                    // foreign key kolom (selalu required)
                    $typeLines[] = "  {$fieldName}: {$related}['id'];";
                    // relasi
                    $typeLines[] = "  {$propName}: {$related};";
                } else {
                    // foreign key kolom (optional)
                    $typeLines[] = "  {$fieldName}?: {$related}['id'];";
                    // relasi optional
                    $typeLines[] = "  {$propName}?: {$related};";
                }

                $imports[] = $related;
            } else {
                $typeLines[] = "  {$fieldName}: {$tsType};";
            }
        }

        $imports = array_unique($imports);

        $importLines = '';
        if (!empty($imports)) {
            $importLines = collect($imports)
                ->map(fn($model) => 'import { ' . $model . ' } from "./' . Str::kebab($model) . '";')
                ->implode("\n");
        }
        if($withMedia){
            $importLines .= "\nimport { Media } from '.';\n";
        }

        $importLines .= "\n\n";

        $dtsPath = "resources/js/types/{$name}.d.ts";

        if (File::exists($dtsPath)) {
            $content = File::get($dtsPath);
            $content = str_replace(
                '{{ imports }}',
                $importLines,
                $content
            );
            $content = str_replace(
                '{{ fields }}',
                implode("\n", $typeLines),
                $content
            );
            File::put($dtsPath, $content);
            $this->info("Updated type definition: {$dtsPath}");
        } else {
            $this->warn("Type file not found: {$dtsPath}");
        }

    }


}
