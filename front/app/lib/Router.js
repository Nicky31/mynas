'use strict';


export default function Router(initializer) {
	this.routes = [];
	this.groups = {
		'all': {
			check: () => true
		}
	};
	this.datas = {};
	this.view404 = undefined;
	this.view403 = undefined;

	this.route = (url, route) => {
		route.url = url;

		this.routes.push(route);
		return this;
	};

	this.group = (name, check, view403) => {
		this.groups[name]  = {check, view403};
		return this;
	};

	this.setData = (key, value) => {
		this.datas[key] = value;
		return this;
	};

	this.set404View = view => {
		this.view404 = view;
		return this;
	};

	this.set403View = view => {
		this.view403 = view;
		return this;
	};

	this.config = function($routeProvider) {
		if (initializer) {
			var params = Array.prototype.slice.call(arguments, 1);
			initializer.apply(this, params);
		}

		this.routes.forEach(({url, group, template403Url, ...route}) => {
			const tpl = route.templateUrl;
			// TODO: BLOQUER L'ACCÈS AU CONTROLEUR AUSSI
			var self = this;
			route.templateUrl = function() {
				if (!group || self.checkPermission(group))
					return (typeof tpl == 'function' ? tpl.apply(undefined, Array.prototype.slice.call(arguments, 0)) : tpl);
				if (Array.isArray(group))
					return (template403Url || self.view403);
				return (template403Url 	|| self.groups[(group.startsWith('!') ? group.slice(1) : group)].view403
										|| self.view403)
			};
			$routeProvider.when(url, route);
		});
		if (this.view404)
			$routeProvider.otherwise({templateUrl: this.view404});
	};

	this.checkPermission = group => {
		if (Array.isArray(group))
			return group.reduce((lastRet, curGrp) => lastRet && this.checkPermission(curGrp), true);
		const invert = group && group[0] == '!';
		if (invert)
			group = group.slice(1);
		return (invert ? !this.groups[group].check() : this.groups[group].check())
	};
}