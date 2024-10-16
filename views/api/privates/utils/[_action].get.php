<?php

namespace API\Privates\Utils;

use App\Models\User;
use App\Models\Store;

class Utils {
  /**
   * @method void
   * 
   * generate a unique username based in a given name
   * 
   */
  function generateUserName ($request, $response) {
    $name = $request->query ('name');
    $quantity = $request->query ('quantity');

    $quantity = (empty ($quantity) || !is_numeric ($quantity))
      ? 1
      : (int)($quantity);

    $usernames = generate_usernames ($name, $quantity);

    $response->json ($usernames);
  }

  function getUploadedImageUrl ($request, $response) {
    $image = $request->query ('image');

    $response->end ([
      'url' => image ($image)
    ]);
  }
}

return new Utils;
