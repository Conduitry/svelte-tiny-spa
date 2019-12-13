import { writable } from 'svelte/store';

let update, click_handler;

const { set, subscribe } = writable(null, () => {
	/*
	// UNCOMMENT THIS IF YOU NEED TO HANDLE UNKNOWN PATHS BY REDIRECTING 404 RESPONSES
	if (location.search.startsWith('?__spa__=')) {
		history.replaceState(null, '', decodeURIComponent(location.search.slice(9)));
	}
	*/
	update();
	document.addEventListener('click', click_handler);
	addEventListener('popstate', update);
	return () => {
		document.removeEventListener('click', click_handler);
		removeEventListener('popstate', update);
	};
});

update = () => set(location);

const goto = (url, replace) => {
	history[replace ? 'replaceState' : 'pushState'](null, '', url);
	update();
	if (!replace) {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}
};

click_handler = event => {
	if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.defaultPrevented) {
		const elm = event.target.closest('a');
		if (elm && elm.href && !elm.target && !elm.hasAttribute('download')) {
			const url = elm.href;
			if (
				url.startsWith(location.origin + '/') &&
				!url.startsWith(location.origin + location.pathname + location.search + '#')
			) {
				event.preventDefault();
				goto(url);
			}
		}
	}
};

export default { subscribe, goto };
