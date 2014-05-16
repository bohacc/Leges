/**
 * Notia Informaèní systémy, spol. s r. o.
 * Created by Martin Boháè on 17.10.13.
 */

var MainApp = angular.module('MainApp',[]);

MainApp.controller('MainController',['$http','$rootScope','$location',function($http,$rootScope,$location){
    var cart = {};
    var delivery = {};
    var order = {};
    var loadCart = function(){
            $http({method:'POST',url:'web_redir?aparameters=akod_r:web_udaje_eshop_kosik_json&aparameters=spouzetelo:1',cache:false}).
                success(function(data, status, headers, config) {
                    var items = [];
                    for (var i = 0, l = data.records.length; i < l; ++i) {
                        var tmp = data.records[i];
                        items.push({ rowid: tmp.cislo,
                            code: decodeURIComponent(tmp.kod),
                            name: decodeURIComponent(tmp.nazev),
                            redirect: decodeURIComponent(tmp.presmerovani),
                            quantity: decodeURIComponent(tmp.mnozstvi),
                            amount: decodeURIComponent(tmp.castka),
                            amount_vat: decodeURIComponent(tmp.castka_sdph)});
                    }
                    cart.items = items;
                    cart.quantity = decodeURIComponent(data.mnozstvi);
                    cart.sum_amount = decodeURIComponent(data.castka);
                    cart.sum_amount_tp = decodeURIComponent(data.castka_dp);
                    cart.sum_amount_vat = decodeURIComponent(data.castka_sdph);
                    cart.sum_amount_vat_tp = decodeURIComponent(data.castka_sdph_dp);
                    setPortletMenuLogin(cart.quantity);
                }).
                error(function(data, status, headers, config) {

                });
    }

    var loadDelivery = function(){
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_udaje_eshop_uzivatele_json&aparameters=spouzetelo:1',cache:false}).
            success(function(data, status, headers, config) {
                delivery.person = decodeURIComponent(data.osoba) == '1' || decodeURIComponent(data.osoba) == '';
                delivery.company_billing = decodeURIComponent(data.nazev_fak);
                delivery.ic = decodeURIComponent(data.ic);
                delivery.dic = decodeURIComponent(data.dic);
                delivery.first_name_billing = decodeURIComponent(data.jmeno_fak);
                delivery.last_name_billing = decodeURIComponent(data.prijmeni_fak);
                delivery.street_billing = decodeURIComponent(data.ulice_fak);
                delivery.city_billing = decodeURIComponent(data.mesto_fak);
                delivery.zip_billing = decodeURIComponent(data.psc_fak);
                delivery.state_billing = 'CZ';//decodeURIComponent(data.stat_fak);
                delivery.phone = decodeURIComponent(data.telefon);
                delivery.email = decodeURIComponent(data.email);
                delivery.company_delivery = decodeURIComponent(data.nazev_dod);
                delivery.first_name_delivery = decodeURIComponent(data.jmeno_dod);
                delivery.last_name_delivery = decodeURIComponent(data.prijmeni_dod);
                delivery.street_delivery = decodeURIComponent(data.ulice_dod);
                delivery.city_delivery = decodeURIComponent(data.mesto_dod);
                delivery.zip_delivery = decodeURIComponent(data.psc_dod);
                delivery.state_delivery = 'CZ';//decodeURIComponent(data.stat_dod);
                delivery.sum_amount = decodeURIComponent(data.castka_celkem);
                delivery.sum_amount_vat = decodeURIComponent(data.castka_celkem_sdph);
                delivery.sum_vat = decodeURIComponent(data.dan_celkem);
                delivery.amount_tp = decodeURIComponent(data.dap_castka);
                delivery.amount_vat_tp = decodeURIComponent(data.dap_castka_sdph);
                delivery.delivery_is_billing = decodeURIComponent(data.dodaci_je_fakturacni);
                delivery.transport = decodeURIComponent(data.doprava);
                delivery.transport_name = decodeURIComponent(data.doprava_nazev);
                delivery.payment = decodeURIComponent(data.platba);
                delivery.payment_name = decodeURIComponent(data.platba_nazev);
                delivery.payment_description = decodeURIComponent(data.platba_popis);
                delivery.transport_description = decodeURIComponent(data.doprava_popis);
                delivery.pay_trans_info = delivery.payment_description != '' || delivery.transport_description != '';
                delivery.password = '';
                delivery.password_verify = '';
                delivery.login_name = decodeURIComponent(data.login_client) != '0' ? decodeURIComponent(data.login_client) : '';
            }).
            error(function(data, status, headers, config) {

            });
    }

    var loadDeliveryInfo = function(){
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_udaje_eshop_uzivatele_json&aparameters=spouzetelo:1',cache:false}).
            success(function(data, status, headers, config) {
                delivery.sum_amount = decodeURIComponent(data.castka_celkem);
                delivery.sum_amount_vat = decodeURIComponent(data.castka_celkem_sdph);
                delivery.sum_vat = decodeURIComponent(data.dan_celkem);
                delivery.amount_tp = decodeURIComponent(data.dap_castka);
                delivery.amount_vat_tp = decodeURIComponent(data.dap_castka_sdph);
                delivery.delivery_is_billing = decodeURIComponent(data.dodaci_je_fakturacni);
                delivery.transport = decodeURIComponent(data.doprava);
                delivery.transport_name = decodeURIComponent(data.doprava_nazev);
                delivery.payment = decodeURIComponent(data.platba);
                delivery.payment_name = decodeURIComponent(data.platba_nazev);
                delivery.payment_description = decodeURIComponent(data.platba_popis);
                delivery.transport_description = decodeURIComponent(data.doprava_popis);
                delivery.pay_trans_info = delivery.payment_description != '' || delivery.transport_description != '';
            }).
            error(function(data, status, headers, config) {

            });
    }

    var loadTransports = function(payment){
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_udaje_doprava_objed_json&aparameters=spouzetelo:1&aparameters=aplatba:'+encodeURIComponent(payment),cache:false}).
            success(function(data, status, headers, config) {
                var items = [];
                for (var i = 0, l = data.records.length; i < l; ++i) {
                    var tmp = data.records[i];
                    items.push({ amount : decodeURIComponent(tmp.cena),
                                amount_vat : decodeURIComponent(tmp.cena_sdph),
                                edit : decodeURIComponent(tmp.editovat) == '1',
                                code : decodeURIComponent(tmp.kod),
                                name : decodeURIComponent(tmp.nazev),
                                selected : {}
                    });
                }
                delivery.transports = items;
            }).
            error(function(data, status, headers, config) {

            });
    }

    var loadPayments = function(transport){
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_udaje_platba_objed_json&aparameters=spouzetelo:1&aparameters=adoprava:'+encodeURIComponent(transport),cache:false}).
            success(function(data, status, headers, config) {
                var items = [];
                for (var i = 0, l = data.records.length; i < l; ++i) {
                    var tmp = data.records[i];
                    items.push({ amount : decodeURIComponent(tmp.cena),
                        amount_vat : decodeURIComponent(tmp.cena_sdph),
                        edit : decodeURIComponent(tmp.editovat) == '1',
                        code : decodeURIComponent(tmp.kod),
                        name : decodeURIComponent(tmp.nazev),
                        selected : {}
                    });
                }
                delivery.payments = items;
            }).
            error(function(data, status, headers, config) {

            });
    }

    var verifyData = function(checkedDelivery, verifyCredential, verifyRegistration, verifyOrder){
        var ok = true;
        //REGISTRATION
        if(verifyRegistration && !$rootScope.delivery.person){
            if(ok && $rootScope.delivery.company_billing.length == 0){
                ok = false;
                alert('Název musí být vyplnìn');
            }
            if(ok && $rootScope.delivery.ic.length == 0){
                ok = false;
                alert('IÈ musí být vyplnìno');
            }
        }
        // BILLING
        if(ok && $rootScope.delivery.first_name_billing.length == 0){
            ok = false;
            alert('Jméno musí být vyplnìno');
        }
        if(ok && $rootScope.delivery.last_name_billing.length == 0){
            ok = false;
            alert('Pøíjmení musí být vyplnìno');
        }
        if(ok && $rootScope.delivery.street_billing.length == 0){
            ok = false;
            alert('Ulice fakturaèní musí být vyplnìna');
        }
        if(ok && $rootScope.delivery.city_billing.length == 0){
            ok = false;
            alert('Mìsto fakturaèní musí být vyplnìno');
        }
        if(ok && $rootScope.delivery.zip_billing.length == 0){
            ok = false;
            alert('PSÈ fakturaèní musí být vyplnìno');
        }
        if(ok && $rootScope.delivery.email.length == 0){
            ok = false;
            alert('Email musí být vyplnìn');
        }
        if(ok && $rootScope.delivery.phone.length == 0){
            ok = false;
            alert('Telefon musí být vyplnìn');
        }
        // FORMAT
        if(ok && !email.verify('aemail',false)){
            ok = false;
            alert('Neplatný email');
        }
        if(ok && !phone.verify('aphone',false)){
            ok = false;
            alert('Neplatný telefon');
        }
        if(ok && !psc.verify('azip_billing',false) && $rootScope.delivery.zip_billing.length > 0){
            ok = false;
            alert('Neplatné PSÈ fakturaèní');
        }
        // DELIVERY
        if(!checkedDelivery){
            if(ok && $rootScope.delivery.first_name_billing.length == 0){
                ok = false;
                alert('Jméno pøíjemce musí být vyplnìno');
            }
            if(ok && $rootScope.delivery.last_name_billing.length == 0){
                ok = false;
                alert('Pøíjmení pøíjemce musí být vyplnìno');
            }
            if(ok && $rootScope.delivery.street_billing.length == 0){
                ok = false;
                alert('Ulice pøíjemce musí být vyplnìna');
            }
            if(ok && $rootScope.delivery.city_billing.length == 0){
                ok = false;
                alert('Mìsto pøíjemce musí být vyplnìno');
            }
            if(ok && $rootScope.delivery.zip_billing.length == 0){
                ok = false;
                alert('PSÈ pøíjemce musí být vyplnìno');
            }
            if(ok && !psc.verify('azip_delivery',false) && $rootScope.delivery.zip_delivery.length > 0){
                ok = false;
                alert('Neplatné PSÈ pøíjemce');
            }
        }
        if(verifyOrder){
            if(ok && $rootScope.delivery.transport.length == 0){
                ok = false;
                alert('Zpùsob dopravy musí být vyplnìn');
            }
            if(ok && $rootScope.delivery.payment.length == 0){
                ok = false;
                alert('Zpùsob platby musí být vyplnìn');
            }
            if(ok && !$rootScope.delivery.checkedTermsAndConditions){
                ok = false;
                alert('Pro pokraèování musíte souhlasit s obchodními podmínkami.');
            }
        }
        if(verifyCredential){
            if(ok && $rootScope.delivery.password != $rootScope.delivery.password_verify){
                ok = false;
                alert('Heslo je jiné než heslo pro ovìøení.');
            }
            if(ok && ($rootScope.delivery.password.length == 0 || $rootScope.delivery.password_verify.length == 0)){
                ok = false;
                alert('Heslo a heslo pro ovìøení musí být vyplnìno.');
            }
        }
        return ok;
    }

    var setDelivery = function(){
        $rootScope.delivery.first_name_delivery = $rootScope.delivery.first_name_billing;
        $rootScope.delivery.last_name_delivery = $rootScope.delivery.last_name_billing;
        $rootScope.delivery.street_delivery = $rootScope.delivery.street_billing;
        $rootScope.delivery.city_delivery = $rootScope.delivery.city_billing;
        $rootScope.delivery.zip_delivery = $rootScope.delivery.zip_billing;
    }

    var setPath = function(){
        if($rootScope.path == '/'+$rootScope.home){
            window.location.href = $rootScope.home;
        }else{
            $location.path($rootScope.path);
        }
        $rootScope.path = '/'+$rootScope.home;
    }

    $rootScope.cart = cart;
    $rootScope.delivery = delivery;
    $rootScope.delivery.checkedTermsAndConditions = false;
    $rootScope.delivery.note_order = '';
    $rootScope.delivery.note_delivery = '';
    $rootScope.delivery.orderWithoutLogin = false;
    $rootScope.loadCart = loadCart;
    $rootScope.loadDelivery = loadDelivery;
    $rootScope.loadDeliveryInfo = loadDeliveryInfo;
    $rootScope.loadTransports = loadTransports;
    $rootScope.loadPayments = loadPayments;
    $rootScope.verifyData = verifyData;
    $rootScope.setDelivery = setDelivery;
    $rootScope.setPath = setPath;
    $rootScope.home = 'nakladatelstvi-leges'
    $rootScope.path = '/'+$rootScope.home;

    //-- RUN --
    loadCart();
}]);

