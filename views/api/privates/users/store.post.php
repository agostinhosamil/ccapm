<?php

namespace API\Users;

use App\Utils\Hash;
use App\Models\User;

class Store {
  private $validations = [
    'user.name' => 'required|min:5|max:40',
    'user.email' => 'required|min:5|max:40|email|unique:user,email',
    'user.phone' => 'nullable|min:9|max:10|unique:user,phone',
    'user.username' => 'required|min:3|max:40|regex:/^[a-zA-Z_0-9\.\-]+$/|unique:user,username',
    'user.password' => 'required|min:6|max:40|same:user-password-confirmation'
  ];

  /**
   * @method mixed
   */
  function handler ($request) {
    $userData = $request->get('user');
    
    $formValidator = form_validator($_POST, $this->validations);

    if ($formValidator->fails()) {
      $errors = $formValidator->errors()->all();

      // foreach ($errors as $error) {
      //   flash($error);
      // }

      // redirect_back();
      exit (json_encode ([
        'status' => 'error',
        'error' => $errors
      ]));
    }

    $user = new User(array_merge($userData, [
      'password' => Hash::Make($userData['password'])
    ]));

    if ($user->save()) {
      // login($userData);

      // redirect_to('/dashboard');
      exit(json_encode (['status' => 'success', 'user' => $user]));
    }
  }
}

return new Store;
