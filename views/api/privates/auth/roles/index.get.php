<?php

namespace API\Privates\Auth\Roles;

use App\Models\Role;
use App\Controllers\BaseController;

class Index extends BaseController {
  /**
   * @method handler
   */
  function handler ($request, $response) {
    $roles = Role::all ();

    return $response->json ($roles);
  }
}

return new Index;
