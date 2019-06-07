import * as React from 'react';

export default class Footer extends React.Component {

    render() {
        return (
            <footer className="app-footer">
                <a href="http://dulis.me">OwnSpace</a> &copy; 2017
                <span className="float-right">Powered by <a href="http://coreui.io">CoreUI</a>
                </span>
            </footer>
            
        )
    }
}