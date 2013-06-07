var PUDIM = PUDIM || {panel: jQuery('#panel'), info: {name: "Dev", version: "X.X.X"}, util: {sub: function(){}}};

PUDIM.panel.on('click','.delete',function(){
	var track = jQuery(this).closest('.track');
	track.slideUp('300',function(){
		track.remove();
	});
});

PUDIM.panel.on('click','.track',function(){
	jQuery(this).find('.qsWrapper').slideToggle('slow');
});

PUDIM.panel.on('click','.qsWrapper', function(e){
	e.stopPropagation();
});

jQuery('.filter').on('click', 'a', function(){
	jQuery(this).closest('li').toggleClass('checked');
	PUDIM.panel.toggleClass(this.className).toggleClass('filtrado', jQuery('.checked').length > 0);
});

jQuery('.clear').on('click',function(){
	jQuery('.checked').removeClass('checked');
	PUDIM.panel.removeClass();
});

jQuery('#busca').bind('keyup', function() {
	var s = new RegExp(this.value,'i');
	jQuery('.track').each(function() {
		var $t = jQuery(this);
		$t.toggleClass('hidden', s.test($t.find('td.value').text()) === false);
	});
});

PUDIM.util.sub('newhit', function(){ jQuery("#busca").trigger('keyup'); });