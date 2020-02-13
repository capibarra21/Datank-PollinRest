const $ = window.$;
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var origin = window.location.origin;




class PollForm extends React.Component{

constructor(props) {
        super(props);
        this.state = {
            txtTema: ' ',
            option: ' ',
            txtOptions: []
        };
          this.handleChangeTema = this.handleChangeTema.bind(this);
           this.handleChangeOpcion = this.handleChangeOpcion.bind(this);
           this.handleOptionAdd = this.handleOptionAdd.bind(this);
           this.handleSubmit = this.handleSubmit.bind(this);
    }
 
 handleChangeTema(e) {
    this.setState({txtTema: e.target.value});
    }
    handleChangeOpcion(e) {
    this.setState({option: e.target.value});
    }

handleOptionAdd(e){
    //update poll options and reset options to an empty string
    this.setState({
    txtOptions: this.state.txtOptions.concat({name: this.state.option}),
    option: ' '
    });
  }


handleSubmit(e) {

   e.preventDefault();
  
   var title = this.state.txtTema;
    var txtOptions = this.state.txtOptions;
   
    var data = {title: title,
                txtOptions: txtOptions.map(function(x){return x.name}),
               
              };

   
   var url =  origin + '/api/polls'
   fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => alert('La encuesta se creo correctamente') );


   
  }

render(){
   
    var classContext = "container-login100"
   
    return (
    
    
    <form id="pollform"   onSubmit={this.handleSubmit}>
        <div className="limiter">
            <div className="container-login100" >
                <div className="wrap-login100 p-t-30 p-b-50">
                    <span className="login100-form-title p-b-41">Bienvenido
                    </span>
                    <div className="login100-form validate-form p-b-33 p-t-5" >
                        <div className="logo">
                            <img src="static/images/datank.png" height="100" />
                        </div>
                        <div id="divCont" >
                            <div className="wrap-input100 validate-input" data-validate="Ingrese tema">
                                <i className="glyphicon glyphicon-user"></i>
                                <input className="input100" type="text" name="txtTema" value={this.state.value}   onChange={this.handleChangeTema} id="txtTema" placeholder="Tema" required/>
                            </div>
                            <div className="wrap-input100 validate-input" data-validate="Ingrese Opcion">
                                <i className="glyphicon glyphicon-lock"></i>
                                <input className="input100" type="text" name="txtOptions" value={this.state.value}  onChange={this.handleChangeOpcion} id="txtOptions" placeholder="Opcion:" />
                            </div>
                             <div className="wrap-input100 validate-input" data-validate="Ingrese Opcion">
                                <i className="glyphicon glyphicon-lock"></i>
                                <input className="input100" type="text" name="txtOptions" value={this.state.value}   onChange={this.handleOptionAdd} id="txtOptions" placeholder="Opcion:" />
                            </div>
                        </div>
                        <div className="container-login100-form-btn m-t-32">
                            <input type="button" className="login100-form-btn" onClick={() => AddTextBox() } value="Añadir Opcion" />
                            <input type="submit" className="login100-form-btn" id="btnEntrar" value="Guardar" />
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>

    

    
  
    );
  }
}
ReactDOM.render(
  
    <PollForm />
  ,
  document.getElementById('container')
);

