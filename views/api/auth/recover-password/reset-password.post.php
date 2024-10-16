<?php

namespace API\Auth;

use App\Utils\Hash;
use App\Controllers\BaseController;

class ResetPassword extends BaseController {
  /**
   * @var array
   * 
   * reset password request validations
   */
  private $validations = [
    'user.password' => 'required|min:6|max:40|same:user-password-confirmation',
    'user-password-confirmation' => 'required'
  ];
  /**
   * action handler
   */
  public function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));
    
    $formValidator = form_validator ($requestData, $this->validations);

    if ($formValidator->fails ()) {
      flash_all ($formValidator->errors ());

      redirect_back();
    }

    $user = tmp_user ();
    $userData = $requestData ['user'];

    $updated = $user->update ([
      'password' => Hash::Make ($userData ['password'])
    ]);

    if ($updated) {
      login ($user->toArray ());

      flash ('Welcome back!');

      redirect_to ('/');
    }

    flash (text ('errors.something_went_wrong'));
    redirect_back ();
  }
}
