<?php

namespace API\Privates\System\Languages;

// use App\Models\Language;
use App\Controllers\BaseController;

class Store extends BaseController {
  /**
   * @var array
   * 
   * action request body data validations
   * 
   */
  private $validations = [
    'language.key' => 'required|min:4|max:12|unique:language(param.id),key',
    'language.name' => 'required|min:4|max:40',
    'language.settings' => 'required'
  ];

  /**
   * action handler
   */
  function handler ($request, $response) {
    $requestData = $request->only (array_keys ($this->validations));

    $formValidation = form_validator ($requestData, $this->validations);

    if ($formValidation->fails ()) {
      $errors = $formValidation->errors ();

      $response->end ([
        'status' => 'error',
        'error' => $errors->all ()
      ]);
    }

    $languageData = $requestData ['language'];

    if ($this->language->update ($languageData)) {
      $languageSettings = array_to_key_path_map ($languageData ['settings']);
    
      foreach ($languageSettings as $property => $value) {
        $this->language->updateSetting ($property, $value, gettype ($value));
      }
    }

    $response->end ($this->language);
  }
}

return new Store;
