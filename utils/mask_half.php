<?php

function mask_half (string $str, string $maskChar = '*') {
  $strHalf = round (strlen ($str) / 2);
  $mask = str_repeat ($maskChar, $strHalf);

  return substr_replace ($str, $mask, $strHalf - 1, strlen ($str));
}
