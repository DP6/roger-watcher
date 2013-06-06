
	/*
	},
	script: {
		handler: function(url) {
			var a = document.createElement('a');
			a.href = url;
			jQuery('<div class="request script"/>').append(
				jQuery('<span class="header">').text(a.pathname.slice(1)),
				jQuery('<div>').addClass('paramsholder').append('<p>' + url + '</p>')
			).appendTo(containers.ga);
		}
	},
	google_analytics: {
		handler: function(url) {
			var html, event, type, content, params = queryToObject(url.slice(url.indexOf('?') + 1));

			event = params.utme ? decodeURIComponent(params.utme).match(/5\((.*?)\*(.*?)\*(.*?)\)(\((\d+)\))?/) : false;

			html = [];
			jQuery.each(params, function(key){
				html.push('<td>' + key + '</td><td>' + decodeURIComponent(params[key]) + '</td>');
			});
			html = html.join('</tr><tr>');
			
			if (params.utmt === 'tran') {
				type = 'transaction';
				content = 'ID:' + params.utmtid + '; Affiliation: ' + params.utmtst + '; Price: ' + params.utmtto;
			} else if (event) {
				type = 'event';
				content = 'Category: ' + event[1] + '; Action: ' + event[2];
				if (event[3]) {
					content += '; Label: ' + event[3];
				}
				if (event[5]) {
					content += '; Value: ' + (event[5] || 0);
				} 
			} else if (params.utmt !== 'event') {
				type = 'pageview';
				content = decodeURIComponent(params.utmp);
			}

			if (type && content) {
				containers.ga.append(jQuery('<div class="request hit"/>').addClass(type).append(
					jQuery('<span class="header hand"/>').text(params.utmhn + ' - ' + content),
					jQuery('<div class="paramsholder"/>').append(jQuery('<table class="params"/>').html('<tr>' + html + '</tr>'))
				));
			}
		}
		*/