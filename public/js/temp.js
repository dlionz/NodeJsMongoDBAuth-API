console.log('hello from the public folder');

function login(){
    const data = {
        email: $('[name="email"]').val(),
        password: $('[name="password"]').val()
    };

    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/user/login/',
        data: JSON.stringify(data),
        contentType: "application/json",

        success: function(data)
        {
            console.log(data.user.userName);
            $('#username').text(`Hello ${data.user.userName}`);
        },
        error: function(e)
        {
           console.log('Error:', e);
        }
    });
}