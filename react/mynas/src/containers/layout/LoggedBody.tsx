import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";

// Layout components
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ReduxActions from "actions";

// Redux links
import { connect } from "react-redux";
const mapState = ({ global } : {global: GlobalReducerShape}) => ({ global })
const mapProps = {
    popBreadcrumb: ReduxActions.POP_BREADCRUMB.create
}

interface IProps {
    children: JSX.Element[];
    onLogout: () => void;
    user: UserModelShape;
    global: GlobalReducerShape;
    popBreadcrumb: (opts: PopBreadcrumbActionShape) => void;
}

class LoggedBody extends React.Component<IProps & RouteComponentProps<any>, {}> {
    componentWillUpdate(nextProps: any) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.props.popBreadcrumb({index: -1})
        }
    }    

    renderBreadcrumb() {
        return (
            <ol className="breadcrumb">
                {this.props.global.breadcrumb.map(({ title } : BreadcrumbShape, idx: number) => (
                <li className="breadcrumb-item" key={title+idx}>
                    <span style={{cursor: 'pointer'}}
                        onClick={() => this.props.popBreadcrumb({index: idx})}
                    >
                        {title}
                    </span>
                </li>
                ))}
            </ol>            
        )
    }

    render() {
        const { user, onLogout, children } = this.props

        return (
        <div className="app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden">
            <Navbar
                user={user}
                onLogout={onLogout}
            />

            <div className="app-body">
                <Sidebar />
                <main className="main">
                    {this.renderBreadcrumb()}
                    <div className="container-fluid">
                        {children}
                    </div>
                </main>


                {/*<div ng-include="'views/common/aside.html'"></div>*/}

            </div>

            <Footer />>
        </div>            
        )
    }
}

export default connect(mapState, mapProps)(withRouter(LoggedBody))

