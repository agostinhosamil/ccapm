<?php

namespace App\Utils\Validator\Rules;

use PDOException;
use Rakit\Validation\Rule;

/**
 * valid_numeric_authentication_token
 *
 * Use:
 *
 * 'field' => 'valid_numeric_authentication_token'
 */
class ValidNumericAuthenticationToken extends Rule {
  /**
   * @var string
   */
  protected $message = 'Invalid authentication token';

  /**
   * @var array
   */
  protected $fillableParams = [];

  /**
   * @method boolean
   */
  public function check ($value): bool {
    $user = tmp_user ();

    return (boolean)(
      is_string ($value)
      && is_numeric ($value)
      && $user->validateNumericAuthToken ($value)
    );
  }
}
