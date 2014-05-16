/**
 * Notia Informaèní systémy, spol. s r. o.
 * Created by Martin Boháè on 7.10.13.
 */
function nAjax( aurl, aparams, afunc, async ){
    function nEncodeUri(str){
        var par, tmp, par_out = [];
        par = str.split("&");
        for(var i = 0, l = par.length; i < l; ++i){
            if(par[i].length > 0){
                tmp = par[i].split(":");
                par_out.push(tmp[0] + ":" + encodeURIComponent(tmp[1]));
            }
        }
        return par_out.join("&");
    }
    var xasync = true;
    var adata = nEncodeUri( aparams + "&aparameters=aajx:1&aparameters=rnd:" + Math.random()*99999 );
    var acharset = 'utf-8';
    if (async != null) {
        xasync = async;
    }
    try{
        $.ajax({
            url: aurl + "?",
            type: 'POST',
            data: adata,
            success: function( data ) {
                afunc( data );
            },
            contentType: "application/x-www-form-urlencoded; charset=" + acharset,
            async: xasync
        });
    }catch(err) {

    }
}

function logout(){
    nAjax("web_redir", "aparameters=akod_r:web_odhlasit_eshop&aparameters=spouzetelo:1&aparameters=aCookie_kod:NBS_PARTNER", function(data){
        window.location.href = 'nakladatelstvi-leges';
    });
}

function vlozDoKos(kod, mnozstvi, url){
    nAjax("web_redir", "aparameters=akod_r:VLOZIT_DO_KOSIKU_JSON&aparameters=spouzetelo:1&aparameters=akod:"+kod+"&aparameters=amnozstvi:"+mnozstvi, function(data) {
        var data_fmt = $.parseJSON(data);
        var state = decodeURIComponent(data_fmt.state);
        var message = decodeURIComponent(data_fmt.message);
        if(state == '1'){
            window.location.href = url;
        }else{
            alert(message);
        }
    });

};

function setPortletMenuLogin(quantity){
    var str = "";
    if(quantity > 0){
        str = '<strong>Nákupní&nbsp;taška&nbsp;('+quantity+')</strong>';
    }else{
        str = 'Nákupní&nbsp;taška';
    }
    $('.js-nakupni-taska').html(str);
}
