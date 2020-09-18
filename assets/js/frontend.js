import $ from 'jquery';
global.$ = global.jQuery = $;
import 'bootstrap';

import { ajax } from './util/ajax/init';

$(document).ready(function() {
    ajax();
});
