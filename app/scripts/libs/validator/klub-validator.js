/**
 * Created with JetBrains WebStorm.
 * User: Naum
 * Date: 3/14/13
 * Time: 8:48 PM
 * To change this template use File | Settings | File Templates.
 */

(function($){
    $.fn.validateAccount = function(options){
        options = $.extend({
            backColor: "red",
            foreColor: "white"
        }, options);

        var has_empty_strings = false;
        var wrong_email = false;
        var password_inequality = false;

        var passwrds = this.find(":password");

        //this.each(function (){
            var inputs = this.find(":input");

            // check for empty input fields
            $.each(inputs, function(key, val){
                var inp_type= $(val).attr("type");

                switch (inp_type){
                    case "text":
                    case "password":
                    case "url":
                        var txt = $.trim($(val).val());

                        if (txt === ""){
                            has_empty_strings = true;
                            $(this).css("border-color", options.backColor);
                        }
                        else{
                            $(this).css("border-color", "white");
                        }
                        break;

                    case "email":
                        //check email
                        //if (inp_type === "email"){
                            var em = $(this).val();
                            var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                            if (!regex.test(em)){
                                wrong_email = true;
                                $(this).css("border-color", options.backColor);
                            }
                            else
                                $(this).css("border-color", "white");
                        //}
                }


            });

            if (passwrds.length > 1){
                //check passwords equality
                var val1 = "", val2 = "";
                var pass1, pass2;
                if (passwrds.length == 2){
                    //register form
                    pass1 = $(passwrds[0]);
                    pass2 = $(passwrds[1]);
                }
                else if (passwrds.length == 3){
                    //edit profile form
                    pass1 = $(passwrds[1]);
                    pass2 = $(passwrds[2]);
                }

                val1 = pass1.val();
                val2 = pass2.val();

                if ((val1+val2 == "") || (val1 !=  val2)){
                    password_inequality = true;
                    pass1.css("border-color", options.backColor);
                    pass2.css("border-color", options.backColor);
                }
                else{
                    pass1.css("border-color", "");
                    pass2.css("border-color", "");
                }
            }
        //});

        var mes = "";

        if (has_empty_strings)
           mes = "Please fill out empty strings!\n";

        if (password_inequality)
            mes += "Password confirmation error!\n";

        if (wrong_email)
            mes += "Wrong e-mail address!\n";
        /*
        if (mes != "")
            alert(mes);
        return (mes == "");//!(has_empty_strings || wrong_email || password_inequality);
        */
        return mes;


    };

})(jQuery);