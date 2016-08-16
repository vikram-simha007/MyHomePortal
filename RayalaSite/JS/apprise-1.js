
function apprise(string, args, callback) {
    if ($('.appriseOverlay').length > 0) {
        $('.appriseOverlay').remove();
    }
    if ($('.appriseOuter').length > 0) {
        $('.appriseOuter').remove();
    }
    var default_args = { 'confirm': false, 'verify': false, 'input': false, 'animate': false, 'textOk': 'Ok', 'textCancel': 'Cancel', 'textYes': 'Yes', 'textNo': 'No' }
    if (args) {
        for (var index in default_args)
        { if (typeof args[index] == "undefined") args[index] = default_args[index]; }
    }
    var aHeight = $(document).height(); var aWidth = $(document).width(); $('body').append('<div class="appriseOverlay" id="aOverlay"></div>'); $('.appriseOverlay').css('height', aHeight).css('width', aWidth).fadeIn(100); $('body').append('<div id="appriseOuter" class="appriseOuter"></div>'); $('.appriseOuter').append('<div class="appriseInner"></div>'); $('.appriseInner').append(string); if (args) {
        if (args['animate']) {
            var aniSpeed = args['animate']; if (isNaN(aniSpeed)) { aniSpeed = 400; }
            $('.appriseOuter').css('top', '-200px').show().animate({ top: "100px" }, aniSpeed);
        }
        else { $('.appriseOuter').fadeIn(200); }
    }
    else { $('.appriseOuter').fadeIn(200); }
    if (args) {

        if (args['input']) {
            if (typeof (args['input']) == 'string')
            { $('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" value="' + args['input'] + '" /></div>'); }
            else
            { $('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" /></div>'); }
            $('.aTextbox').focus();
        }
        if (args['textArea']) {
            if (typeof (args['textArea']) == 'string')
            { $('.appriseInner').append('<div class="aInput"><textarea rows="4" cols="20" t="aTextbox" class="aTextbox" maxlength="2" value="' + args['textArea'] + '"></textarea></div>'); }
            else
            { $('.appriseInner').append('<div class="aInput"><textarea rows="4" cols="20" t="aTextbox" class="aTextbox" maxlength="2" ></textarea></div>'); }
            $('.aTextbox').focus();
        }
        if (args['Custom']) {

            if (typeof (args['Custom']) == 'string') {
                $('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" value="' + args['Custom'] + '" /><br/><br/>Enter Difference of Intercom between floors<br/><br/><input type="text" t="aTextbox" class="acustomTextbox" value="' + args['Custom'] + '" /></div>');
                // $('.appriseInner').append('<div class="aInput"><input type="checkbox" class="checkbox" t="aTextbox" /></div>');
            }
            else { $('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox"  /><br/><br/>Enter Difference of Intercom between floors<br/><br/><input type="text" t="aTextbox" class="acustomTextbox"  /></div>'); }
            $('.aTextbox').focus();
        }
        //if (args['Checkbox']) {
        //    if (typeof (args['Checkbox']) == 'string')
        //    { $('.appriseInner').append('<div class="aInput"><input type="checkbox" class="checkbox" t="aTextbox" /></div>'); }
        //    else
        //    { $('.appriseInner').append('<div class="aInput"><input type="checkbox" class="checkbox" t="aTextbox" /></div>'); }
        //    $('.checkbox').focus();
        //}
    }
    $('.appriseInner').append('<div style="width:100%;padding-top:15px;" align="center"><div class="aButtons"></div></div>'); if (args) {
        if (args['confirm'] || args['input'] || args['textArea'] || args['Custom'])
        { $('.aButtons').append('<button value="ok" id="Ok" class="Button" style="margin-right:10px">' + args['textOk'] + '</button>'); $('.aButtons').append('<button value="cancel" id="Cancel"  class="Button">' + args['textCancel'] + '</button>'); }
        else if (args['confirmOk'] || args['input'])
        { $('.aButtons').append('<button value="ok" id="Ok" class="Button" style="margin-right:10px">' + args['textOk'] + '</button>'); }
        else if (args['verify'])
        { $('.aButtons').append('<button value="ok" id="Ok" class="Button" style="margin-right:10px">' + args['textYes'] + '</button>'); $('.aButtons').append('<button value="cancel" id="Cancel"   class="Button">' + args['textNo'] + '</button>'); }
        else
        { $('.aButtons').append('<button value="ok" id="Ok" class="Button" style="margin-right:10px">' + args['textOk'] + '</button>'); }
    }
    else { $('.aButtons').append('<button value="ok" id="Ok" class="Button">Ok</button>'); }
    $(document).keydown(function (e) {
        if ($('.appriseOverlay').is(':visible')) {
            if (e.keyCode == 13)
            { $('.aButtons > button[value="ok"]').click(); }
            if (e.keyCode == 27)
            { $('.aButtons > button[value="cancel"]').click(); }
        }
    }); var aText = $('.aTextbox').val(); if (!aText) { aText = false; }

    var acustomText = $('.acustomTextbox').val(); if (!acustomText) { acustomText = false; }
    $('.aTextbox').keyup(function ()
    { aText = $(this).val(); });
    $('.acustomTextbox').keyup(function ()

    { acustomText = $(this).val(); });

    //var isChecked = false;
    //$('.checkbox').click(function () {
    //    if ($(this).is(':checked'))
    //        isChecked = true;

    //});


    var windowWidth = parseInt(document.documentElement.clientWidth);
    var windowHeight = parseInt(document.documentElement.clientHeight);

    var popupHeight = parseInt($('#appriseOuter').height());
    var popupWidth = parseInt($('#appriseOuter').width());

    $('#appriseOuter').css({
        "position": "absolute",
        "top": (windowHeight - popupHeight) / 2 + parseInt($(window).scrollTop()),
        "left": (windowWidth - popupWidth) / 2
    });


    $('.aButtons > button').click(function () {
        $('.appriseOverlay').remove(); $('.appriseOuter').remove(); if (callback) {
            var wButton = $(this).attr("value"); if (wButton == 'ok') {
                if (args) {
                    if (args['Custom']) {
                        callback(aText, acustomText);
                    }
                    if (args['input'])
                    { callback(aText); }
                    else if (args['textArea'])
                    { callback(aText); }
                    else
                    { callback(true); }
                }
                else { callback(true); }
            }
            else if (wButton == 'cancel')
            { callback(false); }
        }
    });
}
