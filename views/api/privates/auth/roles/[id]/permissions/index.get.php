<?php

namespace API\Privates\Auth\Roles;

use App\Models\Role;

class Permissions {
  function handler ($request, $response) {
    $id = param ('id');

    $role = Role::find ($id);

    if ($role) {
      $rolePermissions = $role->permissions ()->get();

      return $response->status (202)
        ->json ($rolePermissions);
    }

    $response->json ([
      'status' => 'error',
      'error' => 'role not found'
    ]);
  }
}

return new Permissions;
 