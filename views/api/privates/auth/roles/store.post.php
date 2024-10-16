<?php

namespace API\Privates\Auth\Roles;

use App\Models\Role;
use App\Controllers\BaseController;

class Store extends BaseController {
  /**
   * @var array
   * 
   * role create validations
   * 
   */
  private $validations = [
    'role.description' => 'required|min:1|max:255',
    'role.key' => 'required|min:1|max:255|unique:role,key',
    'role.name' => 'required|min:1|max:255',
  ];

  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));
    $roleData = $requestData ['role'];

    $formValidation = form_validator ($requestData, $this->validations);

    if ($formValidation->fails ()) {
      $errors = $formValidation->errors()->all();

      return $response->json([
        'status' => 'error',
        'error' => $errors
      ]);
    }

    $role = new Role ($roleData);

    if ($role->save ()) {
      return $response->status(201)
        ->json ([
          'status' => 'success', 
          'role' => $role
        ]);
    }

    $response->json([
      'status' => 'error',
      'error' => 'role not found or could not update'
    ]);
  }
}

return new Store;
