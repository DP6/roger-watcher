window.commonRules = {
	regex: {
		universal_analytics_url: /^https?:\/\/(www\.)?google-analytics.com\/collect\??/i,
		trackingID: /^UA\-\d+\-\d{1,2}$/
	},
	universal_analytics: function(url) {
		return url.indexOf('google-analytics.com/collect') >= 0;
	},
	universal_analytics_url: function(url) {
		return this.regex.universal_analytics_url.test(url);
	},
	integer: function(value) {
		return value === String(parseInt(value, 10));
	},
	string: function(value, length) {
		return typeof value === 'string' && value.length <= (length || 2048);
	},
	boolean: function(value) {
		return value === "0" || value === "1";
	},
	currency: function(value) {
		return value === String(parseFloat(value, 10));
	},
	session: function(value) {
		return value === "start" || value === "end";
	},
	trackingID: function(value) {
		return this.regex.trackingID.test(value);
	},
	hit: function(value) {
		return ['pageview', 'appview', 'event', 'transaction', 'item', 'social', 'exception', 'timing'].indexOf(value) >= 0;
	}
};