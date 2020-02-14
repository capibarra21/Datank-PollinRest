function GetDynamicTextbox(value) {

    return '<i class="glyphicon glyphicon-lock"></i><input className="input100" type="text" name="txtOptions" id="txtOptions" placeholder="Opcion:" /><input type="button" onclick="RemoveTextBox(this)" value="Remover"style="width:100px;" />';

}

function AddTextBox() {

    var div = document.createElement('DIV');
    div.setAttribute('class', 'wrap-input100 validate-input');
    
    div.innerHTML = GetDynamicTextbox("");

    document.getElementById("divCont").appendChild(div);

}

function RemoveTextBox(div) {

    document.getElementById("divCont").removeChild(div.parentNode);

}