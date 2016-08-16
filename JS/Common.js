


/*-------------------------- Script to apply styles to table ---------------------------*/

function applyStyles() {
    $('.DataGrid').attr('cellSpacing', '0px');
    $('.DataGrid').attr('cellPadding', '0px');
    $('.DataGrid tbody tr:even td').addClass('Row');
    $('.DataGrid tbody tr:even td').css({ 'border-bottom': '#e6e6e6 1px solid', 'border-right': '#e6e6e6 1px solid' });
    $('.DataGrid tbody tr:odd td').addClass('Row_Alternate');
    $('.DataGrid tbody tr:odd td').css({ 'border-bottom': '#e6e6e6 1px solid', 'border-right': '#e6e6e6 1px solid' });
}

/*--------------------------  End  ----------------------------*/

var pageSize = '';
var RowsPerPage = '';
var DOCUMENTS_ACCESSMODE_PUBLIC = 96;
var DOCUMENTS_ACCESSMODE_FORFLATSPECIFIC = 97;
var DOCUMENTS_ACCESSMODE_FORADMINONLY = 98;
var DOCUMENTS_ACCESSMODE_PRIVATE = 99;
var STAFF_WITH_ADMIN_ACCESS = 107;
var STAFF_WITHOUT_ADMIN_ACCESS = 108;
var LOOKUP_HELPDESK_TICKET_STATUS_CLOSED = 10;

/*-----------------------   Script to build Pagination   ------------------------------ */

//appendid( used to append paging to div )
//contextToLoadTable( ID where table is loaded  )
//urlToLoadTable ( url from where table should be loaded )
//pagingContext ( Context for every paging div which should be unique )
//searchText ( used for searching and is an array or json object where search params are stored and retrieved using searchText as param in controller)

function BuildNavigation(appendid, RowsPerPage, RowsCount, contextToLoadTable, urlToLoadTable, pagingContext, searchText, type, currentPage) {
    $('#' + appendid).children().remove();
    if (RowsCount == undefined || parseInt(RowsCount) <= parseInt(RowsPerPage))
        return false;
    RowsPerPage = RowsPerPage;
    pageSize = Math.ceil(RowsCount / RowsPerPage);
    if (pageSize == 0)
        pageSize = 1;

    var strNextPrev = '';
    strNextPrev += '<div style="margin-bottom:2%" class="' + pagingContext + ' pagination1 gigantic">';
    strNextPrev += '<a href="#" class="first" data-action="first">&laquo;</a>';
    strNextPrev += '<a href="#" class="previous" data-action="previous">&lsaquo;</a>';
    strNextPrev += '<input id="paginationinput" type="text" readonly="readonly" data-max-page="40" data-current-page="' + currentPage + '" />';
    strNextPrev += '<a href="#" class="next" data-action="next">&rsaquo;</a><a href="#" class="last" data-action="last">&raquo;</a>';
    strNextPrev += '</div>';

    $('<div style="float:right;">' + strNextPrev + '</div>').appendTo('#' + appendid);
    applyPaginationForTable(pageSize, RowsPerPage, contextToLoadTable, urlToLoadTable, pagingContext, searchText, type);
}

function applyPaginationForTable(pageSize, RowsPerPage, contextToLoadTable, urlToLoadTable, pagingContext, searchText, type) {
    $('.' + pagingContext + ' #paginationinput').attr('data-max-page', pageSize);
    $('.' + pagingContext).jqPagination({
        paged: function (page) {
            sessionStorage.Page = page;
            $('#rowsPerPage').val(page);
            $('#' + contextToLoadTable).load(urlToLoadTable + '?MinRows=' + (((page - 1) * RowsPerPage) + 1) + '&MaxRows=' + page * RowsPerPage + '&SearchText=' + encodeURIComponent(searchText) + '&Type=' + type, function (status, response) {  });
        }
    });
}

/*--------------------- End -----------------------*/


/*-----------------  Script to build popup and display results that are saved  --------------------------*/

