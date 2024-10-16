<?php

namespace API\Dashboard;

use App\Models\User;
use App\Controllers\BaseController;

class AdminsByRole extends BaseController {
  /**
   * action handler
   */
  public function handler ($request, $response) {
    $role = param ('role');
    $admins = User::where (['role_id' => get_role_id ($role)])
      ->get ();

    $response->end ($admins);
  }
}

return new AdminsByRole;
