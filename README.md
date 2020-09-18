JavaScript Single-Page-Application example
===========

This project is a simple alternative to heavier Single-Page-Application JavaScript Frameworks.

Or even simpler: 
> It's a script to update parts of your html with ajax.

Just like an even smaller [stimulus](https://github.com/stimulusjs/stimulus).

## Example 
### `index.html`
```html
<section id="test">
    <a href="/result.html" data-ajax="spa" data-ajax-mapping="section#test">Test example 1</a>
</section>
```
### `result.html`
```html
<section id="test">
    <p>My new test content</p>
</section>
```

## Options
Add the options directly to your `form` or `a` elements. The `action` or `href` respectively define the path to send the ajax requests.

### Single Page Ajax
- `data-ajax="spa"` required, this attribute is used as the listener
- `data-ajax-mapping="section#test"` optional, your mapping(s)
    - You can write only one selector or an array of selectors like:
        ```html
        data-ajax-mapping="section#test"
      
        data-ajax-mapping='{
            "section#test-1":"section#test-1",
            "section#test-2":"section#test-2 article",
            "section#test-3 img#brand":"section#test-3 aside div#logo"
        }'
        ```
    - The value "null" will remove the element:
        ```html      
        data-ajax-mapping='{
            "section#test":"null"
        }'
        ```
- `data-ajax-mode="replace || append || prepend"` optional, default is "replace"
- `data-ajax-method="GET || POST"` optional, default is "GET"
- `data-ajax-disable="button#test"` optional, default bpmthe current element, this disables a element for the execution time so it can not be triggered again
- `data-ajax-update-url="true || false"` optional, default is false, if it's true it updates the url in the browser history
- `data-ajax-prevent-default="true || false"` optional, default is  true, prevents from execution default browser behavior

## FAQ
### How to redirect and not replace anything?
- Send an `App-Ajax-Redirect` Header within your request with the redirect URL as its value

### How to execute a custom callback after the request succeeded?
- Define a new listener (anything other than `data-ajax="spa"`) in `init.js`
- Create a new instance with your custom callback and pass your options array like so
```js
$('body').on('click', 'a[data-ajax="custom-spa"]', function(e) {
    e.preventDefault();

    import('./SinglePageAjax').then(({ SinglePageAjax }) => {
        let options = {
            config: {
                callback: function(data, instance) {
                    console.log(data, instance);
                }
            }
        };

        let ajax = new SinglePageAjax(this, e, options);

        ajax.execute();
    }).catch(e => console.error(e));
})
```
