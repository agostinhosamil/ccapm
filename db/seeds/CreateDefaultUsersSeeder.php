<?php

use App\Utils\Env;
use App\Utils\Hash;
use App\Database\Seeder;

class CreateDefaultUsersSeeder extends Seeder
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
      [
        'name' => 'Agostinho Sambo Lopes',
        'key' => generate_unique_id (),
        'username' => 'agostinhosaml',
        'email' => Env::Get('DEFAULT_USER_EMAIL'),
        'phone' => Env::Get('DEFAULT_USER_PHONE'),
        'role_id' => 1,
        'password' => Hash::Make(Env::Get('DEFAULT_USER_PASSWORD'))
      ],
    ];

    $this->table ('users')
      ->insert ($data)
      ->saveData ();
  }
}
