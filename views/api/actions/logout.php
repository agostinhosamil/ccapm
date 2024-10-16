<?php

namespace API\Actions;

use Trounex\Auth;

class Logout {
  /**
   * action handler
   */
  function handler () {
    Auth::undo ('/');
  }
}
