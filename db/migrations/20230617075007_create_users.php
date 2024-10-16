<?php
declare(strict_types=1);

use App\Database\Migration;

final class CreateUsers extends Migration
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
    $this->createTable('users', function ($table) {
      $table->string ('key')
        ->unique ();
      $table->string('name');
      $table->string('email')
        ->unique();
      $table->string('phone')
        ->nullable()
        ->unique();
      $table->string('username')
        ->unique();
      $table->string('photo')
        ->default('user-avatar-placeholder.jpg')
        ->nullable();
      $table->string('password');
      // $table->string('secret');
      $table->integer('role_id')
        ->nullable()
        ->length(10)
        ->unsigned();

      $table->foreign('role_id')
        ->references('id')
        ->on('roles')
        ->onUpdate('CASCADE')
        ->onDelete('SET NULL');
    });
  }
}
