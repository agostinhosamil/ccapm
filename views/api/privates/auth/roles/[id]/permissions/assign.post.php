<?php

namespace API\Privates\Auth\Roles;

use App\Models\Role;

class AssignPermissions {
  function handler ($request, $response) {
    $id = param ('id');
    $role = Role::find ($id);

    $permissionsIds = $request->get ('permissions');
    
    if ($role && is_array ($permissionsIds)) {
      $rolePermissions = $role->permissions ();

      foreach ($permissionsIds as $permissionsId) {
        $rolePermissions->attach ($permissionsId);
      }

      return $response->json ([
        'status' => 'success',
        'role' => $role
      ]);
    }

    $response->json ([
      'status' => 'error',
      'error' => 'role not found'
    ]);
  }
}

return new AssignPermissions;
