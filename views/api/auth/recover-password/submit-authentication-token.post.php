<?php

namespace API\Auth\RecoverPassword;

use App\Controllers\BaseController;

class SubmitAuthenticationToken extends BaseController {
  /**
   * @var array
   * 
   * request data validation rules
   * 
   */
  private $validations = [
    'authentication.token' => 'required|min:4|max:4|valid_numeric_authentication_token'
  ];

  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));
    
    $formValidation = form_validator ($requestData, $this->validations);

    if ($formValidation->fails ()) {
      flash ('errors.invalid_authentication_token');
      redirect_back ();
    }

    $_SESSION['system'] = array_merge ($_SESSION['system'], [
      'status' => 'resetting-password'
    ]);

    $this->user->unsetNumericAuthToken ();

    redirect_to ('/auth/reset-password');
  }
}
