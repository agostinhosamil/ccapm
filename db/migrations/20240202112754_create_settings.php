<?php
declare(strict_types=1);

use App\Database\Migration;

final class CreateSettings extends Migration
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
    $this->createTable ('settings', function ($table) {
      $table->string ('property');
      $table->string ('value');
      $table->enum ('type', [
        'string',
        'number',
        'boolean',
        'object',
        'array'
      ])
        ->default ('string');

      $table->string ('context_type')
        ->default ('user');
      $table->integer ('context_id')
        ->unsigned ()
        ->length (10);
    });
  }
}
