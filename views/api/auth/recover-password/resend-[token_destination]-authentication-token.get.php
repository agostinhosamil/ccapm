<?php

namespace API\Auth\RecoverPassword;

class ResendAuthenticationToken {
  /**
   * action handler
   */
  function handler ($request, $response) {
    $authenticationTokenDestination = strtolower (trim (param ('token_destination')));

    switch ($authenticationTokenDestination) {
      case 'phone':
        // Send user authentication SMS
        flash('Send user authentication SMS');
        break;

      case 'email':
        // Send user authentication Email
        flash('Send user authentication Email');
        break;

      default:
        flash ('errors.something_went_wrong');
        redirect_back ();
    }

    // Send user authentication email/SMS

    redirect_to ("/auth/lost-password/submit-{$authenticationTokenDestination}-authentication-token");
  }
}

return new ResendAuthenticationToken;
