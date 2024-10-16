<?php

namespace API\Auth\RecoverPassword;

use App\Controllers\BaseController;

class RequestAuthenticationToken extends BaseController {
  /**
   * @var array
   * 
   * request data validation rules
   * 
   */
  private $validations = [
    'authentication-token-destination' => 'required'
  ];

  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));
    
    $formValidation = form_validator ($requestData, $this->validations);

    if ($formValidation->fails ()) {
      flash ('errors.something_went_wrong');
      redirect_back ();
    }

    $authenticationTokenDestination = strtolower (trim ($requestData ['authentication-token-destination']));
    $numericAuthToken = $this->user->setNumericAuthToken ();

    switch ($authenticationTokenDestination) {
      case 'phone':    
        // Send user authentication SMS
        break;

      case 'email':
        $authToken = $this->user->setAuthToken ();
        // Send user authentication Email
        break;

      default:
        flash ('errors.something_went_wrong');
        redirect_back ();
    }

    // Send user authentication email/SMS

    redirect_to ("/auth/lost-password/submit-{$authenticationTokenDestination}-authentication-token");
  }
}
