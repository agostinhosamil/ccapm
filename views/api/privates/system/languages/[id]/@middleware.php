<?php

namespace API\Privates\System\Languages;

use App\Models\Language;
use App\Middlewares\BaseMiddleware;

class LanguageMiddleware extends BaseMiddleware {
  /**
   * middleware handler
   */
  function handler ($request, $response) {
    $this->language = Language::find (param ('id'));

    if (!$this->language) {
      $response->status (404)
        ->end ([
          'status' => 'error',
          'error' => 'not-found',
          'message' => 'language not found'
        ]);
    }
  }
}


return new LanguageMiddleware;
