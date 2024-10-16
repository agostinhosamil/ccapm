<?php

namespace API\Appointments;

use App\Models\Appointment;
use App\Controllers\BaseController;

class Update extends BaseController {
  /**
   * @var array
   * 
   * POST request data validations
   */
  private $validations = [
    'appointment.description' => 'required|min:5',
    'appointment.date' => 'required',
    // 'appointment.doctor' => 'exists:user,key',
    // 'owner_type' => 'required',
    // 'owner_id' => 'required',
  ];

  /**
   * action handler
   */
  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));

    $validation = form_validator ($requestData, $this->validations);

    if ($validation->fails ()) {
      $response->end ([
        'type' => 'error',
        'error' => 'appointment:create',
        'message' => 'could not create appointment',
        'data' => $validation->errors ()->all ()
      ]);
    }

    $appointmentData = $requestData ['appointment'];

    $appointment = $this->appointment
      ->update (array_merge ($appointmentData, [
        'doctor' => isset ($appointmentData ['doctor'])
          ? get_user_id_from_key ($appointmentData ['doctor'])
          : null
      ]));

    $appointmentId = $this->appointment->id;

    $response->end ($this->appointment->with (['doctor'])->find ($appointmentId));
  }
}

return new Update;
