<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionGroups = config("template-starter.additional_permissions");

        foreach ($permissionGroups as $group => $permissions) {
            foreach ($permissions as $permissionName => $roles) {
                $permission = Permission::updateOrCreate([
                    'name'  => $permissionName,
                    'group' => $group,
                ], []);
                
                if ($roles === ["*"]) {
                    $roles = Role::all()->pluck('name')->toArray();
                }

                $permission->syncRoles($roles);

                // foreach ($roles as $roleName) {
                //     $role = Role::where('name', $roleName)->first();
                //     if ($role) {
                //         $role->givePermissionTo($permission);
                //     }
                // }
            }
        }
    }
}
