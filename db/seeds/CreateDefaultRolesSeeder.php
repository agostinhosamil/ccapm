<?php

use App\Database\Seeder;

class CreateDefaultRolesSeeder extends Seeder
{
  /**
   * Run Method.
   *
   * Write your database seeder using this method.
   *
   * More information on writing seeders is available here:
   * https://book.cakephp.org/phinx/0/en/seeding.html
   */
  public function run (): void
  {
    $data = [
      [
        'description' => 'super-admin', 
        'name' => 'super-admin', 
        'key' => 'super-user:admin'
      ],
      [
        'description' => 'admin', 
        'name' => 'admin', 
        'key' => 'user:admin'
      ],
      [
        'description' => 'editor', 
        'name' => 'editor', 
        'key' => 'user:editor'
      ],
      [
        'description' => 'seller', 
        'name' => 'seller', 
        'key' => 'user:seller'
      ],
      [
        'description' => 'doctor', 
        'name' => 'doctor', 
        'key' => 'user:doctor'
      ],
      [
        'description' => 'manager', 
        'name' => 'manager', 
        'key' => 'user:manager'
      ],
      [
        'description' => 'employee', 
        'name' => 'employee', 
        'key' => 'user:employee'
      ],
      [
        'description' => 'guest', 
        'name' => 'guest', 
        'key' => 'user:guest'
      ],
    ];

    $this->table ('roles')
      ->insert ($data)
      ->saveData ();
  }
}
