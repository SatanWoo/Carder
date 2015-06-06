var Router = require('react-router');
var { Route } = Router;

var App = React.createClass({
  render () {
    return (<div>Hello</div>)
  }
});

var routes = (
  <Route name="app" handler={App} path="/">
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.getElementById('app'));
});