$(document).on('ready', function() {
  console.log('what');

  $('#muzak').on('click', function() {
    var content = $('.list-group .list-group-item-text');
    contentArray = [];
    content.each(function() {
      contentArray.push($(this).text());
    });
    console.log(contentArray);
  })
});
