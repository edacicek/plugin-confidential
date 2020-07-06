// Startup
// Confidential

$(function () {
    $("#footer").load("/html/footer.html");
    $("#goToRegister").on("click", function () {
        window.location.href = "userControlRegister.html";
    });
    $("#goBack").on("click", function () {
        window.location.href = "userControl.html";
    });
    $("#register").on("click", function () {
        if(validateInvitationCode($("#reg_invitation_code").val())) {
            let email = $("#reg_email").val();
            let password =  $("#reg_password").val();
            let nickname = $("#reg_nickname").val();
            let language = $("#reg_language").val();
            let englishLevel = $("#reg_english_level").val();
            let originCode = $("#reg_invitation_code").val();
            signUpCognito(
                email,
                password,
                nickname,
                language,
                englishLevel,
                originCode
            )
        } else {
            alert("Invitation code invalid");
        }
    });
    $("#login").on("click", function () {
        let email = $("#log_email").val();
        let password =  $("#log_password").val();
        loginCognito(
            email,
            password
        )
    });
    $("#verify").on("click", function () {
        let email = $("#val_email").val();
        let code =  $("#val_verification").val();
        validateCognito(
            email,
            code
        )
    });
});

// Confidential
let validateInvitationCode = function(code){} ;

let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

let signUpCognito = function(email, password, nickname, language, englishLevel, originCode) {

    let attributeList = [
        { Name : 'nickname',	        Value : nickname },
        { Name : 'custom:englishLevel', Value : englishLevel }, // a1, a2, b1, b2, c1, c2
        { Name : 'custom:language',		Value : language }, // english, german, spanish
        { Name : 'custom:originCode',	Value : originCode },
    ];

    // Sending to Cognito
    userPool.signUp(email, sha256(password + salt), attributeList, null, function(err, result){
        if (err) {
            if (err.code === "UsernameExistsException") {
                alert("Already registered user");
            } else {
                alert("Error, please try letter " + err.message);
            }
            return;
        }
        // Success
        window.cognitoUser = result.user;
        alert("Success registration, please verify your mail for you activation code please.");
        window.location.href = "userControlVerification.html";
    });
};

let loginCognito = function(email, password) {
    let userData = {
        Username : email,
        Pool : userPool
    };

    let authenticationData = {
        Username : email,
        Password : sha256(password + salt),
    };

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            localStorage.setItem("accessToken", result.getAccessToken().getJwtToken());
            window.location.href = "search.html"
        },
        onFailure: function(err) {
            switch(err.code) {
                case "NotAuthorizedException":
                    alert("Wrong password and email combination" + err.message);
                break;
                case "UserNotFoundException":
                    alert("User not registered");
                break;
                case "UserNotConfirmedException":
                    window.location.href = "userControlVerification.html";
                break;
                default:
                    alert("Error, please try again in some minutes");
                break;
            }
        },

    });

};

let validateCognito = function(email, code) {
    let userData = {
        Username : email,
        Pool : userPool
    };

    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
            console.log(err.code);
            if (err.code === "NotAuthorizedException") {
                alert("Verification not needed, please try to sign in");
                location.href='sign-in.html';
            } else {
                alert("Problem in the verification, please check you data.");
            }
            return;
        }
        // Success
        alert("Verification complete, thanks. Now you can sing in.");
        window.location.href = "userControl.html";
    });
};

let signOut = function() {
    cognitoUser.signOut();
    window.location.href = "userControl.html";
};