var accountingPopupStatus = 0;
function disableAccountingPopup() {

    if (accountingPopupStatus == 1) {
        $(".backgroundPopup").fadeOut("slow");
        $(".popup").fadeOut("slow");
        accountingPopupStatus = 0;
    }
}

function buildPopUp(objCashPayment, functionality, title, message, transactionId, TDSAccountNumber, BankChargesAccountNumber, isReceipt) {

    var strPopUpDiv = '<div id="TransactionId" style="display:none;">' + transactionId + '</div>';
    strPopUpDiv += '<div id="accountingPopUp" class="popup" style="display: inline;width:900px;">';
    strPopUpDiv += '<div style="width: 100%; font-size: 14px; font-weight: bold; font-family: Calibri, Verdana, Geneva, sans-serif;">';
    strPopUpDiv += '<div class="popupheader"><span style="margin-left:1%">' + title + '</span></div>';
    if (message != '' && message != undefined)
        strPopUpDiv += '<div id="message" style="margin-top:3%;margin-bottom:1%" align="center"><span style="margin-left:1%">' + message + '</span></div>';
    strPopUpDiv += '<div><input type="button" value="Ok" Class="Button closeButton" style="margin-left:45%;" />';
    if (isReceipt)
        strPopUpDiv += '<input type="button" value="Print" Class="Button" id="printReceipt" style="margin-left:10px;height:28px;" onclick="printTransactions(this);" />';
    strPopUpDiv += '</div><div class="popupheader" id="title" style="margin-top:1%;width:100%">';
    strPopUpDiv += '<span style="margin-left:1%;float:left">Journal Entry</span>';
    strPopUpDiv += '<img class="expand" id="displayResults" style="cursor:pointer;margin-left:70%;margin-top:-4px;float:left;" src="../Content/Images/expandImage.png" />';
    strPopUpDiv += '</div>';
    strPopUpDiv += '<div style="margin: 0; left: 895px; top: -10px; position: absolute;">';
    strPopUpDiv += '<img style="cursor:pointer" src="../Content/Images/closeImage.png" class="accountingPopupClose"  alt=""/>';
    strPopUpDiv += '</div>';
    strPopUpDiv += '<span id="toggleResults" style="display:none;width:100%;margin-top:3%;margin-left:3px;">';
    strPopUpDiv += '<table class="DataGrid" id="accountingPopupTable" style="width:100%">';

    if (functionality == 'Payment' || functionality == 'Receipt') {
        var amount = 0; runningAmount = 0;
        var cashAccountNumber = '';
        if (functionality == 'Payment')
            strPopUpDiv += '<div style="font-weight:bold;margin-bottom:1%;margin-left:10px;text-align:center"><label>Payment Date - </label><label>' + objCashPayment[0].PaymentDate + '</label>';
        else
            strPopUpDiv += '<div style="font-weight:bold;margin-bottom:1%;margin-left:10px;text-align:center"><label>Payment Date - </label><label>' + objCashPayment[0].ReceiptDate + '</label>';
        strPopUpDiv += '<input type="button" value="Print" Class="Button" id="printJournalEntry" data-type="JournalEntry" data-functionality="' + functionality + '" onclick="printTransactions(this);"  style="float:right;height:28px;margin-bottom:5px;margin-top:-5px;margin-right:2px;"/></div>';
        strPopUpDiv += '<thead><tr><th  align="left" style="width:34%;padding-left:5px;">GLAccount</th><th align="right" style="width:11%;padding-right:5px;">Debit</th><th align="right" style="width:11%;padding-right:5px;">Credit</th><th align="left" style="width:48%;padding-left:5px;">Narration</th></tr></thead></table>';
        strPopUpDiv += '<div style="max-height:300px;overflow:auto;"><table class="DataGrid"><tbody>';
        if (functionality == 'Payment') {
            for (var i = 0; i < objCashPayment.length; i++) {
                amount += parseFloat(objCashPayment[i].Amount) + (objCashPayment[i].BankCharges > 0 ? parseFloat(objCashPayment[i].BankCharges) : 0);
                cashAccountNumber = objCashPayment[i].CashAccountNumber;
                runningAmount = (parseFloat(objCashPayment[i].Amount) + (parseFloat(objCashPayment[i].TDS) > 0 ? parseFloat(objCashPayment[i].TDS) : 0))
                strPopUpDiv += '<tr><td style="width:34%" align="left"><label>' + objCashPayment[i].GLAccountNumber + '  A/C</label></td>';
                strPopUpDiv += '<td align="right" style="width:10%;padding-right:5px;"><label>' + parseFloat(runningAmount).toFixed(2) + '</label></td><td align="right" style="width:11%"><label></label></td>';
                strPopUpDiv += '<td align="left" style="width:48%;">' + objCashPayment[i].Narration + '</td></tr>';
                if (objCashPayment[i].BankCharges > 0) {
                    strPopUpDiv += '<tr><td style="width:34%"><label>' + BankChargesAccountNumber + '  A/C</label></td>';
                    strPopUpDiv += '<td align="right" style="width:11%;padding-right:5px;"><label>' + parseFloat(objCashPayment[i].BankCharges).toFixed(2) + '</label></td><td style="width:11%"><label></label></td>';
                    strPopUpDiv += '<td style="width:48%;"></td></tr>';
                }
                if (objCashPayment[i].TDS > 0) {
                    strPopUpDiv += '<tr><td style="width:31%"><label>' + TDSAccountNumber + '  A/C</label></td>';
                    strPopUpDiv += '<td style="width:11%"><label></label></td><td align="right" style="width:11%;padding-right:5px;"><label>' + parseFloat(objCashPayment[i].TDS).toFixed(2) + '</label></td>';
                    strPopUpDiv += '<td style="width:48%;"></td></tr>';
                }
            }
        }
        else {
            runningAmount = 0;
            for (var i = 0; i < objCashPayment.length; i++) {
                amount += parseFloat(objCashPayment[i].Amount);
                runningAmount = parseFloat(objCashPayment[i].Amount) + (parseFloat(objCashPayment[i].TDS) > 0 ? parseFloat(objCashPayment[i].TDS) : 0) + (objCashPayment[i].BankCharges > 0 ? parseFloat(objCashPayment[i].BankCharges) : 0);
                strPopUpDiv += '<tr><td style="width:34%"><label>' + objCashPayment[i].CashAccountNumber + '  A/C</label></td>';
                strPopUpDiv += '<td style="width:10%"><label></label></td><td style="width:11%;text-align:right;padding-right:5px;"><label>' + parseFloat(runningAmount).toFixed(2) + '</label></td>';
                strPopUpDiv += '<td style="width:48%;">' + objCashPayment[i].Narration + '</td></tr>';

                if (objCashPayment[i].TDS > 0) {
                    strPopUpDiv += '<tr><td style="width:31%"><label>' + TDSAccountNumber + '  A/C</label></td>';
                    strPopUpDiv += '<td align="right" style="width:11%;padding-right:5px;"><label>' + parseFloat(objCashPayment[i].TDS).toFixed(2) + '</label></td><td style="width:11%"><label></label></td>';
                    strPopUpDiv += '<td style="width:48%;"></td></tr>';
                }
                if (objCashPayment[i].BankCharges > 0) {
                    strPopUpDiv += '<tr><td style="width:31%"><label>' + BankChargesAccountNumber + '  A/C</label></td>';
                    strPopUpDiv += '<td align="right" style="width:11%;padding-right:5px;"><label>' + parseFloat(objCashPayment[i].BankCharges).toFixed(2) + '</label></td><td style="width:11%"><label></label></td>';
                    strPopUpDiv += '<td style="width:48%;"></td></tr>';
                }
            }
        }
        if (functionality == 'Payment') {
            strPopUpDiv += '<tr><td style="width:31%"><label>' + cashAccountNumber + '  A/C</label></td>';
            strPopUpDiv += '<td style="width:11%"><label></label></td><td align="right" style="width:11%;padding-right:5px;"><label>' + parseFloat(amount).toFixed(2) + '</label></td>';
            strPopUpDiv += '<td></td></tr>';
            strPopUpDiv += '<tr height="17px"></tr>';
        }
        else {
            strPopUpDiv += '<tr><td style="width:31%"><label>' + objCashPayment[0].GLAccountNumber + '  A/C</label></td>';
            strPopUpDiv += '<td align="right" style="width:11%;padding-right:5px;"><label>' + parseFloat(amount).toFixed(2) + '</label></td><td style="width:11%"><label></label></td>';
            strPopUpDiv += '<td></td></tr>';
            strPopUpDiv += '<tr height="17px"></tr>';
        }
    }

    if (functionality == 'ContraCash' || functionality == 'ContraCheque') {

        var amount = 0;
        if (functionality == 'ContraCash') {
            var receipt = new Date(Date.parse(objCashPayment.TransactionDate));
            var date = receipt.getDate(), month = receipt.getMonth() + 1, year = receipt.getFullYear();
            strPopUpDiv += '<div align="center" style="font-weight:bold;margin-bottom:1%"><label>Transaction Date - </label><label>' + date + "-" + formatDateForMonth(month) + "-" + year + '</label>';
        }
        if (functionality == 'ContraCheque') {
            var receipt = new Date(Date.parse(objCashPayment.TransactionDate));
            var date = receipt.getDate(), month = receipt.getMonth() + 1, year = receipt.getFullYear();
            strPopUpDiv += '<div align="center" style="font-weight:bold;margin-bottom:1%"><label>Payment Date - </label><label>' + date + "-" + formatDateForMonth(month) + "-" + year + '</label>';
        }

        strPopUpDiv += '<input type="button" value="Print" Class="Button" id="printJournalEntry" data-type="JournalEntry" data-functionality="' + functionality + '" onclick="printTransactions(this);"  style="float:right;height:28px;margin-bottom:5px;margin-top:-5px;margin-right:2px;"/></div>';
        strPopUpDiv += '<thead><tr><th style="width:31%">GLAccount</th><th style="width:11%">Debit</th><th style="width:11%">Credit</th><th style="width:48%">Narration</th></tr></thead>';

        strPopUpDiv += '<tbody><tr><td style="width:31%"><label>' + objCashPayment.GLAccountNumber + '  A/C</label></td>';
        strPopUpDiv += '<td style="width:11%"><label>' + parseFloat(objCashPayment.DebitAmount).toFixed(2) + '</label></td><td style="width:11%"><label></label></td>';
        strPopUpDiv += '<td style="width:48%;">' + objCashPayment.Narration + '</td></tr>';

        strPopUpDiv += '<tr><td style="width:31%"><label>' + objCashPayment.CashAccountNumber + '  A/C</label></td>';
        strPopUpDiv += '<td style="width:11%"><label></label></td><td style="width:11%"><label>' + (parseFloat(objCashPayment.CreditAmount).toFixed(2) - parseFloat(objCashPayment.BankCharges).toFixed(2)) + '</label></td>';
        strPopUpDiv += '<td style="width:48%;">' + objCashPayment.Narration + '</td></tr>';

        strPopUpDiv += '<tr height="17px"></tr>';
        amount = 0;

        if (objCashPayment.TDS > 0) {
            strPopUpDiv += '<tr><td style="width:31%"><label>' + TDSAccountNumber + '  A/C</label></td>';
            strPopUpDiv += '<td style="width:11%"><label>' + parseFloat(objCashPayment.TDS).toFixed(2) + '</label></td><td style="width:11%"><label></label></td>';
            strPopUpDiv += '<td style="width:48%;">' + objCashPayment.Narration + '</td></tr>';
        }
        if (objCashPayment.BankCharges > 0) {
            strPopUpDiv += '<tr><td style="width:31%"><label>' + BankChargesAccountNumber + '  A/C</label></td>';
            strPopUpDiv += '<td style="width:11%"><label>' + parseFloat(objCashPayment.BankCharges).toFixed(2) + '</label></td><td style="width:11%"><label></label></td>';
            strPopUpDiv += '<td style="width:48%;">' + objCashPayment.Narration + '</td></tr>';
        }
    }

    if (functionality == 'JournalVoucher') {
        strPopUpDiv += '<div align="center" style="font-weight:bold;margin-bottom:1%"><label>Payment Date - </label><label>' + objCashPayment[0].Date + '</label>';
        strPopUpDiv += '<input type="button" value="Print" Class="Button" id="printJournalEntry" data-type="JournalEntry" data-functionality="' + functionality + '" onclick="printTransactions(this);"  style="float:right;height:28px;margin-bottom:5px;margin-top:-5px;margin-right:2px;"/></div>';
        strPopUpDiv += '<thead><tr><th style="width:31%">GLAccount</th><th style="width:11%">Debit</th><th style="width:11%">Credit</th><th style="width:48%">Narration</th></tr></thead><table>';
        strPopUpDiv += '<div style="max-height;"><table class="DataGrid"><tbody>';

        for (var i = 0; i < objCashPayment.length; i++) {
            if (objCashPayment[i].Debit > 0) {
                strPopUpDiv += '<tr><td style="width:31%"><label>' + objCashPayment[i].GLAccountNumber + '  A/C</label></td>';
                strPopUpDiv += '<td style="width:11%"><label>' + parseFloat(objCashPayment[i].Debit).toFixed(2) + '</label></td><td style="width:11%"><label></label></td>';
                strPopUpDiv += '<td style="width:48%;">' + objCashPayment[i].Narration + '</td></tr>';
            }
            else {
                strPopUpDiv += '<tr><td style="width:31%"><label>' + objCashPayment[i].GLAccountNumber + '  A/C</label></td>';
                strPopUpDiv += '<td style="width:11%"><label></label></td><td style="width:11%"><label>' + parseFloat(objCashPayment[i].Credit).toFixed(2) + '</label></td>';
                strPopUpDiv += '<td style="width:48%;">' + objCashPayment[i].Narration + '</td></tr>';
            }
        }
    }
    strPopUpDiv += '</tbody></table></div>';
    strPopUpDiv += '</div></div></div>';
    applyStyles();
    $(strPopUpDiv).appendTo('body');

    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;

    var popupHeight = $('#accountingPopUp').height();
    var popupWidth = $('#accountingPopUp').width();

    $('#accountingPopUp').css({
        "position": "absolute",
        "top": $(window).scrollTop() + 150,
        "left": windowWidth / 2 - popupWidth / 2
    });

    $('#Background').css({
        "height": windowHeight
    });

    if (accountingPopupStatus == 0) {
        $('#Background').css({
            "opacity": "0.7"
        });
        $('#Background').fadeIn("slow");
        accountingPopupStatus = 1;
    }

    $(".backgroundPopup,.closeButton,.accountingPopupClose").on('click', function () {
        if (accountingPopupStatus == 1)
            disableAccountingPopup();
        else
            disableAccountingPopup();
    });

    $('#displayResults').on('click', function () {
        if ($(this).attr('class') == 'expand') {
            $(this).attr('src', '../Content/Images/collapseImage.png');
            $(this).attr('class', 'collapse');
        }
        else {
            $(this).attr('src', '../Content/Images/expandImage.png');
            $(this).attr('class', 'expand');
        }
        $('#toggleResults').slideToggle();
    });
}

