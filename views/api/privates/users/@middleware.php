<?php

namespace API\Privates\Users;

use App\Server;

class UsersMiddleware {
  function handler () {
    if (!is_admin ()) {
      redirect_to('/');
    }
  }
}

return new UsersMiddleware;
