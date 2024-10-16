<?php

namespace API;

use App\Models\Appointment;
use App\Controllers\BaseController;

class Appointments extends BaseController {
  /**
   * @var array
   * 
   * POST request data validations
   */
  private $validations = [
    'appointment.description' => 'required|min:5',
    'appointment.date' => 'required',
    'appointment.doctor' => 'exists:user,key',
    // 'owner_type' => 'required',
    // 'owner_id' => 'required',
  ];

  /**
   * action handler
   */
  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));

    // $user = user ();
    $validation = form_validator ($requestData, $this->validations);

    // if (!($user instanceof User)) {
    //   $response->end ([
    //     'type' => 'error',
    //     'error' => 'user:unauthenticated',
    //     'message' => 'User not authenticated',
    //     'data' => 'must login first'
    //   ]);
    // }

    if ($validation->fails ()) {
      $response->end ([
        'type' => 'error',
        'error' => 'appointment:create',
        'message' => 'could not create appointment',
        'data' => $validation->errors ()->all ()
      ]);
    }

    $appointmentData = $requestData ['appointment'];

    $appointment = $this->user
      ->appointments ()
      ->create (array_merge ($appointmentData, [
        'doctor' => isset ($appointmentData ['doctor'])
          ? get_user_id_from_key ($appointmentData ['doctor'])
          : null
      ]));

    $response->end ($appointment);
  }
}
