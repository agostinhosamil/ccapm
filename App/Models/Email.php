<?php

namespace App\Models;

class Email extends AppModel {
  /**
   * @var array
   */
  protected $fillable = [
    'store_id',
    'value',
  ];

  public function store () {
    return $this->belongsTo('App\Models\Store');
  }
}
