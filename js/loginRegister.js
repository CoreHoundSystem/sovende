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
$('#sovendeRegister .loginButton').on('click',function() {
    console.log("Clicky");
    //check registry for email
        //if there is not match then register
        //if there is a match - post a notification --console.log
    //
    sID = "1OCBNwHb6TCFHcS1WSmlS1OrKmqQwJRpYe1XjtgrTiW4";
    sheet = "Form Responses 1";
    range = "B2:B";
    getData(sID,sheet,range);
    //$('#email').val();
    //$('#password').val();
    //registerAcct
    //submitForm();
});
registerForm = ["https://docs.google.com/forms/d/e/1FAIpQLScMj-OSDreel0uUvf8MwCQxdbMKUExrgXb7Ew3vkWmJzTqsYg/formResponse?usp=pp_url","&entry.1302031357=","&entry.2038887219="];
function submitForm(x) {
    $('#login').append(x);
}

function getData(x,y,z) {
    $.get(
        "https://sheets.googleapis.com/v4/spreadsheets/" + x + "/values/" + y + "!" + z + "?key=" + apiKey,
        function(data) {
        console.log(data);
        console.log(findRow('Equity',data));
        //getData(sIDs[0],sheets[0],getRow(findRow('Equity',data)));
        //console.log(data.values[2][0]);
        
        }
    );
}
