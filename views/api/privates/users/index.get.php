<?php

namespace API\Privates\Users;

use App\Models\User;

class Users {
  /**
   * @method mixed
   */
  function handler ($request, $response) {
    $users = User::with ('role');

    $response->json ($users->get ());
  }
}

return new Users;
