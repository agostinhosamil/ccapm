<?php

namespace App\Models;

use App\Repositories\HasSettings;

class User  extends AppModel {
  /**
   * @var array
   */
  protected $fillable = [
    'key',
    'name',
    'email',
    'phone',
    'username',
    'password',
    'role_id'
  ];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [
    'password'
  ];

  /**
   * Indicates if the model should be timestamped.
   *
   * @var bool
   */
  public $timestamps = false;

  public function role () {
    return $this->belongsTo('App\Models\Role');
  }

  public function posts () {
    return $this->morphMany ('App\Models\Post', 'owner');
  }

  public function tokens () {
    return $this->morphMany ('App\Models\Token', 'owner');
  }

  public function favorites () {
    return $this->hasMany ('App\Models\Favorite');
  }

  public function appointments () {
    return $this->morphMany ('App\Models\Appointment', 'owner');
  }

  #region Four digits authentication token utils
  public function setNumericAuthToken () {
    $numericAuthToken = rand (1000, 9999);

    $this->setSetting ('authentication-token', $numericAuthToken);

    return $numericAuthToken;
  }

  public function unsetNumericAuthToken () {
    $this->setSetting ('authentication-token', '----');
  }

  public function getNumericAuthToken () {
    return $this->getSetting ('authentication-token');
  }

  public function validateNumericAuthToken (string $numericAuthToken) {
    $userNumericAuthToken = $this->getNumericAuthToken ();

    return ($userNumericAuthToken === $numericAuthToken);
  }
  #endregion

  #region Default authentication token utils
  public function setAuthToken () {
    $tokenContent = uuid ();

    $token = $this->tokens ()
      ->firstOrCreate ([
        'content' => $tokenContent
      ]);

    if ($token->content !== $tokenContent) {
      $token->update (['content' => $tokenContent]);
    }

    return $tokenContent;
  }

  public function getAuthToken () {
    $token = $this->tokens ()
      ->firstOrCreate ([
        'content' => uuid ()
      ]);

    return $token->content;
  }

  public function unsetAuthToken () {
    $this->tokens ()
      ->delete ();
  }

  public function validateAuthToken (string $authToken) {
    $userAuthToken = $this->getAuthToken ();

    return ($userAuthToken && $userAuthToken === $authToken);
  }
  #endregion

}
