class Tracker {
  constructor(id) {
    this.id = id;
    this.cid = null;
    this.queue = [];
    this.page = '/panel';
    this.hostname = 'roger.dp6.com.br';
    this.title = 'Roger Watcher';
    try {
      chrome.storage.sync.get('dp6_cid', items => {
        if (items.dp6_cid) {
          this.cid = items.dp6_cid;
        } else {
          this.cid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function(c) {
              var r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            }
          );
          chrome.storage.sync.set({
            dp6_cid: this.cid
          });
        }
        this.queue.forEach(args => this.sendHit(...args));
      });
    } catch ($$e) {
      console.error($$e);
    }
  }
  sendHit(params) {
    if (!this.cid) return this.queue.push(arguments);
    if (params.ev === 0) delete params.ev;
    const payload = RW.util.objectToQuery({
      v: 1,
      tid: this.id,
      cid: this.cid,
      sr: `${screen.width}x${screen.height}`,
      vp: `${window.innerWidth}x${window.innerHeight}`,
      sd: `${screen.colorDepth}-bits`,
      dh: this.hostname,
      dp: this.page,
      dt: this.title,
      cd1: RW.info.version,
      ...params,
      z: new Date() | 0
    });
    navigator.sendBeacon('https://www.google-analytics.com/collect', payload);
  }
  pageview(page) {
    if (page) this.page = page;
    this.sendHit({ t: 'pageview' });
  }
  event(ec = '', ea = '', el = '', ev = 0) {
    this.sendHit({
      t: 'event',
      ec,
      ea,
      el,
      ev: ev | 0
    });
  }
  timing(utc = '', utv = '', utt = 0, utl = '') {
    this.sendHit({
      t: 'timing',
      utc,
      utv,
      utt: utt | 0,
      utl
    });
  }
}

var ga = new Tracker('UA-3635138-29');
ga.pageview();

jQuery('#logo').mousedown(() => ga.event('Cabeçalho', 'Clique', 'Logo'));

jQuery('.filter').on('click', 'a', function() {
  const isChecked = this.closest('li').classList.contains('checked');
  var action = (isChecked ? 'Adicionar' : 'Remover') + ' filtro';
  ga.event('Cabeçalho', action, this.className);
});

jQuery('.clear-filter').on('click', () =>
  ga.event('Cabeçalho', 'Limpar Filtros', 'Limpar Filtros')
);

jQuery('.clear-report').on('click', () =>
  ga.event('Cabeçalho', 'Limpar Relatório', 'Limpar Relatório')
);

jQuery('#busca').on('change', function() {
  if (this.value) {
    ga.event('Cabeçalho', 'Busca', 'Busca');
    ga.pageview('/busca/?busca=' + this.value);
  }
});

RW.panel.on('click', '.track', function() {
  ga.event('Disparos', 'Detalhes', this.classList[1]);
});

RW.panel.on('click', '.delete', function() {
  var track = this.closest('.track');
  ga.event('Disparos', 'Exclusão', track.classList[1]);
});

window.onbeforeunload = function() {
  var time = (performance.now() / 1000) | 0;
  ga.timing('Utilização', 'Tempo de Uso', time, time + 's');
};
