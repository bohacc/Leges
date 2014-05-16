/**
 * Notia Informaèní systémy, spol. s r. o.
 * Created by Martin Boháè on 7.10.13.
 */
$(document).ready(function(){
    $('#menchartform').bind("submit", function(e) {
        e.preventDefault();
        return false;
    });

    $('#menchartform').bind("keypress", function(e) {
        var code = e.keyCode || e.which;
        if (code  == 13) {
            e.preventDefault();
            return false;
        }
    });

    $(".js-brand").click(function(){
        $("#brand").val($(this).find('img').attr("data-brand"));
        $('#poslat').click();
    });
});

function newPayment(obj){
    nAjax("web_redir", "aparameters=akod_r:web_eshop_new_payment_json&aparameters=spouzetelo:1&aparameters=aid_objp:"+gpay.id, function(data){
        var data_fmt = $.parseJSON(data);
        var state = decodeURIComponent(data_fmt.state);
        if(state === "1"){
            $("#merchantref").val(decodeURIComponent(data_fmt.merchantref));
            obj.submit();
        }else{
            alert("Pøi inicializaci vstupního formuláøe došlo k chybì, kontaktujte nás!");
        }
    });
}