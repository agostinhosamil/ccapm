<?php

namespace API\Privates\Auth\Permissions;

use App\Models\Permission;
use App\Controllers\BaseController;

class Index extends BaseController {
  /**
   * @method handler
   */
  function handler ($request, $response) {
    $permissions = Permission::all ();

    return $response->json ($permissions);
  }
}

return new Index;
