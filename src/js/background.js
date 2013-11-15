// var logs = {},
// 	runtimemessage = function runtimemessage(message, sender){
// 		if (message.name !== '_dp6.Pudim') return;
// 		console.log('runtimemessage', message, sender);
// 		if (!logs[message.id]) logs[message.id] = [];
// 		switch (message.type) {
// 			case 'newLog':
// 				logs[message.id].push(message.url);
// 			case 'clearLogs':
// 				logs[message.id].length = 0;
// 		}
// 	};

// chrome.runtime.onMessage.addListener(runtimemessage);

////////////////////////////////////////////////////////////////////////////////
// Funcionamento com requisições controladas pelo background
// var tabs = {},
// 	beforereq = function(details) {
// 		if (details.url.indexOf('google-analytics.com/collect') === -1) return;
// 		tabs[details.tabId] = tabs[details.tabId] || [];
// 		tabs[details.tabId].push(details);
// 		chrome.runtime.sendMessage(details);
// 	},
// 	runtimeconnect = function(port){
// 		console.log('runtimeconnect', port);
// 		if (port.name !== 'dp6_pudim') return;
// 		var tab = port.sender.tab.id;

// 		tabs[tab] = tabs[tab] || [];
// 		tabs[tab].forEach(function(details) {
// 			chrome.runtime.sendMessage(details);
// 		});
// 	},
// 	runtimemessage = function(message, sender){
// 		console.log('runtimemessage', message, sender);
// 		if (message.type === 'clear') {
// 			var tab = sender.tab.id;
// 			tabs[tab] = tabs[tab] || [];
// 			tabs[tab].length = 0;
// 		}
// 	};

// chrome.webRequest.onBeforeRequest.addListener(beforereq, {urls:["<all_urls>"]});
// chrome.runtime.onConnect.addListener(runtimeconnect);
// chrome.runtime.onMessage.addListener(runtimemessage);

////////////////////////////////////////////////////////////////////////////////
// Antigo Funcionamento
// var logs = [],
// 	log = function(details) {
// 		chrome.extension.sendMessage(details);
// 	},
// 	portlog = function(port){
// 		// chrome.webRequest.onBeforeRequest.removeListener(log);
// 		chrome.webRequest.onBeforeRequest.addListener(function(details){
// 			// chrome.extension.sendMessage(details);
// 			port.postMessage(details);
// 		},{urls:["<all_urls>"]});
// 	};
//
// chrome.webRequest.onBeforeRequest.addListener(log,{urls:["<all_urls>"]});
// chrome.extension.onConnect.addListener(portlog);
//
// chrome.browserAction.onClicked.addListener(function() {
// 	chrome.windows.create({'url': 'popup/popup.html', 'type': 'popup'}, function(window) { });
// }); 
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// AutoResponder (em Hold)
// var redirects,
// filter = function(type, query, url) {
// 	switch (type) {
// 		case 'exact': return url === query;
// 		case 'match': return url.indexOf(query) >= 0;
// 		case 'regex': return query.test(url);
// 	}
// };

// chrome.storage.sync.get('redirects', function(storage){
// 	if (typeof storage.redirects === 'undefined') {
// 		chrome.storage.sync.set({redirects: []});
// 		redirects = [{type: 'exact', query: 'http://digitalks.com.br/ga_dp6_tag_digitalks.js', redirect: chrome.extension.getURL('teste.js') }];
// 	} else {
// 		redirects = storage.redirects;
// 	}
// });

// chrome.webRequest.onBeforeRequest.addListener(function(details) {
// 	var obj = {};
// 	redirects.forEach(function(el, index, array) {
// 		if (filter(el.type, el.query, details.url)) {
// 			obj.redirectUrl = el.redirect;
// 		}
// 	});
// 	console.log(details.url, obj);
// 	return obj;
// },{urls:["<all_urls>"]}, ['blocking']);

// chrome.extension.onMessage.addListener(function(msg){
// 	if (msg.name === 'bacon-filter') {
// 		redirects.push(msg.filter);
// 		chrome.storage.sync.set({redirects: redirects});
// 	}
// })
////////////////////////////////////////////////////////////////////////////////