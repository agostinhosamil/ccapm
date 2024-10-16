<?php

namespace API\Privates\Auth\Permissions;

use App\Models\Permission;
use App\Controllers\BaseController;

class Store extends BaseController {
  /**
   * @var array
   * 
   * permission create validations
   * 
   */
  private $validations = [
    'permission.description' => 'required|min:1|max:255',
    'permission.key' => 'required|min:1|max:255|unique:permission,key',
    'permission.name' => 'required|min:1|max:255',
  ];

  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));
    $permissionData = $requestData ['permission'];

    $formValidation = form_validator ($requestData, $this->validations);

    if ($formValidation->fails ()) {
      $errors = $formValidation->errors()->all();

      return $response->json([
        'status' => 'error',
        'error' => $errors
      ]);
    }

    $permission = new Permission ($permissionData);

    if ($permission->save ()) {
      return $response->status(201)
        ->json ([
          'status' => 'success', 
          'permission' => $permission
        ]);
    }

    $response->json([
      'status' => 'error',
      'error' => 'permission not found or could not update'
    ]);
  }
}

return new Store;