MainApp.controller('CartController',['$scope','$http','$location','$rootScope', function($scope, $http, $location, $rootScope){
    $scope.isLoginPage = false;
    $scope.login_url = '/templates/login.html';
    $scope.j = 0;
    $scope.deleteItemCart = function(index){
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_odstr_z_kos_dle_cisla_json&aparameters=spouzetelo:1&aparameters=acislo:'+$rootScope.cart.items[index].rowid,cache:false}).
            success(function(data, status, headers, config){
                $rootScope.loadCart();
            }).
            error(function(){
                alert('Pøi odstranìní položky z košíku došlo k chybì.');
            });
    };
    $scope.orderCart = function(){
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_overit_prihlaseni_json&aparameters=spouzetelo:1',cache:false}).
            success(function(data, status, headers, config){
                if($rootScope.cart.items.length > 0){
                    $rootScope.delivery.orderWithoutLogin = false;
                    if(data.prihlasen == '1'){
                        $location.path('/objednani-dodaci-udaje');
                    }else{
                        $rootScope.path = '/objednani-dodaci-udaje';
                        $location.path('/prihlaseni-uzivatele');
                    }
                }else{
                    alert("V košíku nemáte žádné zboží.");
                }
            });
    };
    $scope.orderWithoutLoginCart = function(){
        if($rootScope.cart.items.length > 0){
            $rootScope.delivery.orderWithoutLogin = true;
            $location.path('/objednani-dodaci-udaje');
        }else{
            alert("V košíku nemáte žádné zboží.");
        }
    };
    $scope.changeQuantityCart = function(index){
        var params = 'aparameters=akod_r:web_zmen_mnoz_kos_dle_cis_json'+
                     '&aparameters=spouzetelo:1'+
                     '&aparameters=amnozstvi:'+encodeURIComponent($rootScope.cart.items[index].quantity)+
                     '&aparameters=acislo:'+encodeURIComponent($rootScope.cart.items[index].rowid);
        if($rootScope.cart.items[index].quantity.length > 0){
            $http({method: 'POST', url: 'web_redir?'+params,cache:false}).
                success(function(){
                    $rootScope.loadCart();
                }).
                error(function(){
                });
        }
    }
    $scope.recalculateCart = function(){
        $scope.j = 0;
        for (var i = 0; i < $rootScope.cart.items.length; i++) {
            var item = $rootScope.cart.items[i];
            var params = 'aparameters=akod_r:web_zmen_mnoz_kos_dle_cis_json'+
                        '&aparameters=spouzetelo:1'+
                        '&aparameters=amnozstvi:'+encodeURIComponent($rootScope.cart.items[i].quantity)+
                        '&aparameters=acislo:'+encodeURIComponent($rootScope.cart.items[i].rowid);
            $http({method: 'POST',url: 'web_redir?'+params,cache:false}).
                success(function(){
                    $scope.j += 1;
                });
        }
    }
    $scope.refreshCart = function(){
        if($scope.j > 0 && $scope.j == $rootScope.cart.items.length){
            $rootScope.loadCart();
        }
    }
    $scope.$watch('j',$scope.refreshCart);
}]);

