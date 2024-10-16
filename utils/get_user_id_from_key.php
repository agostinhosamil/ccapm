<?php

use App\Models\User;

function get_user_id_from_key (string $key) {
  $fetchResults = User::where ([
    'key' => $key
  ]);

  $user = $fetchResults->first ();

  if ($user) {
    return $user->id;
  }
}
