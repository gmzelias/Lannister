/*Action when the button "Nuevo Contribuyente" is clicked, shows modal to ask for the password, and validates it in the back end*/
$('#nuevoContribuyente').on('click',function() { 
    $('.modal-body-dashboard').empty();
    $('.modal-body-dashboard').append("<input type='password'style='margin-bottom: 00px;text-align: center; class='' id='password' placeholder='Password'>"); 
    $('#exampleModal-dashboard').modal('show');
    $('#password').focus(function() {
        $('#password').removeClass("invalid-password");
    });

/*Function that checks password*/ 
$('#checkpassword').on('click',function() { 
        var data = {
            pass : $('#password').val()}
        $.ajax({
            type: "POST",
            url: "/validatePassword",
            data: data,
            success: function(a) {  
            /*If password is correct loads the partial page*/ 
              if(a.error == 0){
                $('#exampleModal-dashboard').modal('hide');  
                $.ajax({
                    type: "GET",
                    url: "/nuevoCont",
                    success: function(a) {  
                        $('#main').hide();  
                        $("#newpage").load( "nuevoCont.html", function() {
                            $("#newpage").show();
                        });
                    },
                    error: function (e) {
                    },
                });
              }
              else{
                $('#password').addClass("invalid-password");
              }
            },
            error: function (e) {
            },
        });
    });
});

/*Action when the button "Nuevo Tributo" is clicked*/
$('#nuevoTributo').on('click',function() { 
    $.ajax({
        type: "GET",
        url: "/nuevoTrib",
        success: function(a) {  
            $('#main').hide();  
            $("#newpage").load( "nuevoTrib.html", function() {
                $("#newpage").show();
            });
        },
        error: function (e) {
        },
    });
})

$('#addContribuyente').on('click',function() { 
    $.ajax({
        type: "GET",
        url: "/listaTribs",
        success: function(a) {  
            $('#main').hide();  
            $( "#newpage" ).load( "listaTribs.html", function() {
                $("#newpage").show();
            });
        },
        error: function (e) {
        },
    });
})