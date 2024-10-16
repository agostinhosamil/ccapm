<?php

namespace API\Privates\Auth;

use App\Server;

class AuthMiddleware {
  function handler () {
    if (!is_admin ()) {
      redirect_to('/');
    }
  }
}

return new AuthMiddleware;
