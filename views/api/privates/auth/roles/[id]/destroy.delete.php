<?php

namespace API\Privates\Auth\Roles;

use App\Models\Role;

class Destroy {
  function handler ($request, $response) {
    $id = param ('id');

    $role = Role::find ($id);

    if ($role && $role->delete ()) {
      return $response->status (202)
        ->json (['status' => 'success']);
    }

    $response->json ([
      'status' => 'error',
      'error' => 'role not found or could not delete'
    ]);
  }
}

return new Destroy;
 