/*----------------  End  ------------------------*/

function formatDateForMonth(index) {
    var arrMonth = [];
    arrMonth[1] = "Jan";
    arrMonth[2] = "Feb";
    arrMonth[3] = "Mar";
    arrMonth[4] = "Apr";
    arrMonth[5] = "May";
    arrMonth[6] = "Jun";
    arrMonth[7] = "Jul";
    arrMonth[8] = "Aug";
    arrMonth[9] = "Sep";
    arrMonth[10] = "Oct";
    arrMonth[11] = "Nov";
    arrMonth[12] = "Dec";
    return arrMonth[index];
}

function getEncodedUrl(id, Url) {
    var encryptId;
    $.ajax({
        url: Url,
        dataType: 'json',
        data: JSON.stringify({ 'EncodeId': id }),
        type: 'POST',
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (response) {
            encryptId = response;
        },
        error: function (result) {
            // return result;
        }
    });
    return encryptId;
}

/*----------------------- Script  to apply validate attributes for partial views  -------------------------*/

function applyValidation(status) {
    if (status == 'success') {
        $("form").removeData("validator");
        $("form").removeData("unobtrusiveValidation");
        $.validator.unobtrusive.parse("form");
    }
}

/*-------------------- End -------------------------*/

function ValidateEmail(thisEmail) {

    var validEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (thisEmail != '' && validEmail.test(thisEmail)) {
        return true;
    }
    else
        return false;
}

