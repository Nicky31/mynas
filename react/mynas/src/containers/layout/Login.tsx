import * as React from 'react';

interface IProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

interface IState {
  error: string;
  email: string;
  password: string;
}

class Login extends React.Component<IProps, IState> {

  public state: IState = {
    error: "",
    email: "",
    password: "",
  };  

  public onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { email, password } = this.state
    this.props.onLogin(email, password)
    .catch(({ error }: {error: string}) => {
      this.setState({error})
    })
  }

  public render() {
    const { error } = this.state
    return (
      <div className="app flex-row align-items-center">
      <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card-group">
            <div className="card p-4">
              <div className="card-body">
                <h1>Connexion</h1> <br />
  
                <form method="post" onSubmit={this.onSubmit}>
                  <div className="input-group mb-3">
                    <span className="input-group-addon"><i className="icon-user"></i></span>
                    <input type="text" className="form-control" placeholder="Email" 
                      value={this.state.email}
                      onChange={({ target: { value: email }}) => this.setState({email})}
                    />
                  </div>
                  <div className="input-group mb-4">
                    <span className="input-group-addon"><i className="icon-lock"></i></span>
                    <input type="password" className="form-control" placeholder="Password" 
                      value={this.state.password}
                      onChange={({ target: { value: password }}) => this.setState({password})}
                    />                      
                  </div>
                  <div className="row">
                    <div className="col-6">
                      {!error ? null : (
                      <span style={{color: "#D8000C"}}>{error}<br /></span> 
                      )}
                      <button type="submit" className="btn btn-primary px-4">Connexion</button>
                    </div>
                  </div>
                </form>
  
              </div>
            </div>
  
          </div>
        </div>
      </div>
    </div>
    </div>
    )
  }
}

export default Login