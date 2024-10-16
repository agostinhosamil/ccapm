<?php

use App\Database\Seeder;

class CreateDefaultPermissionsSeeder extends Seeder
{
  /**
   * Seeder dependencies
   */
  public function getDependencies (): array {
    return [
      'CreateDefaultRolesSeeder'
    ];
  }

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
      # System
      [
        'description' => 'Edit the entire system', 
        'name' => 'Edit system', 
        'key' => 'edit:system'
      ]
    ];

    $this->table ('permissions')
      ->insert ($data)
      ->saveData ();
  }
}
