import * as React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

// Layout
import Login from 'containers/layout/Login';
import LoggedBody from 'containers/layout/LoggedBody';

// Containers
import { Dashboard, Files } from 'containers';

// Redux links
import { connect } from 'react-redux';
import { restoreSession, login, destroySession } from 'actions/globalActions';

const mapProps = {
  restoreSession,
  destroySession,
  login
}
const mapState = ({ global } : { global: GlobalReducerShape }) => ({
  global
})

interface IProps {
  restoreSession: () => any;
  global: GlobalReducerShape;
  login: (params: LoginRequestShape) => any;
  destroySession: () => any;
}

class App extends React.Component<IProps, {}> {

  componentDidMount() {
    this.props.restoreSession()
  }

  public onLogin = (email: string, password: string) => this.props.login({email, password})

  public render() {
    const user = this.props.global.user
    if (!user) {
      return (
        <Login onLogin={this.onLogin} />
      )
    }
    
    return (
    <Router>
      <LoggedBody user={user} onLogout={this.props.destroySession}>
        <Route path="/" exact component={Dashboard} />
        <Route path="/files/" component={Files} />
      </LoggedBody>
    </Router>      
    )
  }
}

export default connect(mapState, mapProps)(App);
