<?php

namespace API\Appointments;

use App\Models\User;
use App\Middlewares\BaseMiddleware;

class AppointmentsMiddleware extends BaseMiddleware {
  /**
   * middleware handler
   */
  function handler ($request, $response) {
    $user = user ();

    // if (!($user instanceof User)) {
    //   $response->status(401)
    //     ->end ([
    //       'type' => 'error',
    //       'error' => 'user:unauthenticated',
    //       'message' => 'User not authenticated',
    //       'data' => 'must login first'
    //     ]);
    // }

    $this->user = $user;
  }
}

return new AppointmentsMiddleware;
