// svelte-tiny-spa
// (c) 2019 Conduitry
// MIT

import { writable } from 'svelte/store';

let doc, loc, click_handler, popstate_handler, is_nav;

const { set, subscribe } = writable(null, () => {
	doc = document;
	loc = doc.location;
	/*
	// UNCOMMENT THIS IF YOU NEED TO HANDLE UNKNOWN PATHS BY REDIRECTING 404 RESPONSES
	if (loc.search.startsWith('?__spa__=')) {
		history.replaceState(null, '', decodeURIComponent(loc.search.slice(9)));
	}
	*/
	set(loc);
	doc.addEventListener('click', click_handler);
	addEventListener('popstate', popstate_handler);
	return () => {
		doc.removeEventListener('click', click_handler);
		removeEventListener('popstate', popstate_handler);
	};
});

const goto = (url, replace) => {
	is_nav = true;
	history[replace ? 'replaceState' : 'pushState'](null, '', url);
	set(loc);
};

click_handler = event => {
	if (event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.defaultPrevented) {
		const elm = event.target.closest('a');
		if (elm && elm.href && !elm.target && !elm.hasAttribute('download')) {
			const url = elm.href;
			if (url.startsWith(loc.origin + '/') && !url.startsWith(loc.origin + loc.pathname + loc.search + '#')) {
				event.preventDefault();
				goto(url);
			}
		}
	}
};

popstate_handler = () => {
	is_nav = false;
	set(loc);
};

const done = () => {
	if (is_nav) {
		scrollTo(0, 0);
		if (loc.hash) {
			loc.hash = loc.hash;
		}
	}
};

export default { subscribe, goto, done };
