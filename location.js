import { writable } from 'svelte/store';

/*
// UNCOMMENT THIS IF YOU NEED TO HANDLE UNKNOWN PATHS BY REDIRECTING 404 RESPONSES
if (location.search.startsWith('?__spa__=')) {
	history.replaceState(null, '', decodeURIComponent(location.search.slice(9)));
}
*/

const { set, subscribe } = writable();

const update = () => set(location);

update();

document.addEventListener('click', event => {
	if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.which === 1) {
		const elm = event.target.closest('a');
		if (elm && !elm.target && !elm.download) {
			const url = elm.href;
			if (url.startsWith(location.origin + '/')) {
				event.preventDefault();
				history.pushState(null, '', url);
				update();
				document.body.scrollTop = document.documentElement.scrollTop = 0;
			}
		}
	}
});

addEventListener('popstate', update);

export default { subscribe };