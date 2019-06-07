import * as React from "react";
import { Link } from "react-router-dom";

interface IProps {
    user: UserModelShape,
    onLogout: () => void;
}

export default class Navbar extends React.Component<IProps> {

    render() {
        const { user, onLogout } = this.props

        return (
<header className="app-header navbar">
    <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button">&#9776;</button>
    <Link to="/" className="navbar-brand"></Link>
    <ul className="nav navbar-nav d-md-down-none">
        <li className="nav-item">
            <span style={{cursor: 'pointer'}} className="nav-link navbar-toggler sidebar-toggler">&#9776;</span>
        </li>

        <li className="nav-item px-3">
            <Link className="nav-link" to="/">Dashboard</Link>
        </li>
        <li className="nav-item px-3">
            <Link className="nav-link" to="/files">Fichiers</Link>
        </li>
        <li className="nav-item px-3">
            <Link className="nav-link" to="/">Agenda</Link>
        </li>
        <li className="nav-item px-3">
            <Link className="nav-link" to="/">Notes</Link>
        </li>
    </ul>
    <ul className="nav navbar-nav ml-auto d-md-down-none">
        <li className="nav-item dropdown" style={{marginRight: "40px !important"}}>
            <span  className="nav-link dropdown-toggle" data-toggle="dropdown" role="button"
                aria-haspopup="true" aria-expanded="false" style={{cursor: "pointer", marginRight: 5}}
            >
                <img src="img/avatars/6.jpg" className="img-avatar" alt="admin@bootstrapmaster.com" />
                <span className="d-md-down-none">{user.name}</span>
            </span>
            <div className="dropdown-menu dropdown-menu-right">

                <div className="dropdown-header text-center">
                    <strong>Account</strong>
                </div>
                <Link className="dropdown-item" to="/settings"><i className="fa fa-wrench"></i> Setting</Link>
                <span className="dropdown-item" style={{cursor:'pointer'}} onClick={onLogout}><i className="fa fa-lock"></i> Logout</span>
            </div>
        </li>
    </ul>
</header>

        )
    }
}