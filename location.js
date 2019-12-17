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
	if (!replace) {
		doc.body.scrollTop = doc.documentElement.scrollTop = 0;
	}
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

export default { subscribe, goto };
