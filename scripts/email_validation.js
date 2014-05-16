/**
 * Created by Martin on 20.10.13.
 */
var email = {
    value:'',
    input_name:'',
    message_error:'',
    message_check:'',
    message_check_active:false,
    verify: function(id,show_message){
        if (id != ''){this.input_name = id};
        this.message_check_active = show_message;
        var input = document.getElementById(this.input_name);
        this.value = input.value;
        if (this.message_error == ''){
            this.message_error = 'neplatný email';
        }
        if (this.message_check == ''){
            this.message_check = 'Email je v poøádku.';
        }
        var val = this.value;
        var front = '';
        var behind = '';
        var delimiter = 0;
        var last_delimiter = 0;
        var check = 1;
        var dot = 0;
        var last_dot = 0;

        delimiter = val.indexOf('@');
        last_delimiter = val.lastIndexOf('@');
        front = val.substr(1,delimiter);
        behind = val.substr(delimiter+1,val.length);
        dot = val.substr(delimiter+1,val.length).indexOf('.');
        last_dot = val.substr(delimiter+1,val.length).lastIndexOf('.');

        if (delimiter < 0){ check = 0;};
        if (front.length <= 0){ check = 0;};
        if (behind.length <= 0){ check = 0;};
        if (dot <= 0){ check = 0;};
        if (dot+1 == behind.length){ check = 0;};
        if (last_dot+1 == behind.length){ check = 0;};
        if (delimiter != last_delimiter){ check = 0;};
        if (behind.indexOf == 0){ check = 0;};

        if (check == 0){
            if (this.message_check != '' && this.message_check_active) {alert(this.message_error+' '+val);};
            if (input.style.visibility == true){
                input.focus();
            }
            return false;
        }
        else {
            if (input.style.visibility == true){
                input.focus();
            }
            return true;
        };
    }
};