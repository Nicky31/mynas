import EntityModel from './EntityModel';

function getModelLinks(model) {
	var modelLinks = {}
	const addLink = (attrName,link) => {
		var depModel = link.model
		if (!modelLinks[depModel])
			modelLinks[depModel] = []
		modelLinks[depModel].push({
			depModel: model.name,
			attr: attrName,
			list: (link.list || false) 
		})
	}

	for (var attrName in model.attrs) {
		var attr = model.attrs[attrName]
		if (attr.link && !attr.link.spread_obj) {
			addLink(attrName, attr.link)
		}
	}

	return modelLinks
}

function link(managersList) {
	var managers = managersList.reduce((lastRet, manager) => {
		lastRet[manager.model.name] = manager;
		return lastRet
	}, {})
	var links = {};
	for (var mgrName in managers) {
		var manager = managers[mgrName]
		var modelLinks = getModelLinks(manager.model);
		for (var link in modelLinks) {
			if (!links[link])
				links[link] = modelLinks[link]
			else
				Array.prototype.push.apply(links[link], modelLinks[link])
		}
	}

	EntityModel.onNewLinkedEntity = (modelName, entity) => {
		if (!(modelName in managers))
			return ;
		// console.log('linked ' + modelName + ' added to his mgr')
		managers[modelName].worker.append(entity);
	};
}

export default link;