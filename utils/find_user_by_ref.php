<?php

use App\Models\User;

function find_user_by_ref (string $userRefData) {
  $userFetch = User::where (['username' => $userRefData])
    ->orWhere (['id' => $userRefData])
    ->orWhere (['key' => $userRefData]);

  return $userFetch->first ();
}
