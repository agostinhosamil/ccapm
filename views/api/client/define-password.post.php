<?php

namespace API\Client;

use App\Utils\Hash;
use App\Models\User;
use App\Controllers\BaseController;

class DefinePassword extends BaseController {
  function handler ($request, $response) {
    $requestData = $request->only([
      'user.password',
      'user.password-confirmation',
      'user.id',
      'user.email',
      // 'user.email',
      // 'user.phone',
      // 'appointment.date',
      // // 'appointment.time',
      // 'appointment.description',
    ]);

    if ($requestData['user']['password'] === $requestData['user']['password-confirmation']) {
      $password = Hash::make($requestData['user']['password']);
      $user = User::where(['id' => $requestData['user']['id']])
        ->update([
          'password' => $password
        ]);

      $signInResponse = login ([
        'username' => $requestData['user']['email'], 
        'password' => $requestData['user']['password'], 
      ]);

      if (is_array ($signInResponse) && $signInResponse ['type'] == 'error') {
        $response->end ([
          'type' => 'error',
          'error' => 'login:error',
          'message' => 'username or password is incorrect'
        ]);
      }

      $response->end ($signInResponse);
    }

    $response->end (['error' => true, 'data' => null]);
  }
}
