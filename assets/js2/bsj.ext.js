$(document).ready(function() {

    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    var strLanguage = "hr.txt";

    //$('#bsjsearchtext').popover();
    $('#bsjsearchtext').tooltip();

    $("input[type=text]").focus(function() { $(this).select(); });
    $("input[type=text]").mouseup(function(e) { e.preventDefault(); });

    $("#bsjToolsContainer").hide();
    $("#desktopdisplay").hide();
    
    

    var strWebServiceFromDOM = $("#bsjWebService").html();
    var strPickNonSerializeData = '';

   
    // ---------------------------------- autocomplete

    function log(message) {
        $("<div/>").text(message).prependTo("#log");
        $("#log").attr("scrollTop", 0);
        //alert(message);
    }

    // ------------------------------------------------------------ BUTTONS CLICKOVI  : Theme swicher, Search, Recent ....

    var bgindex = 0;
    if ($.Storage.get("bsjbgindex") != undefined) { bgindex = $.Storage.get("bsjbgindex") };
    if (bgindex > 0) { $.backstretch("assets/css/bg/" + bgindex + ".jpg"); }

    if ($.Storage.get("bsjThemeSwicher")) {
        $("link.changeme").attr("href", $.Storage.get("bsjThemeSwicher"));
        $("#bsjdebug").prepend("<li><b>" + hours + ":" + minutes + ":" + seconds + "</b><br/>THEME : " + $.Storage.get("bsjThemeSwicher") + "</li>");
    }

    if ($.Storage.get("bsjThemeSwicherAdditional")) {
        $("link.additional").attr("href", $.Storage.get("bsjThemeSwicherAdditional"));
        $("#bsjdebug").prepend("<li><b>" + hours + ":" + minutes + ":" + seconds + "</b><br/>ADDITIONAL CSS : " + $.Storage.get("bsjThemeSwicherAdditional") + "</li>");
    }

    $("#bsjThemeSwicher li a").live('click', function() {
        $("#bsjdebug").prepend("<li><b>" + hours + ":" + minutes + ":" + seconds + "</b><br/>THEME SWICHED TO : " + $(this).attr('rel') + " , BG INDEX: " + $(this).attr('bsjbgindex') + " ,ADDITIONAL CSS: " + $(this).attr('bsjadditional') + "</li>");
        $("#bsjThemeSwicher li").removeClass('active');
        $(this).parent().addClass('active');
        $.Storage.set({ "bsjThemeSwicher": $(this).attr('rel') });
        $.Storage.set({ "bsjThemeSwicherAdditional": $(this).attr('bsjadditional') });
        bgindex = parseFloat($(this).attr('bsjbgindex'));
        $.Storage.set({ "bsjbgindex": bgindex });
        $("link.changeme").attr("href", $(this).attr('rel'));
        $("link.additional").attr("href", $(this).attr('bsjadditional'));
        if (bgindex > 0) {
            $.backstretch("assets/css/bg/" + $(this).attr('bsjbgindex') + ".jpg");
        } else { $(".backstretch").remove(); }
    });

    $("#bsjtopsearchbutton").click(function() {
        $('#bsjsearchform').trigger('submit');
        $("#bsjtoprecentbutton").removeClass('btn-info');
        $("#bsjtopsearchbutton").addClass('btn-info');
    });

    $("#bsjtoprecentbutton").click(function() {
        $("#bsjtopsearchbutton").removeClass('btn-info');
        $("#bsjtoprecentbutton").addClass('btn-info');
    });

    $(".bsjtoprecentaction").click(function() {
        $("#bsjtoprecentbutton").html('<i class="icon-list"></i> ' + $(this).text());
        $("#bsjtoprecentbutton").attr('bsjAction', $(this).attr('bsjAction'));
        $("#bsjtoprecentbutton").trigger('click');
        $.Storage.set({ "bsjtoprecentaction": $(this).text() });
    });

    /*
    $("#bsjtopwrench").click(function() {
        if ($("#bsjtopwrench").hasClass('btn-danger')) { $("#bsjtopwrench").removeClass('btn-danger'); $("#bsjToolsContainer").hide('400'); $.Storage.set({ "bsjtopwrench": '' }); } else { $("#bsjtopwrench").addClass('btn-danger'); $("#bsjToolsContainer").show(''); position = -1; $('html, body').animate({ scrollTop: 0 }, ''); $.Storage.set({ "bsjtopwrench": '1' }); }
    });
    */

    $(".showhidesiblings").live('click', function() {
        if ($(this).children().hasClass('icon-file')) {
            $(this).children().removeClass('icon-file').addClass('icon-list');
            $(".bsjDocumentContainer,.bjsnavstep,.bsjseparator").hide('');
            $("#bsjDocumentContainer" + $(this).attr('kid')).show('');
        } else {
            $(this).children().removeClass('icon-list').addClass('icon-file');
            $(".bsjDocumentContainer,.bjsnavstep,.bsjseparator").show('');
        }
    });

    $(".printdoc").live('click', function() {
        window.print();
        return false;
    });


    // --------------------------------------------------------- log out ...
    $('#bsjClearDisplay').live('click', function() {
        //$(".bsjDisplay").html('');
        $(".bsjDisplay").hide();
    });

    $('#bsjSignOut').live('click', function() {
        $("#bsjLoginContainer").show();
        $('#username').html('');
        $("bsjusernameforlogout,#bsjwusername,#bsjwuserfullname,#bsjuserid,#bsjsessionkey,#bsjdesktopdisplay").html('');
        $(".bsjDisplay").hide();
        $("#bsjpassword").val('');
        $.Storage.set({ "bsjpassword": '' })
        $.Storage.set({ "bsjlogindisplay": '' });
        $("#bsjToolsContainer").hide();
        $('.bsjTopButtons').hide('slow');
        $('#bsjpassword').focus();
    });

    // --------------------------------------------------------- ucitaj jos ...

    $('.ucitajjos').live('click', function() {
        CallWebService('ucitajjos' + $(this).attr('position'), $(this).attr('action'), '', '', '', '', '');
        //$("#ucitajjoswrapper").html('');
    });

    $('.bsjDisplayBackButton').live('click', function() {
        $('#bsjdesktopdisplay').html($('#bsjTemp1').html());
    });

    // --------------------------------------------------------- FORM SUBMIT

    $('form').live('submit', function() {
        return false;
    });

    $('#bsjsearchform').submit(function() { // ovo treba izbaciti i staviti te gore srčove u klasu bsjCallWebServiceOnSubmit
        $("#bsjtoprecentbutton").removeClass('btn-info');
        $("#bsjtopsearchbutton").addClass('btn-info');
        var obj = { bsjDisplay: "bsjdesktopdisplay", bsjAction: "searchx", bsjSql: $("#bsjsearchtext").val() };
        CallWebService(obj);
        return false;
    });

    
    $('#bsjloginform').live('submit', function() {
        if (($("#bsjdatabase").val() != '') && ($("#bsjusername").val() != '') && ($("#bsjpassword").val() != '')) {
            $.Storage.set({ "bsjdatabase": $("#bsjdatabase").val(), "bsjusername": $("#bsjusername").val(), "bsjpassword": $("#bsjpassword").val() });
            var obj = {
                bsjDisplay: "bsjlogindisplay",
                bsjAction: "login"
            };
            CallWebService(obj);
            // ili ovako :
            //$div = $('<div></div>');
            //$div.attr('bsjDisplay', 'bsjlogindisplay');
            //$div.attr('bsjAction', 'login');
            //CallWebService($div);
            return false;
        } else { $("#bsjLoginContainer").show(); $("#bsjpassword").focus(); }
    });

    /* možda bude trebalo
    $('.table tbody tr td').live('click', function() {
    var currentCellText = $(this).text();
    var LeftCellText = $(this).prev().text();
    var RightCellText = $(this).next().text();
    var RowIndex = $(this).parent().parent().children().index($(this).parent());
    var ColIndex = $(this).parent().children().index($(this));
    var RowsAbove = RowIndex;
    var ColName = $(".head").children(':eq(' + ColIndex + ')').text();
    //var FirstDT = $('td:eq(0)', $(this).parent()).text();
    var FirstDT = $(this).parent().attr('id');
    });
    */

    $('.bsjhidewrapper').live('click', function() { // click na X na inner navbaru,  hide container
        $(this).parent().parent().parent().hide(300);
    });

    $('.table tbody tr').live('click', function(evt) {
        if (!evt.ctrlKey) { $(this).parent().children().removeClass('btn-danger'); $(this).parent().children().children().removeClass('btn-danger'); }
        //$(':first-child', this).addClass('btn-danger');
        $(this).addClass('btn-danger');
        $(this).children().addClass('btn-danger');
        PickNonSerializeData();

        var bsjRowClick = $(this).parent().parent().attr('bsjRowClick');
        if (bsjRowClick != '') { CallWebService($("#" + bsjRowClick)); }

        var bsjRowDblClick = $(this).parent().parent().attr('bsjRowDblClick');
        if (bsjRowDblClick != '') { CallWebService($("#" + bsjRowDblClick)); }

    });



    // ---------------------------------------------------------- ENTER AS TAB
    $('.enterastab').live("keypress", function(e) {
        if (e.keyCode == 13) {
            var inputs = $(this).parents("form").eq(0).find(":input");
            var idx = inputs.index(this);

            if (idx == inputs.length - 1) {
                inputs[0].select()
            } else {
                inputs[idx + 1].focus();
                inputs[idx + 1].select();
            }
            return false;
        }
    });

    // ---------------------------------------------------------- GENERIČKI POZIVI WEBSERVISA : onLoad, onClick , onLostFocus , onEnterKey , onAppear
    $('.bsjCallWebServiceOnClick').live('click', function() {
        CallWebService($(this));
        return false;
    });

    $('.bsjCallWebServiceOnClickOnEmptyDisplay').live('click', function () {
        if ($("#" + $(this).attr('bsjDisplay')).html().trim() == '') { CallWebService($(this)); } else {
            $("#" + $(this).attr('bsjDisplay')).children().toggle(100);
        };
        return false;
    });
    
    $('.bsjCallWebServiceOnSubmit').live('submit', function () {
        CallWebService($(this));
        return false;
    });
    
    $('.bsjCallWebServiceOnChange').live('change', function() {
        CallWebService($(this));
        return false;
    });

    $('.bsjCallWebServiceOnLostFocus').live('blur', function() { // isto kao i gore samo se dešva na onlostfocus
        //CallWebService($(this).attr('bsjDisplay'), $(this).attr('bsjAction'), $(this).attr('bsjSql'), $(this).attr('bsjFormat'), $(this).attr('bsjForm'), $(this).attr('bsjWebService'), '');
        //return false;
    });

    $('.bsjCallWebServiceOnEnterKey').live('keydown', function(event) { // isto kao i gore samo se dešva na enter key
        if (event.keyCode === 37) {
            //CallWebService($(this).attr('bsjDisplay'), $(this).attr('bsjAction'), $(this).attr('bsjSql'), $(this).attr('bsjFormat'), $(this).attr('bsjForm'), $(this).attr('bsjWebService'), '');
        }
        return false;
    });

    // ---------------------------------------------------------- NAVIGATE NEXT & PREV POST

    $("#bsjsearchtext").live("keydown", function(event) {
        if (event.keyCode === 37) { $('.bsjprev').click(); }
        if (event.keyCode === 39) { $('.bsjnext').click(); }
    })


    function scrollToPosition(element) {
        if (element !== undefined) {
            $.scrollTo(element, 800, { margin: true });
        }
    }

    var posts = $('.bjsnavstep');
    var position = -1;
    var next = $('.bsjnext');
    var prev = $('.bsjprev');

    next.click(function(evt) {
        scrollToPosition(posts[position += 1]);
        if (position > posts.length - 2) {
            position = posts.length - 2;
        }
    });

    prev.click(function(evt) {
        scrollToPosition(posts[position -= 1]);
        if (position < 0) {
            position = -1;
            $('html, body').animate({ scrollTop: 0 }, '');
        }
    });

    //---------------------------------------------------------------------------------- SREDI SQL

    function SrediSQL(strSQL) {

        strSQL = strSQL.replace(/'/g, "@@@");
        strSQL = strSQL.replace(/@@operateriid/g, "7");
        strSQL = strSQL.replace(/@@id/g, $("#clipboard").data('id'));
        strSQL = encodeURI(strSQL);
        //strSQL = encodeURIComponent(strSQL);
        return strSQL;
    }

    function PickNonSerializeData(strObjID) { // pokupim ID-je označenih redova u tablicama
        var strTableIDs = '';
        var strIDs = '';
        strPickNonSerializeData = '';
        $('table').each(function(index) {
            strTableIDs = strTableIDs + '&' + $(this).attr('id');
            strIDs = '';
            $('#' + $(this).attr('id') + ' tbody tr.btn-danger').each(function(index) { strIDs = strIDs + $(this).attr('id') + ','; });
            strIDs = strIDs.substring(0, strIDs.length - 1);
            strTableIDs = strTableIDs + '=' + strIDs;
        });
        strPickNonSerializeData = strTableIDs;
    }

    // ------------------------------------------------------------------------------------- AJAX
    

    function CallWebService() {
        var bsjCaller = arguments[0] || {};
        var bsjdataSource = bsjCaller.dataSource;
       //alert($(bsjCaller).attr('bsjDisplay'));
        if ($(bsjCaller).hasClass('disabled')) { return };

        /* ulazni $ objek treba sadržavati ove atribute :
        bsjDisplay - mjesto gdje će se primljeni podaci staviti u DOM , podatak ne ide na server
        bsjAction - podatak ide na server i koristi ga web service kako bi znao što činiti
        bsjSql - podatak ide na server i koristi ga web service , nije nužno da u njemu bude SQL
        bsjFormat - opciono formatiranje dobivenih podataka npr. sa DataTable pluginom , podatak ne ide na server
        bsjForm - ime forme čiji se podaci šalju na server
        bsjWebService - ime web servisa , ako se ne navede koristi se vrijednost iz DOM objekta bsjWebService
        bsjCallBack - id objekta sa kojim će se pozvati CallWebService nakon success-a ovog poziva
        bsjCallBackTriggerClick - id objekta nad kojim ce se desiti CLICK nakon success-a ovog poziva
        bsjRowClick - id objekta sa kojim će se pozvati CallWebService nakon row click-a
        bsjRowDblClick - id objekta sa kojim će se pozvati CallWebService nakon row dblclick-a
        */

        strDisplay = $(bsjCaller).attr('bsjDisplay') || 'bsjdesktopdisplay';
        strAction = $(bsjCaller).attr('bsjAction') || 'execsql';
        strSQL = $(bsjCaller).attr('bsjSql') || '';
        strFormat = $(bsjCaller).attr('bsjFormat') || 'datatable';
        strSerializeForm = $(bsjCaller).attr('bsjForm') || '';
        strWebService = $(bsjCaller).attr('bsjWebService') || strWebServiceFromDOM || 'index_service.asp';
        bsjCallBack = $(bsjCaller).attr('bsjCallBack') || '';
        bsjCallBackTriggerClick = $(bsjCaller).attr('bsjCallBackTriggerClick') || '';
       
        bsjRowClick = $(bsjCaller).attr('bsjRowClick') || '';
        bsjRowDblClick = $(bsjCaller).attr('bsjRowDblClick') || '';
            
        //alert($("#bsjlogindisplay").html());

        $(bsjCaller).addClass('disabled');
        //$(bsjCaller).append(' <img src="assets/ajax-loader.gif" id="' + strDisplay + 'loadinggif" class="hide" />');
        $('#' + strDisplay).fadeTo('fast', 0);
        $('#' + strDisplay + 'loadinggif').show();
        $('#bsjhomeicon').removeClass('icon-home').removeClass('icon-th').removeClass('icon-ban-circle').addClass('icon-refresh');
        var bsjappcounter = 0;
        var bsjappname = $("a.brand").attr('href');
        var bsjapptext = $("a.brand").html();
        if ($("#bsjsessionkey").html() != undefined) {
            if ($("#bsjsessionkey").html().length > 30) {
                bsjappcounter = parseFloat($("a.brand").attr('bsjappcounter'));
                bsjappcounter = bsjappcounter + 1;
                $("a.brand").attr('bsjappcounter', bsjappcounter);
            }
        }
        strSQL = SrediSQL(strSQL);
        var strUrl = strWebService + "?apt=" + bsjapptext + "&apc=" + bsjappcounter + "&apn=" + bsjappname + "&rdc=" + bsjRowDblClick + "&rc=" + bsjRowClick + "&c=" + strDisplay + "&av=" + strAction + "&guid=" + $("#bsjsessionkey").html() + "&sql=" + strSQL + "&d=" + $("#bsjdatabase").val() + "&u=" + $("#bsjusername").val() + "&p=" + $("#bsjpassword").val() + strPickNonSerializeData + "&" + $("#" + strSerializeForm).serialize();
        $("#bsjdebug").prepend("<li><b>" + hours + ":" + minutes + ":" + seconds + "</b><br/>" + strUrl + "</li>");
        $.ajax({
            type: "POST",
            cache: false,
            url: strUrl,
            contentType: "text/html;charset=UTF-8",
            begin: function() {
                // $('#loading').html('');
            }
                ,
            error: function(xhr, ajaxOptions, thrownError) {
                $('#bsjhomeicon').removeClass('icon-refresh').addClass('icon-ban-circle');
                //alert(' \n\n Postoji problem u komunikaciji sa serverom. \n\n  ');
                $(bsjCaller).removeClass('disabled');
                //alert(xhr.status);
                //alert(thrownError);
            }
                ,
            success: function(msg) {
                //alert(strDisplay + '          ' + msg);
                $('#bsjResponse').html(msg);
                var bsjResponseCounter = 0;
                $('#bsjResponse .bsjResponse').each(function (index) {
                    bsjResponseCounter = bsjResponseCounter + 1;
                    if ($($(this).attr("bsjTarget")).is('input')) { $($(this).attr("bsjTarget")).val($(this).html()); } else { $($(this).attr("bsjTarget")).html($(this).html()); }
                });                
                if (bsjResponseCounter == 0) { $('#' + strDisplay).html(msg);}
                $('#' + strDisplay).fadeTo("fast", 1);
                $('#' + strDisplay + 'loadinggif').hide();
                $('#bsjhomeicon').removeClass('icon-refresh').addClass('icon-th');

                $('#bsjResponse .bsjCommand').each(function (index) {
                    $($(this).attr("bsjTarget")).trigger($(this).attr("bsjTrigger"));
                });

                posts = $('.bjsnavstep');
                if (posts.length > 0) { $(".bsjprev,.bsjnext").show() } else { $(".bsjprev,.bsjnext").hide() }
                // ------------------------------------------------------------------------------------- after login
                if (strAction == 'login') {
                    
                    if ($("#bsjsessionkey").html().length > 30) {
                        $.Storage.set({ "bsjlogindisplay": $("#bsjlogindisplay").html() });
                        $("#logindisplay,#bsjLoginContainer").hide();
                        $('#bsjdbname').html($("#bsjdatabase").val());
                        //$('#bsjusernameforlogout').html($('#bsjwusername').html());
                        $('#bsjwuserfullnameforlogout').html($('#bsjwuserfullname').html());
                        $('.bsjTopButtons,.bsjHide').show(''); $('.bsjprev,.bsjnext').hide('');
                        //if ($.Storage.get("bsjtopwrench")) { $("#bsjtopwrench").trigger('click'); }
                        //if ($.Storage.get("bsjtoprecentaction")) { $("#bsjtoprecentbutton").html('<i class="icon-list"></i> ' + $.Storage.get("bsjtoprecentaction")); }
                        $('#bsjsearchtext').focus();
                        $('.bsjCallWebServiceAfterLogin').each(function (index) {
                            //$('.bsjCallWebServiceAfterLogin').removeClass('bsjCallWebServiceAfterLogin');
                            //alert(1);
                                    CallWebService($(this));
                                    //var newCWS = jQuery.extend(true, {}, CallWebService());
                                    //var newCWS = new CallWebService();
                                    //newCWS($(this));
                                });
                    }
                    else { $("#logindisplay,#bsjLoginContainer").show(); }
                } // end of login
                // ------------------------------------------------------------------------------------- after search
                if ((strAction == 'searchx') || (strAction == 'advancedsearch')) {
                    position = -1;
                    $('html, body').animate({ scrollTop: 0 }, '');
                } // end of searchx


                // ------------------------- data table plugin :
                if (strFormat == 'datatable') {
                    strPaginate = true;
                    strScrolly = '';
                    $('#' + strDisplay + 'table').dataTable({
                        "bPaginate": strPaginate,
                        "sDom": "<'row'<'span6'l><'span5'f>r>t<'row'<'span6'i><'span5'p>>",

                        "sPaginationType": "full_numbers",
                        "bStateSave": true,
                        "bAutoWidth": true,
                        "oLanguage": { "sUrl": 'assets/XML/' + strLanguage },
                        "bInfo": true,
                        "bDestroy": false,
                        "bProcessing": true,
                        "sScrollY": strScrolly,
                        "iDisplayLength": 10
                    });
                } // end of datatable


                // ------------------------- trazilica partnera :
                if ($(".bsjpartnerfinder").length > 0) {
                    $(".bsjpartnerfinder").autocomplete({
                        source: strWebService + "?av=json2",
                        autoFocus: true,
                        minLength: 3,
                        search: function(event, ui) { $('#loginloadinggif').show(); },
                        close: function(event, ui) { $('#loginloadinggif').hide(); },
                        change: function(event, ui) { $('#loginloadinggif').hide(); },
                        select: function (event, ui) {
                            $("#adresapartnera" + this.name).fadeTo("fast", 0);
                            $("#mjestopartnera" + this.name).fadeTo("fast", 0);
                            $("#poreznibroj" + this.name).fadeTo("fast", 0);
                            $("#idpartnera" + this.name + ',.idpartnera' + this.name).html(ui.item.id).val(ui.item.id);
                            $("#nazivpartnera" + this.name + ',.nazivpartnera' + this.name).html(ui.item.label).val(ui.item.label);
                            $("#adresapartnera" + this.name + ',.adresapartnera' + this.name).html(ui.item.adresa).val(ui.item.adresa);
                            $("#mjestopartnera" + this.name + ',.mjestopartnera' + this.name).html(ui.item.mjesto).val(ui.item.mjesto);
                            $("#poreznibroj" + this.name + ',.poreznibroj' + this.name).html(ui.item.poreznibroj).val(ui.item.poreznibroj);
                            $("#adresapartnera" + this.name).fadeTo("fast", 1);
                            $("#mjestopartnera" + this.name).fadeTo("fast", 1);
                            $("#poreznibroj" + this.name).fadeTo("fast", 1);
                            $('#loginloadinggif').hide();
                        }
                    });
                    $(".bsjpartnerfinder").removeClass('bsjpartnerfinder');
                } // end of trazilica partnera


                // ------------------------- product finder :
                if ($(".bsjproductfinder").length > 0) {
                    $(".bsjproductfinder").autocomplete({
                        source: strWebService + "?av=json1",
                        autoFocus: true,
                        minLength: 3,
                        search: function(event, ui) { $('#loginloadinggif').show(); },
                        close: function(event, ui) { $('#loginloadinggif').hide(); },
                        change: function(event, ui) { $('#loginloadinggif').hide(); },
                        select: function (event, ui) {
                            log(ui.item ?
					                            "Selected: " + ui.item.value + " aka " + ui.item.id :
					                            "Nothing selected, input was " + this.value);
                            $("#id" + this.name + ',.idpartnera' + this.name).html(ui.item.id).val(ui.item.id);
                            $("#cijena" + this.name).val(ui.item.cijena);
                            $("#kolicina" + this.name).val(1);
                            $('#button' + this.name).show();
                            $('#button' + this.name).focus();
                            $('#loginloadinggif').hide();

                        }
                    });
                    $(".bsjproductfinder").removeClass('bsjproductfinder');
                } // end of productfinder

                if ($(".datepicker").length > 0) { $('.datepicker').datepicker({ dateFormat: "dd.mm.yy", altFormat: "yymmdd" }); }

                $(bsjCaller).removeClass('disabled');
                $('#bsjhomeicon').removeClass('icon-th').addClass('icon-home');
                // ------- AJAX CONTENT LOADED EVENT
                $('.bsjCallWebServiceOnLoaded').each(function(index) {
                    CallWebService($(this));
                    $(this).removeClass('bsjCallWebServiceOnLoaded'); // ako ne maknem ovo dobijem cirkularnu referencu
                });
                // ------ CALL BACK
                if (bsjCallBack != '') { CallWebService($("#" + bsjCallBack)); }
                if (bsjCallBackTriggerClick != '') { $("#" + bsjCallBackTriggerClick).trigger('click'); }
                //------- select on focus
                $("input[type=text]").focus(function() { $(this).select(); });
                $("input[type=text]").mouseup(function(e) { e.preventDefault(); });
                $('.bsjElastic').elastic();
            } // end of success
        }); // end of ajax
    } // end of CallWebService



    //-------------------------------------------------------------------------------------- html loaderi

    $('#bsjLoginContainer').load('assets/inc/login.html', function() {
        $("#bsjusername").val($.Storage.get("bsjusername"));
        $("#bsjpassword").val($.Storage.get("bsjpassword"));
        $("#bsjdatabase").val($.Storage.get("bsjdatabase"));
        $("#bsjlogindisplay").html($.Storage.get("bsjlogindisplay"));
        $("#login_btn").click();
        /* HTML PAGE LOADED EVENT */$('.bsjCallWebServiceOnPageLoaded').each(function(index) { CallWebService($(this)); });
    }
    );

    $('#bsjThemeContainer').load('assets/inc/theme.html', function() { });
    //$('#bjsFooterContainer').load('assets/inc/footer.html', function() { });
    $('#bsjExitContainer').load('assets/inc/exit.html', function() { });




});                                           // end of document ready
   