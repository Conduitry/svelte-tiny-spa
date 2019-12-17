// svelte-tiny-spa
// (c) 2019 Conduitry
// MIT

import { writable } from 'svelte/store';

let doc, loc, update, click_handler;

const { set, subscribe } = writable(null, () => {
	doc = document;
	loc = doc.location;
	/*
	// UNCOMMENT THIS IF YOU NEED TO HANDLE UNKNOWN PATHS BY REDIRECTING 404 RESPONSES
	if (loc.search.startsWith('?__spa__=')) {
		history.replaceState(null, '', decodeURIComponent(loc.search.slice(9)));
	}
	*/
	update();
	doc.addEventListener('click', click_handler);
	addEventListener('popstate', update);
	return () => {
		doc.removeEventListener('click', click_handler);
		removeEventListener('popstate', update);
	};
});

update = () => set(loc);

const goto = (url, replace) => {
	history[replace ? 'replaceState' : 'pushState'](null, '', url);
	update();
};

click_handler = event => {
	if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.defaultPrevented) {
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

const scroll = () => {
	scrollTo(0, 0);
	if (loc.hash) {
		loc.hash = loc.hash;
	}
};

export default { subscribe, goto, scroll };
