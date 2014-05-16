/**
 * Created by Martin on 20.10.13.
 */
var phone = {
    value:'',
    input_name:'',
    message_error:'',
    message_check:'',
    message_check_active:false,
    verify: function(id,show_message){
        var check = 0;
        this.message_error = 'neplatný telefon';
        var obj = document.getElementById(id);
        var val = obj.value.replace(/ /g,'');
        if ((val.length == 9) || ((val.length == 13) && (val.substring(0,1) == '+'))){
            val = val.replace('+','');
            if ((val * -1) < 0){
                check = 1;
            }
        }
        if ((show_message == true) && (check == 0)){alert(this.message_error);}
        if (check == 1){
            return true;
        }else{
            return false;
        };
    }
}