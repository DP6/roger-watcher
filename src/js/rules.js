window.commonRules = {
  regex: {
    universal_analytics_url: /^https?:\/\/(www\.)?google-analytics.com\/collect\??/i,
    trackingID: /^UA\-\d+\-\d{1,2}$/,
    hitType: /^(pageview|appview|event|transaction|item|social|exception|timing)$/
  },
  universal_analytics: url => url.indexOf('google-analytics.com/collect') >= 0,
  universal_analytics_url(url) {
    return this.regex.universal_analytics_url.test(url);
  },
  integer: value => value === String(parseInt(value, 10)),
  string: (value, length) =>
    typeof value === 'string' && value.length <= (length || 2048),
  boolean: value => value === '0' || value === '1',
  currency: value => value === String(parseFloat(value, 10)),
  session: value => value === 'start' || value === 'end',
  trackingID(value) {
    return this.regex.trackingID.test(value);
  },
  hit(value) {
    return value.match(this.hitType);
  }
};
