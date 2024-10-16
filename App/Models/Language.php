<?php

namespace App\Models;

use App\Repositories\HasSettings;

class Language extends AppModel {
  /**
   * @var array
   * 
   * fillable props
   * 
   */
  protected $fillable = [
    'name',
    'key'
  ];

  use HasSettings;
}