MainApp.controller('LoginController',['$scope','$http','$location','$rootScope',function($scope,$http,$location,$rootScope){
    $scope.login_name = '';
    $scope.login_password = '';
    $scope.login = function(){
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_prihlasit_eshop&aparameters=spouzetelo:1&aparameters=alg:'+encodeURIComponent($scope.login_name)+'&aparameters=apd:'+encodeURIComponent($scope.login_password),cache:false}).
            success(function(data, status, headers, config){
                if(data.state != '1'){
                    alert('Chybné jméno nebo heslo.');
                }else{
                    if($rootScope.path == '/'+$rootScope.home){
                        window.location.href = $rootScope.home;
                    }else{
                        window.location.href = 'nakupni-kosik#'+$rootScope.path;
                        window.location.reload();
                    }
                }
            }).
            error(function(){
            });
    }
    $scope.showRegistration = function(){
        $location.path('/nova-registrace');
    }
}]);

MainApp.controller('RecapitulationController',['$scope','$location','$rootScope','$http',function($scope, $location, $rootScope, $http){
    $scope.sendingOrder = false;
    $scope.order = function(){
        $scope.sendingOrder = true;
        var params = '&aparameters=pole:poznamka&aparameters=apoznamka:'+$scope.delivery.note_order+
                     '&aparameters=pole:poznamka2&aparameters=apoznamka2:'+$scope.delivery.note_delivery;
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_uloz_udaje_eshop_uziv_json&aparameters=spouzetelo:1'+params,cache:false}).
            success(function(data, status, headers, config){
                if(data.state == '1'){
                    $http({method:'POST',url:'web_redir?aparameters=akod_r:web_udaje_eshop_uzivatele_json&aparameters=spouzetelo:1',cache:false}).
                        success(function(data, status, headers, config){
                            if( data.polozek_kosiku != null && data.polozek_kosiku != '0' ) {
                                $http({method:'POST',url:'web_redir?aparameters=akod_r:web_eshop_vytvorit_objed_json&aparameters=spouzetelo:1',cache:false}).
                                    success(function(){
                                        window.location.href = 'uspesne-objednani';
                                    });
                            } else {
                                messageDlg( 'V košíku není žádné zboží.' );
                                window.location.href = $rootScope.home;
                            };
                        });
                }else{
                    alert(decodeURIComponent(data.message));
                }

            }).
            error(function(){
            });
    }
    $scope.goDelivery = function(){
        $location.path('/objednani-dodaci-udaje');
    }

    //-- RUN --
    $rootScope.loadCart();
    $rootScope.loadDelivery();
}]);

