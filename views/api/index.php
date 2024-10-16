<?php

namespace API;

class Index {
  /**
   * route handler
   */
  function handler ($request, $response) {
    $response->end ([
      'appName' => 'Anluge CDN API',
      'version' => '1.0.0'
    ]);
  }
}

return new Index;
