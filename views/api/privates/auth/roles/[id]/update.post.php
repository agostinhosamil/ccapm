<?php

namespace API\Privates\Auth\Roles;

use App\Models\Role;

class Update {
  /**
   * @var array
   * 
   * role model validations
   * 
   */
  private $validations = [
    'role.description' => 'required|min:1|max:255',
    'role.key' => 'required|min:1|max:255|unique:role(id),key',
    'role.name' => 'required|min:1|max:255',
  ];

  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));

    $roleData = $requestData ['role'];

    $id = param ('id');

    $formValidation = form_validator ($requestData, $this->validations);

    if ($formValidation->fails()) {
      $errors = $formValidation->errors()->all();

      return $response->json ([
        'status' => 'error',
        'error' => $errors
      ]);
    }

    $role = Role::find ($id);

    if ($role && $role->update ($roleData)) {
      return $response->status(202)
        ->json ([
          'status' => 'success', 
          'role' => $role
        ]);
    }

    $response->json ([
      'status' => 'error',
      'error' => 'role not found or could not update'
    ]);
  }
}

return new Update;
