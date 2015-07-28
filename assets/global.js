$( document ).ready(function() {
  $(".js-like-idea").on("click", function(event){
    event.preventDefault();
    var ideaId = $(this).data("idea-id");
    $.ajax({
      url: $(this).attr("href"),
      type: "POST",
      dataType: "json",
      success: function(data){
        $("[data-like-count="+ideaId+"]").text(data.likes_count);
      },
      error: function(){
        alert("Something went wrong!");
      }
    });
  });

  $(".js-unlike-idea").on("click", function(event){
    event.preventDefault();
    var ideaId = $(this).data("idea-id");
    $.ajax({
      url: $(this).attr("href"),
      type: "delete",
      dataType: "json",
      success: function(data){
        $("[data-like-count="+ideaId+"]").text(data.likes_count);
      },
      error: function(xhr, status, err) {
        console.log('error:', xhr, status, err);
      }
    });
  });
});
