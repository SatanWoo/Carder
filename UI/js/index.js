var Router = require('react-router');
var EventEmitter = require('events').EventEmitter;
var { Route } = Router;

var Header = React.createClass({
  render () {
    return (<nav className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">
            Cardify
          </a>
        </div>
      </div>
    </nav>);
  }
});

var URLInput = React.createClass({
  getInitialState () {
    return {
      url: '',
      source: 'default',
      iframeCode: ''
    };
  },
  handleURLChange (e) {
    this.setState({
      url: e.target.value
    });
  },
  handleSourceChange (e) {
    this.setState({
      source: e.currentTarget.value
    });
  },
  handleSubmit (e) {
    e.preventDefault();
    this.setState({
      iframeCode: `<iframe src="http://localhost:3000/iframe?source=${this.state.source}&url=${encodeURIComponent(this.state.url)}"/>`
    });
  },
  renderIFrameCode () {
    if (!this.state.iframeCode) return <div></div>;
    return (<div>
              <pre>
                {this.state.iframeCode}
              </pre>
            </div>);
  },
  render () {
    return (
      <div className="container" style={{marginTop: '40px'}}>
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <form className="form">
              <div className="form-group">
                <label for="url">URL you want to cardify</label>
                <input type="url"
                  name="url" 
                  className="form-control"
                  value={this.state.url} 
                  onChange={this.handleURLChange}/>
              </div>
              <div className="form-group">
                <label for="source">Select source</label>
                <div className="radio">
                  <label>
                    <input type="radio" value="default" name="source" checked={this.state.source === 'default'} onChange={this.handleSourceChange}/> Any source
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" value="Tudou" name="source" checked={this.state.source === 'Tudou'} onChange={this.handleSourceChange}/> Tudou
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" value="Ebay" name="source" checked={this.state.source === 'Ebay'} onChange={this.handleSourceChange}/> Ebay
                  </label>
                </div>
              </div>
              <div className="form-group">
                <button className="btn btn-default" onClick={this.handleSubmit}>Cardify It!</button>
              </div>
            </form> 
            {this.renderIFrameCode()}
          </div>
        </div>
      </div>
    );
  }
});

var App = React.createClass({
  render () {
    return (
      <div>
        <Header />
        <URLInput />
      </div>);
  }
});

var routes = (
  <Route name="app" handler={App} path="/">
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.getElementById('app'));
});