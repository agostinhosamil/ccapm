<?php

namespace App\Utils\Development;

class Commands {
  /**
   * Run dev server
   */
  public static function dev () {
    $format = requires ('format');

    print_r ($format);
  }
}
