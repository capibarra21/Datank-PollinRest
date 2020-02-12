$(document).ready(function () {
    $("#textUser").focus();
    $("#btnEntrar").click(function () {
        var Usuario = validaCaracteresEspeciales($("#textUser").val());
        var PassWord = validaCaracteresEspeciales($("#textPassword").val());
        getLogin(Usuario, PassWord);
        return false;
    });
});

function getLogin(usuario, password) {
    showLoading();
    $.ajax({
        type: "POST",
        async: false,
        url: 'Login.aspx/getLogin',
        data: '{Usuario : "' + usuario + '", Password : "' + password + '"}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {

            if (data.d.length == 0) {
                RemoveLoading();
                alert("Usuario o contraseña incorrectos");
                $("#textUser").focus();
                return;
            }

            if (data.d[0].ID_Usuario == -1) {/*we have some error*/
                RemoveLoading();
                alert(data.d[0].Nombre);
            }
            else {
                sessionStorage.setItem('ID_Usuario', data.d[0].ID_Usuario);
                sessionStorage.setItem('Nombre', data.d[0].Nombre);
                sessionStorage.setItem('Admin', data.d[0].Admin);
                sessionStorage.setItem('Correo_Usuario', data.d[0].email);
                RemoveLoading();
                location.href = "index.aspx";
            }
        },
        error: function (excepcion) {
            RemoveLoading();
            alert(excepcion.responseText);
        }
    });
}