MainApp.controller('ThanksController',['$scope',function($scope){

}]);

MainApp.controller('RegistrationController',['$scope','$rootScope','$http','$location',function($scope,$rootScope,$http,$location){
    $scope.registration_title = 'Vaše registraèní údaje';
    $scope.newRegistration = false;
    $scope.verifyOK = false;
    $scope.$watch('delivery.delivery_is_billing',function(){$scope.checkedDelivery = $rootScope.delivery.delivery_is_billing == '1'});
    $scope.updateCustomer = function(){
        if($rootScope.verifyData($scope.checkedDelivery, false, true)){
            if($scope.checkedDelivery){
                $rootScope.setDelivery();
            }
            var params = '&aparameters=aemail:'+encodeURIComponent($rootScope.delivery.email)+'&aparameters=pole:email'+
                '&aparameters=atelefon:'+encodeURIComponent($rootScope.delivery.phone)+'&aparameters=pole:telefon'+
                '&aparameters=ajmeno_fak:'+encodeURIComponent($rootScope.delivery.first_name_billing)+'&aparameters=pole:jmeno_fak'+
                '&aparameters=aprijmeni_fak:'+encodeURIComponent($rootScope.delivery.last_name_billing)+'&aparameters=pole:prijmeni_fak'+
                '&aparameters=aulice_fak:'+encodeURIComponent($rootScope.delivery.street_billing)+'&aparameters=pole:ulice_fak'+
                '&aparameters=amesto_fak:'+encodeURIComponent($rootScope.delivery.city_billing)+'&aparameters=pole:mesto_fak'+
                '&aparameters=apsc_fak:'+encodeURIComponent($rootScope.delivery.zip_billing)+'&aparameters=pole:psc_fak'+
                '&aparameters=anazev_fak:'+encodeURIComponent($rootScope.delivery.company_billing)+'&aparameters=pole:nazev_fak'+
                '&aparameters=aic:'+encodeURIComponent($rootScope.delivery.ic)+'&aparameters=pole:ic'+
                '&aparameters=adic:'+encodeURIComponent($rootScope.delivery.dic)+'&aparameters=pole:dic'+
                '&aparameters=adodaci_je_fakturacni:'+encodeURIComponent($rootScope.delivery.delivery_is_billing ? '1' : '0')+'&aparameters=pole:dodaci_je_fakturacni'+
                '&aparameters=ajmeno_dod:'+encodeURIComponent($rootScope.delivery.first_name_delivery)+'&aparameters=pole:jmeno_dod'+
                '&aparameters=aprijmeni_dod:'+encodeURIComponent($rootScope.delivery.last_name_delivery)+'&aparameters=pole:prijmeni_dod'+
                '&aparameters=anazev_dod:'+encodeURIComponent($rootScope.delivery.company_delivery)+'&aparameters=pole:nazev_dod'+
                '&aparameters=aulice_dod:'+encodeURIComponent($rootScope.delivery.street_delivery)+'&aparameters=pole:ulice_dod'+
                '&aparameters=amesto_dod:'+encodeURIComponent($rootScope.delivery.city_delivery)+'&aparameters=pole:mesto_dod'+
                '&aparameters=apsc_dod:'+encodeURIComponent($rootScope.delivery.zip_delivery)+'&aparameters=pole:psc_dod';
            $http({method:'POST',url:'web_redir?aparameters=akod_r:web_uloz_udaje_eshop_uziv_json&aparameters=spouzetelo:1'+params,cache:false}).
                success(function(data, status, headers, config){
                    if(data.state == '1'){
                        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_eshop_zalozit_uziv_json&aparameters=spouzetelo:1'+params,cache:false}).
                            success(function(){
                                $location.path('/registrace-ulozena');
                            });
                    }else{
                        alert(decodeURIComponent(data.message));
                    }
                });
        }
    }
    $scope.send = $scope.updateCustomer;

    //-- RUN --
    $rootScope.loadDelivery();
}]);

