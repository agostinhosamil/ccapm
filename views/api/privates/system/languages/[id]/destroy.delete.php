<?php

namespace API\Privates\System\Languages;

use App\Controllers\BaseController;

class Destroy extends BaseController {
  /**
   * action handler
   */
  function handler ($request, $response) {
    if ($this->language->delete ()) {
      $response->end ([
        'status' => 'success',
        'message' => 'language deleted'
      ]);
    }

    $response->status (500)
      ->end ([
        'status' => 'error',
        'error' => 'system-error',
        'message' => 'something went wrong while deleting'
      ]);
  }
}

return new Destroy;
