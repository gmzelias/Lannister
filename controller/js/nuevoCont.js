$('#exampleModal').modal({ show: false})
$.ajax({
    type: "GET",
    url: "/getCont",
    success: function(a) {  
        var dataSet = a.data;
        console.log(dataSet);
        $('#example').DataTable( {
        scrollX:        true,
        scrollCollapse: true,
        autoWidth:         true,  
         paging:         true,       
        columnDefs: [
        { "width": "150px", "targets": [0,1] },       
        { "width": "40px", "targets": [4] }
      ],
            data: dataSet,
            columns: [
                { title: "Nombre" },
                { title: "Apellido1" },
                { title: "Apellido2" },
                { title: "Direccion" },
                { title: "Date" },
                { title: "Tributa" }
            ]
        });
    },
    error: function (e) {
    },
});

$('#nuevoCont').on('click',function() { 
    $('#exampleModal').modal('show');
    var data = {
      Nombre: $('#nombre').val(),
      Apellido_Pri:$('#primerapellido').val(),
      Apellido_Sec:$('#segundoapellido').val(),
      Direccion:$('#direccion').val(),
      Tributa:$('#tribCheck').is(":checked"),
      Date:$('#datepicker').val(),
    }
   $.ajax({
        type: "POST",
        url: "/addCont",
        data: data,
        success: function(a) {  
            if(a.error == 1){
            $('.modal-body').empty;
            $('.modal-body').append("<p style='margin-bottom: 00px;text-align: center;'>Usuario no creado: Ya existente</p>"); 
            $('#exampleModal').modal('show');
            }
            else {
                $.ajax({
                    type: "GET",
                    url: "/nuevoCont",
                    /*data: data,*/
                    success: function(a) {  
                        $('.maindashboard').hide();  
                        $( ".body" ).load( "nuevoCont.html", function() {
                            $('.modal-body').empty;
                            $('.modal-body').append("<p style='margin-bottom: 00px;text-align: center;'>Usuario creado exitosamente</p>"); 
                            $('#exampleModal').modal('show');
                        });
                    },
                    error: function (e) {
                    },
                });
            }

        },
        error: function (e) {

        },
    });
});