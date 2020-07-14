"use strict";
function hamborger() {
    $('#navList').hide();
    $('#btnMain').on('click',function(){
        $('#navList').slideToggle("fast")
        
    })
}

hamborger();
function handelForm() {
console.log(555);
        $('.hiddenForm').hide();
        $('.creatForm').click(function() {
            console.log();
            $(this).parent().find('.hiddenForm').slideToggle("fast")
            // $('#hiddenForm').show();
             
        })
 
    
};

handelForm();
