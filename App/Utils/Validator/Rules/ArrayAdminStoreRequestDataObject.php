<?php

namespace App\Utils\Validator\Rules;

use PDOException;
use App\Models\User;
use Rakit\Validation\Rule;

/**
 * admin_store_request_data_object
 *
 * Use:
 *
 * 'field' => 'admin_store_request_data_object'
 */
class ArrayAdminStoreRequestDataObject extends Rule {
  /**
   * @var string
   */
  protected $message = 'Invalid array admin store request data object';

  /**
   * @var array
   */
  protected $fillableParams = [];

  /**
   * @method boolean
   */
  public function check ($value): bool {
    if (!(is_array ($value) && count ($value) >= 1)) {
      return false;
    }

    foreach ($value as $key => $input) {
      if (!AdminStoreRequestDataObject::checkInput ($input)) {
        return false;
      }
    }

    return true;
  }
}
