<?php

namespace App\Models;

class Token extends AppModel {
  /**
   * @var array
   * 
   * Fillable token properties
   * 
   */
  protected $fillable = [
    'content'
  ];

  public function owner () {
    return $this->morphTo ();
  }
}
