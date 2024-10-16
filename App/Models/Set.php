<?php

namespace App\Models;

class Set extends AppModel {
  /**
   * @var array
   * 
   * fillable set properties
   * 
   */
  protected $fillable = [
    'key',
    'name',
  ];

  /**
   * Indicates if the model should be timestamped.
   *
   * @var bool
   */
  public $timestamps = false;

  public function files () {
    return $this->hasMany ('App\Models\File');
  }
}
