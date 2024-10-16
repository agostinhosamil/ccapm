<?php

namespace API\Dashboard;

use App\Models\User;
use App\Controllers\BaseController;

class Admins extends BaseController {
  /**
   * action handler
   */
  public function handler ($request, $response) {
    $admins = User::where (['role_id' => get_role_id ('admin')])
      ->get ();

    $response->end ($admins);
  }
}
