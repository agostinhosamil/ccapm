<?php

namespace API\Dashboard;

use App\Models\User;
use App\Controllers\BaseController;

class Admins extends BaseController {
  /**
   * @var array
   * 
   * POST request data validations
   * 
   */
  private $validations = [
    'user' => 'admin_store_request_data_object',
    'users' => 'array_admin_store_request_data_object',
    'role' => 'exists:role,key'
  ];

  /**
   * action handler
   */
  public function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));

    $formValidation = form_validator ($requestData, $this->validations);

    if ($formValidation->fails ()) {
      $response->status (400)
        ->end ([
          'type' => 'error',
          'error' => 'invalid:input',
          'message' => 'invalid input data',
          'data' => $formValidation->errors ()->all ()
        ]);
    }

    $defaultRoleKey = $requestData ['role'] ?? 'user:employee';
    $defaultRoleId = get_role_id ($defaultRoleKey);
    $users = $requestData ['users'] ?? [];
    $user = $requestData ['user'] ?? null;

    if (is_array ($user)) {
      array_push ($users, $user);
    }

    foreach ($users as $userIndex => $userData) {
      $userId = $userData ['id'];
      $userRoleId = isset ($userData ['role'])
        ? get_role_id ($userData ['role'])
        : $defaultRoleId;

      $updatedUser = User::where (['id' => $userId])
        ->orWhere (['key' => $userId])
        ->first ()
        ->update ([
          'role_id' => $userRoleId
        ]);

      if (!$updatedUser) {
        // pass
      }
    }

    $updatedUsers = array_map (function ($userData) {
      return User::with ('role.permissions')
        ->where (['id' => $userData ['id']])
        ->orWhere (['key' => $userData ['id']])
        ->first ();
    }, $users);

    $response->end (
      isset ($requestData ['users']) 
        ? $updatedUsers 
        : $updatedUsers [0]
    );
  }
}
