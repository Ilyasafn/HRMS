<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass('index role');

        $data = Role::query()->when($request->name, fn($q, $v) => $q->where('name', 'like', "%$v%"));

        return Inertia::render('role/index', [
            'roles' => $data->get()->each(function ($role) {
                $role->permissions;
            }),
            'query' => $request->input(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $this->pass('create role');

        $data = $request->validated();
        Role::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $this->pass('show role');

        // dd($role->load('permissions')->toArray());

        return Inertia::render('role/show', [
            'role' => $role->load('permissions'),
            'permits' => Permission::get(),
            'permissions' => [
                'canEdit' => $this->user->can('edit role'),
                'canAddPermission' => $this->user->can('create permission'),
                'canResyncPermission' => $this->user->can('resync permission'),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->pass('update role');

        $data = $request->validated();
        $role->update($data);

        if ($request->has('permissions')) {
            $role->syncPermissions($data['permissions']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $this->pass('delete role');

        $role->delete();
    }
}
