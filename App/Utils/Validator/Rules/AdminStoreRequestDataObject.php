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
class AdminStoreRequestDataObject extends Rule {
  /**
   * @var string
   */
  protected $message = 'Invalid admin store request data object';

  /**
   * @var array
   */
  protected $fillableParams = [];

  /**
   * @method boolean
   */
  public function check ($value): bool {
    return self::checkInput ($value);
  }

  static function checkInput ($value): bool {
    if (!(is_array ($value) && isset ($value ['id']) && !empty ($value ['id']))) {
      return false;
    }

    $userId = preg_replace ('/[^0-9]+/', '', trim ($value ['id']));
    $userFetch = User::where (['id' => $userId])
      ->orWhere (['key' => $userId]);

    $invalidUserRole = (boolean)(
      isset ($value ['role'])
      && !empty ($value ['role'])
      && get_role_id ($value ['role']) === -1
    );

    return $userFetch->count () >= 1 && !$invalidUserRole;
  }
}
