<?php

$rootDir = absolute_path (__DIR__, '..');

return [
  'rootDir'                => $rootDir,
  'dbPath'                 => absolute_path ($rootDir, 'db'),
  'docsPath'               => absolute_path ($rootDir, 'docs'),
  'utilsPath'              => absolute_path ($rootDir, 'utils'),
  'viewsPath'              => absolute_path ($rootDir, 'views'),
  'configPath'             => absolute_path ($rootDir, 'config'),
  'publicPath'             => absolute_path ($rootDir, 'public'),
  'assetsPath'             => absolute_path ($rootDir, 'assets'),
  'uploadsPath'            => absolute_path ($rootDir, 'uploads'),
  'layoutsPath'            => absolute_path ($rootDir, 'layouts'),
  'seedsPath'              => absolute_path ($rootDir, 'db', 'seeds'),
  'cachesPath'             => absolute_path ($rootDir, 'db', 'caches'),
  'tmpUploadsPath'         => absolute_path ($rootDir, 'uploads', 'tmp'),
  'migrationsPath'         => absolute_path ($rootDir, 'db', 'migrations'),
  'textUploadsPath'        => absolute_path ($rootDir, 'assets', 'texts', 'uploads'),
  'imageUploadsPath'       => absolute_path ($rootDir, 'assets', 'images', 'uploads'),
  'audioUploadsPath'       => absolute_path ($rootDir, 'assets', 'audios', 'uploads'),
  'videoUploadsPath'       => absolute_path ($rootDir, 'assets', 'videos', 'uploads'),
  'documentUploadsPath'    => absolute_path ($rootDir, 'assets', 'documents', 'uploads'),
  'applicationUploadsPath' => absolute_path ($rootDir, 'assets', 'applications', 'uploads'),

  // 'main' => [
  //   'test1' => 'test/1',

  //   'data' => [
  //     'b',
  //     'c'
  //   ]
  // ]
];
