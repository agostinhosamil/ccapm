<?php

namespace API\Privates;

use App\Server;

class PrivateMiddleware {
  function handler () {
    if (!preg_match ('/^(get)$/i', Server::Get('method'))) {
      redirect_if_unauthenticated('/');

      if (!is_admin ()) {
        redirect_to('/');
      }
    }
  }
}

return new PrivateMiddleware;
