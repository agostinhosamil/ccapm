<?php

namespace App;

use App\Utils\Env;

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config/boot.php';

header('Access-Control-Allow-Origin: *');

// Specify which request methods are allowed
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, PATCH');

// Additional headers which may be sent along with the CORS request
header('Access-Control-Allow-Headers: X-Requested-With,Authorization,Content-Type,Accept');

// Set the age to 1 day to improve speed/caching.
header('Access-Control-Max-Age: 86400');

// exit(json_encode($_FILES));

Server::Run ();

// echo '<pre>';
// print_r ($_SERVER);


// $config = [
//   'rootDir' => dirname (__DIR__),

//   'myName' => 'Agostinho Sambo Lopes',

//   'testProp' => '${myName} - Sam is amazing',

//   'useTestProp' => '${testProp}, and I am like him! this server is on: ${backgroundJobs.production.database.host}',

//   'backgroundJobs' => [
//     'default' => [
//       'adapter' => 'fs'
//     ],
//     'development' => [],
//     'test' => [],
//     'production' => [
//       'adapter' => 'database',
//       'database' => [
//         'table' => [
//           'name' => 'jobs',
//           'columns' => [
//             'jobId' => 'id',
//             'jobHandler' => 'className',
//             'jobProps' => 'arguments'
//           ]
//         ],
//         'host' => 'localhost',
//         'port' => '3306',
//         'user' => 'sam',
//         'pass' => '1256@sam.ysanetword/3306',
//         'name' => 'jobs'
//       ]
//     ]
//   ],

//   'viewEngine' => [
//     'resolve' => 'default',
//     'options' => [
//       'rootDir' => '${paths.viewsPath}',
//       'layoutsDir' => '${.rootDir}/layouts',
//       'extensions' => [
//         'php'
//       ]
//     ]
//   ]
// ];

// $c = [
//   'viewEngine' => [
//     'options' => [
//       'extensions' => [
//         'json'
//       ]
//     ],
//     'data' => [
//       'fileList' => [
//         'main' => 'index.php'
//       ]
//     ]
//   ]
// ];

// echo '<pre>';
// print_r(array_full_merge($config, $c));
// echo '</pre>';


// exit ('KJ');
