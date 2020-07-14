"use strict";
function hamborger() {
    $('#navList').hide();
    $('#btnMain').on('click',function(){
        $('#navList').slideToggle("fast")
        
    })
}

hamborger();
function handelForm() {

        // $('#hiddenForm').hide();
        $('#creatForm').click(function() {
            $('#hiddenForm').show();
        })
 
    
};

handelForm();
