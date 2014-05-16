/**
 * Created by Martin on 20.10.13.
 */
var psc = {
    value:'',
    input_name:'',
    message_error:'',
    message_check:'',
    message_check_active:false,
    verify: function(id,show_message){
        var check = 0;
        this.message_error = 'neplatné PSÈ';
        var obj = document.getElementById(id);
        if ((obj.value.length == 5) || (obj.value.length == 6)){
            if ((obj.value * -1) < 0){
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