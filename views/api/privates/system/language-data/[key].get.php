<?php

namespace API\Privates\System;

use App\Models\Language;

class LanguageData {
  /**
   * action handler
   */
  function handler ($request, $response) {
    $languageFetch = Language::where (['key' => param ('key')]);

    if ($languageFetch->count () < 1) {
      $response->status (404)
        ->end ([
          'status' => 'error',
          'error' => 'not-found',
          'message' => 'language not found'
        ]);
    }

    $language = $languageFetch->first ();

    $languageData = array_to_key_path_map (language_data ($language));

    $response->end ($languageData);
  } 
}

return new LanguageData;
