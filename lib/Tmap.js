(function(root, factory) {

	if (root === null) {
		throw new Error('qqmap package can be used only in browser');
	}

	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.TMapsLoader = factory();
	}

})(typeof window !== 'undefined' ? window : null, function() {


	'use strict';


	var qqmapVersion = '2.exp';

	var script = null;

	var qqmap = null;

	var loading = false;

	var callbacks = [];

	var onLoadEvents = [];

	var originalCreateLoaderMethod = null;


	var TMapsLoader = {};


	TMapsLoader.URL = 'https://map.qq.com/api/js';

	TMapsLoader.KEY = null;

	TMapsLoader.LIBRARIES = [];

	TMapsLoader.CLIENT = null;

	TMapsLoader.CHANNEL = null;

	TMapsLoader.LANGUAGE = null;

	TMapsLoader.REGION = null;

	TMapsLoader.VERSION = qqmapVersion;

	TMapsLoader.WINDOW_CALLBACK_NAME = '__qqmap_maps_api_provider_initializator__';


	TMapsLoader._qqmapMockApiObject = {};


	TMapsLoader.load = function(fn) {
		if (qqmap === null) {
			if (loading === true) {
				if (fn) {
					callbacks.push(fn);
				}
			} else {
				loading = true;

				window[TMapsLoader.WINDOW_CALLBACK_NAME] = function() {
					ready(fn);
				};

				TMapsLoader.createLoader();
			}
		} else if (fn) {
			fn(qqmap);
		}
	};


	TMapsLoader.createLoader = function() {
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = TMapsLoader.createUrl();

		document.body.appendChild(script);
	};


	TMapsLoader.isLoaded = function() {
		return qqmap !== null;
	};


	TMapsLoader.createUrl = function() {
		var url = TMapsLoader.URL;

		url += '?callback=' + TMapsLoader.WINDOW_CALLBACK_NAME;

		if (TMapsLoader.KEY) {
			url += '&key=' + TMapsLoader.KEY;
		}

		if (TMapsLoader.LIBRARIES.length > 0) {
			url += '&libraries=' + TMapsLoader.LIBRARIES.join(',');
		}

		if (TMapsLoader.CLIENT) {
			url += '&client=' + TMapsLoader.CLIENT;
		}

		if (TMapsLoader.CHANNEL) {
			url += '&channel=' + TMapsLoader.CHANNEL;
		}

		if (TMapsLoader.LANGUAGE) {
			url += '&language=' + TMapsLoader.LANGUAGE;
		}

		if (TMapsLoader.REGION) {
			url += '&region=' + TMapsLoader.REGION;
		}

		if (TMapsLoader.VERSION) {
			url += '&v=' + TMapsLoader.VERSION;
		}

		return url;
	};


	TMapsLoader.release = function(fn) {
		var release = function() {
			TMapsLoader.KEY = null;
			TMapsLoader.LIBRARIES = [];
			TMapsLoader.CLIENT = null;
			TMapsLoader.CHANNEL = null;
			TMapsLoader.LANGUAGE = null;
			TMapsLoader.REGION = null;
			TMapsLoader.VERSION = qqmapVersion;

			qqmap = null;
			loading = false;
			callbacks = [];
			onLoadEvents = [];

			if (typeof window.qqmap !== 'undefined') {
				delete window.qqmap;
			}

			if (typeof window[TMapsLoader.WINDOW_CALLBACK_NAME] !== 'undefined') {
				delete window[TMapsLoader.WINDOW_CALLBACK_NAME];
			}

			if (originalCreateLoaderMethod !== null) {
				TMapsLoader.createLoader = originalCreateLoaderMethod;
				originalCreateLoaderMethod = null;
			}

			if (script !== null) {
				script.parentElement.removeChild(script);
				script = null;
			}

			if (fn) {
				fn();
			}
		};

		if (loading) {
			TMapsLoader.load(function() {
				release();
			});
		} else {
			release();
		}
	};


	TMapsLoader.onLoad = function(fn) {
		onLoadEvents.push(fn);
	};


	TMapsLoader.makeMock = function() {
		originalCreateLoaderMethod = TMapsLoader.createLoader;

		TMapsLoader.createLoader = function() {
			window.qqmap = TMapsLoader._qqmapMockApiObject;
			window[TMapsLoader.WINDOW_CALLBACK_NAME]();
		};
	};


	var ready = function(fn) {
		var i;

		loading = false;

		if (qqmap === null) {
			qqmap = window.qqmap;
		}

		for (i = 0; i < onLoadEvents.length; i++) {
			onLoadEvents[i](qqmap);
		}

		if (fn) {
			fn(qqmap);
		}

		for (i = 0; i < callbacks.length; i++) {
			callbacks[i](qqmap);
		}

		callbacks = [];
	};


	return TMapsLoader;

});
