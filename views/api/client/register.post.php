<?php

namespace API\Client;

use Trounex\Cookie;
use App\Controllers\BaseController;
use App\Models\Appointment;
use App\Models\User;

class Register extends BaseController {
  function handler ($request, $response) {
    $requestData = $request->only([
      'user.name',
      'user.surname',
      'user.email',
      'user.phone',
      'appointment.date',
      // 'appointment.time',
      'appointment.description',
    ]);

    $user = $this->user;

    if (!$user) {
      $usernameAlternates = generate_usernames (join(' ', [
        $requestData['user']['name'],
        $requestData['user']['surname']
      ]), rand (1, 15));
  
      $username = $usernameAlternates [rand (0, -1 + count ($usernameAlternates))];
  
      $userData = [
        'name' => join(' ', [
          $requestData['user']['name'],
          $requestData['user']['surname']
        ]),
        'email' => $requestData['user']['email'],
        'password' => 'tmpPassword',
        'phone' => $requestData['user']['phone'],
        'key' => generate_unique_id(),
        'username' => $username
      ];
  
      $user = User::create($userData);
    }

    $appointment = $user->appointments()->create(array_merge($requestData['appointment'], [
      'key' => generate_unique_id(),
    ]));

    Cookie::set('tmp-user-id', $user->id);

    $response->end (
      $this->user 
        ? ['appointment' => $appointment] 
        : ['user' => $user, 'appointment' => $appointment]
    );
  }
}
