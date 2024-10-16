<?php

namespace API\Appointments;

use App\Middlewares\BaseMiddleware;

class AppointmentMiddleware extends BaseMiddleware {
  /**
   * middleware handler
   */
  function handler ($request, $response) {
    $appointmentId = param ('id');
    $appointment = $this->user->appointments ()
      ->find ($appointmentId);

    if (!$appointment) {
      $response->status (404)
        ->end ([
          'type' => 'error',
          'error' => 'appointment:noFound',
          'message' => 'Appointment not found',
          'data' => 'No data'
        ]);
    }

    $this->appointment = $appointment;
  }
}

return new AppointmentMiddleware;
