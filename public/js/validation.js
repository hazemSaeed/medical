
 var errors;
 window.errors=errors;
    
 var tooltip_place = "left";
 var top;
 var urlreg = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
 var emailreg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

 jQuery(document).ready(function() {
    
     if(jQuery('body').attr('data-lang')=="ar")
    {
        tooltip_place = "right";
    }

    jQuery(document).on('keydown', '.txtinput-filter-number', function (event) {
         // Allow: backspace, delete, tab, escape, enter and , 190.
         if ($.inArray(event.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
             // Allow: Ctrl+A
             (event.keyCode == 65 && event.ctrlKey == true) ||
             // Allow: home, end, left, right
             (event.keyCode >= 35 && event.keyCode <= 39)) {
             // let it happen, don't do anything
             return;
         }
         else {
             // Ensure that it is a number and stop the keypress
             if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                 event.preventDefault();
             }
         }
    });
     
    jQuery(document).on('keydown', '.txtnotnumber', function (event) {
        if (event.altKey == false && event.ctrlKey == false)
        {
            if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) && event.shiftKey== false)
            {
                return false;
            }
            else
            {
                if((event.keyCode >= 65 && event.keyCode <= 90) ||
                (event.keyCode >= 97 && event.keyCode <= 122))
                {}
            }
        }
    });

    jQuery(document).on('submit', '.form-validation', function() {
        
        errors = false;

        if(window.innerWidth <=992)
        {
            tooltip_place = "top";
        }

		//--------------------------------------------------

        jQuery(this).find('.txtinput-required:visible').each(function() {
            
            if (jQuery(this).val().trim().length < 1) {
                jQuery(this).addClass('error-required required-field');
                jQuery(this).parent().addClass('error-parent');
                jQuery(this).parents('.form-group').addClass('forminput-haverror');
                //jQuery(this).parent().append('<span class="validation-text" data-toggle="tooltip" data-placement="left" title="هذا الحقل مطلوب"></span>');
                //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('show');
                if (jQuery(this).hasClass('login-error')) {
                    jQuery(this).addClass('login-error-gen');
                }
                if (errors == false) {
                    top = jQuery(this).offset().top;
                }
                errors = true;
            }
            else {
                //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('hide').remove();
                jQuery(this).removeClass('error-required');
                jQuery(this).parent().removeClass('error-parent');
                jQuery(this).parents('.form-group').removeClass('forminput-haverror');
                //jQuery(this).parent().find('.txtinput-normal-icon-region').removeClass('error-icon-required');
            }
        });

        
        jQuery(this).find('.txtinput-url:visible').each(function () {
            if (jQuery(this).val().trim().length < 1) {
                jQuery(this).addClass('error-required required-field');
                jQuery(this).parent().addClass('error-parent');
                if (errors == false) {
                    top = jQuery(this).offset().top;
                }
                errors = true;
            }
            else {
                if ((jQuery(this).val().trim().length >= 1) && urlreg.test(jQuery(this).val().trim()) == true) {
                    jQuery(this).removeClass('error-required');
                    jQuery(this).parent().removeClass('error-parent');
                    jQuery(this).parent().find('.error-msg-validation').remove();
                    //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('hide').remove();
                }
                else {
                    jQuery(this).addClass('error-required');
                    jQuery(this).parent().addClass('error-parent');
                    if (!jQuery(this).parents('.form-group').find('.error-msg-validation').is(':visible')) {
                        //jQuery(this).parent().append('<span class="validation-text" data-toggle="tooltip" data-placement="'+tooltip_place+'" title="Please enter valid url"></span>');
                        //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('show');
                        if(jQuery('body').attr('data-lang')=="ar")
                        {
                            jQuery(this).parents('.form-group').append('<span class="error-msg-validation">الرجاء ادخال رابط صحيح</span>');
                        }
                        else
                        {
                            jQuery(this).parents('.form-group').append('<span class="error-msg-validation">Please enter valid URL</span>');
                        }
                    }
                    if (errors == false || (jQuery(this).offset().top < top)) {
                        top = jQuery(this).offset().top;
                    }
                    errors = true;
                }
            }
        });

        jQuery(this).find('.txtinput-email:visible').each(function() {
            if (jQuery(this).val().trim().length > 0 && emailreg.test(jQuery(this).val().trim()) == false) {

                jQuery(this).addClass('error-required');
                jQuery(this).parent().addClass('error-parent forminput-haverror');
                if (!jQuery(this).parents('.form-group').find('.error-msg-validation').is(':visible')) {
                    //jQuery(this).parent().append('<span class="validation-text" data-toggle="tooltip" data-placement="'+tooltip_place+'" title="Please enter valid email"></span>');
                    //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('show');
                    if(jQuery('body').attr('data-lang')=="ar")
                    {
                        jQuery(this).parents('.form-group').append('<span class="error-msg-validation">الرجاء ادخال بريد الكتروني صحيح</span>');
                    }
                    else
                    {
                        jQuery(this).parents('.form-group').append('<span class="error-msg-validation">Please enter valid email</span>');
                    }
                }
                if (errors == false || (jQuery(this).offset().top < top)) {
                    top = jQuery(this).offset().top;
                }
                errors = true;
            }
            else if(!jQuery(this).hasClass('required-field')){
                jQuery(this).removeClass('error-required');
                jQuery(this).parent().removeClass('error-parent forminput-haverror');
                jQuery(this).parents('.form-group').find('.error-msg-validation:not(.msgerror-valid)').remove();
                //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('hide').remove();
            }
            else {
                jQuery(this).parents('.form-group').find('.error-msg-validation:not(.msgerror-valid)').remove();
                //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('hide').remove();
            }
        });
		
		//-----------------------------------------------------------------------
		jQuery(this).find('.txtinput-mobile:visible').each(function () {
		    var txtinput_minlength_val = jQuery(this).attr('data-minlength');
		    var str = jQuery(this).val();
		    if (jQuery(this).val().trim().length < 1) {
		        jQuery(this).addClass('error-required required-field');
                jQuery(this).parent().addClass('error-parent forminput-haverror');
		        if (errors == false) {
		            top = jQuery(this).offset().top;
		        }
		        errors = true;
		    }
		    else {
		        if ((jQuery(this).val().trim().length >= 10) && (str.substring(0, 2) == '05')) {
		            jQuery(this).removeClass('error-required');
                    jQuery(this).parent().removeClass('error-parent forminput-haverror');
		            jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
                    //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('hide').remove();
		        }
		        else {
		            jQuery(this).addClass('error-required');
                    jQuery(this).parent().addClass('error-parent forminput-haverror');
		            if (!jQuery(this).parents('.form-group').find('.error-msg-validation').is(':visible')) {
                        //jQuery(this).parent().append('<span class="validation-text" data-toggle="tooltip" data-placement="'+tooltip_place+'" title="Please enter ' + txtinput_minlength_val + ' fields, start with 05"></span>');
                        //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('show');                        
                        if(jQuery('body').attr('data-lang')=="ar")
                        {
                            jQuery(this).parents('.form-group').append('<span class="error-msg-validation">الرجاء ادخال  ' + txtinput_minlength_val + ' خانات ، ويبدأ ب05 </span>');
                        }
                        else
                        {
                            jQuery(this).parents('.form-group').append('<span class="error-msg-validation">Please enter at least ' + txtinput_minlength_val + ' fields, start 05 </span>');
                        }
    		        }
		            if (errors == false || (jQuery(this).offset().top < top)) {
		                top = jQuery(this).offset().top;
		            }
		            errors = true;
		        }
		    }
		});
        
        jQuery(this).find('.txtinput-minlength:visible').each(function () {
            var txtinput_minlength_val = jQuery(this).attr('data-minlength');
            var str = jQuery(this).val();
            if((jQuery(this).val().trim().length > 0))
            {
                if ((jQuery(this).val().trim().length >= txtinput_minlength_val)) {
                    jQuery(this).removeClass('error-required');
                    jQuery(this).parent().removeClass('error-parent forminput-haverror');
                    jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
                    //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('hide').remove();
                }
                else {
                    jQuery(this).addClass('error-required');
                    jQuery(this).parent().addClass('error-parent forminput-haverror');
                    if (!jQuery(this).parents('.form-group').find('.error-msg-validation').is(':visible')) {
                        //jQuery(this).parent().append('<span class="validation-text" data-toggle="tooltip" data-placement="'+tooltip_place+'" title="Please enter at least ' + txtinput_minlength_val + ' fields"></span>');
                        //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('show');
                        if(jQuery('body').attr('data-lang')=="ar")
                        {
                            jQuery(this).parents('.form-group').append('<span class="error-msg-validation">الرجاء ادخال  ' + txtinput_minlength_val + ' خانات على الاقل</span>');
                        }
                        else
                        {
                            jQuery(this).parents('.form-group').append('<span class="error-msg-validation">Please enter at least ' + txtinput_minlength_val + ' fields</span>');
                        }
                    }
                    if (errors == false || (jQuery(this).offset().top < top)) {
                        top = jQuery(this).offset().top;
                    }
                    errors = true;
                }
            }
        });
        
        jQuery(this).find('.txtinput-nationalID').each(function () {
            jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
            var txtinput_minlength_val = parseInt(jQuery(this).attr('data-minlength'));
            var str = jQuery(this).val();
            if (jQuery(this).val().trim().length < 1) {
                jQuery(this).addClass('error-required required-field');
                jQuery(this).parents('.form-group').addClass('error-parent forminput-haverror');
                if (errors == false) {
                    top = jQuery(this).offset().top;
                }
                errors = true;
            }
            else {
                if (((jQuery(this).val().trim().length >= txtinput_minlength_val) && (str.substring(0, 1) == '1')) || ((jQuery(this).val().trim().length >= txtinput_minlength_val) && (str.substring(0, 1) == '2'))) {
                    jQuery(this).removeClass('error-required');
                    jQuery(this).parent().removeClass('error-parent forminput-haverror');
                    jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
                    //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('hide').remove();
                }
                else {
                    jQuery(this).addClass('error-required');
                    jQuery(this).parent().addClass('error-parent forminput-haverror');
                    if (!jQuery(this).parents('.form-group').find('.error-msg-validation').is(':visible')) {
                        //jQuery(this).parent().append('<span class="validation-text" data-toggle="tooltip" data-placement="'+tooltip_place+'" title="Please enter ' + txtinput_minlength_val + ' fields, start with 05"></span>');
                        //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('show');
                        if(jQuery('body').attr('data-lang')=="ar")
                        {
                            jQuery(this).parents('.form-group').append('<span class="error-msg-validation">الرجاء ادخال رقم وطني صحيح</span>');
                        }
                        else
                        {
                            jQuery(this).parents('.form-group').append('<span class="error-msg-validation">Please enter valid National ID</span>');
                        }
                    }
                    if (errors == false || (jQuery(this).offset().top < top)) {
                        top = jQuery(this).offset().top;
                    }
                    errors = true;
                }
            }
        });
        
        jQuery(this).find('.txtinput-related:visible').each(function() {
            //var confirm_password_val = jQuery(this).val().trim();
            //var password_val = jQuery(this).parents('form').find('.txtinput-password').val().trim();

            var input_related = jQuery(this).attr('data-related');
            var input_related_val = jQuery(this).parents('form').find('input[name='+input_related+']').val();
            var this_input_val = jQuery(this).val();
            var this_input_placeholder = jQuery(this).parents('form').find('input[name='+input_related+']').attr('data-placeholder');
            var input_related_placeholder = jQuery(this).attr('data-placeholder');
            //if (jQuery(this).val().trim().length > 0) {
            if (input_related_val != this_input_val) {
                jQuery(this).addClass('error-required');
                jQuery(this).parent().addClass('error-parent forminput-haverror');
                if (!jQuery(this).parents('.form-group').find('.error-msg-validation').is(':visible')) {
                    if(jQuery('body').attr('data-lang')=="ar")
                    {
                        jQuery(this).parents('.form-group').append('<span class="error-msg-validation">'+input_related_placeholder+' و '+this_input_placeholder+' غير متساويان</span>');
                    }
                    else
                    {
                        jQuery(this).parents('.form-group').append('<span class="error-msg-validation">'+input_related_placeholder+' and '+this_input_placeholder+' not equal</span>');
                    }
                    //jQuery(this).parent().append('<span class="validation-text" data-toggle="tooltip" data-placement="'+tooltip_place+'" title="'+input_related_placeholder+' and '+this_input_placeholder+' not equal"></span>');
                    //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('show');
                }
                if (errors == false || (jQuery(this).offset().top < top)) {
                    //top = jQuery(this).offset().top;
                    top = jQuery(this).offset().top;
                }
                errors = true;
            }
            else {
                if (jQuery(this).val().trim().length > 0) 
                {
                    jQuery(this).removeClass('error-required');
                    jQuery(this).parent().removeClass('error-parent forminput-haverror');
                    jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
                }
            }
            //}
        });

        //input-wlbl-select
        jQuery(this).find('.selectinput-required').each(function() {
            if (jQuery(this).val().trim().length < 1) {
                jQuery(this).addClass('error-required required-field');
                jQuery(this).parents('.input-wlbl-select').addClass('error-required');
                if (errors == false) {
                    top = jQuery(this).offset().top;
                }
                errors = true;
            }
            else {
                jQuery(this).removeClass('error-required');
                jQuery(this).parents('.input-wlbl-select').removeClass('error-required');
            }
        });

        jQuery(this).find('.fileinput-required').each(function() {
            if (jQuery(this).val()) {
                jQuery(this).parents('.form-group').find('.form-control').removeClass('error-required');
            }
            else {

                jQuery(this).parents('.form-group').find('.form-control').addClass('error-required');
                if (errors == false) {
                    top = jQuery(this).offset().top;
                }
                errors = true;
            }
        });
        
        jQuery('.tinymce-required').each(function() {
            var this_editor = jQuery(this).attr('id');
            var tinymce_length = tinyMCE.get(this_editor).getContent().trim().length;
            if(tinymce_length<=61)
            {
                jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
                if(jQuery('body').attr('data-lang')=="ar")
                {
                    jQuery(this).parents('.form-group').append('<span class="error-msg-validation">هذا الحقل مطلوب</span>');
                }
                else
                {
                    jQuery(this).parents('.form-group').append('<span class="error-msg-validation">This field is required</span>');
                }
                errors = true;
            }
            else
            {
                jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
            }
        });

        jQuery(this).find('.filerequired').each(function() {
            if(jQuery(this).val())
            {
                jQuery(this).parents('.btn-upload').removeClass('btnupload-error');
            }
            else
            {
                jQuery(this).parents('.btn-upload').addClass('btnupload-error');
                if(jQuery('body').attr('data-lang')=="ar")
                {
                    //jQuery(this).parents('.upload-area').after('<span class="error-msg-validation">الصورة مطلوبة</span>');
                }
                else
                {
                    //jQuery(this).parents('.upload-area').after('<span class="error-msg-validation">The Image is required</span>');
                }
                errors = true;
            }
        });
        
        jQuery(this).find('.select-required:visible select.select2>option:selected,.select-required:visible select.select2-search>option:selected').each(function(){
            if(jQuery(this).val().length>0)
            {
                jQuery(this).parents('.select-required').find('.select2-container .select2-choice,.select2-container .select2-selection--single').removeClass('select-error');
                jQuery(this).parents('.form-group').removeClass('formselect-haverror');
            }
            else
            {
                jQuery(this).parents('.select-required').find('.select2-container .select2-choice,.select2-container .select2-selection--single').addClass('select-error');
                jQuery(this).parents('.form-group').addClass('formselect-haverror');
                errors = true;
            }
        });

        jQuery(this).find('.selectnozero-required:visible select.select2>option:selected').each(function(){
            if(jQuery(this).val() == 0)
            {
                jQuery(this).parents('.select-required').find('.select2-container .select2-choice,.select2-container .select2-selection--single').addClass('select-error');
                jQuery(this).parents('.form-group').addClass('formselect-haverror');
                errors = true;
            }
            else
            {
                jQuery(this).parents('.select-required').find('.select2-container .select2-choice,.select2-container .select2-selection--single').removeClass('select-error');
                jQuery(this).parents('.form-group').removeClass('formselect-haverror');
            }
        });

        jQuery(this).find('.checkbox-required .checkbox-region>input[type=checkbox]').each(function() {
            if (jQuery(this).prop('checked') == true) {
                jQuery(this).parents('.checkbox-parent').find('.error-msg-validation').remove();
            }
            else
            {
                if (errors == false) {
                    top = jQuery(this).offset().top;
                }
                errors = true;
                if (!jQuery(this).parents('.checkbox-parent').find('.error-msg-validation').is(':visible')) {
                    if(jQuery('body').attr('data-lang')=="ar")
                    {
                        jQuery(this).parents('.checkbox-parent').append('<span class="error-msg-validation">الرجاء الموافقة على الشروط والأحكام</span>');
                    }
                    else {
                        jQuery(this).parents('.checkbox-parent').append('<span class="error-msg-validation">Please accept terms and conditions</span>');
                    }
                }
            }
        });

        $(this).find('.checkbox-required input[type=checkbox]').each(function() {
            jQuery(this).parents('.checkboxcustom-rg').find('.error-msg-validation').remove();
            if (jQuery(this).prop('checked') == true) {
                jQuery(this).parents('.checkboxcustom-rg').find('.error-msg-validation').remove();
            }
            else
            {
                if (errors == false) {
                    top = jQuery(this).offset().top;
                }
                errors = true;
                if (!jQuery(this).parents('.checkbox-custom').find('.error-msg-validation').is(':visible')) {
                    if(jQuery('body').attr('data-lang')=="ar")
                    {
                        jQuery(this).parents('.checkboxcustom-rg').append('<span class="error-msg-validation">الرجاء اختيار هذا الحقل</span>');
                    }
                    else {
                        jQuery(this).parents('.checkboxcustom-rg').append('<span class="error-msg-validation">Please Check This Field</span>');
                    }
                }
            }
        });

        if (errors == true) {
            if (top) {
                //top = top.offset().top;
                if((jQuery(this).hasClass('bookform')==false))
                {
                    //jQuery('html,body').animate({scrollTop: top - 100}, 400);
                }
            }
            return false;
        }

    });
    
    jQuery(document).on('keyup','.txtinput-required',function(){
        if ((jQuery(this).val().trim().length >= 1)) {
            jQuery(this).removeClass('error-required required-field');
            jQuery(this).parents('.form-group').removeClass('error-parent forminput-haverror');
        }
        else {
            jQuery(this).addClass('error-required required-field');
            jQuery(this).parents('.form-group').addClass('error-parent forminput-haverror');
        }
    });

    jQuery(document).on('keyup','.txtinput-email',function(){
        if ((jQuery(this).val().trim().length > 2)) {
            jQuery(this).addClass('error-required required-field');
            jQuery(this).parents('.form-group').addClass('error-parent forminput-haverror');
        }
        if ((jQuery(this).val().trim().length > 2) && (emailreg.test(jQuery(this).val().trim()) == true)) {
            jQuery(this).removeClass('error-required required-field');
            jQuery(this).parents('.form-group').removeClass('error-parent forminput-haverror');
            //jQuery(this).parent().find('[data-toggle="tooltip"]').tooltip('hide').remove();
            jQuery(this).parents('.form-group').find('.error-msg-validation:not(.msgerror-valid)').remove();
        }
        if (!(jQuery(this).val().trim())) {
            jQuery(this).parents('.form-group').find('.error-msg-validation:not(.msgerror-valid)').remove();
        }
    });

     jQuery(document).on('keyup','.txtinput-minlength',function(){
         var txtinput_minlength_val = jQuery(this).attr('data-minlength');
         var str = jQuery(this).val();
         if((jQuery(this).val().trim().length > 0))
         {
             if ((jQuery(this).val().trim().length >= txtinput_minlength_val)) {
                 jQuery(this).removeClass('error-required');
                 jQuery(this).parents('.form-group').removeClass('forminput-haverror');
                 jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
             }
             else {
                 jQuery(this).addClass('error-required');
                 jQuery(this).parents('.form-group').addClass('forminput-haverror');
                 jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
                 if(jQuery('body').attr('data-lang')=="ar")
                 {
                     jQuery(this).parents('.form-group').append('<span class="error-msg-validation">الرجاء ادخال  ' + txtinput_minlength_val + ' خانات على الاقل</span>');
                 }
                 else
                 {
                     jQuery(this).parents('.form-group').append('<span class="error-msg-validation">Please enter at least ' + txtinput_minlength_val + ' fields</span>');
                 }
             }
         }
     });
    
    jQuery('.select-required .select2-custom').change(function(){
        if(jQuery(this).find('option:selected').val())
        {
            jQuery(this).parents('.form-group').removeClass('formselect-haverror');
            jQuery(this).parents('.select-required').find('.select2-container .select2-choice,.select2-container .select2-selection--single').removeClass('select-error');
            jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
        }
    });

     jQuery('.selectnozero-required .select2-custom').change(function(){
         if(jQuery(this).find('option:selected').val() && jQuery(this).find('option:selected').val() != 0)
         {
             jQuery(this).parents('.form-group').removeClass('formselect-haverror');
             jQuery(this).parents('.select-required').find('.select2-container .select2-choice,.select2-container .select2-selection--single').removeClass('select-error');
         }
     });

     jQuery('.selectzero-related .select2-custom').change(function(){
         if(jQuery(this).find('option:selected').val())
         {
             $('.select-nozero').removeClass('selectnozero-required');
         }
     });

     jQuery('.filerequired').change(function() {
         if(jQuery(this).val()) {
             jQuery(this).parents('.btn-upload').removeClass('btnupload-error');
         }
     });
    
    jQuery(document).on('blur keypress','.txtinput-required',function(){
        if (!(jQuery(this).val())) {
            jQuery(this).removeClass('error-required required-field');
            jQuery(this).parents('.form-group').removeClass('error-parent forminput-haverror');
        }
    });

     jQuery(document).on('blur keydown','.txtinput-email',function(){
         if (jQuery(this).val().trim().length > 0 && emailreg.test(jQuery(this).val().trim()) == true) {
             jQuery(this).removeClass('error-required required-field');
             jQuery(this).parents('.form-group').removeClass('error-parent forminput-haverror');
         }
     });

     jQuery(document).on('blur keyup','.txtinput-mobile',function(){
         var str = jQuery(this).val();
         if ((jQuery(this).val().trim().length >= 10) && (str.substring(0, 2) == '05')) {
             jQuery(this).removeClass('error-required required-field');
             jQuery(this).parents('.form-group').removeClass('error-parent forminput-haverror');
             jQuery(this).parents('.form-group').find('.error-msg-validation').remove();
         }
     });

     jQuery(document).on('submit','.question-region form',function() {
         var elm = jQuery(this);
         if(elm.find('.qanswers-region .radio-btn:checked').length <= 0)
         {
             jQuery('.question-validtion').addClass('questionvalidtion-show');
             return false;
         }
         else
         {
             jQuery('.question-validtion').removeClass('questionvalidtion-show');
         }
     });

     jQuery(document).on('change','.question-region form .radio-btn',function() {
         jQuery('.question-validtion').removeClass('questionvalidtion-show');
     });

     jQuery(document).on('change','.accept-terms .checkbox-region>input[type=checkbox]',function() {
         if (jQuery(this).prop('checked') == true) {
             jQuery(this).parents('.checkbox-area').find('.error-msg-validation').remove();
         }
     });

     $('.checkbox-required input[type=checkbox]').change(function () {
         if (jQuery(this).prop('checked') == true) {
             jQuery(this).parents('.checkboxcustom-rg').find('.error-msg-validation').remove();
         }
     });
    //end
});