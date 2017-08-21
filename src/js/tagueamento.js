function Tracker(id) {
	this.id = id;
	this.cid = false;
	this.queue = [];
	this.page = encodeURIComponent('/panel');
	this.hostname = encodeURIComponent('www.dp6.com.br');
	this.title = encodeURIComponent('Roger Watcher');

	chrome.storage.sync.get('dp6_cid', items => {
		if (items.dp6_cid) {
			this.cid = items.dp6_cid;
		} else {
			this.cid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
			chrome.storage.sync.set({
				dp6_cid: this.cid
			});
		}
		this.queue.forEach(args => this.sendHit(...args));
		delete this.queue;
	});
}

Tracker.prototype.sendHit = function(params) {
	if (!this.cid) return this.queue.push(arguments);

	let payload = [
		'v=1', // Tag version
		`tid=${this.id}`,
		`cid=${this.cid}`,
		`sr=${screen.width}x${screen.height}`,
		`vp=${window.innerWidth}x${window.innerHeight}`,
		`sd=${screen.colorDepth}-bits`,
		`dh=${this.hostname}`,
		`dp=${this.page}`,
		`dt=${this.title}`,
		`cd1=${PUDIM.info.version}`,
		...params,
		`z=${(new Date() | 0)}`
	].join('&');

	navigator.sendBeacon('https://www.google-analytics.com/collect', payload);
	//new Image().src = 'https://www.google-analytics.com/collect?' + payload;
};

Tracker.prototype.set = function(param, value) {
	this[param] = value;
};

Tracker.prototype.pageview = function(page) {
	page = encodeURIComponent(page);
	this.sendHit(['t=pageview']);
};

Tracker.prototype.event = function(category, action, label, value) {
	category = encodeURIComponent(category || '');
	action = encodeURIComponent(action || '');
	label = encodeURIComponent(label || '');
	this.sendHit(['t=event', `ec=${category}`, `ea=${action}`, `el=${label}`, `ev=${value|0}`]);
};

Tracker.prototype.timing = function(category, variable, time, label) {
	category = encodeURIComponent(category || '');
	variable = encodeURIComponent(variable || '');
	label = encodeURIComponent(label || '');
	this.sendHit(['t=timing', `utc=${category}`, `utv=${variable}`, `utt=${time|0}`, `utl=${label}`]);
};

var ga = new Tracker('UA-3635138-29');
ga.pageview();

jQuery('#logo').mousedown(function() {
	ga.event('Cabeçalho', 'Clique', 'Logo');
});

jQuery('.filter').on('click', 'a', function() {
	var action = (jQuery(this).closest('li').hasClass('checked') ? 'Adicionar' : 'Remover') + ' filtro';
	ga.event('Cabeçalho', action, this.className);
});

jQuery('.clear-filter').on('click', function() {
	ga.event('Cabeçalho', 'Limpar Filtros', 'Limpar Filtros');
});

jQuery('.clear-report').on('click', function() {
	ga.event('Cabeçalho', 'Limpar Relatório', 'Limpar Relatório');
});

jQuery('#busca').on('change', function() {
	if (this.value) {
		ga.event('Cabeçalho', 'Busca', 'Busca');
		ga.pageview('/busca/?busca=' + this.value);
	}
});

PUDIM.panel.on('click', '.track', function() {
	var label = this.className.split(' ')[1];
	ga.event('Disparos', 'Detalhes', label);
});

PUDIM.panel.on('click', '.delete', function() {
	var track = jQuery(this).closest('.track')[0];
	ga.event('Disparos', 'Exclusão', track.className.split(' ')[1]);
});

window.onbeforeunload = function() {
	var time = parseInt(performance.now(), 10);
	ga.timing('Utilização', 'Tempo de Uso', time, time + 's');
	// ga.event('Time on Page(s)', parseInt(time/1000,10) + 's', '', parseInt(time/1000,10));
};