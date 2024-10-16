<?php

namespace API;

use App\Models\User;
use App\Controllers\BaseController;

class Profile extends BaseController {
  function handler ($request, $response) {
    $user = User::with('appointments.doctor')
      ->where('id', $this->user->id)
      ->first();

    $response->end ($user);
  }
}
