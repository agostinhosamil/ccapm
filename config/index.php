<?php

/**
 * App configuration data should be set here
 */
return [
  'rootDir' => dirname (__DIR__),

  'appName' => 'AnlugeCdnApp',

  'viewEngine' => [
    'resolve' => 'default',
    'options' => [
      'rootDir' => '${paths.viewsPath}',
      'layoutsDir' => '${.rootDir}/layouts',
      'extensions' => [
        'php'
      ]
    ]
  ],

  'authentication' => [
    'models' => [
      // 'roles' => [
      //   'name' => 'App\Models\Role',
      //   'props' => [
      //     'name' => 'name',
      //     'description' => 'description',
      //     'key' => 'key'
      //   ]
      // ],
  
      // 'permissions' => [
      //   'name' => 'App\Models\Permission',
      //   'props' => [
      //     'name' => 'name',
      //     'description' => 'description',
      //     'key' => 'key'
      //   ]
      // ],
  
      'user' => [
        // 'name' => 'App\Models\User',
        'props' => [
          // 'name' => 'id',
          // 'role_id' => 'role_id',
          'username' => [
            'email',
            'phone',
            'key'
          ]
        ]
      ]
    ],

    /**
     * @var boolean
     * 
     * allow guest user authentication
     * 
     */
    'users' => [
      'allowGuest' => false
    ],

    'token' => [
      'sources' => [
        # 'session',
        # 'cookie',
        'bearer'
      ]
    ]
  ],
  'languages' => [
    'defaultLang' => 'pt-PT'
  ]
];
