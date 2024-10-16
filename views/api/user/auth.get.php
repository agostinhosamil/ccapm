<?php

namespace API\User;

// use Trounex\Auth;

class Auth {
  /**
   * action handler
   */
  function handler ($request, $response) {
    // redirect_if_unauthenticated ('/');

    // $user = user ();
    // $role = $user->role ()
    //   ->with (['permissions'])
    //   ->first ();

    // $user->role = $role;

    $response->end ([
      'user' => '$user'
    ]);
  }
}
