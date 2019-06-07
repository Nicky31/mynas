import * as React from "react";

export default class Sidebar extends React.Component {
    render() {
        const baseLinks = null
        /*
                    <div ng-if="baseLinks.length">
                        <li className="nav-item" ng-repeat="link in baseLinks">
                            <a className="nav-link" ng-click="link.action()" style={{cursor: "pointer"}}>
                                <i ng-className="link.iconClassname"></i>{{link.name}}
                            </a>
                        </li>
                    </div>
*/

        const pageLinks = null
        /*
<div ng-if="pageLinks.length">
                        <li className="nav-item" ng-repeat="link in pageLinks">
                            <a className="nav-link" ng-click="link.action()" style={{cursor: "pointer"}}>
                                <i ng-className="link.iconClassname"></i>{{link.name}}
                            </a>
                        </li>
                    </div>
        */
        return (
        <div className="sidebar" ng-controller="SidebarCtrl">
            <nav className="sidebar-nav">
                <ul className="nav">
                    {baseLinks}
                    <li className="divider"></li>
                    <li className="nav-title">
                        Tools
                    </li>

                    <div ng-repeat="widget in pageWidgets" ng-include="widget.include"></div>

                    <li className="divider"></li>

                    {pageLinks}
                </ul>
            </nav>
        </div>

        )
    }
}