var $city = $('select[id="city"]');
$('select[id="prefecture"]').change(function() {
  var val1 = $(this).val();  
  $city.find('option').each(function() {
    var val2 = $(this).data('val');
    if (val1 === val2) {
      $(this).show();
    }else {
      $(this).hide();
    }
  })
})