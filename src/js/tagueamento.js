class Tracker {
  constructor(id) {
    this.id = id;
    this.cid = null;
    this.queue = [];
    this.page = '/panel';
    this.hostname = 'roger.dp6.com.br';
    this.title = 'Roger Watcher';
  }

  async init() {
    const { dp6_cid } = await new Promise(resolve =>
      chrome.storage.sync.get('dp6_cid', items => resolve(items))
    );

    if (dp6_cid) {
      this.cid = dp6_cid;
    } else {
      this.cid = this.generateCid();
      await new Promise(resolve =>
        chrome.storage.sync.set({ dp6_cid: this.cid }, () => resolve())
      );
    }
    this.queue.forEach(args => this.sendHit(...args));
  }
  generateCid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
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
    const extra = page ? {} : { dp: page };
    this.sendHit({ t: 'pageview', ...extra });
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
ga.init();
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
  if (!this.value) return;
  ga.event('Cabeçalho', 'Busca', 'Busca');
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
