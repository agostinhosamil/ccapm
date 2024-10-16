<?php

namespace App\Models;

class Setting extends AppModel {
  /**
   * @var array
   * 
   * fillable file properties
   * 
   */
  protected $fillable = [
    'type',
    'value',
    'property',
    'context_type',
    'context_id',
  ];

  public function context () {
    return $this->morphTo ();
  }
}
