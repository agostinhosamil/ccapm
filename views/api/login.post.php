<?php

namespace API;

class Login {
  private $validations = [
    'user.username' => 'required|min:3|max:40',
    'user.password' => 'required|min:6|max:40'
  ];

  function handler ($request, $response) {
    $userData = $request->only ([
      'user.username',
      'user.password'
    ]);
    
    $formValidator = form_validator ($userData, $this->validations);

    if ($formValidator->fails ()) {
      flash_all ($formValidator->errors ());

      redirect_back ();
    }

    $signInResponse = login ($userData ['user']);

    if (is_array ($signInResponse) && $signInResponse ['type'] == 'error') {
      $response->end ([
        'type' => 'error',
        'error' => 'login:error',
        'message' => 'username or password is incorrect'
      ]);
    }

    $response->end ($signInResponse);
  }
}
