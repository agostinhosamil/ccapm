<?php

namespace API\Privates\Chunks;

use App\Controllers\BaseController;

class Upload extends BaseController {
  /**
   * action handler
   */
  function handler ($request, $response) {
    $uploadingChunk = $request->get ('chunk');

    save_uploaded_file ($uploadingChunk);

    $response->end ([
      'chunkFileName' => $uploadingChunk
    ]);
  }
}
