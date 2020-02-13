function GetDynamicTextbox(value) {

    return '<i class="glyphicon glyphicon-lock"></i><input type="text" class="input100" id="options" placeholder="Opcion:" value={this.state.txtOptions}   onChange={e => this.handleChange(e)}/> name="txtOptions" /><input type="button" onclick="RemoveTextBox(this)" value="Remover"style="width:100px;" />';

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