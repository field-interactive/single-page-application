const removeDisabled = (el) => {
    if (el) {
        let $el = $(el);

        if (typeof el[Symbol.iterator] === 'function') {
            $el.each(function () {
                $(this).removeClass('disabled');
                $(this).prop('disabled', false);
            });
        } else {
            $el.removeClass('disabled');
            $el.prop('disabled', false);
        }
    }
};

const addDisabled = (el) => {
    if (el) {
        let $el = $(el);

        if (typeof el[Symbol.iterator] === 'function') {
            $el.each(function () {
                $(this).addClass('disabled');
                $(this).prop('disabled', true);
            });
        } else {
            $el.addClass('disabled');
            $el.prop('disabled', true);
        }
    }
};

export { removeDisabled, addDisabled };
