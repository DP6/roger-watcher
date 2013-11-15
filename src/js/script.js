/* global jQuery: false, window: false, document: false, chrome: false */
var PUDIM = window.PUDIM = (function(){
	var notifier, body, panel, modules, commonRules, requiredParameters, metadata, info;

	notifier = jQuery({});

	body = jQuery(document.body);

	panel = jQuery("#panel");

	function clear(){
		jQuery('.track').remove();
	}

	function publish(type, data) {
		notifier.trigger(type, data);
	}

	function subscribe(type, func) {
		notifier.on(type, func);
	}

	function queryToObject(url) {
		var obj = {};

		if (url.charAt(0) === '?') {
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
			if (!obj.hasOwnProperty(key) || typeof obj[key] === 'object') return;
			url.push(key + '=' + obj[key]);
		}
		return url.join('&');
	}

	function init(details) {
		var url = details.request.url;
		if (commonRules.universal_analytics(url)) {
			modules.universal_analytics.handler(url);
			if (autoscroll) autoscroll();
		}
	}

	function autoscroll(){
		body.stop(true, true).animate({scrollTop: panel.height()}, 'slow');
	}

	modules = {
		universal_analytics: {
			template: jQuery(document.getElementById('template-universal').outerHTML),
			parseByType: function parseByType(type, params) {
				var errors = [];
				if (requiredParameters[type]) {
					requiredParameters[type].forEach(function(param){
						if (params[param] === undefined) {
							errors.push(param);
						}
					});
				}
				return errors;
			},
			appendNewHit: function appendNewHit(params, qs, status, content, metadata){
				var clone = this.template.clone();
				clone.addClass(params.t).attr('data-qs', qs);
				// clone.addClass(params.t).data('qs', qs);
				clone.find('.label').addClass(status);
				clone.find('.content').text(content).attr('title', content);
				clone.find('table.queryString').html((function(){
					var html = '', param;
					for (param in params) {
						if (param.charAt(0) === '_' || !params.hasOwnProperty(param)) continue;
						html += '<tr>';
						html += '<td class="key" title="' + param + '">' + (metadata[param] && metadata[param].name || param) + '</td>';
						html += '<td class="value" title="' + params[param] + '">' + decodeURIComponent(params[param]) + '</td>';
						html += '</tr>';
					}
					return html;
				}()));
				panel.append(clone);
			},
			handler: function handler(url) {
				var qs = url.slice(url.indexOf('?') + 1),
					params = queryToObject(qs),
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

				errors = this.parseByType('all', params);
				errors.concat(this.parseByType(params.t, params));

				if (errors.length) {
					status = 'error';
				}

				this.appendNewHit(params, qs, status, decodeURIComponent(label), metadata.universal_analytics);
				publish('newhit', url);

				// if (panel.hasClass('filtrado') && !panel.hasClass(params.t)) {
				// 	alguma coisa com o tipo excluido
				// }
			}
		}
	};

	commonRules = {
		universal_analytics: function(url) {
			return url.indexOf('google-analytics.com/collect') >= 0;
		},
		integer : function(value) {
			return (value === String(parseInt(value, 10)));
		},
		string : function(value, length) {
			return ( typeof value === 'string' && value.length <= (length || 2048));
		},
		boolean : function(value) {
			return (value === "0" || value === "1");
		},
		currency : function(value) {
			return (value === String(parseFloat(value, 10)));
		},
		session : function(value) {
			return (value === "start" || value === "end");
		},
		trackingID : function(value) {
			return (/^UA\-\d+\-\d{1,2}$/.test(value));
		},
		hit : function(value) {
			return (value === 'pageview' || value === 'appview' || value === 'event' || value === 'transaction' || value === 'item' || value === 'social' || value === 'exception' || value === 'timing');
		}
	};

	requiredParameters = {
		all: ['v', 't', 'cid', 'tid'],
		social: ['sn', 'sa', 'st'],
		transaction: ['ti'],
		item: ['ti', 'in']
	};

	// MetaData
	// Minificado, o original está em old/metadata.js
	/**
	 * GA Live Log v1
	 * @fabiophms - http://phms.com.br/
	 * 2013
	 */
	metadata={universal_analytics:{t:{name:'hit type',required:true,rule:commonRules.hit},ni:{name:'non interaction',rule:commonRules.boolean},dl:{name:'location'},dh:{name:'hostname',length:100,rule:commonRules.string},dp:{name:'page',length:2048,rule:commonRules.string},dt:{name:'title',length:1500,rule:commonRules.string},cd:{name:'description',length:2048,rule:commonRules.string},cg0:{name:'content group 0',length:100,rule:commonRules.string},cg1:{name:'content group 1',length:100,rule:commonRules.string},cg2:{name:'content group 2',length:100,rule:commonRules.string},cg3:{name:'content group 3',length:100,rule:commonRules.string},cg4:{name:'content group 4',length:100,rule:commonRules.string},cg5:{name:'content group 5',length:100,rule:commonRules.string},cg6:{name:'content group 6',length:100,rule:commonRules.string},cg7:{name:'content group 7',length:100,rule:commonRules.string},cg8:{name:'content group 8',length:100,rule:commonRules.string},cg9:{name:'content group 9',length:100,rule:commonRules.string},ec:{name:'event category',length:150,rule:commonRules.string},ea:{name:'event action',length:500,rule:commonRules.string},el:{name:'event label',length:500,rule:commonRules.string},ev:{name:'event value',rule:commonRules.integer},ti:{name:'transaction id',length:500,rule:commonRules.string},ta:{name:'affiliation',length:500,rule:commonRules.string},tr:{name:'revenue',rule:commonRules.currency},ts:{name:'shipping',rule:commonRules.currency},tt:{name:'tax',rule:commonRules.currency},ip:{name:'item price',rule:commonRules.currency},iq:{name:'item quantity',rule:commonRules.integer},ic:{name:'item code',length:500,rule:commonRules.string},'in':{name:'item name',length:500,rule:commonRules.string},iv:{name:'item category',length:500,rule:commonRules.string},sa:{name:'social action',length:50,rule:commonRules.string},sn:{name:'social network',length:50,rule:commonRules.string},st:{name:'social target',length:2048,rule:commonRules.string},utc:{name:'timing category',length:150,rule:commonRules.string},utv:{name:'timing variable',length:500,rule:commonRules.string},utt:{name:'timing time',rule:commonRules.integer},utl:{name:'timing label',length:500,rule:commonRules.string},plt:{name:'page load time',rule:commonRules.integer},dns:{name:'dns time',rule:commonRules.integer},pdt:{name:'page download time',rule:commonRules.integer},rrt:{name:'redirect response time',rule:commonRules.integer},tcp:{name:'tcp connect time',rule:commonRules.integer},srt:{name:'server response time',rule:commonRules.integer},cd0:{name:'dimension 0',length:150,rule:commonRules.string},cd1:{name:'dimension 1',length:150,rule:commonRules.string},cd2:{name:'dimension 2',length:150,rule:commonRules.string},cd3:{name:'dimension 3',length:150,rule:commonRules.string},cd4:{name:'dimension 4',length:150,rule:commonRules.string},cd5:{name:'dimension 5',length:150,rule:commonRules.string},cd6:{name:'dimension 6',length:150,rule:commonRules.string},cd7:{name:'dimension 7',length:150,rule:commonRules.string},cd8:{name:'dimension 8',length:150,rule:commonRules.string},cd9:{name:'dimension 9',length:150,rule:commonRules.string},cm0:{name:'metric 0',rule:commonRules.integer},cm1:{name:'metric 1',rule:commonRules.integer},cm2:{name:'metric 2',rule:commonRules.integer},cm3:{name:'metric 3',rule:commonRules.integer},cm4:{name:'metric 4',rule:commonRules.integer},cm5:{name:'metric 5',rule:commonRules.integer},cm6:{name:'metric 6',rule:commonRules.integer},cm7:{name:'metric 7',rule:commonRules.integer},cm8:{name:'metric 8',rule:commonRules.integer},cm9:{name:'metric 9',rule:commonRules.integer},dr:{name:'referrer',length:2048,rule:commonRules.string},cn:{name:'campaign name',length:100,rule:commonRules.string},cs:{name:'campaign source',length:100,rule:commonRules.string},cm:{name:'campaign medium',length:50,rule:commonRules.string},ck:{name:'campaign keyword',length:500,rule:commonRules.string},cc:{name:'campaign content',length:500,rule:commonRules.string},ci:{name:'campaign id',length:100,rule:commonRules.string},gclid:{name:'adwords id'},dclid:{name:'display ads id'},cid:{name:'client id'},a:{name:'session'},sc:{name:'session control',rule:commonRules.session},v:{name:'protocol version'},tid:{name:'web property id',rule:commonRules.trackingID},aip:{name:'anonymize ip',rule:commonRules.boolean},qt:{name:'queue time',rule:commonRules.integer},z:{name:'cache buster'},sr:{name:'resolution',length:20,rule:commonRules.string},vp:{name:'viewport size',length:20,rule:commonRules.string},sd:{name:'screen colors',length:20,rule:commonRules.string},de:{name:'encoding',length:20,rule:commonRules.string},ul:{name:'language',length:20,rule:commonRules.string},je:{name:'java enabled',rule:commonRules.boolean},fl:{name:'flash version',length:20,rule:commonRules.string},an:{name:'app name',length:100,rule:commonRules.string},av:{name:'app version',length:100,rule:commonRules.string},exd:{name:'exception description',length:150,rule:commonRules.string},exf:{name:'exception fatal',rule:commonRules.boolean}}};

	// Retorna o PUDIM!
	return {
		init: init,
		body: body,
		panel: panel,
		modules: modules,
		clear: clear,
		info: chrome.runtime.getManifest(),
		util: {
			queryToObject: queryToObject,
			objectToQuery: objectToQuery,
			pub: publish,
			sub: subscribe
		}
	};
}());

chrome.devtools.network.onRequestFinished.addListener(PUDIM.init);