MainApp.controller('DeliveryController',['$scope','$location','$rootScope','$http',function($scope, $location, $rootScope, $http){
    $scope.goRecapitulation = function(){
        if($rootScope.verifyData($scope.checkedDelivery,null,null,true)){
            if($scope.checkedDelivery){
                $rootScope.setDelivery();
            }
            var params = '&aparameters=aemail:'+encodeURIComponent($rootScope.delivery.email)+'&aparameters=pole:email'+
                '&aparameters=atelefon:'+encodeURIComponent($rootScope.delivery.phone)+'&aparameters=pole:telefon'+
                '&aparameters=ajmeno_fak:'+encodeURIComponent($rootScope.delivery.first_name_billing)+'&aparameters=pole:jmeno_fak'+
                '&aparameters=aprijmeni_fak:'+encodeURIComponent($rootScope.delivery.last_name_billing)+'&aparameters=pole:prijmeni_fak'+
                '&aparameters=aulice_fak:'+encodeURIComponent($rootScope.delivery.street_billing)+'&aparameters=pole:ulice_fak'+
                '&aparameters=amesto_fak:'+encodeURIComponent($rootScope.delivery.city_billing)+'&aparameters=pole:mesto_fak'+
                '&aparameters=apsc_fak:'+encodeURIComponent($rootScope.delivery.zip_billing)+'&aparameters=pole:psc_fak'+
                '&aparameters=anazev_fak:'+encodeURIComponent($rootScope.delivery.company_billing)+'&aparameters=pole:nazev_fak'+
                '&aparameters=aic:'+encodeURIComponent($rootScope.delivery.ic)+'&aparameters=pole:ic'+
                '&aparameters=adic:'+encodeURIComponent($rootScope.delivery.dic)+'&aparameters=pole:dic'+
                '&aparameters=ajmeno_dod:'+encodeURIComponent($rootScope.delivery.first_name_delivery)+'&aparameters=pole:jmeno_dod'+
                '&aparameters=aprijmeni_dod:'+encodeURIComponent($rootScope.delivery.last_name_delivery)+'&aparameters=pole:prijmeni_dod'+
                '&aparameters=anazev_dod:'+encodeURIComponent($rootScope.delivery.company_delivery)+'&aparameters=pole:nazev_dod'+
                '&aparameters=aulice_dod:'+encodeURIComponent($rootScope.delivery.street_delivery)+'&aparameters=pole:ulice_dod'+
                '&aparameters=amesto_dod:'+encodeURIComponent($rootScope.delivery.city_delivery)+'&aparameters=pole:mesto_dod'+
                '&aparameters=apsc_dod:'+encodeURIComponent($rootScope.delivery.zip_delivery)+'&aparameters=pole:psc_dod';
            $http({method:'POST',url:'web_redir?aparameters=akod_r:web_uloz_udaje_eshop_uziv_json&aparameters=spouzetelo:1'+params,cache:false}).
                success(function(data, status, headers, config){
                    if(data.state == '1'){
                        $location.path('/objednani-rekapitulace');
                    }else{
                        alert(decodeURIComponent(data.message));
                    }
                });
        }
    }
    $scope.goCart = function(){
        $location.path('/');
    }
    $scope.saveDelivery = function(){
        var delivery_is_billing = 0;
        if($scope.checkedDelivery){
            delivery_is_billing = 1;
        }
        $scope.setDelivery();
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_uloz_udaje_eshop_uziv_json&aparameters=spouzetelo:1&aparameters=pole:dodaci_je_fakturacni&aparameters=adodaci_je_fakturacni:'+delivery_is_billing,cache:false}).
            success(function(data, status, headers, config){
                if(data.state != '1'){
                    alert(decodeURIComponent(data.message));
                }
            }).
            error(function(){
            });
    }

    $scope.saveTransport = function(index){
        var kod = '';
        var obj = $rootScope.delivery.transports[index];
        if(obj.selected){kod = encodeURIComponent(obj.code);};
        $scope.editPayment = true;
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_doprava_na_e_objed_json&aparameters=spouzetelo:1&aparameters=akod:'+kod,cache:false}).
            success(function(){
                $scope.editPayment = false;
                $rootScope.loadCart();
                $rootScope.loadDeliveryInfo();
                $rootScope.loadTransports('');
                $rootScope.loadPayments(obj.code);
            });
    }

    $scope.savePayment = function(index){
        var kod = '';
        var obj = $rootScope.delivery.payments[index];
        if(obj.selected){kod = encodeURIComponent(obj.code);};
        $scope.editTransport = true;
        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_platba_na_e_objed_json&aparameters=spouzetelo:1&aparameters=akod:'+kod,cache:false}).
            success(function(){
                $scope.editTransport = false;
                $rootScope.loadCart();
                $rootScope.loadDeliveryInfo();
                $rootScope.loadTransports(obj.code);
                $rootScope.loadPayments('');
            });
    }
    $scope.editCustomers = function(){
        $rootScope.path = $location.path();
        $location.path('/uprava-registrace');
    }

    //-- RUN --
    $rootScope.loadCart();
    $rootScope.loadDelivery();
    $rootScope.loadTransports('');
    $rootScope.loadPayments('');
    $http({method:'POST',url:'web_redir?aparameters=akod_r:web_udaje_eshop_uzivatele_json&aparameters=spouzetelo:1',cache:false}).
        success(function(data, status, headers, config){
            if(data.dodaci_je_fakturacni == '1' || data.dodaci_je_fakturacni == ''){
                $scope.setDelivery();
                $scope.checkedDelivery = true;
            }
        });
}]);

