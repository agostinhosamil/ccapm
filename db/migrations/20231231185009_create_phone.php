<?php
declare(strict_types=1);

use App\Database\Migration;

final class CreatePhone extends Migration
{
  /**
   * Change Method.
   *
   * Write your reversible migrations using this method.
   *
   * More information on writing migrations is available here:
   * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
   *
   * Remember to call "create()" or "update()" and NOT "save()" when working
   * with the Table class.
   */
  public function change(): void
  {
    $this->createTable('phones', function ($table) {
      $table->string('value')
        ->unique();
      $table->string('owner_type');
      $table->integer('owner_id')
        ->length(10)
        ->unsigned();
    });
  }
}
