<?php

namespace API\Auth\RecoverPassword;

use App\Middlewares\BaseMiddleware;

class RecoverPasswordMiddleware extends BaseMiddleware {
  /**
   * middleware handler
   */
  function handler () {
    $this->user = tmp_user ();

    if (!$this->user) {
      redirect_to ('/auth/lost-password');
    }
  }
}

return new RecoverPasswordMiddleware;
