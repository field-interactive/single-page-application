const ajax = _ => {

    $('body').on('click', 'a[data-ajax="spa"], button[data-ajax="spa"]', function(e) {
        e.preventDefault();

        import('./SinglePageAjax').then(({ SinglePageAjax }) => {
            let ajax = new SinglePageAjax(this, e);

            ajax.execute();
        }).catch(e => console.error(e));

    }).on('submit', 'form[data-ajax="spa"]', function(e) {
        e.preventDefault();

        import('./SinglePageAjax').then(({ SinglePageAjax }) => {
            let ajax = new SinglePageAjax(this, e);

            ajax.execute();
        }).catch(e => console.error(e));
    });
};

export { ajax };
