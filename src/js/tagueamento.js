function Tracker(id) {
	var tracker = this;
	tracker.id = id;
	tracker.cid = false;
	tracker.queue = [];
	tracker.hostname = encodeURIComponent(document.location.hostname);
	tracker.title = encodeURIComponent(document.title);

	chrome.storage.sync.get('dp6_cid', function(items){
		var hit;
		if (items.dp6_cid) {
			tracker.cid = items.dp6_cid;
		} else {
			tracker.cid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			    return v.toString(16);
			});
			chrome.storage.sync.set({dp6_cid: tracker.cid});
		}
		while (hit = tracker.queue.shift()) {
			tracker.sendHit.apply(tracker, hit);
		}
	});

}

Tracker.prototype.sendHit = function(params) {
	if (!this.cid) return this.queue.push(arguments);

	var basehit = ['v=1']; // Tag version
	basehit.push('tid=' + this.id); // Account ID
	basehit.push('cid=' + this.cid); // User ID (Unique, randomly generated)
	basehit.push('sr=' + screen.width + 'x' + screen.height); // Screen resolution
	basehit.push('vp=' + window.innerWidth + 'x' + window.innerHeight); // Viewport size
	basehit.push('sd=' + screen.colorDepth + '-bits'); // Color depth
	basehit.push(params);

	params = basehit.join('&') + '&z=' + (new Date()|0);

	document.createElement('img').src = 'https://www.google-analytics.com/collect?' + params;

	// var xhr = new XMLHttpRequest();
	// xhr.open('POST', 'https://www.google-analytics.com/collect', true);
	// xhr.send(hit);
};

Tracker.prototype.set = function(param, value){
	this[param] = value;
};

Tracker.prototype.pageview = function(page) {
	page = encodeURIComponent(page);
	this.sendHit('t=pageview&dh=' + this.hostname + '&dp=' + page + '&dt=' + this.title);
};

Tracker.prototype.event = function(category, action, label, value) {
	category = encodeURIComponent(category || '');
	action = encodeURIComponent(action || '');
	label = encodeURIComponent(label||'');
	value = encodeURIComponent(value||0);
	this.sendHit('t=event&ec=' + category + '&ea=' + action + '&el=' + label + '&ev=' + value);
};

Tracker.prototype.timing = function(category, variable, time, label) {
	category = encodeURIComponent(category || '');
	variable = encodeURIComponent(variable || '');
	time = encodeURIComponent(time||0);
	label = encodeURIComponent(label||'');
	this.sendHit('t=timing&utc=' + category + '&utv=' + variable + '&utt=' + time + '&utl=' + label);
};

var ga = new Tracker('UA-3635138-29');
ga.set('title', PUDIM.info.name + '@' + PUDIM.info.version);
ga.pageview('/' + PUDIM.info.name + '/' + PUDIM.info.version);

jQuery('#logo').mousedown(function(){
	ga.event('Cabeçalho', 'Clique', 'Logo');
});

jQuery('.filter').on('click', 'a', function(){
	var action = (jQuery(this).closest('li').hasClass('checked') ? 'Adicionar' : 'Remover') + ' filtro';
	ga.event('Cabeçalho', action, this.className);
});

jQuery('.clear').on('click', function(){
	ga.event('Cabeçalho', 'Limpar Filtros', 'Limpar Filtros');
});

jQuery('#busca').on('change', function(){
	ga.event('Cabeçalho', 'Busca', 'Busca');
});

PUDIM.panel.on('click','.track',function(){
	var label = this.className.split(' ')[1];
	ga.event('Disparos', 'Detalhes', label);
});

PUDIM.panel.on('click','.delete',function(){
	var track = jQuery(this).closest('.track')[0];
	ga.event('Disparos', 'Exclusão', track.className.split(' ')[1]);
});

window.onbeforeunload = function(){
	var time = parseInt(performance.now(),10);
	ga.timing('Utilização', 'Tempo de Uso', time, time + 's');
	// ga.event('Time on Page(s)', parseInt(time/1000,10) + 's', '', parseInt(time/1000,10));
};