<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // required
        Validator::replacer('required', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' wajib diisi.';
        });

        // string
        Validator::replacer('string', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa teks.';
        });

        // max
        Validator::replacer('max', function ($message, $attribute, $rule, $parameters) {
            return $attribute . " maksimal {$parameters[0]} karakter.";
        });

        // min
        Validator::replacer('min', function ($message, $attribute, $rule, $parameters) {
            return $attribute . " minimal {$parameters[0]} karakter.";
        });

        // exists
        Validator::replacer('exists', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' tidak ditemukan.';
        });

        // unique
        Validator::replacer('unique', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' sudah terdaftar';
        });

        // boolean
        Validator::replacer('boolean', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus bernilai true atau false';
        });

        // image
        Validator::replacer('image', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa gambar';
        });

        // numeric
        Validator::replacer('numeric', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa angka';
        });

        // confirmed
        Validator::replacer('confirmed', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus sama dengan konfirmasi';
        });

        // email
        Validator::replacer('email', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa alamat email yang valid';
        });

        // date
        Validator::replacer('date', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa tanggal yang valid';
        });

        // url
        Validator::replacer('url', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa URL yang valid';
        });

        // in
        Validator::replacer('in', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus salah satu dari: ' . implode(', ', $parameters);
        });

        // not_in
        Validator::replacer('not_in', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' tidak boleh salah satu dari: ' . implode(', ', $parameters);
        });

        // array
        Validator::replacer('array', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa list';
        });

        // integer
        Validator::replacer('integer', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa bilangan bulat';
        });

        // digits
        Validator::replacer('digits', function ($message, $attribute, $rule, $parameters) {
            return $attribute . " harus {$parameters[0]} digit";
        });

        // digits_between
        Validator::replacer('digits_between', function ($message, $attribute, $rule, $parameters) {
            return $attribute . " harus antara {$parameters[0]} dan {$parameters[1]} digit";
        });

        // file
        Validator::replacer('file', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa file';
        });

        // mimes
        Validator::replacer('mimes', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus berupa file dengan tipe: ' . implode(', ', $parameters);
        });

        // after
        Validator::replacer('after', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus setelah ' . $parameters[0] . '.';
        });

        // before
        Validator::replacer('before', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus sebelum ' . $parameters[0] . '.';
        });

        // after_or_equal
        Validator::replacer('after_or_equal', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus setelah atau sama dengan ' . $parameters[0] . '.';
        });

        // before_or_equal
        Validator::replacer('before_or_equal', function ($message, $attribute, $rule, $parameters) {
            return $attribute . ' harus sebelum atau sama dengan ' . $parameters[0] . '.';
        });

        // size
        Validator::replacer('size', function ($message, $attribute, $rule, $parameters) {
            return $attribute . " harus berukuran {$parameters[0]}";
        });
    }
}
