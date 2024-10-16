<?php

use App\Models\User;

function generate_usernames (string $name, int $quantity = 1) {
  $registeredUsernames = User::all ()
    ->map (function (User $user) {
      return strtolower ($user->username);
    })
    ->toArray ();

  $usernames = generate_unique_slags ($name, $registeredUsernames, $quantity);

  return $usernames;
}
