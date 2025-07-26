//This occurs when a user logs in. Hides login button. Pair down this function as needed.
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
    console.log(response);
    $('#loginModal').css("display","none");
    //determine if login or register
    
    //set input for email to Gmail
    $('#eMail').val(responsePayload.email);
    $('#pWord').val(responsePayload.sub);
    console.log($('#pWord').val());
    sovendeRegister();
}
//Allows for decoding above function
function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
//Function that loads on page load. 
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "143101079948-vk875d4tv0q2r77jhjqib03imq8ttsb5.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("googleLogin"),
        { theme: "outline", size: "large" }
    );
    //Prompts One Tap
    google.accounts.id.prompt();
}
//sheets
apiKey = "AIzaSyDNPvEIBIM1edEcICj7AzsiHbEYfMAVji0";
registerForm = ["https://docs.google.com/forms/d/e/1FAIpQLScMj-OSDreel0uUvf8MwCQxdbMKUExrgXb7Ew3vkWmJzTqsYg/formResponse?usp=pp_url","&entry.1302031357=","&entry.2038887219="];

//reusable functions
function getData(x,y,z,c) {
    $.get(
        "https://sheets.googleapis.com/v4/spreadsheets/" + x + "/values/" + y + "!" + z + "?key=" + apiKey,
        function(data) {
            console.log(data);//
            console.log($('#eMail').val());
            c(data.values);
        }
    );
}
function submitForm(x) {
    $('body').append('<iframe src="' + x + '" style="display:none;"></iframe>');
    setTimeout(deleteIFrame(), 10000);
}
function deleteIFrame() {
    $('#body').find('iFrame:first').remove();
}

$(document).ready(function() {
    //check announcements
    //check version and copyright
    $('#sovendeRegister').find('div:first').on('click',function() {
        validateInputs(sovendeRegister); 
    });
    //assign login button
    $('#sovendeLogin').find('div:first').on('click',function() {
        validateInputs(sovendeLogin);
    });
})

function validateInputs(c) {
    $('#loginNotice').css('display','none');
    $('#registerNotice').css('display','none');
    e = true;
    p = true;
    if(!$('#eMail').val() || $('#eMail').val().length < 6 || $('#eMail').val().length > 320 || $('#eMail').val().indexOf('@') == -1 || $('#eMail').val().indexOf('.') == -1) {
        e = false;
        //invalid email format
    }
    if(!$('#pWord').val() || $('#pWord').val().length > 20 || $('#pWord').val().length < 8) {
        p = false;
        if(e) {
            //invalid password - must be between 8 and 20 characters
        }
    }
    if(e && p) {
        console.log('True ' + e + ' ' + p);//
        c();
    } else {//
        console.log('False ' + e + ' ' + p);//
    }//
}
function sovendeRegister() {
    console.log("Clicky");//
    sID = "1m9QW3rvQrE0aUUMOoeO2Er3tZyrrKd72QEs0suqjYZs";
    sheet = "Form Responses 1";
    range = "B2:B";
    emails = getData(sID,sheet,range,emailCheck);
}
function emailCheck(x) {
    console.log(x);
    if(x !== undefined) {
        a = [];
        for(i=0;i<x.length;i++) {
            a.push(x[i][0]);
            console.log(a);
        }
        if(a.includes($('#eMail').val())) {
            //get proof of google
            if($('#pWord').val().length > 20) {
                sovendeLogin();
            } else {
                console.log("Match found - email attached to account");//
                $('#registerNotice').css('display','block');
            }
        } else {
            termsOfService();
        }
    } else {
        termsOfService();
        
    }
}
function termsOfService() {
    /*
        load tos & pp
            build tos to include accept button - carry version number
        on accept submit register form and acct form
    */
    $('body').append('<div id="tOS" class="modal"></div>');
    $('#tOS').append('<object type="text/html" data="tos.html?emailID=1234&acctObj=5678"></object>');
    //
    //submitForm(f);
    //$('#sovendeLogin').find('div:first').trigger('click');
}

/*
f = registerForm[0] +  registerForm[1] + encodeURI($('#eMail').val()) + registerForm[2] + encodeURI($('#pWord').val());
*/

function sovendeLogin() {
    console.log('Click triggered Login');
    //this is the next step.
    //alert("You have an account and have logged in! Aren't you fucking special!");
    //TOS PP
    termsOfService();
    //acct = ['https://docs.google.com/forms/d/e/1FAIpQLSet01OUiLbgS9t6YNVqVV6C_KQAdCWS_w5kHiG8O_OYX_RfoA/formResponse?usp=pp_url','&entry.1292056060=','&entry.556119510=','&entry.1334536695='];
    sID = '1QA4JU_pCOX0Uy6-74kCoIitQjVe3Q24P-feWwDZMDRM';
    sheet = 'Form Responses 1';
    range = 'B2:D';
    //getData(sID,sheet,range,acctCheck);
}

