<?php

namespace API\Users;

use App\Utils\Hash;
use App\Models\User;

class Destroy {
  // private $validations = [
  //   'user.name' => 'required|min:5|max:40',
  //   'user.email' => 'required|min:5|max:40|email',
  //   'user.phone' => 'nullable|min:9|max:10',
  //   'user.username' => 'required|min:3|max:40|regex:/^[a-zA-Z_0-9\.\-]+$/',
  //   'user.password' => 'required|min:6|max:40|same:user-password-confirmation'
  // ];

  /**
   * @method mixed
   */
  function handler ($request) {
    $id = param ('id');
    // $userData = $request->get('user');
    
    // $formValidator = form_validator($_POST, $this->validations);

    // if ($formValidator->fails()) {
    //   $errors = $formValidator->errors()->all();

    //   exit (json_encode ([
    //     'status' => 'error',
    //     'error' => $errors
    //   ]));
    // }

    // $userData = array_merge($userData, [
    //   'password' => Hash::Make($userData['password'])
    // ]);

    $user = User::find($id);

    if ($user && $user->id !== user()->id && $user->delete()) {
      exit(json_encode (['status' => 'success']));
    }

    exit (json_encode ([
      'status' => 'error',
      'error' => 'user not found or could not delete'
    ]));
  }
}

return new Destroy;
