<?php

declare(strict_types=1);

use App\Database\Migration;

final class CreateHistory extends Migration
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
    $this->createTable('histories', function ($table) {
      $table->string('action')
        ->default('CREATED');
      $table->string('resource');
      $table->integer('user_id')
        ->nullable()
        ->length(10)
        ->unsigned();

      $table->foreign('user_id')
        ->references('id')
        ->on('users')
        ->onUpdate('CASCADE')
        ->onDelete('SET NULL');
    });
  }
}
