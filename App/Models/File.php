<?php

namespace App\Models;

class File extends AppModel {
  /**
   * @var array
   * 
   * fillable file properties
   * 
   */
  protected $fillable = [
    'key',
    'name',
    'type',
    'alias',
    // 'set_id',
    // 'parent_id',
    // 'parent_type',
  ];

  /**
   * Indicates if the model should be timestamped.
   *
   * @var bool
   */
  public $timestamps = false;

  public function parent () {
    return $this->morphTo ();
  }

  public function set () {
    return $this->belongsTo ('App\Models\Set');
  }

  /**
   * Variants relation
   */
  public function variants () {
    return $this->morphMany ('App\Models\File', 'parent');
  }
}
