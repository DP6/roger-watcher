/* global jQuery: false, window: false, document: false, chrome: false */
var PUDIM = window.PUDIM = (function() {
	var info = chrome.runtime.getManifest(),
		notifier = jQuery({}),
		body = jQuery(document.body),
		panel = jQuery('#panel'),
		filter = jQuery('#filter'),
		busca = jQuery('#busca'),
		modules = {
			universal_analytics: {
				template: jQuery(document.getElementById('template-universal').innerHTML),
				parseByType: function (type, params) {
					var errors = [];

					if (type instanceof Array) {
						type = type.map.call(arguments, function(arr) {
							return modules.universal_analytics.parseByType.apply(null, arr);
						});
						errors = errors.concat.apply(errors, type);
					} else if (requiredParameters[type]) {
						requiredParameters[type].forEach(function(param) {
							if (params[param] === undefined) {
								errors.push(param);
							}
						});
					}

					return errors;
				},
				appendNewHit: function (obj) {
					var clone = this.template.clone();

					clone.addClass(obj.parameters.t).attr('data-qs', obj.queryString);
					// clone.addClass(params.t).data('qs', qs);
					clone.find('.label').addClass(obj.status);
					clone.find('.content').attr('title', obj.content).text(obj.content);
					clone.find('table.queryString').html(objectToRows(obj.parameters));
					panel.prepend(clone);
				},
				handler: function (url, content) {
					var qs = url.slice(url.indexOf('?') + 1),
						params = queryToObject(content || qs),
						label = '',
						status = 'ok',
						errors;

					switch (params.t) {
						case "pageview":
							if (params.dp) {
								label = (params.dh || "") + params.dp;
							} else {
								label = params.dl;
							}
							// color = "#3333CC";
							break;
						case "event":
							label = params.ec + "%20%3E%20" + params.ea + "%20%3E%20" + (params.el || '<empty>') + "%20%3E%20" + (params.ev || 0);
							// color = "#33CC33";
							break;
						case "transaction":
							label = "Trans: " + params.ti + "%20%3E%20" + params.tr;
							// color = "#CC33CC";
							break;
						case "item":
							label = params.iv + "%20%3E%20" + params['in'];
							// color = "#CC3380";
							break;
						case "social":
							label = params.sn + "%20%3E%20" + params.sa;
							// color = "#33CCCC";
							break;
						case "timing":
							label = params.utc + "%20%3E%20" + params.utv + "%20%3E%20" + params.utl + "%20%3E%20" + params.utt;
							// color = "#A66F00";
							break;
					}

					errors = this.parseByType(['all', params], [params.t, params]);

					if (commonRules.universal_analytics_url(url) === false) {
						errors.push(url);
					}

					if (errors.length) {
						status = 'error';
					}

					this.appendNewHit({
						parameters: params,
						queryString: qs,
						status: status,
						content: decode(label)
					});
					publish('newhit', url);

					if (panel.hasClass('filtrado') && panel.hasClass(params.t) === false) {
						panel.find();
					}
				}
			}
		},
		requiredParameters = {
			all: ['v', 't', 'cid', 'tid'],
			social: ['sn', 'sa', 'st'],
			transaction: ['ti'],
			item: ['ti', 'in']
		};

	function clear() {
		jQuery('.track').remove();
		busca.val('');
	}

	function publish(type, data) {
		notifier.trigger(type, data);
	}

	function subscribe(type, func) {
		notifier.on(type, func);
	}

	function queryToObject(url) {
		var obj = {};

		if (url[0] === '?') {
			url = url.slice(1);
		}

		url.split('&').forEach(function(value) {
			var param = value.split('=');
			obj[param[0]] = param[1];
		});

		return obj;
	}

	function objectToQuery(obj) {
		var key, url = [];
		for (key in obj) {
			if (typeof obj[key] === 'object' && obj.hasOwnProperty(key)) {
				url.push(key + '=' + obj[key]);
			}
		}
		return url.join('&');
	}

	function objectToRows(obj) {
		var html = [],
			metadata = window.metadata.universal_analytics,
			key;
		for (key in obj) {
			if (key[0] !== '_' && obj.hasOwnProperty(key)) {
				html.push('<td class="key" title="' + key + '">' + (metadata[key] ? metadata[key].name : key) + '</td><td class="value" title="' + obj[key] + '">' + decode(obj[key]) + '</td>');
			}
		}
		return html.length ? '<tr>' + html.join('</tr><tr>') + '</tr>' : '';
	}

	function decode(str) {
		try {
			return decodeURIComponent(str);
		} catch ($$e) {
			return unescape(str);
		}
	}

	function init(request) {
		let url = request.request.url;
		if (commonRules.universal_analytics(url)) {
			if (request.request.method === "GET") {
				modules.universal_analytics.handler(url);
			} else {
				request.request.postData.text.split('\n').forEach(row => modules.universal_analytics.handler(url, row));
			}
			if (autoscroll) autoscroll();
		}
	}

	function autoscroll() {
		body.stop(true, true).animate({
			scrollTop: panel.height()
		}, 'slow');
	}

	// Retorna o PUDIM!
	return {
		init: init,
		body: body,
		filter: filter,
		busca: busca,
		panel: panel,
		modules: modules,
		clear: clear,
		info: info,
		util: {
			queryToObject: queryToObject,
			objectToQuery: objectToQuery,
			pub: publish,
			sub: subscribe
		}
	};
}());

chrome.devtools.network.onRequestFinished.addListener(PUDIM.init);