'use strict';
export function Worker(entities, model) {
	this.newEntity = datas => {
		if (Array.isArray(datas))
			return (datas.map(this.newEntity.bind(this)))
		if (datas.__model) 
			return (datas);
		return (model.hydrateEntity(datas, model.getDefaultValues()));
	};

	this.findAll = query => {
		const attrs = Object.keys(query);
		return entities.filter(cur => {
			return attrs.every(attr => typeof cur[attr] != 'undefined' && cur[attr] == query[attr])
		});
	};

	this.find = query => {
		var ret = this.findAll(query);
		if (!ret || !ret.length)
			return (false);
		return (ret[0]);
	};

	this.update = query => {
		var target = this.find({id: query.id});
		if (!target)
			return (false);
		target.update(query);
		return (target);
	};

	this.delete = id => {
		var index = entities.findIndex(cur => cur.id == id);
		if (index == -1)
			return (false);
		entities.splice(index, 1);
		return (true);
	};

	this.append = entity => {
		return (this.insert(entity, entities.length));
	};

	this.prepend = entity => {
		return (this.insert(entity, 0));
	};

	this.insert = (entity, pos) => {
		var instances = this.newEntity(entity)
		if (Array.isArray(instances))
			entities.splice(pos, 0, ...instances.filter(cur => !entities.some(entity => entity.id == cur.id)))
		else if (!entities.some(cur => cur.id == instances.id))
			entities.splice(pos, 0, instances)
		return instances
	}
}

// TODO: gestion pagination
// TODO: Gestion status requêtes (sauvegarde timestamp + résultat de chaque dernière requete)
export default function EntityManager(entityModel, backendLinks, customMethods) {
	this.model = entityModel;
	this.backend = backendLinks;

	this.entities = []
	this.worker = new Worker(this.entities, entityModel);

	for (var name in customMethods) {
		this[name] = customMethods[name].bind(this);
	}

	this.has = query => this.worker.find(query);

	this.fetch = id => {
		var ret = this.worker.find({id})
		if (ret) {
			return (Promise.resolve({success: true, entity: ret}));
		}
		return this.backend.fetchOne({id})
		.then(result => {
			if (result.success && result.entity) {
				result.entity = this.worker.append(result.entity);
			}
			return (result);
		});
		return (Promise.reject(false))
	};

	this.fetchAll = () => {
		return this.backend.fetchAll()
		.then(result => {
			if (result.success && result.entity) {
				result.entity = this.worker.append(result.entity);
			}
			return (result);
		});
		return (Promise.reject(false))
	};

	this.update = query => {
		return this.backend.update(query)
		.then(result => {
			if (result.success && result.entity) {
				result.entity = this.worker.update({...query, ...result.entity})
			}
			return (result);
		});
		return (Promise.reject(false))
	};

	this.insert = (entity, insertMode) => {
		return this.backend.insert(entity)
		.then(result => {
			if (result.success && result.entity) {
				if (!insertMode ||  insertMode == 'append')
					result.entity = this.worker.append({...entity, ...result.entity});
				else
					result.entity = this.worker.prepend({...entity, ...result.entity});
			}
			return (result);
		});
		return (Promise.reject(false))
	};

	this.delete = id => {
		return this.backend.delete(id)
		.then(result => {
			if (result.success) {
				this.worker.delete(id);
			}
			return (result);
		});
		return (Promise.reject(false))
	};
}