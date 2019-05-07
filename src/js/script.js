/* global jQuery: false, window: false, document: false, chrome: false */
var RW = (window.RW = (function() {
  const info = chrome.runtime.getManifest();
  const notifier = jQuery({});
  const body = jQuery(document.body);
  const panel = jQuery('#panel');
  const filter = jQuery('#filter');
  const busca = jQuery('#busca');
  const requiredParameters = {
    all: ['v', 't', 'cid', 'tid'],
    social: ['sn', 'sa', 'st'],
    transaction: ['ti'],
    item: ['ti', 'in']
  };
  const modules = {
    universal_analytics: {
      template: jQuery(jQuery('#template-universal').html()),
      parseByType(type, params) {
        if (type instanceof Array) {
          return Array.from(arguments).map(arr =>
            modules.universal_analytics.parseByType.apply(null, arr)
          );
        } else if (requiredParameters[type]) {
          return requiredParameters[type].filter(
            param => params[param] === undefined
          );
        }

        return [];
      },
      appendNewHit(obj) {
        var clone = this.template.clone();

        clone.addClass(obj.parameters.t).data('qs', obj.queryString);
        clone.find('.label').addClass(obj.status);
        clone
          .find('.content')
          .attr('title', obj.content)
          .text(obj.content);
        clone.find('table.queryString').html(objectToRows(obj.parameters));
        panel.append(clone);
        if (RW.autoscroll) clone.get(0).scrollIntoView({behavior: 'smooth'});
      },
      handler(url = '', qs = url.slice(url.indexOf('?') + 1)) {
        const params = queryToObject(decode(qs));
        let status = 'ok';
        let content = '';

        switch (params.t) {
          case 'pageview':
            if (params.dp) {
              content = (params.dh || '') + params.dp;
            } else {
              content = params.dl;
            }
            // color = "#3333CC";
            break;
          case 'event':
            content = [params.ec, params.ea, params.el]
              .map(val => val || '<empty>')
              .join(' > ');
            // color = "#33CC33";
            break;
          case 'transaction':
            content = `Trans: ${params.ti} > ${params.tr}`;
            // color = "#CC33CC";
            break;
          case 'item':
            content = `${params.iv} > ${params.in}`;
            // color = "#CC3380";
            break;
          case 'social':
            content = `${params.sn} > ${params.sa}`;
            // color = "#33CCCC";
            break;
          case 'timing':
            content = [params.utc, params.utv, params.utl, params.utt].join(
              ' > '
            );
            // color = "#A66F00";
            break;
        }

        const errors = this.parseByType(
          ['all', params],
          [params.t, params]
        ).filter(error => error.length > 0);

        if (commonRules.universal_analytics_url(url) === false) {
          errors.push(url);
        }

        if (errors.length) {
          status = 'error';
        }

        this.appendNewHit({
          parameters: params,
          queryString: qs,
          status,
          content
        });

        publish('newhit', url);

        if (panel.hasClass('filtrado') && !panel.hasClass(params.t)) {
          panel.find();
        }
      }
    }
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

  function queryToObject(url = '') {
    if (url.startsWith('?')) {
      url = url.slice(1);
    }

    return url.split('&').reduce((acc, next) => {
      var [key, ...val] = next.split('=');
      acc[key] = val.join('=');
      return acc;
    }, {});
  }

  function objectToQuery(obj) {
    return Object.keys(obj)
      .reduce((acc, next) => acc.concat(`${next}=${obj[next]}`), [])
      .join('&');
  }

  function objectToRows(obj) {
    const metadata = window.metadata.universal_analytics;
    const html = Object.keys(obj)
      .filter(key => !key.startsWith('_'))
      .map(key => {
        const keyName = metadata[key] ? metadata[key].name : key;
        return `<td class="key" title="${key}">${keyName}</td>
					<td class="value" title="${obj[key]}">${decode(obj[key])}</td>`;
      });
    return html.length ? '<tr>' + html.join('</tr><tr>') + '</tr>' : '';
  }

  function decode(str) {
    try {
      return decodeURIComponent(str);
    } catch ($$e) {
      return unescape(str);
    }
  }

  function init({ request: { url, method, postData } }) {
    if (commonRules.universal_analytics(url)) {
      if (method === 'GET') {
        modules.universal_analytics.handler(url);
      } else {
        postData.text
          .split('\n')
          .forEach(row => modules.universal_analytics.handler(url, row));
      }
    }
  }

  function doScroll() {
    body.stop(true, true).animate(
      {
        scrollTop: panel.height()
      },
      'slow'
    );
  }

  // Retorna o PUDIM!
  return {
    init,
    body,
    filter,
    busca,
    panel,
    modules,
    clear,
    info,
    autoscroll: true,
    util: {
      queryToObject,
      objectToQuery,
      pub: publish,
      sub: subscribe
    }
  };
})());

chrome.devtools.network.onRequestFinished.addListener(RW.init);
