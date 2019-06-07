import * as React from "react";

export default class Dashboard extends React.Component {
	BASE_BREADCRUMB = "Dashboard"

    render() {

        return (
            <div>
	<div className="map-wrapper">
		<br />
            <div className="page-title">
              <div className="container">
                <h1>Carte des oeuvres </h1>
              </div>
            </div>
        <div id="indexMap" style={{width: 1000, height: 500}}></div>
  	</div>

  	<div className="main-wrapper" >
        <div className="page-title" >
          <div className="container">
            <h1>Dernières oeuvres</h1>
          </div>
        </div>

    	<div className="main">
      	<div className="main-inner">
        	<div className="container">
          	<div className="content">
            	<div className="mt-80">
              	<div className="listing-tiles">
                	<div className="row">
                		<div className="col-sm-4" ng-repeat="artwork in artworkOverview" ng-include="'views/home/artworkTemplate.html'"></div>
                	</div>
              	</div>
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