function ValidatePhoneNumber(e) {
    var charCode = (e.which) ? e.which : e.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 40 && charCode != 41 && charCode != 43 && charCode != 45 && charCode != 32)
        return false;
    return true;
}

function ValidateNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

/*-------------------------- Script to display Characters remaining message for textareas  --------------------------------*/

//id ( id of textarea where text is entered )
//data-length ( length in DB )
//data-displayId ( id where message will be displayed )
function displayRemainigCharacters(currentObj, e) {
    var length = $(currentObj).attr('data-length');
    var displayId = $(currentObj).attr('data-displayid');
    $('#' + displayId).show();
    if ($(currentObj).val().length > length)
        $(currentObj).val($(currentObj).val().substring(0, length));
    $('#' + displayId).text(length - $(currentObj).val().length + ' characters remaining');
}

/*-------------------------- End --------------------------------*/

/*------------------------- function to Encrypt String using Base64 --------------------*/
function EncryptusingBase64(input) {
    var Base64 = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },
    }
    return Base64.encode($.trim(input));
}

/*----------------------- END  -------------------*/

/*---------------------- Function to Print Transactions and Receipts ----------------------*/
function deleteTempFile() {
    $.ajax({
        url: '../Accounting/DeleteDocument',
        type: 'GET',
        success: function (response) {

        },
        error: function (error) {
        }
    });
}

