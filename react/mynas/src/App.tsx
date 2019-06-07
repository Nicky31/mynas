import * as React from 'react';
import { withCookies } from 'react-cookie';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from "react-router-dom";

// Layout
import Login from 'containers/layout/Login';
import LoggedBody from 'containers/layout/LoggedBody';

// Containers
import { Dashboard, Files } from 'containers';

interface IProps {
  cookies: any;
  store: any;
}

class App extends React.Component<IProps, {}> {

  public onLogin = (email: string, password: string) => {
    console.log(email + ' / ' + password)
    return Promise.reject("invalid ids")
  }

  public onLogout = () => {
    console.log('LOGOUT ')
  }

  public render() {
    const user = {"name": "Martin"} //this.props.cookies.get('user')
    if (!user) {
      return (
        <Login onLogin={this.onLogin} />
      )
    }
    
    return (
    <Provider store={this.props.store}>
    <Router>
        <LoggedBody user={user} onLogout={this.onLogout}>
          <Route path="/" exact component={Dashboard} />
          <Route path="/files/" component={Files} />
        </LoggedBody>
    </Router>      
    </Provider>
    )
  }
}

export default withCookies(App);
