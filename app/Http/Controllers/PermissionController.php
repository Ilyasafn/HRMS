<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass('index permission');

        $data = Permission::query()
            //->with(['media']).
            ->when($request->name, function($q, $v) 
                { $q->where('name', 'like', "%$v%");
            });

        return Inertia::render('permission/index', [
            'permits' => $data->orderBy('group')->get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create permission"),
                'canEdit' => $this->user->can("update permission"),
                'canResync' => $this->user->can("resync permission"),
                'canDelete' => $this->user->can("delete permission"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermissionRequest $request)
    {
        $this->pass('create permission');

        $data = $request->validated();
        Permission::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        $this->pass('show permission');

        return $permission;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $this->pass('update permission');

        $data = $request->validated();
        $permission->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        $this->pass('delete permission');

        $permission->delete();
    }

    public function resync()
    {
        Artisan::call('generate:permission --all --softDelete');
    }
}
