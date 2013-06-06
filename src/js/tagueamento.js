function Tracker(id) {
	var tracker = this;
	tracker.id = id;
	tracker.cid = false;
	tracker.queue = [];
	tracker.domain = encodeURIComponent(document.location.hostname);
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
			tracker.sendhit.apply(tracker, hit);
		}
	});
}

Tracker.prototype.sendhit = function(hit) {
	if (!this.cid) {
		return this.queue.push(arguments);
	}
	hit = 'v=1&tid=' + this.id + '&cid=' + this.cid + '&' + hit;
	var img = document.createElement('img');
	img.src = 'https://www.google-analytics.com/collect?' + hit;
	// var xhr = new XMLHttpRequest();
	// xhr.open('POST', 'https://www.google-analytics.com/collect', true);
	// xhr.send(hit);
};

Tracker.prototype.set = function(param, value){
	this[param] = value;
};

Tracker.prototype.pageview = function(page) {
	page = encodeURIComponent(page);
	this.sendhit('t=pageview&dh=' + this.domain + '&dp=' + page + '&dt=' + this.title);
};

Tracker.prototype.event = function(category, action, label, value) {
	category = encodeURIComponent(category || '');
	action = encodeURIComponent(action || '');
	label = encodeURIComponent(label||'');
	value = encodeURIComponent(value||0);
	this.sendhit('t=event&ec=' + category + '&ea=' + action + '&el=' + label + '&ev=' + value);
};

Tracker.prototype.timing = function(category, variable, time, label) {
	category = encodeURIComponent(category || '');
	variable = encodeURIComponent(variable || '');
	time = encodeURIComponent(time||0);
	label = encodeURIComponent(label||'');
	this.sendhit('t=timing&utc=' + category + '&utv=' + variable + '&utt=' + time + '&utl=' + label);
};

var ga = new Tracker('UA-3635138-29');
ga.set('title', PUDIM.info.name + '@' + PUDIM.info.version);
ga.pageview('/' + PUDIM.info.name + '/' + PUDIM.info.version);

jQuery('#logo').mousedown(function(){
	ga.event('Cliques no Logo' ,'click');
});

jQuery('.filter').find('a').mousedown(function(){
	ga.event('utilização de filtros', this.className);
});

PUDIM.panel.on('click','.detail,.content',function(){
	var track = jQuery(this).closest('.track');
	ga.event('visualização de detalhes', track.data().type);
});

PUDIM.panel.on('click','.delete',function(){
	var track = jQuery(this).closest('.track');
	ga.event('exclusão de disparo', track.data().type);
});

window.onbeforeunload = window.onunload = function(){
	var time = parseInt(performance.now(),10);
	ga.timing('timing', 'range', time, 'total');
	// ga.event('Time on Page(s)', parseInt(time/1000,10) + 's', '', parseInt(time/1000,10));
};