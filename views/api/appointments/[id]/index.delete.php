<?php

namespace API\Appointments;

use App\Models\Appointment;
use App\Controllers\BaseController;

class Destroy extends BaseController {
  /**
   * action handler
   */
  function handler ($request, $response) {
    $response->end ($this->appointment->delete ());
  }
}

return new Destroy;
