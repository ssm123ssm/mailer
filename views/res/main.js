//CODE HANDLING
function code(json) {
    if (json.log) {
        console.log(json.log);

    }
    if (json.alert) {
        alert(json.alert);
    }
    if (json.redirect) {
        setTimeout(function () {
            location.replace(json.redirect);
        }, 1000);
    }
}

//ANGULAR
var app = angular.module('myApp', []);
app.controller('ctrl', ['$scope', function ($scope) {

    $scope.loadMyProjects = function () {
        $.getJSON('/myProjects', function (json) {
            code(json);
            if (json.code == 200) {
                for (var i = 0; i < json.projects.length; i++) {
                    if (!json.projects[i].redirect) {
                        json.projects[i].redirect = 'Default'
                    }
                }
                $scope.$apply(function () {
                    $scope.myProjects = json.projects;
                });
            }
        });
    }

    $scope.remove = function (name) {

        $.post('/remove', {
            name: name
        }, function (json) {
            code(json);
            if (json.code == 500) {
                for (var i = 0; i < json.projects.length; i++) {
                    if (!json.projects[i].redirect) {
                        json.projects[i].redirect = 'Default'
                    }
                }
                $scope.myProjects = json.projects;
                $scope.$apply();
            }
        });
    }

    }]);

$(function () {
    //Enter Key
    $(document).keypress(function (e) {
        if (e.which == 13) {
            $("#login_btn").trigger('click');
            $("#signup_btn").trigger('click');
        }
    });

    var valid_mail = false,
        valid_password = false,
        valid_confirm_password = false;

    $('#signup_btn').click(function () {

            var username = $('#username_field').val();
            var email = $('#email_field').val();
            var password = $('#password_field').val();

            // debugger;
            $('#username_group').removeClass('has-danger', 'has-success');
            $('#username_field').removeClass('form-control-success', 'form-control-danger');
            $('#username_feedback').html('');
            //posting and validating username
            if (username == '') {

                $('#username_group').addClass('has-danger');
                $('#username_field').addClass('form-control-danger');
                $('#username_feedback').html('Username cannot be empty');

            } else {
                if (valid_mail && valid_password && valid_confirm_password) {
                    $.post('/signup', {
                        username: username,
                        password: password,
                        email: email
                    }).done(function (json) {

                            if (json.code == 101) {
                                $('#username_group').addClass('has-danger');
                                $('#confirm_password_group').removeClass('has-success', 'has-warning');
                                $('#confirm_password_group').addClass('has-warning');
                                $('#confirm_password_field').addClass('form-control-warning');
                                $('#confirm_password_field').val('');
                                var feedback = "Passwords don't match";
                                $('#confirm_password_feedback').html(feedback);
                                valid_confirm_password = false;
                                $('#username_field').addClass('form-control-danger');
                                var feedback = "Username is taken!";
                                $('#username_feedback').html(feedback);
                            } else if (json.code == 100) {
                                $('#username_group').addClass('has-success');
                                $('#username_field').addClass('form-control-success');
                                var feedback = "Sign up complete!";
                                $('#username_feedback').html(feedback);
                            } else if (json.code == 750) {
                                $('#email_group').removeClass('has-warning', 'has-success');
                                $("#email_group").addClass('has-warning');
                                $('#email_field').removeClass('form-control-success', 'form-control-warning');
                                $("#email_field").addClass('form-control-warning');
                                $('#email_feedback').html('An account already registered on that email!');
                                $('#confirm_password_group').removeClass('has-success', 'has-warning');
                                $('#confirm_password_group').addClass('has-warning');
                                $('#confirm_password_field').addClass('form-control-warning');
                                $('#confirm_password_field').val('');
                                var feedback = "Passwords don't match";
                                $('#confirm_password_feedback').html(feedback);
                                valid_confirm_password = false;
                            }
                        } else if (json.code == 105) {
                            $('#email_group').removeClass('has-warning', 'has-success');
                            $("#email_group").addClass('has-warning');
                            $('#email_field').removeClass('form-control-success', 'form-control-warning');
                            $("#email_field").addClass('form-control-warning');
                            $('#email_feedback').html('Email address does not exist!');
                            $('#confirm_password_group').removeClass('has-success', 'has-warning');
                            $('#confirm_password_group').addClass('has-warning');
                            $('#confirm_password_field').addClass('form-control-warning');
                            $('#confirm_password_field').val('');
                            var feedback = "Passwords don't match";
                            $('#confirm_password_feedback').html(feedback);
                            valid_confirm_password = false;
                        }
                        code(json);
                    });
            }
        }

    });

//realtime validation - PASSWORD
$('#confirm_password_field, #password_field').on('paste keyup change', function () {

    var password = $('#password_field').val();
    var confirm_password = $('#confirm_password_field').val();


    //password validation
    if (password.length > 5) {
        valid_password = true;
    } else {
        valid_password = false;
    }
    $('#password_group').removeClass('has-warning', 'has-success');
    $('#password_field').removeClass('form-control-success', 'form-control-warning');

    if (!valid_password) {
        $('#password_group').addClass('has-warning');
        $('#password_field').addClass('form-control-warning');
        var feedback = "Password should have at least 6 characters";
        $('#password_feedback').html(feedback);
    } else {
        $('#password_group').addClass('has-success');
        $('#password_field').addClass('form-control-success');
        $('#password_feedback').html('');
    }

    //confirm password validation
    if (password == confirm_password) {
        valid_confirm_password = true;
    } else {
        valid_confirm_password = false;
    }
    $('#confirm_password_group').removeClass('has-warning', 'has-success');
    $('#confirm_password_field').removeClass('form-control-success', 'form-control-warning');

    if (!valid_confirm_password) {
        $('#confirm_password_group').addClass('has-warning');
        $('#confirm_password_field').addClass('form-control-warning');
        var feedback = "Passwords don't match";
        $('#confirm_password_feedback').html(feedback);
    } else {
        if (!valid_password) {
            $('#confirm_password_group').addClass('has-warning');
            $('#confirm_password_field').addClass('form-control-warning');
            $('#confirm_password_feedback').html('');
        } else {
            $('#confirm_password_group').addClass('has-success');
            $('#confirm_password_field').addClass('form-control-success');
            $('#confirm_password_feedback').html('Passwords match');

        }
    }
});

//realtime validation - email
$('#email_field').on('change keyup paste', function () {
    var email = $('#email_field').val();
    //email validation
    if (email.indexOf('@') >= 0 && email.indexOf('.') >= 0 && (email.indexOf('.') + 1 != email.indexOf('@') && email.indexOf('.') - 1 != email.indexOf('@')) && email.indexOf('.') != email.length - 1 && email.indexOf('@') != 0) {
        valid_mail = true;
    } else {
        valid_mail = false;
    }
    $('#email_group').removeClass('has-warning', 'has-success');
    $('#email_field').removeClass('form-control-success', 'form-control-warning');

    if (!valid_mail) {
        $('#email_group').addClass('has-warning');
        $('#email_field').addClass('form-control-warning');
        var feedback = "Invalid email address";
        $('#email_feedback').html(feedback);
    } else {
        $('#email_group').addClass('has-success');
        $('#email_field').addClass('form-control-success');
        $('#email_feedback').html('');
    }
});

//realtime validation - USERNAME
$('#username_field').on('change paste keyup', function () {
    $('#username_group').removeClass('has-success');
    $('#username_group').removeClass('has-danger');
    $('#username_field').removeClass('form-control-success', 'form-control-danger');
    $('#username_feedback').html('');
});

$('#login_btn').click(function () {
    var username = $('#username_field').val();
    var password = $('#password_field').val();
    $.post('/login', {
        username: username,
        password: password
    }, function (json) {
        code(json);
    });
});

$('#submit_project_btn').click(function () {
    if ($("#project_field").val() != '') {
        $('#project_group').removeClass('has-danger');
        $('#project_group').removeClass('has-success');
        $('#project_field').removeClass('form-control-success');
        $('#project_field').removeClass('form-control-danger');
        $('#project_feedback').html('');
        var project = $('#project_field').val();
        var redirect = $("#redirect_field").val();

        var submission = {};
        submission.project = project;
        if ($("#custom_redirect_radio").is(':checked') && redirect != '') {
            submission.redirect = redirect;
        }
        $.post('/submit_project', submission, function (json) {
            code(json);
            if (json.code == 400) {

                $('#project_group').addClass('has-success');
                $('#project_field').addClass('form-control-success');

                var scope = angular.element("body").scope();
                for (var i = 0; i < json.projects.length; i++) {
                    if (!json.projects[i].redirect) {
                        json.projects[i].redirect = 'Default'
                    }
                }
                scope.$apply(function () {
                    scope.myProjects = json.projects;
                });
            }
            if (json.code == 300) {
                $('#project_group').addClass('has-danger');
                $('#project_field').addClass('form-control-danger');
                $('#project_feedback').html('The Project name exists!');
            }
        });
    } else {
        alert('Project name cannot be empty!');
    }
}); $('#custom_redirect_radio').click(function () {
    $("#redirect_group").css('display', 'block');
}); $('#default_redirect_radio').click(function () {
    $("#redirect_group").css('display', 'none');
});


});

/*codes
101: signup - username taken
100: signup complete
200: loadMyProjects - not logged in
300: project name exists
400: project submition success
500: project removal success
750: email taken
105: email not exists
*/
