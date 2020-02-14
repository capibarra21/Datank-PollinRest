const $ = window.$;
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var browserHistory = ReactRouter.browserHistory;
var origin = window.location.origin;



var Align = {
  textAlign: 'center'
};

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
      
      <div>
        <form id="pollform"   onSubmit={this.handleSubmit}>
          <div className="limiter">
            <div className="container-login100" >
              <div className="wrap-login100 p-t-30 p-b-50">
                <span className="login100-form-title p-b-41">Bienvenido</span>
                <div className="login100-form validate-form p-b-33 p-t-5" >
                  <div className="logo">
                    <img src="static/images/datank.png" height="100"/>
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
                      <input className="input100" type="text" name="txtOptions"  value={this.state.value}   onChange={this.handleOptionAdd} id="txtOptions" placeholder="Opcion:" />
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
        
        <div className="row">
          <h3 style={Align}>Live Preview</h3>
          <LivePreview title={this.state.title} options={this.state.txtOptions} classContext={classContext} />
        </div>
      </div>
    );
  }
};

class LivePreview extends React.Component{
  
  constructor(props) {
      super(props);
      this.state = {
        selected_option : ''
      };

    }
  handleOptionChange(e) {
    this.setState({selected_option: e.target.value });
  }
  
  voteHandler(e){
    e.preventDefault();
    
    var data = {"poll_title": this.props.title, "option": this.state.selected_option};
    
    //calls props handler
    this.props.voteHandler(data);
    
    //disable the button
    this.setState({disabled: 1});
    
  }
  
  render(){
  var options = this.props.options.map((option) =>  {
     
      if(option.name) {
       
        // calculate progress bar percentage
        var progress = Math.round((option.vote_count / this.props.total_vote_count) * 100) || 0
        var current = {width: progress+"%"}

        return (
          <div key={option.name}>
            <input name="options" type="radio" value={option.name} onChange={this.handleOptionChange} /> {option.name}
            <div className="progress">
              <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={progress}
              aria-valuemin="0" aria-valuemax="100" style={current}>
                {progress}%
              </div>
            </div>
          </div>
        );
      }
    }.bind(this));

    return(

      <div className={this.props.classContext}>
        <div className="panel panel-success">
          <div className="panel-heading">
            <h4>{this.props.title}</h4>
          </div>
          <div className="panel-body">
            <form onSubmit={this.voteHandler}>
              {options}
              <br />
              <button type="submit" disabled={this.state.disabled}
              className="btn btn-success btn-outline hvr-grow">Vote!</button>
              <small> {this.props.total_vote_count} votos</small>
             
            </form>
          </div>
        </div>
      </div>
    )
  }
};

class AllPolls extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        polls: {'Polls': []},
        selected_option: '', disabled: 0};
      
      this.loadPollsFromServer = this.loadPollsFromServer.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
    }
    
   
    
    loadPollsFromServer(){
      
      
      var pollName = this.props.routeParams.pollName
      
      if(pollName){
        var url = origin + '/api/poll/' + pollName
        this.setState({classContext: 'col-sm-6 col-sm-offset-3'})
        
      } else {
        var url = origin + '/api/polls'
        this.setState({header: 'Latest polls', classContext: 'col-sm-6'})
      }
      
      fetch(url)
        .then(response => response.json())
        .then(data => this.setState({polls: data}));
        
       
      
      //make get request
      
    }
    
    componentDidMount(){
      this.loadPollsFromServer()
    }
    
    render(){
     
      // if a message was returned in the json result (the poll wasn't found)
      if(!this.state.polls.message){
         
        return (
          <LivePreviewProps polls={this.state.polls} loadPollsFromServer={this.loadPollsFromServer} />
        );
      } else {
        return (
          <div style={Align}>
            <h1>Poll not found</h1>
            <p>You might be interested in these <a href="/">polls</a></p>
          </div>
        )
      }
    }
  };
class LivePreviewProps extends React.Component{
    
    constructor(props) {
      super(props);
      this.state = {
        selected_option : ''
      };
    }
    
    voteHandler(data){
      
      var url =  origin + '/api/poll/vote'
      
      fetch(url, {
        method: 'PATCH',
        data: JSON.stringify(data),
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .catch(error => console.error('Error:', error))
      this.setState({selected_option: ''});
      this.props.loadPollsFromServer();
      
    }
    render(){
      console.log(this.props.polls.Polls);
      var polls = this.props.polls.Polls.map((poll) => {
        return (
          < LivePreview key={poll.title} title={poll.title} options={poll.options}
          total_vote_count={poll.total_vote_count} voteHandler={this.voteHandler} />
          
        );
      })
      
      return (
        <div>
          <h1 style={Align}>{this.props.header}</h1>
          <br />
          <div className="row">{polls}</div>
        </div>
      );
    }
  };
  
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={AllPolls} />
    <Route path="/polls" component={PollForm} />
    <Route path="/polls/:pollName" component={AllPolls} />
  </Router>
  ),
  document.getElementById('container')
);
