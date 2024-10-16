<?php

namespace API\Users;

use App\Models\User;

class UpdateRole {
  private $validations = [
    'role.id' => 'required|exists:role,id'
  ];

  /**
   * @method mixed
   */
  function handler ($request, $response) {
    $id = param ('id');
    $requestData = $request->only (['role.id']);
    $roleData = $requestData ['role'];
    
    $formValidator = form_validator ($requestData, $this->validations);

    if ($formValidator->fails ()) {
      $errors = $formValidator->errors()->all();

      return $response->json ([
        'status' => 'error',
        'error' => $errors
      ]);
    }

    $userData = [
      'role_id' => $roleData ['id']
    ];

    $user = User::find ($id);

    if ($user && $user->update ($userData)) {
      return $response->json (['status' => 'success', 'user' => $user]);
    }

    $response->json ([
      'status' => 'error',
      'error' => 'user not found or could not update'
    ]);
  }
}

return new UpdateRole;
