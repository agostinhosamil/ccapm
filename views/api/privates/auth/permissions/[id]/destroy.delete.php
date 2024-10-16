<?php

namespace API\Privates\Auth\Permissions;

use App\Models\Permission;

class Destroy {
  function handler ($request, $response) {
    $id = param ('id');

    $permission = Permission::find ($id);

    if ($permission && $permission->delete ()) {
      return $response->status (202)
        ->json (['status' => 'success']);
    }

    $response->json ([
      'status' => 'error',
      'error' => 'permission not found or could not delete'
    ]);
  }
}

return new Destroy;
 