function printTransactions(currentObject) {
    var type = $(currentObject).attr('data-type');
    var transactionId = $('#TransactionId').text();
    var functionality = $(currentObject).attr('data-functionality');
    var jsonData = JSON.stringify({ 'iTransactionId': transactionId, 'iFlatId': 'null', 'isJournalEntry': type == 'JournalEntry' ? true : false, 'isJournalVoucher': functionality == 'JournalVoucher' ? true : false });
    $.ajax({
        url: '../Accounting/CreateDocument',
        type: 'POST',
        dataType: 'JSON',
        data: jsonData,
        async: false,
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            var url = 'http://' + window.location.hostname + response;
            if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/))
                window.location.href = url;
            else
                window.open(url, "_blank");
            var timer = 2000;
            clearInterval(timer);
            timer = window.setTimeout(
                function () {
                    deleteTempFile();
                },
            20000);
        },
        error: function (a) {
            alert(a.responseText);
        }
    });
}

/*----------------------- End Function printing... -------------------------------*/

function applyAppriseStyles() {
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var popupHeight = $('#appriseOuter').height();
    var popupWidth = $('#appriseOuter').width();
    var top = windowHeight / 2 - popupHeight / 2 + $(window).scrollTop();
    var left = windowWidth / 2 - popupWidth / 2;
    $('#appriseOuter').css({ 'top': top, 'left': left });
}

