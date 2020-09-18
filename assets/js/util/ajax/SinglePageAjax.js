import { addDisabled } from '../disable';
import { Modal } from '../Modal';
import { Ajax } from './Ajax';

/**
 * Available options:
 *
 * options = {
 *      config = {
 *          mapping: element || {                       // Single element which is source and target at once
 *              sourceElement: targetElement,           // Or an array of mappings: key => source : value => target
 *              furtherSource: furtherTarget,           // configure with [data-ajax-mapping]
 *              furtherSource: 'null'                   // Element gets removed
 *          } || null,                                  // Default null (nothing gets updated)
 *          mode: 'replace' || 'append' || 'prepend',   // Mode how to handle mappings with [data-ajax-mode] - default replace
 *      }
 * }
 */
export class SinglePageAjax extends Ajax {

    constructor(el = null, ev = null, options = {}) {
        super(el, ev, options);

        const config = options.config || {};

        // Behaviour and handling of the request
        this.config.mapping = config.mapping || $(this.el).data('ajax-mapping') || null;
        this.config.mode = config.mode || $(this.el).data('ajax-mode') || 'replace';
    }

    execute() {
        addDisabled(this.config.disable);

        if ($(this.el).data('modal') && !$(this.el).data('modal-confirmed')) {
            let modal = new Modal(this.el, this.e, {
                callback: () => {
                    let ajax = new SinglePageAjax(this.el, this.e);

                    ajax.execute();
                }
            });

            modal.show();

            return;
        }

        super.execute();
    }

    handleResult(data) {
        // Filter finds node on the root level but not on levels below
        let scriptsRoot = $(data).filter('script');
        $(data).filter('script').remove();
        // Find does not find nodes on the root level but on levels below
        let scriptsNested = $(data).find('script');
        $(data).find('script').remove();

        let html = $.parseHTML($.trim(data));
        let scripts = $.merge(scriptsRoot, scriptsNested);

        let mapping = this.config.mapping;
        if (mapping) {
            if (typeof mapping === 'string') {
                this.handleMapping(mapping, mapping, html);
            } else if (typeof mapping === 'object') {
                for (let source in mapping) {
                    if (mapping.hasOwnProperty(source)) {
                        this.handleMapping(source, mapping[source], html);
                    }
                }
            }
        }

        // Only execute scripts if a partial html was returned
        // otherwise all the app.js scripts would be included and executed again
        // see https://stackoverflow.com/questions/14423257/find-body-tag-in-an-ajax-html-response why we search with string methods
        if (data.indexOf('</body>') === -1) {
            $(scripts).each(function () {
                $('body').append(this);
            });
        }

        super.handleResult(data);
    }

    /** @internal Use of handling the html result from the ajax request */
    handleMapping(source, target, html) {
        if (target === 'null') {
            $(source).fadeOut(500, function () { $(this).remove(); });
            return;
        }

        let mode = this.config.mode,
            targetHtml = $(html).find(target);

        if ($(source).length > 1) {
            $(source).each(function(index) {
                if (mode === 'prepend') {
                    $(this).prepend(targetHtml.get(index));
                } else if (mode === 'append') {
                    $(this).append(targetHtml.get(index));
                } else {
                    $(this).replaceWith(targetHtml.get(index));
                }
            });
        } else {
            if (mode === 'prepend') {
                $(source).prepend(targetHtml);
            } else if (mode === 'append') {
                $(source).append(targetHtml);
            } else {
                $(source).replaceWith(targetHtml);
            }
        }
    }
}
