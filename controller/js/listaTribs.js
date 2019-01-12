$('.landingFromListTrib').on('click',function() { 
    $('#TribsTable').DataTable().destroy();
    $('#newpage').hide();  
    $('#main').show();   
})
//$('#TribsTable').hide(); 

/*Request that returns datatable data and datatable generation*/ 
$.ajax({
    type: "GET",
    url: "/getTrib",
    success: function(a) {  
        var dataSet = a.data;
        $('#TribsTable').DataTable({
        scrollX:        true,
        scrollCollapse: true,
        paging:         true,   
        "bDestroy": true,    
            data: dataSet,
            columns: [
                { title: "Nombre" },
                { title: "Apellido" },
                { title: "Fecha" },
                { title: "Cuantia" },
                { title: "Lugar" },
            ]
        });
        $('.TribsTable_load').hide();
        $('#TribsTable').show(); 
    },
    error: function (e) {
    },
});