var month = new Array();
month['Jan'] = 1;
month['Feb'] = 2;
month['Mar'] = 3;
month['Apr'] = 4;
month['May'] = 5;
month['Jun'] = 6;
month['Jul'] = 7;
month['Aug'] = 8;
month['Sep'] = 9;
month['Oct'] = 10;
month['Nov'] = 11;
month['Dec'] = 12;

$(function () {

    //window.setInterval(function () {
    //$.ajax({
    //    url: '../Home/RetrieveNotifications',
    //    contentType: 'application/json;charset=utf-8',
    //    success: function (response) {
    //        //alert('as');
    //    },
    //    error: function (a, b) {
    //        debugger;
    //    }
    //});
    //}, 60000); // 1 min


    $('.deleteRecord').live('click', function () {
        var obj = {};
        obj.this = $(this);
        obj.urlToLoadTable = $(this).parents('.searchTable').attr('data-urlToLoadTable');
        obj.urlToDeleteRecord = $(this).parents('.searchTable').attr('data-urlToDeleteRecord');
        obj.contextToLoadTable = $(this).parents('.searchTable').attr('id');
        obj.deleteId = $(this).attr('data-DID');
        obj.rowsPerPage = $(this).parents('.searchTable').attr('data-RowSize');
        obj.currentPage = $('#rowsPerPage').val();
        obj.minRows = (((obj.currentPage - 1) * obj.rowsPerPage) + 1);
        obj.maxRows = obj.currentPage * obj.rowsPerPage;

        apprise('Do you want to delete?', { 'verify': true }, function (r) {
            if (r)
                deleteRecord(obj);
        });


    });

    function deleteRecord(obj) {
        $.ajax({
            url: obj.urlToDeleteRecord,
            data: JSON.stringify({ 'id': obj.deleteId }),
            dataType: 'JSON',
            type: 'POST',
            contentType: 'application/json;charset-utf8',
            success: function () {
                if (obj.currentPage != '')
                    $('#' + obj.contextToLoadTable).load(obj.urlToLoadTable + '?minRows=' + obj.minRows + '&MaxRows=' + obj.maxRows);
                else
                    $('#' + obj.contextToLoadTable).load(obj.urlToLoadTable + '?minRows=1&MaxRows=' + obj.rowsPerPage);
            },
            error: function (a, b) {
               
            }
        });
    }

    /*---------------------- Credit Card Mask edit -----------------*/
    //String.prototype.toCardFormat = function () {
    //    return this.replace(/[^0-9]/g, "").substr(0, 16).split("").reduce(cardFormat, "");
    //    function cardFormat(str, l, i) {
    //        return str + ((!i || (i % 4)) ? "" : "-") + l;
    //    }
    //};

    //$('.creditCardNumber').live('keyup', function (e) {
    //    //debugger;
    //    if (e.which == 39 || e.which == 37 || e.which == 46 || e.which == 35 || e.which ==36)
    //        return true;
    //    $(this).val($(this).val().toCardFormat());
    //});

    /*----------------- END Credit Card Mask --------------------*/

    $('.searchRecords').live('keypress', function (e) {
        if (e.keyCode == 13)
            $('.searchRecordsButton').trigger('click');
    });

    //$('input, textarea').placeholder();

    /*------------ Script to close popup when escape Key is pressed-----------------*/
    $(document).keypress(function (e) {
        if (e.keyCode == 27) {
            disableApprise();
            if (accountingPopupStatus == 1)
                disableAccountingPopup();
            else
                disableAccountingPopup();
        }
    });

    function disableApprise() {
        $('#appriseOuter').remove();
        $('#aOverlay').remove();
    }

    $('#aOverlay').live('click', function () {
        disableApprise();
    });

    $(document).scroll(function () {
        var windowWidth = parseInt(document.documentElement.clientWidth);
        var windowHeight = parseInt(document.documentElement.clientHeight);

        var popupHeight = parseInt($('#appriseOuter').height());
        var popupWidth = parseInt($('#appriseOuter').width());

        $('#appriseOuter').css({
            "position": "absolute",
            "top": (windowHeight - popupHeight) / 2 + parseInt($(window).scrollTop()),
            "left": (windowWidth - popupWidth) / 2
        });
        //$('#appriseOuter').css('top', parseInt($('#appriseOuter').css('top')) + $(window).scrollTop());
    });
    /*---------------------- End -------------------------*/

    /*-------------------------- Script to Accept only Numbers with two decimal places  ----------------------------*/

    $(document).on('keypress', '.floatValue', function (event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (event.which == 0)
            return true;
        var value = $(this).val();
        if ($(this).val().length == 7 && charCode != 46 && value.indexOf('.') == -1)
            return false;
        if (charCode == 46 && value.indexOf('.') != -1)
            return false;
        else if (charCode != 46 && charCode != 45 && charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    });

    $(document).on('keyup', '.floatValue', function (event) {
        var dotvalue = $(this).val().split('.')[1];
        if (dotvalue != undefined) {
            if ($(this).val().split('.')[1].length > 2)
                $(this).val($(this).val().substring(0, ($(this).val().split('.')[0].length + 3)));
            else
                return false;
        }
    });

    $(document).on('focus', '.floatValue', function () {
        if ($(this).val() == '0.00')
            $(this).val('');
    });

    $(document).on('blur', '.floatValue', function () {
        if ($(this).val() == '')
            $(this).val('0.00');
    });

    /* -------------------------------- End ----------------------------- */
});

function UploadFile(strTargetButtonPlaceHolder, strProgressTarget, strBtnCancel, strpath) {
    fileName = '';
    filesCount = 0;
    filecancel = 0;
    //debugger;
    //    if (strBtnCancel == 'btnCancel') {
    //        debugger;
    //        document.getElementById(strBtnCancel).style.visibility = "visible";
    //    }
    set = {
        flash_url: "../FlashUpload/swfupload.swf",
        upload_url: "../FlashUpload/upload.aspx",
        file_size_limit: "100 MB",
        file_types: "*.*",
        file_types_description: "All Files",
        file_upload_limit: 0,
        file_queue_limit: 0,
        custom_settings: {
            progressTarget: strProgressTarget,
            cancelButtonId: strBtnCancel
        },
        debug: false,

        //Button Settings
        button_image_url: "",
        button_placeholder_id: strTargetButtonPlaceHolder,
        button_width: 100,
        button_height: 18,
        //button_text: '<span class="button">Select Image <span class="buttonSmall">(5 MB Max)</span></span>',
        button_text: '<label class="SelectImagebutton" style="margin-left:2%;"><b>Select File</b></label>',
        button_text_style: '.SelectImagebutton{ font-family: Calibri, Arial, sans-serif; font-size: 14pt; } .buttonSmall { font-size: 12px; }',
        button_text_top_padding: 0,
        button_text_left_padding: 25,
        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
        button_cursor: SWFUpload.CURSOR.HAND,

        // The event handler functions are defined in handlers.js
        file_queued_handler: fileQueued,
        file_queue_error_handler: fileQueueError,
        file_dialog_complete_handler: fileDialogComplete,
        upload_start_handler: uploadStart,
        upload_progress_handler: uploadProgress,
        upload_error_handler: uploadError,
        upload_success_handler: uploadSuccess,
        upload_complete_handler: uploadComplete,
        queue_complete_handler: queueComplete,
        strPath: strpath// Queue plugin event
    };

    swfu = new SWFUpload(set);

}

function showMessage(type, validation, text, position, timeout) {
    if (text != undefined) {
        $('#noty_top_layout_container li').remove();
        if (timeout == '' || timeout == undefined)
            timeout = 3000;
        var $noty = noty({
            text: text + '<div id="notyCloseButton" style="float:right;padding:10px;cursor:pointer;">Close</div>',
            type: type,
            dismissQueue: true,
            layout: position,
            theme: 'defaultTheme',
            timeout: timeout,
            callback: {
                afterShow: function () {
                    $('#notyCloseButton').on('click', function () {
                        $noty.close();
                    });
                }
            },
        });
        strerror = '';
        return false;
    }
}

