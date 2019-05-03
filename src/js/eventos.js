var RW = RW || {
  panel: jQuery('#panel'),
  info: { name: 'Dev', version: 'X.X.X' },
  util: { sub: () => {} },
  clear() {
    jQuery('.track').remove();
    jQuery('#busca').val('');
  }
};

jQuery('.filter').on('click', 'a', function() {
  jQuery(this)
    .closest('li')
    .toggleClass('checked');
  RW.panel
    .toggleClass(this.className)
    .toggleClass('filtrado', jQuery('.checked').length > 0);
});

jQuery('.clear-filter').on('click', function() {
  jQuery('.checked').removeClass('checked');
  RW.panel.removeClass();
});

jQuery('.clear-report').on('click', () => RW.clear());

jQuery('#autoscroll').on('change', function() {
  RW.autoscroll = this.checked;
});

jQuery('#busca').on('keyup', function() {
  const s = new RegExp(this.value, 'i');
  jQuery('.track').each(function() {
    const $this = jQuery(this);
    $this.toggleClass('hidden', !s.test($this.find('td.value').text()));
  });
});

RW.panel.on('click', '.delete', function(e) {
  e.stopPropagation();
  jQuery(this)
    .closest('.track')
    .remove();
});

RW.panel.on('click', '.track', function() {
  jQuery(this)
    .find('.qsWrapper')
    .stop()
    .slideToggle('slow');
});

RW.panel.on('click', '.qsWrapper', e => e.stopPropagation());

RW.util.sub('newhit', () => jQuery('#busca').trigger('keyup'));
