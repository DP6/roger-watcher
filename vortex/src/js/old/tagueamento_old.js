(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-3635138-29');
ga('set', {
	'page': '/' + PUDIM.info.name + '/' + PUDIM.info.version,
	'title': PUDIM.info.name + '@' + PUDIM.info.version
});
ga('send', 'pageview');

jQuery('#logo').mousedown(function(){
	ga('send', 'event', 'Cliques no Logo' ,'click');
});

jQuery('.filter').find('a').mousedown(function(){
	ga('send', 'event', 'utilização de filtros', this.className);
});

jQuery('#panel').on('click','.detail,.content',function(){
	var track = jQuery(this).closest('.track');
	ga('send', 'event', 'visualização de detalhes', track.data().type);
});

jQuery('#panel').on('click','.delete',function(){
	var track = jQuery(this).closest('.track');
	ga('send', 'event', 'exclusão de disparo', track.data().type);
});