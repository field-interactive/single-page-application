<?php
    $json = file_get_contents(__DIR__ . "/assets/manifest.json");
    $assets = json_decode($json, true);

    function createAjaxDataAttributes($ajax)
    {
        foreach ($ajax as $option => $value) {
            $value = is_array($value) ? json_encode($value) : $value;

            echo "{$option}='{$value}' ";
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Javascript SPA example</title>
    <link rel="stylesheet" type="text/css" href="<?php echo $assets['assets/css/app.css'] ?>"/>
</head>
<body class="d-flex justify-content-center align-items-center flex-column">
    <div class="container">

        <h1 class="mt-3">Javascript SPA example</h1>
        <hr>

        <section id="test-1">
            <h4><b>section#test-1</b>: Simple <kbd>GET</kbd> request</h4>
            <p><b>Expected result:</b> This example should replace this section with the content of <code>section#test-1</code> from <code>results.php</code>.</p>
            <?php
                $ajax = [
                    'data-ajax' => 'spa',
                    'data-ajax-mapping' => 'section#test-1',
                ];
            ?>

            <a class="btn btn-primary" href="/results.php" <?php createAjaxDataAttributes($ajax) ?>>Test example 1</a>
        </section>

        <section id="test-2">
            <hr class="mt-4">

            <h4><b>section#test-2</b>: Append mode and more mappings</h4>
            <p><b>Expected result:</b> This example should append the content of <code>section#test-1</code> and <code>section#test-2</code> from <code>results.php</code>.</p>
            <?php
                $ajax = [
                    'data-ajax' => 'spa',
                    'data-ajax-mode' => 'append',
                    'data-ajax-mapping' => [
                        'section#test-1' => 'section#test-1 .alert-success',
                        'section#test-2' => 'section#test-2 .alert-success'
                    ],
                ];
            ?>

            <a class="btn btn-primary" href="/results.php" <?php createAjaxDataAttributes($ajax) ?>>Test example 2</a>
        </section>

        <section id="test-3">
            <hr class="mt-4">

            <h4><b>section#test-3</b>: Remove the element after the <kbd>POST</kbd> request</h4>
            <p><b>Expected result:</b> This example should disappear this section after you confirmed it.</p>
            <?php
                $ajax = [
                    'data-ajax' => 'spa',
                    'data-ajax-method' => 'POST',
                    'data-ajax-mapping' => [
                        'section#test-3' => 'null'
                    ],
                    'data-modal' => 'true',
                ];
            ?>

            <a class="btn btn-primary" href="/results.php" <?php createAjaxDataAttributes($ajax) ?>>Test example 3</a>
        </section>

        <section id="test-4">
            <hr class="mt-4">

            <h4><b>section#test-4</b>: Form <small>(method and url are handled via form attributes)</small></h4>
            <p><b>Expected result:</b> This example should submit the form and replace it with a nice hello message.</p>
            <?php
                $ajax = [
                    'data-ajax' => 'spa',
                    'data-ajax-mapping' => [
                        'section#test-4 form' => 'section#test-4 .result',
                    ],
                ];
            ?>

            <form method="POST" action="/results.php" <?php createAjaxDataAttributes($ajax) ?>>
                <label for="test-4-input">Name</label>
                <input id="test-4-input" class="form-control mb-3" type="text" name="test-input" value="John Doe">
                <button class="btn btn-primary mb-2" type="submit">Test example 4</button>
            </form>
        </section>
    </div>

    <div id="site-modals"></div>

    <script type="text/javascript" src="<?php echo $assets['assets/js/app.js'] ?>"></script>
</body>
</html>
