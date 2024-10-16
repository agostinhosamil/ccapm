<?php

namespace API\Auth;

use App\Models\User;

class FindAccount {
  /**
   * @var array
   * 
   * request data validation rules
   * 
   */
  private $validations = [
    'user.username' => 'required'
  ];

  function handler ($request, $response) {
    $userData = $request->only (array_keys ($this->validations));
    
    $formValidation = form_validator ($userData, $this->validations);

    if ($formValidation->fails ()) {
      $response->end ([
        'type' => 'error',
        'error' => 'invalid:input',
        'message' => 'Not provided user data'
      ]);
    }

    $username = strtolower ($userData['user']['username']);

    $userFetchByEmail = User::where (['username' => $username])
      ->orWhere (['email' => $username])
      ->orWhere (['phone' => $username]);

    if ($userFetchByEmail->count () >= 1) {
      $user = $userFetchByEmail->first ();

      $response->end ([
        'status' => 'recovering-account',
        'account' => $user->key
      ]);
    }

    $response->end ([
      'type' => 'error',
      'error' => 'account:notFound',
      'message' => 'Account not found'
    ]);
  }
}
