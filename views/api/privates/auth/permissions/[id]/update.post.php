<?php

namespace API\Privates\Auth\Permissions;

use App\Models\Permission;

class Update {
  /**
   * @var array
   * 
   * permission model validations
   * 
   */
  private $validations = [
    'permission.description' => 'required|min:1|max:255',
    'permission.key' => 'required|min:1|max:255|unique:permission(id),key',
    'permission.name' => 'required|min:1|max:255',
  ];

  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));

    $permissionData = $requestData ['permission'];

    $id = param ('id');

    $formValidation = form_validator ($requestData, $this->validations);

    if ($formValidation->fails()) {
      $errors = $formValidation->errors()->all();

      return $response->json ([
        'status' => 'error',
        'error' => $errors
      ]);
    }

    $permission = Permission::find ($id);

    if ($permission && $permission->update ($permissionData)) {
      return $response->status(202)
        ->json ([
          'status' => 'success', 
          'permission' => $permission
        ]);
    }

    $response->json ([
      'status' => 'error',
      'error' => 'permission not found or could not update'
    ]);
  }
}

return new Update;
