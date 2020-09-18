<div class="container">

    <h1 class="mt-3">Ajax testing results</h1>

    <section id="test-1">
        <div class="alert-success p-2 mt-3">My new test content</div>
    </section>


    <section id="test-2">
        <div class="alert-success p-2 mt-3">Success for Test 2</div>
    </section>


    <section id="test-4">
        <div class="result">
            <?php if (!empty($_POST['test-input'])): ?>
                <strong>Hello: <?php echo $_POST['test-input'] ?></strong>
            <?php endif; ?>
        </div>
    </section>
</div>
