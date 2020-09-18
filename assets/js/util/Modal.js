import { removeDisabled } from './disable';

/**
 * Available options:
 *
 * options = {
 *     header: 'text',                             // Text for the headline or [data-modal-header]
 *     body: 'text',                               // Text for the body or [data-modal-body]
 *     cancel: 'text'                              // Text for the close / cancel button or [data-modal-cancel]
 *     ok: 'text',                                 // Text for the ok button or [data-modal-ok]
 *     id: 'id',                                   // The Id for the modal or [data-modal-id]
 *     class: 'class',                             // Additional class for the modal or [data-modal-class]
 *     callback: function() || null,               // A function to be executed after clicked modals ok button
 *     container: element                          // A container for the modal element or [data-modal-container]
 * }
 */
export class Modal {

    constructor(element = null, event = null, options = {}) {
        this.el = element;
        this.e = event;

        this.options = {
            header: $(this.el).data('modal-header') || 'Modal header',
            body: $(this.el).data('modal-body') || 'Modal body',
            cancel: $(this.el).data('modal-cancel') || 'Cancel',
            ok: $(this.el).data('modal-ok') || 'Confirm',
            id: $(this.el).data('modal-id') || 'modal-' + Math.floor(Math.random() * 100),
            class: $(this.el).data('modal-class') || '',
            callback: null,
            container: $(this.el).data('modal-container') || $('#site-modals'),
        };

        // Override settings defaults
        this.options = Object.assign(this.options, options);
    }

    show() {
        $(this.el).data('modal-id', this.options.id);

        let id = '#' + this.options.id;
        if ($(id).length === 0) {
            $(this.options.container).append(this.getHtml());
        }

        $(id).modal('show').on('hide.bs.modal', () => {
            removeDisabled(this.el);
        });

        $(id).find('[data-modal-ok]').on('click', () => {
            $(this.el).data('modal-confirmed', 'true');

            this.hide();
            this.callback();
        });
    }

    hide() {
        $('#' + this.options.id).modal('hide');
    }

    callback() {
        if (this.options.callback !== undefined && this.options.callback) {
            this.options.callback(this);
        }
    }

    getHtml() {
        return `
            <div id="${this.options.id}" class="modal ${this.options.class}" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${this.options.header}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="${this.options.cancel}">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>${this.options.body}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn on-light-bg" data-dismiss="modal">${this.options.cancel}</button>
                            <button type="button" class="btn on-light-bg submit" data-modal-ok>${this.options.ok}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
