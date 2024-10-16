<?php

namespace API;

use App\Models\Appointment;
use App\Controllers\BaseController;

class Appointments {
  /**
   * action handler
   */
  function handler ($request, $response) {
    $user = user ();
    $appointments =  [];
    
    if ($user) {
      $appointments = $user->appointments ()->get ();
    }


    $response->end($appointments);
  }
}
