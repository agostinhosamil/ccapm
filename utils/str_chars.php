<?php

// // use App\Models\User;

function str_chars (string $str) {
  $strCharsList = preg_split ('//', $str);
  return array_slice ($strCharsList, 1, -2 + count ($strCharsList));
}
