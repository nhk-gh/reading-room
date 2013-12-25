'use strict';

readingRoomApp.controller('accountController',
  function accountController($scope, $dialog, $log, $location, userService, layoutService){

    $scope.countries = [
      "Afghanistan", "Aland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola",
      "Anguilla", "Antarctica", "Antigua And Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria",
      "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
      "Bermuda", "Bhutan", "Bolivia, Plurinational State of", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina",
      "Botswana", "Bouvet Island", "Brazil",
      "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
      "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China",
      "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo",
      "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba",
      "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
      "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)",
      "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia",
      "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece",
      "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea",
      "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City State)",
      "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic of", "Iraq",
      "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya",
      "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan",
      "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
      "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia, The Former Yugoslav Republic Of",
      "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique",
      "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of",
      "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
      "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger",
      "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau",
      "Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
      "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation",
      "Rwanda", "Saint Barthelemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia",
      "Saint Martin (French Part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
      "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
      "Sint Maarten (Dutch Part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
      "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
      "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic",
      "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste",
      "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
      "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
      "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu",
      "Venezuela, Bolivarian Republic of", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.S.",
      "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
    ];

    $scope.accountDialog = function(which){
      switch (layoutService.selectedKlub){
        case "hall":
          $scope.opts = {
            backdrop: true,
            keyboard: true,
            backdropClick: false,
            dialogClass: "hall-dialog",
            backdropClass: "hall-backdrop"
          };
          break;

        default :
          $scope.opts = {
            backdrop: true,
            keyboard: true,
            backdropClick: false,
            dialogClass: "gallery-dialog",
            backdropClass: "gallery-backdrop"
          };
          break;
      }
      var dlg = $dialog.dialog($scope.opts);

      switch(which){
        case "passwordreminder":
          dlg.open('/projects/hall/templates/passwordReminder.html', 'SubmitPasswordReminderController')
            .then(function(data){

            });
          break;

        case "register":
          $scope.user.country = $scope.countries[-1];  //Israel = 107

          dlg.open('/projects/hall/templates/register.html', 'SubmitRegisterController')
            .then(function(usr){
              if (usr){
                layoutService.titleBar.logged = angular.copy(usr[0]);
                userService.user = angular.copy(usr[0]);
                $scope.user = userService.user;
              }

              //userService.clear("new");
            });
          break;

        case "login":
          dlg.open('/projects/hall/templates/login.html', 'SubmitLoginController')
            .then(function(usr){
              if (usr) {
                layoutService.titleBar.logged = usr;
                userService.user = usr;
                $scope.user = userService.user;
              }
            });

          break;

        case "logout":
          dlg.open('/projects/hall/templates/logout.html', 'SubmitLogoutController')
            .then(function(data){
              if (data) {
                layoutService.titleBar.logged = false;
                userService.clear("current");
                $location.path("/");
              }
            });
          break;

        case "profile":
          dlg.open('/projects/hall/templates/editProfile.html', 'SubmitEditProfileController')
            .then(function(data){
              if (data)
                layoutService.titleBar.logged = data.user;
            });

          break;
      }
    };
  }
);

readingRoomApp.controller("SubmitPasswordReminderController",
  function($scope, $log, dialog, accountService ){

    $scope.close = function(email, lookfor, name){
      if (!email)  {
        dialog.close(null);
      }
      else {
        if($("#reminder-form").find("form").validateAccount() ){
          var params = {
            email: email,//$("#email-rem").val(),
            name: name,   //$("#name-rem").val()
            lookfor: lookfor
          }

          accountService.passReminder(params)
            .then(function(data){
              if (data.error == 200){
                alert(data.message);
                dialog.close(data);
              }
              else{
                alert(data.message);
              }
            }, function(status){
              $log.warn(status);
            });
        }
      }
    };
  }
);

readingRoomApp.controller('SubmitRegisterController',
  function($scope, $log, dialog, userService, accountService ){

    $scope.close = function(param){
      if (!param)  {
        dialog.close(null);
      }
      else {
        if($("#register_form").find("form").validateAccount() ){
          accountService.register(userService.user)
            .then(function(data){
              if (data.error == 200){
                dialog.close(data.user);
              }
              else{
                alert(data.message);
              }
            }, function(status){
              $log.warn(status);
            });
        }
      }
    };
  }
);

readingRoomApp.controller('SubmitLoginController',
  function($scope, $log, dialog, accountService ){

    $scope.close = function(userName, password){

      if ((userName === null) && (password === null)) {
        dialog.close(null);
      }
      else {
        if($("#login_form").find("form").validateAccount() ){
          accountService.logIn(userName, password)
            .then(function(data){
              if (data.error == 200)
                dialog.close(data.user);
              else{
                alert(data.message);
              }
            }, function(status){
              $log.warn(status);
            });
        }
      }
    };
  }
);

readingRoomApp.controller('SubmitEditProfileController',
  function($scope, $log, dialog, accountService, userService ){

    $scope.close = function(param){

      if (!param) {
        dialog.close(null);
      }
      else {
        if($("#edit-profile-form").find("form").validateAccount() ){
          var usr = {
            firstname: $("#firstname-e").val(),
            lastname: $("#lastname-e").val(),
            oldpassword: $("#password0-e").val(),
            newpassword: $("#password1-e").val(),
            country: $("#country-e option:selected").val(),
            email: $("#email-e").val()
          }

          accountService.editProfile(usr)
            .then(function(data){
              if (data.error == 200)
                dialog.close(data.user);
              else{
                alert(data.message);
              }
            }, function(status){
              $log.warn(status);
            });
        }
      }
    };
  }
);

readingRoomApp.controller('SubmitLogoutController',
  function($scope, $log, dialog, accountService, layoutService ){

    $scope.close = function(param){

      if (param === null) {
        dialog.close(null);
      }
      else {
        accountService.logOut(layoutService.titleBar.logged.username)
          .then(function(data){
            if (data.error == 200)
              dialog.close(true);
            else{
              alert(data.message);
            }
          }, function(status){
            $log.warn(status);
          });
      }
    };
  }
);
