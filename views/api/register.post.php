<?php

namespace API;

use App\Utils\Hash;
use App\Models\User;

class Register {
  private $validations = [
    'user.name' => 'required|min:5|max:40',
    'user.email' => 'required|min:5|max:40|email|unique:user,email',
    'user.phone' => 'nullable|min:9|max:10|unique:user,phone',
    'user.password' => 'required|min:6|max:40|same:user-password-confirmation',
    'user-password-confirmation' => 'required'
  ];

  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));
    
    $formValidator = form_validator ($requestData, $this->validations);

    if ($formValidator->fails ()) {
      $errors = $formValidator->errors ();

      $response->end ([
        'type' => 'error',
        'error' => $errors->all ()
      ]);
    }

    $userData = $requestData ['user'];

    $usernameAlternates = generate_usernames ($userData ['name'], rand (1, 15));

    $username = $usernameAlternates [rand (0, -1 + count ($usernameAlternates))];

    $user = new User (array_merge ($userData, [
      'key' => generate_unique_id (),
      'username' => $username,
      'password' => Hash::Make ($userData ['password'])
    ]));
    
    if ($user->save ()) {
      $userAuthData = array_merge ($userData, [
        'username' => $username
      ]);

      $signInResponse = login ($userAuthData);

      if (is_array ($signInResponse) && isset ($signInResponse ['token'])) {
        $response->end ($signInResponse);
      }
    }

    $response->end ([
      'type' => 'error',
      'message' => 'Could not create account'
    ]);
  }
}
