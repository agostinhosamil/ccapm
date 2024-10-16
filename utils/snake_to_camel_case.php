<?php

function snake_to_camel_case ($string = null) {
  /**
   * [$str description]
   * @var string
   */
  $string = (string)($string);

  $string = preg_replace_callback (
    '/_+([a-zA-Z])/',
    function ($match) {
      return strtoupper ($match [1]);
    },
    $string
  );

  return ucfirst ($string);
}
