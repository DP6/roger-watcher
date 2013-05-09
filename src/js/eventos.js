var panel = jQuery("#panel");

panel.on('click','.delete',function(e){
	e.stopPropagation();
	e.preventDefault();
	var track = jQuery(this).closest('.track');
	track.slideUp('300',function(){
		track.remove();
	});
});

panel.on('click','.detail,.content',function(e){
	e.stopPropagation();
	e.preventDefault();
	var track = jQuery(this).closest('.track');
	track.find('.qsWrapper').slideToggle('slow');
});

jQuery('.filter').on('click', 'a', function(e){
	e.stopPropagation();
	e.preventDefault();

	if (jQuery(this).hasClass('clean')) {
		jQuery('.checked').removeClass('checked');
		panel.removeClass();
	} else {
		jQuery(this).closest('li').toggleClass('checked');
		panel.toggleClass(this.className).toggleClass('filtrado', jQuery('.checked').length > 0);
	}
});