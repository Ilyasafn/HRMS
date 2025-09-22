<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDivisiRequest;
use App\Http\Requests\UpdateDivisiRequest;
use App\Http\Requests\BulkUpdateDivisiRequest;
use App\Http\Requests\BulkDeleteDivisiRequest;
use App\Models\Divisi;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;


class DivisiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index divisi");
        
        $data = Divisi::query()
            ->withCount('users')
            //->with(['media'])
            ->when($request->name, function($q, $v){
                $q->where('name', $v);
            
            });

        return Inertia::render('divisi/index', [
            'divisis' => $data->get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create divisi"),
                'canShow' => $this->user->can("show divisi"),
                'canUpdate' => $this->user->can("update divisi"),
                'canDelete' => $this->user->can("delete divisi"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDivisiRequest $request)
    {
        $this->pass("create divisi");

        $data = $request->validated();
        Divisi::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Divisi $divisi)
    {
        $this->pass("show divisi");

        return Inertia::render('divisi/show', [
            'divisi' => $divisi,
            'users' => $divisi->users,
            'permissions' => [
                'canUpdate' => $this->user->can("update divisi"),
                'canDelete' => $this->user->can("delete divisi"),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDivisiRequest $request, Divisi $divisi)
    {
        $this->pass("update divisi");

        $data = $request->validated();
        $divisi->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Divisi $divisi)
    {
        $this->pass("delete divisi");

        $divisi->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateDivisiRequest $request)
    {
        $this->pass("update divisi");

        $data = $request->validated();
        Divisi::whereIn('id', $data['divisi_ids'])->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteDivisiRequest $request)
    {
        $this->pass("delete divisi");

        $data = $request->validated();
        Divisi::whereIn('id', $data['divisi_ids'])->delete();
    }

    /**
     * View archived resource from storage.
     */
    public function archived()
    {
        $this->pass("archived divisi");

        return Inertia::render('divisi/archived', [
            'divisis' => Divisi::onlyTrashed()->get(),
        ]);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $this->pass("restore divisi");

        $model = Divisi::onlyTrashed()->findOrFail($id);
        $model->restore();
    }

    /**
     * Force delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $this->pass("force delete divisi");

        $model = Divisi::onlyTrashed()->findOrFail($id);
        $model->forceDelete();
    }
    
    
}