MainApp.controller('NewRegistrationController',['$scope','$rootScope','$http','$location',function($scope,$rootScope,$http,$location){
    $scope.registration_title = 'Nová registrace';
    $scope.newRegistration = true;
    $scope.verifyOK = false;
    $scope.checkedDelivery = true;
    $scope.delivery.person = true;
    $scope.insertCustomer = function(){
        if($rootScope.verifyData($scope.checkedDelivery, true, true)){
            if($scope.checkedDelivery){
                $rootScope.setDelivery();
            }
            var params = '&aparameters=aemail:'+encodeURIComponent($rootScope.delivery.email)+'&aparameters=pole:email'+
                '&aparameters=atelefon:'+encodeURIComponent($rootScope.delivery.phone)+'&aparameters=pole:telefon'+
                '&aparameters=ajmeno_fak:'+encodeURIComponent($rootScope.delivery.first_name_billing)+'&aparameters=pole:jmeno_fak'+
                '&aparameters=aprijmeni_fak:'+encodeURIComponent($rootScope.delivery.last_name_billing)+'&aparameters=pole:prijmeni_fak'+
                '&aparameters=aulice_fak:'+encodeURIComponent($rootScope.delivery.street_billing)+'&aparameters=pole:ulice_fak'+
                '&aparameters=amesto_fak:'+encodeURIComponent($rootScope.delivery.city_billing)+'&aparameters=pole:mesto_fak'+
                '&aparameters=apsc_fak:'+encodeURIComponent($rootScope.delivery.zip_billing)+'&aparameters=pole:psc_fak'+
                '&aparameters=anazev_fak:'+encodeURIComponent($rootScope.delivery.company_billing)+'&aparameters=pole:nazev_fak'+
                '&aparameters=aic:'+encodeURIComponent($rootScope.delivery.ic)+'&aparameters=pole:ic'+
                '&aparameters=adic:'+encodeURIComponent($rootScope.delivery.dic)+'&aparameters=pole:dic'+
                '&aparameters=ajmeno_dod:'+encodeURIComponent($rootScope.delivery.first_name_delivery)+'&aparameters=pole:jmeno_dod'+
                '&aparameters=aprijmeni_dod:'+encodeURIComponent($rootScope.delivery.last_name_delivery)+'&aparameters=pole:prijmeni_dod'+
                '&aparameters=anazev_dod:'+encodeURIComponent($rootScope.delivery.company_delivery)+'&aparameters=pole:nazev_dod'+
                '&aparameters=aulice_dod:'+encodeURIComponent($rootScope.delivery.street_delivery)+'&aparameters=pole:ulice_dod'+
                '&aparameters=amesto_dod:'+encodeURIComponent($rootScope.delivery.city_delivery)+'&aparameters=pole:mesto_dod'+
                '&aparameters=apsc_dod:'+encodeURIComponent($rootScope.delivery.zip_delivery)+'&aparameters=pole:psc_dod'+
                '&aparameters=aosoba:'+encodeURIComponent($rootScope.delivery.person ? '1' : '0')+'&aparameters=pole:osoba'+
                '&aparameters=adodaci_je_fakturacni:'+encodeURIComponent($rootScope.delivery.delivery_is_billing ? '1' : '0')+'&aparameters=pole:dodaci_je_fakturacni'+
                '&aparameters=apwd:'+encodeURIComponent($rootScope.delivery.password)+'&aparameters=pole:pwd';
            $http({method:'POST',url:'web_redir?aparameters=akod_r:web_uloz_udaje_eshop_uziv_json&aparameters=spouzetelo:1'+params,cache:false}).
                success(function(data, status, headers, config){
                    if(data.state == '1'){
                        $http({method:'POST',url:'web_redir?aparameters=akod_r:web_eshop_exist_user_json&aparameters=spouzetelo:1&aparameters=alogin:'+encodeURIComponent($rootScope.delivery.login_name),cache:false}).
                            success(function(data, status, headers, config){
                                if ( decodeURIComponent(data.existuje) == '1' ) {
                                    alert('Uživatel s pøihlašovacím jménem ' + $rootScope.delivery.login_name + ' již existuje, zadejte jiné.' );
                                }else{
                                    $http({method:'POST',url:'web_redir?aparameters=akod_r:web_eshop_zalozit_uziv_json&aparameters=spouzetelo:1&aparameters=alg:'+encodeURIComponent($rootScope.delivery.login_name),cache:false}).
                                        success(function(data, status, headers, config){
                                            if(data.state == '1'){
                                                $location.path('/nova-registrace-ulozena');
                                            }else{
                                                alert(decodeURIComponent(data.message));
                                            }
                                        });
                                }
                            });
                    }else{

                    }
                });
        }
    }
    $scope.send = $scope.insertCustomer;

    //-- RUN --
    $rootScope.loadDelivery();
}]);

