<?php

namespace API\Privates\System;

class LanguageData {
  /**
   * action handler
   */
  function handler ($request, $response) {
    $languageData = array_to_key_path_map (default_language_data ());

    $response->end ($languageData);
  } 
}

return new LanguageData;
