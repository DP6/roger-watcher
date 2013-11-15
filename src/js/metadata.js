window.metadata = {
	universal_analytics: {
		// Hit
		t: {
			name: 'hit type',
			required: true,
			rule: commonRules.hit
		},
		ni: {
			name: 'non interaction',
			rule: commonRules.boolean
		},

		// Content Information
		dl: {
			name: 'location'
		},
		dh: {
			name: 'hostname',
			length: 100,
			rule: commonRules.string
		},
		dp: {
			name: 'page',
			length: 2048,
			rule: commonRules.string
		},
		dt: {
			name: 'title',
			length: 1500,
			rule: commonRules.string
		},
		cd: {
			name: 'description',
			length: 2048,
			rule: commonRules.string
		},
		cg0: {
			name: 'content group 0',
			length: 100,
			rule: commonRules.string
		},
		cg1: {
			name: 'content group 1',
			length: 100,
			rule: commonRules.string
		},
		cg2: {
			name: 'content group 2',
			length: 100,
			rule: commonRules.string
		},
		cg3: {
			name: 'content group 3',
			length: 100,
			rule: commonRules.string
		},
		cg4: {
			name: 'content group 4',
			length: 100,
			rule: commonRules.string
		},
		cg5: {
			name: 'content group 5',
			length: 100,
			rule: commonRules.string
		},
		cg6: {
			name: 'content group 6',
			length: 100,
			rule: commonRules.string
		},
		cg7: {
			name: 'content group 7',
			length: 100,
			rule: commonRules.string
		},
		cg8: {
			name: 'content group 8',
			length: 100,
			rule: commonRules.string
		},
		cg9: {
			name: 'content group 9',
			length: 100,
			rule: commonRules.string
		},

		// "Event Tracking"
		ec: {
			name: 'event category',
			length: 150,
			rule: commonRules.string
		},
		ea: {
			name: 'event action',
			length: 500,
			rule: commonRules.string
		},
		el: {
			name: 'event label',
			length: 500,
			rule: commonRules.string
		},
		ev: {
			name: 'event value',
			rule: commonRules.integer
		},

		// "E-Commerce"
		ti: {
			name: 'transaction id',
			length: 500,
			rule: commonRules.string
			// Required for transaction hit type.
			// Required for item hit type.
		},
		ta: {
			name: 'affiliation',
			length: 500,
			rule: commonRules.string
		},
		tr: {
			name: 'revenue',
			rule: commonRules.currency
		},
		ts: {
			name: 'shipping',
			rule: commonRules.currency
		},
		tt: {
			name: 'tax',
			rule: commonRules.currency
		},
		ip: {
			name: 'item price',
			rule: commonRules.currency
		},
		iq: {
			name: 'item quantity',
			rule: commonRules.integer
		},
		ic: {
			name: 'item code',
			length: 500,
			rule: commonRules.string
		},
		'in': {
			name: 'item name',
			length: 500,
			rule: commonRules.string
		},
		iv: {
			name: 'item category',
			length: 500,
			rule: commonRules.string
		},

		// "Social Interactions"
		sa: {
			name: 'social action',
			length: 50,
			rule: commonRules.string
		},
		sn: {
			name: 'social network',
			length: 50,
			rule: commonRules.string
		},
		st: {
			name: 'social target',
			length: 2048,
			rule: commonRules.string
		},

		// "Timing"
		utc: {
			name: 'timing category',
			length: 150,
			rule: commonRules.string
		},
		utv: {
			name: 'timing variable',
			length: 500,
			rule: commonRules.string
		},
		utt: {
			name: 'timing time',
			rule: commonRules.integer
		},
		utl: {
			name: 'timing label',
			length: 500,
			rule: commonRules.string
		},
		plt: {
			name: 'page load time',
			rule: commonRules.integer
		},
		dns: {
			name: 'dns time',
			rule: commonRules.integer
		},
		pdt: {
			name: 'page download time',
			rule: commonRules.integer
		},
		rrt: {
			name: 'redirect response time',
			rule: commonRules.integer
		},
		tcp: {
			name: 'tcp connect time',
			rule: commonRules.integer
		},
		srt: {
			name: 'server response time',
			rule: commonRules.integer
		},

		// "Custom Dimensions"
		cd0: {
			name: 'dimension 0',
			length: 150,
			rule: commonRules.string
		},
		cd1: {
			name: 'dimension 1',
			length: 150,
			rule: commonRules.string
		},
		cd2: {
			name: 'dimension 2',
			length: 150,
			rule: commonRules.string
		},
		cd3: {
			name: 'dimension 3',
			length: 150,
			rule: commonRules.string
		},
		cd4: {
			name: 'dimension 4',
			length: 150,
			rule: commonRules.string
		},
		cd5: {
			name: 'dimension 5',
			length: 150,
			rule: commonRules.string
		},
		cd6: {
			name: 'dimension 6',
			length: 150,
			rule: commonRules.string
		},
		cd7: {
			name: 'dimension 7',
			length: 150,
			rule: commonRules.string
		},
		cd8: {
			name: 'dimension 8',
			length: 150,
			rule: commonRules.string
		},
		cd9: {
			name: 'dimension 9',
			length: 150,
			rule: commonRules.string
		},

		// "Custom Metric"
		cm0: {
			name: 'metric 0',
			rule: commonRules.integer
		},
		cm1: {
			name: 'metric 1',
			rule: commonRules.integer
		},
		cm2: {
			name: 'metric 2',
			rule: commonRules.integer
		},
		cm3: {
			name: 'metric 3',
			rule: commonRules.integer
		},
		cm4: {
			name: 'metric 4',
			rule: commonRules.integer
		},
		cm5: {
			name: 'metric 5',
			rule: commonRules.integer
		},
		cm6: {
			name: 'metric 6',
			rule: commonRules.integer
		},
		cm7: {
			name: 'metric 7',
			rule: commonRules.integer
		},
		cm8: {
			name: 'metric 8',
			rule: commonRules.integer
		},
		cm9: {
			name: 'metric 9',
			rule: commonRules.integer
		},

		// "Traffic Sources"
		dr: {
			name: 'referrer',
			length: 2048,
			rule: commonRules.string
		},
		cn: {
			name: 'campaign name',
			length: 100,
			rule: commonRules.string
		},
		cs: {
			name: 'campaign source',
			length: 100,
			rule: commonRules.string
		},
		cm: {
			name: 'campaign medium',
			length: 50,
			rule: commonRules.string
		},
		ck: {
			name: 'campaign keyword',
			length: 500,
			rule: commonRules.string
		},
		cc: {
			name: 'campaign content',
			length: 500,
			rule: commonRules.string
		},
		ci: {
			name: 'campaign id',
			length: 100,
			rule: commonRules.string
		},
		gclid: {
			name: 'adwords id'
		},
		dclid: {
			name: 'display ads id'
		},

		// "Visitor"
		cid: {
			name: 'client id'
		},

		// "Session"
		a: { // ????
			name: 'session'
		},
		sc: {
			name: 'session control',
			rule: commonRules.session
		},

		// "General"
		v: {
			name: 'protocol version'
		},
		tid: {
			name: 'web property id',
			rule: commonRules.trackingID
		},
		aip: {
			name: 'anonymize ip',
			rule: commonRules.boolean
		},
		qt: {
			name: 'queue time',
			rule: commonRules.integer
		},
		z: {
			name: 'cache buster'
		},

		// "System Info"
		sr: {
			name: 'resolution',
			length: 20,
			rule: commonRules.string
		},
		vp: {
			name: 'viewport size',
			length: 20,
			rule: commonRules.string
		},
		sd: {
			name: 'screen colors',
			length: 20,
			rule: commonRules.string
		},
		de: {
			name: 'encoding',
			length: 20,
			rule: commonRules.string
		},
		ul: {
			name: 'language',
			length: 20,
			rule: commonRules.string
		},
		je: {
			name: 'java enabled',
			rule: commonRules.boolean
		},
		fl: {
			name: 'flash version',
			length: 20,
			rule: commonRules.string
		},

		// "App Tracking"
		an: {
			name: 'app name',
			length: 100,
			rule: commonRules.string
		},
		av: {
			name: 'app version',
			length: 100,
			rule: commonRules.string
		},

		// "Exceptions"
		exd: {
			name: 'exception description',
			length: 150,
			rule: commonRules.string
		},
		exf: {
			name: 'exception fatal',
			rule: commonRules.boolean
		}
	}
};