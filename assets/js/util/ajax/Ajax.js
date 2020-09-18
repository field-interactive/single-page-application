import { addDisabled, removeDisabled } from '../disable';

/**
 * Available options:
 *
 * options = {
 *      settings = {
 *          type: 'POST' || null,        // Type of request or [data-ajax-method] - default GET
 *          url: '/script' || null,      // Url for the request or form[action] or a[href] - default current url
 *          data: data || []             // Additional data to be send or serialized form - default []
 *      },
 *
 *      config = {
 *          callback: function() || null                // Custom callback function(resultData, ajaxInstance) - default null
 *          disable: element || [elements] || false,    // Set attribute disabled on certain element/s with [data-ajax-disable] - default event element
 *          updateUrl: true || false,                   // Updates the Url (history.pushState) with [data-ajax-update-url] - default false
 *          preventDefault: true || false               // Prevent event from default behaviour with [data-ajax-prevent-default]- default true
 *      }
 * }
 */
export class Ajax {

    constructor(el = null, ev = null, options = {}) {
        this.el = el;
        this.$el = $(this.el);
        this.ev = ev;
        this.settings = {};
        this.config = {};

        const settings = options.settings || {},
            config = options.config || {};

        // Default settings https://api.jquery.com/jquery.ajax/
        this.settings = {
            type: this.$el.attr('method') || this.$el.data('ajax-method') || 'GET',
            url: this.$el.attr('action') || this.$el.attr('href') || window.location.href,
            data: []
        };

        // Set data to serialized form data
        if (!settings.data && this.el && this.$el.prop('tagName').toLowerCase() === 'form') {
            this.settings.data = this.$el.serialize();
        }

        // Extend new settings object if form is a mulitpart form
        if (this.$el.attr('enctype') === 'multipart/form-data') {
            this.settings = Object.assign(this.settings, {
                data: new FormData(this.$el[0]),
                processData: false,
                contentType: false,
                cache: false,
                enctype: 'multipart/form-data'
            });
        }

        // Override settings defaults
        this.settings = Object.assign(this.settings, settings);

        // Behaviour and handling of the request
        this.config = {
            disable: this.$el.data('ajax-disable'),
            updateUrl: this.$el.data('ajax-update-url') || false,
            callback: null,
            preventDefault: this.$el.data('ajax-prevent-default') || true
        };

        if (this.config.disable !== false && this.el && this.$el.prop('tagName').toLowerCase() === 'form') { // Disable for form submit button
            this.config.disable = this.$el.find('button[type="submit"]');
        } else if (this.config.disable !== false) { // Disable for element (anchor or button)
            this.config.disable = this.el || false;
        }

        // Override config defaults
        this.config = Object.assign(this.config, config);

        if (this.config.preventDefault) {
            this.ev.preventDefault();
            this.ev.stopPropagation();
        }
    }

    execute() {
        addDisabled(this.config.disable);

        $.ajax(this.settings)
            .done((data, textStatus, jqXHR) => {
                // Redirect if header: App-Ajax-Redirect is set
                if (jqXHR.getResponseHeader('App-Ajax-Redirect')) {
                    location.href = jqXHR.getResponseHeader('App-Ajax-Redirect');
                    return;
                }

                this.handleResult(data);
            }).fail((XMLHttpRequest, textStatus, errorThrown) => {
                /** TODO: inform the user that something went wrong*/
                console.log(XMLHttpRequest, textStatus, errorThrown);
            }).always(() => {
                removeDisabled(this.config.disable);
            });
    }

    /** Handles the result data from the ajax request */
    handleResult(data) {
        if (this.config.updateUrl) {
            history.pushState(null, '', this.settings.url);
        }

        this.callback(data);
    }

    /** Execute custom callback with result of ajax and current instance */
    callback(data) {
        if (this.config.callback !== undefined && this.config.callback) {
            this.config.callback(data, this);
        }
    }
}
