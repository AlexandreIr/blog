function check(event, form){
    event.preventDefault();
    const email = document.getElementById('email');
    const pass = document.getElementById('password');
    email.classList.remove('error');
    document.getElementById('emailErr').style.display = 'none';
    pass.classList.remove('error');
    document.getElementById('passErr').style.display='none';

    if(email.value=="" || pass.value==""){
        if(email.value==""){
            email.classList.add('error');
            document.getElementById('emailErr').style.display = 'block';
        }

        if(pass.value==""){
            pass.classList.add('error');
            document.getElementById('passErr').style.display='block'
        }
    } else {
        form.submit();
    }
}
module.exports = check;