MainApp.controller('RegistrationSuccessController',function(){

});

MainApp.controller('HomeController',['$rootScope',function($rootScope){
    window.location.href = $rootScope.home;
}]);

MainApp.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
    $routeProvider.when('/', {
        templateUrl: '/templates/kosik.html',
        controller: 'CartController'
    });
    $routeProvider.when('/prihlaseni-uzivatele', {
        templateUrl: '/templates/login.html',
        controller: 'LoginController'
    });
    $routeProvider.when('/objednani-dodaci-udaje', {
        templateUrl: '/templates/dodaci_udaje.html',
        controller: 'DeliveryController'
    });
    $routeProvider.when('/objednani-rekapitulace', {
        templateUrl: '/templates/rekapitulace.html',
        controller: 'RecapitulationController'
    });
    $routeProvider.when('/podekovani', {
        templateUrl: '/templates/podekovani.html',
        controller: 'ThanksController'
    });
    $routeProvider.when('/nova-registrace', {
        templateUrl: '/templates/registrace.html',
        controller: 'NewRegistrationController'
    });
    $routeProvider.when('/uprava-registrace', {
        templateUrl: '/templates/registrace.html',
        controller: 'RegistrationController'
    });
    $routeProvider.when('/registrace-ulozena', {
        templateUrl: '/templates/registrace_uspesne_ulozena.html',
        controller: 'RegistrationSuccessController'
    });
    $routeProvider.when('/nova-registrace-ulozena', {
        templateUrl: '/templates/nova_registrace_uspesne_ulozena.html',
        controller: 'RegistrationSuccessController'
    });
    $routeProvider.when('/nakladatelstvi-leges', {
        templateUrl: '/templates/home.html',
        controller: 'HomeController'
    });

    $routeProvider.otherwise({redirecTo: '/'});

    $httpProvider.defaults.cache = false;

    //XSRF
    $httpProvider.defaults.headers.common['X-XSRF-TOKEN'] = 'KmHsMiuY+xua0I6XMiux+mQ9KiTVMjTunmA6+j5C'; //$('input[name="xsrf_token"]').val();
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic bGVnZXM6ZXNob3A=';
}]);