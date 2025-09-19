<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkDeleteUserRequest;
use App\Http\Requests\BulkUpdateUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass('index user');

        $data = User::query()
            ->with(['media', 'roles'])
            ->when($request->name, function($q, $v) {
                $q->where('name', $v);
            });

        return Inertia::render('user/index', [
            'users' => $data->get(),
            'query' => $request->input(),
            'roles' => Role::whereNot('name', "superadmin")->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $this->pass('create user');

        $data = $request->validated();
        User::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->pass('show user');

        return Inertia::render('user/show', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->pass('update user');

        $data = $request->validated();
        $user->update($data);

        $user->syncRoles($data['roles']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->pass('delete user');

        $user->delete();
    }

    public function bulkUpdate(BulkUpdateUserRequest $request)
    {
        $this->pass('update user');

        $data = $request->validated();
        User::whereIn('id', $data['user_ids'])->update($data);
    }
    
    public function bulkDelete(BulkDeleteUserRequest $request)
    {
        $this->pass('delete user');

        $data = $request->validated();
        User::whereIn('id', $data['user_ids'])->delete();
    }

    public function archived()
    {
        $this->pass('archived user');

        return Inertia::render('user/archived', [
            'users' => User::onlyTrashed()->get(),
        ]);
    }

    public function restore($user)
    {
        $this->pass('restore user');

        $user = User::onlyTrashed()->find($user);
        $user->restore();
    }

    public function forceDelete($user)
    {
        $this->pass('force delete user');

        $user = User::onlyTrashed()->find($user);
        $user->forceDelete();
    }
}
