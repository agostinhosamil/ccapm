<?php

namespace App\Models;

class Appointment  extends AppModel {

  /**
   * Indicates if the model should be timestamped.
   *
   * @var bool
   */
  public $timestamps = false;
  
  /**
   * @var array
   */
  protected $fillable = [
    'description',
    'date',
    'doctor'
  ];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [
    'owner_type',
    'owner_id'
  ];

  public function owner () {
    return $this->morphTo ();
  }

  public function doctor () {
    return $this->belongsTo ('App\Models\User', 'doctor');
  }
}
