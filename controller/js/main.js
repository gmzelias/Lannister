$('#nuevoContribuyente').on('click',function() { 
    $.ajax({
        type: "GET",
        url: "/nuevoCont",
        success: function(a) {  
            $('#main').hide();  
            $( "#newpage" ).load( "nuevoCont.html", function() {
                $("#newpage").show();
              });
        },
        error: function (e) {

        },
    });
});