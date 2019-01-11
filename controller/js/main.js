$('#nuevoContribuyente').on('click',function() { 
    $.ajax({
        type: "GET",
        url: "/nuevoCont",
        /*data: data,*/
        success: function(a) {  
            $('.maindashboard').hide();  
          /*  $.get('nuevoCont.html', function (data) {
                $("#main").append(data);
            });*/
            $( ".body" ).load( "nuevoCont.html", function() {
               // alert( "Load was performed." );
              });
        },
        error: function (e) {

        },
    });
});