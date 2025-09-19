<?php

return [

	/*
    |--------------------------------------------------------------------------
    | Default role lists
    |--------------------------------------------------------------------------
    |
    | This option defines the default roles that are assigned to new users.
    | The value provided here should match one of the roles present in the
    | list of "default-roles" configured below.
    |
    */
	
	'default-roles' => [
		'superadmin',
		'admin',
		'user',
	],

	/*
    |--------------------------------------------------------------------------
    | Default role for new users
    |--------------------------------------------------------------------------
    |
    | This option defines the default role that is assigned to new users.
    | The value provided here should match one of the roles present in the
    | list of "default-roles" configured below.
    |
    */

	'default-role' => 'user',

	/*
    |--------------------------------------------------------------------------
    | Is Landing Page Enabled
    |--------------------------------------------------------------------------
    |
    | This option defines whether the landing page feature is enabled or not.
    | If set to true, users will see the landing page when they visit the site.
    | If set to false, users will be redirected to the dashboard.
    |
    */

	'with-landingpage' => env('WITH_LANDINGPAGE', true),

    /*
    |--------------------------------------------------------------------------
    | Is Landing Page Enabled
    |--------------------------------------------------------------------------
    |
    | This option defines whether the landing page feature is enabled or not.
    | If set to true, users will see the landing page when they visit the site.
    | If set to false, users will be redirected to the dashboard.
    |
    */

    'generated-react-files-path' => env('GENERATED_REACT_FILES_PATH', resource_path('js/pages')),

    'additional_permissions' => [
        "settings" => [
            "menu adminer" => ['superadmin'],
        ],
        "role_permission" => [
            "menu role" => ['superadmin'],
            "index role" => ['superadmin'],
            "show role" => ['superadmin'],
            "create role" => ['superadmin'],
            "update role" => ['superadmin'],
            "delete role" => ['superadmin'],
            "index permission" => ['superadmin'],
            "create permission" => ['superadmin'],
            "update permission" => ['superadmin'],
            "delete permission" => ['superadmin'],
            "resync permission" => ['superadmin'],
        ],
        "dashboard" => [
            "profile" => ["*"],
            "documentation" => ["*"]
        ]
    ]

];