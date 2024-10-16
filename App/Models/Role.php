<?php

namespace App\Models;

class Role  extends AppModel {
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

  public function users () {
    return $this->hasMany('App\Models\User');
  }

  public function permissions () {
    return $this->belongsToMany('App\Models\Permission');
  }
}
