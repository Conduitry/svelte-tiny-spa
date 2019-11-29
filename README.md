# svelte-tiny-spa

A tiny unframework for making SPAs in Svelte.

## Overview

This library intercepts clicks on internal links and turns them into `history.pushState()` calls. The browser's `location` object is exposed through a Svelte store, which updates upon these intercepted clicks or on other `popstate` events. It also optionally provides a mechanism for hosts which do not support falling back to `index.html` for missing files.

## Setup

If your host supports falling back to `index.html` for requests of all unknown files, you should use that feature. Copy [`location.js`](location.js) into your project, and you're done.

### If your host does not support falling back to `index.html`

You'll use a custom 404 page that redirects to the root and encodes the original URL is a query parameter. The root page then rewrites the URL with `history.replaceState()`.

Add [`404.html`](404.html) to your project at the appropriate path. Uncomment the lines at the top of [`location.js`](location.js) to handle the rewrite after the redirection.

## Usage

```js
import location from '.../location.js';
```

This is a Svelte store containing the `location` object, and updates whenever a link click is intercepted or a `popstate` event occurs.

Interception occurs when all of the following are met:

1. The link is same-origin
1. The link does not have a `target` attribute
1. The link does not have a `download` attribute
1. The link is left clicked
1. Ctrl/Cmd/Shift are not pressed when clicking the link

## License

[MIT](LICENSE)
