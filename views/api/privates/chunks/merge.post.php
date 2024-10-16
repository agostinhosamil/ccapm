<?php

namespace API\Privates\Chunks;

use App\Controllers\BaseController;
use Trounex\Helpers\FileUploadHelper;

class Merge extends BaseController {
  /**
   * action handler
   */
  function handler ($request, $response) {
    $uploadedChunks = $request->get ('chunks');
    $uploadedFileType = $request->get ('fileType');

    if (!(is_array ($uploadedChunks) && count ($uploadedChunks) >= 1)) {
      $response->status (401)
        ->end ([
          'status' => 'error',
          'error' => 'invalid-chunk-data'
        ]);
    }
    
    $videoFileExtension = resolve_video_file_extension_by_mime_type ($uploadedFileType);
    $videoFileTmpName = join ('.', ['video', $videoFileExtension]);

    $videoFileName = FileUploadHelper::generateFileNameIfNull ([
      'data' => [
        'name' => $videoFileTmpName
      ]
    ]);

    $videoFileDestinationDirectory = FileUploadHelper::resolveUploadedFileDestinationDirectory ($videoFileName);

    $uploadsPath = conf ('paths.uploadsPath');
    $videoFileAbsolutePath = join (DIRECTORY_SEPARATOR, [$videoFileDestinationDirectory, $videoFileName]);

    $videoFile = fopen ($videoFileAbsolutePath, 'w');

    foreach ($uploadedChunks as $uploadedChunk) {
      $uploadedChunkFilePath = absolute_path ($uploadsPath, $uploadedChunk);

      if (!empty ($uploadedChunkFilePath) && is_file ($uploadedChunkFilePath)) {
        $uploadedChunkFileContent = file_get_contents ($uploadedChunkFilePath);

        fwrite ($videoFile, $uploadedChunkFileContent);

        @unlink ($uploadedChunkFilePath);
      }
    }

    fclose ($videoFile);

    $response->end ([
      'message' => 'merge n file chunks',
      'type' => $uploadedFileType,
      'name' => $videoFileName
    ]);
  }
}
