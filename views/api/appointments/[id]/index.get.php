<?php

namespace API\Appointments;

use App\Models\Appointment;
use App\Controllers\BaseController;

class Read extends BaseController {
  /**
   * action handler
   */
  function handler ($request, $response) {
    $appointmentId = $this->appointment->id;
    $appointmentWithDoctor = $this->appointment->with (['doctor']);

    $response->end ($appointmentWithDoctor->find ($appointmentId));
  }
}

return new Read;
