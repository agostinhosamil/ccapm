<?php

namespace API\Privates\System;

use App\Models\Language;

class Languages {
  /**
   * action handler
   */
  function handler ($request, $response) {
    $languages = Language::all ()
      ->map (function (Language $language) {
        $language->settings = array_to_key_path_map (language_data ($language));

        return $language;
      });

    $response->end ($languages);
  } 
}

return new Languages;
