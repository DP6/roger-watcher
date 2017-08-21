var PUDIM = PUDIM || {panel: jQuery('#panel'), info: {name: "Dev", version: "X.X.X"}, util: {sub: function(){}}};

jQuery('.filter').on('click', 'a', function(){
	jQuery(this).closest('li').toggleClass('checked');
	PUDIM.panel.toggleClass(this.className).toggleClass('filtrado', jQuery('.checked').length > 0);
});

jQuery('.clear-filter').on('click',function(){
	jQuery('.checked').removeClass('checked');
	PUDIM.panel.removeClass();
});

jQuery('.clear-report').on('click',function(){
	PUDIM.clear();
});

jQuery('#busca').on('keyup', function() {
	var s = new RegExp(this.value,'i');
	jQuery('.track').each(function() {
		var $t = jQuery(this);
		$t.toggleClass('hidden', s.test($t.find('td.value').text()) === false);
	});
});

PUDIM.panel.on('click','.delete',function(e){
	e.stopPropagation();
	jQuery(this).closest('.track').remove();
});

PUDIM.panel.on('click','.track',function(){
	jQuery(this).find('.qsWrapper').stop().slideToggle('slow');
});

PUDIM.panel.on('click','.qsWrapper', function(e){
	e.stopPropagation();
});

PUDIM.util.sub('newhit', function(){ jQuery("#busca").trigger('keyup'); });