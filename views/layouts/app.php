<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>APP - Hiya<?= isset ($title) ? " | $title" : null ?></title>
  <link rel="shortcut icon" href="<?= image ('icon-primary.svg') ?>" type="image/svg">
  <script type="text/javascript" src="<?= asset_path ('javascript', 'lib', 'vendor', 'uolkeo.min.js') ?>" crossorigin="annonimous"></script>
  <script type="text/javascript" src="<?= asset_path ('javascript', 'lib', 'vendor', 'popper.min.js') ?>" crossorigin="annonimous"></script>
  <script type="text/javascript" src="<?= asset_path ('javascript', 'lib', 'vendor', 'bootstrap.min.js') ?>" crossorigin="annonimous"></script>
  <!--script src="https://cdn.jsdelivr.net/npm/cep-promise/dist/cep-promise.min.js"></script-->
  <script type="application/json" data-property="application-language-data">
    <?= ['app' => 'C'] # json_encode (application_language_data ()) ?>
  </script>
  <script type="application/json" data-property="application-view-flash">
    <?= json_encode (flash ()) ?>
  </script>
  <?= style ('bootstrap.css') ?>
  <?= style ('application.css') ?>
  <?= style ('build/application.bundle.css') ?>
  <?= style ('dialog-box-styles.css') ?>
  <?= style ('custom-select-box.css') ?>
  <?= style ('perfect-scrollbar.css') ?>

  <?= script ('bootstrap.min.js') ?>
  <?= script ('popper.min.js') ?>
  <?= script ('build/application.bundle.js') ?>

  <?= partial('components/post/meta-data') ?>
</head>
<body>
  <div class="page-container">
    <?= yields() ?>
  </div>
</body>
</html>
