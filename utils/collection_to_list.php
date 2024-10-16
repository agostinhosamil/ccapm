<?php

use Illuminate\Support\Collection;

function collection_to_list (Collection $collection) {
  $list = [];

  foreach ($collection as $item) {
    array_push ($list, $item);
  }

  return $list;
}
