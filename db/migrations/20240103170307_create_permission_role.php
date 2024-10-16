<?php
declare(strict_types=1);

use App\Database\Migration;

final class CreatePermissionRole extends Migration
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
    $this->createTable('permission_role', function ($table) {
      $table->integer('role_id')
        ->unsigned()
        ->length(10);
      $table->foreign('role_id')
        ->references('id')
        ->on('roles')
        ->onDelete('CASCADE')
        ->onUpdate('CASCADE');
      $table->integer('permission_id')
        ->unsigned()
        ->length(10);
      $table->foreign('permission_id')
        ->references('id')
        ->on('permissions')
        ->onDelete('CASCADE')
        ->onUpdate('CASCADE');
    });
  }
}
