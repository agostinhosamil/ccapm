<?php

use App\Models\Role;

function get_role_id (string $roleKey) {
  $roleByKeyFetch = Role::where (['key' => $roleKey]);

  if ($roleByKeyFetch->count () >= 1) {
    $role = $roleByKeyFetch->first ();

    return $role->id;
  }

  return -1;
}
