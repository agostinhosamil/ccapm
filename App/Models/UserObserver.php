<?php

namespace App\Models;

use App\Utils\Hash;

class UserObserver {
  /**
   * before saving a user, it should encrypt its password
   */
  public function saving ($user) {
    $user->password = Hash::Make ($user->password);

    print('<pre>');
    print_r($user);

    exit ('YA');
  }
}
