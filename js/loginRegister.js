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
        //invalid password - must be between 8 and 20 characters
    }
    if(e && p) {
        console.log('True ' + e + ' ' + p);
        sID = "1m9QW3rvQrE0aUUMOoeO2Er3tZyrrKd72QEs0suqjYZs";
        sheet = "Form Responses 1";
        range = "B2:B";
        emails = getData(sID,sheet,range,emailCheck);
    } else {
        console.log('False ' + e + ' ' + p);
    }
    console.log($('#eMail').val().indexOf('@') + ' ' + $('#eMail').val().indexOf('.') + ' ' + $('#eMail').val().length + ' ' + !$('#eMail').val());
}
/*
function sovendeRegister() {
    console.log("Clicky");//
    if(!$('#eMail').val() || $('#eMail').val().length > 5 || $('#eMail').val().length < 321 || $('#eMail').val().indexOf('@') != -1 || $('#eMail').val().indexOf('.') != -1
        
        || !$('#pWord').val() || $('#pWord').val().length < 21 || $('#pWord').val().length > 7) {
        //one or both are empty or password too short
    } else {
        sID = "1m9QW3rvQrE0aUUMOoeO2Er3tZyrrKd72QEs0suqjYZs";
        sheet = "Form Responses 1";
        range = "B2:B";
        emails = getData(sID,sheet,range,emailCheck);
    }
}
function sovendeLogin(x) {

}
*/


function emailCheck(x) {
    console.log(x);
    f = registerForm[0] +  registerForm[1] + encodeURI($('#eMail').val()) + registerForm[2] + encodeURI($('#pWord').val());
    if(x !== undefined) {
        a = [];
        for(i=0;i<x.length;i++) {
            a.push(x[i][0]);
            console.log(a);
        }
        if(a.includes($('#eMail').val())) {
            console.log("Match found - email attached to account");//
            $('#registerNotice').css('display','block');
        } else {
            submitForm(f);
            $('#sovendeLogin').find('div:first').trigger('click');
        }
    } else {
        submitForm(f);
        $('#sovendeLogin').find('div:first').trigger('click');
    }
}

