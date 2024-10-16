<?php

namespace App\Models;

class Permission  extends AppModel {
  /**
   * @var array
   */
  protected $fillable = [
    'key',
    'name',
    'description'
  ];

  /**
   * Indicates if the model should be timestamped.
   *
   * @var bool
   */
  public $timestamps = false;

  public function roles () {
    return $this->belongsToMany('App\Models\Role');
  }
}
