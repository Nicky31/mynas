'use strict';
import moment from 'moment'

export function Worker(entities, model) {
	this.newEntity = datas => {
		if (Array.isArray(datas))
			return (datas.map(this.newEntity.bind(this)))
		if (datas.__model) 
			return (datas);
		return (model.hydrateEntity(datas, model.getDefaultValues()));
	};

	this.findAll = (query = {}) => {
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
		if (Array.isArray(id)) {
			return id.map(this.delete.bind(this))
		}
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
export default function EntityManager(entityModel, tasks, customMethods) {
	this.model = entityModel;

	this.entities = []
	this.worker = new Worker(this.entities, entityModel);

	for (var name in customMethods) {
		this[name] = customMethods[name].bind(this);
	}

	this.tasks = {
		InsertEntity: {
			params: ['entity', 'insertMode'],
			handler: function(entity, insertMode) {
				if (!insertMode || insertMode == 'append')
					return this.worker.append(entity)
				return this.worker.prepend(entity)
			}
		},

		DeleteEntity: {
			params: ['id'],
			handler: (id) => this.worker.delete(id)
		},

		UpdateEntity: {
			params: ['update'],
			handler: update => this.worker.update(update)
		}
	}

	for (var name in tasks) {
		this.tasks[name] = tasks[name]
	}

	this.taskHistory = {}
	this.get = query => this.worker.find(query);

	var entityMgr = this
	// Tasks handling
	this.taskId = (taskArgs) => {
		const tab = Array.from(taskArgs)
		return tab.slice(0, this.tasks[tab[0]].params.length + 1).map(JSON.stringify).join('_')
	}

	this.task = function(name) {
		const task = this.tasks[name]
		var result  = task.handler.apply(entityMgr, Array.from(arguments).slice(1))
		if (!result.then) {
			return result
		}
		if (task.logging !== false)
			this.logTask(arguments, {working: true})		
		return result
		.then(ret => {
			if (task.logging !== false)
				this.logTask(arguments, {result: ret})
			return ret
		})
		.catch(error => {
			if (task.logging !== false)
				this.logTask(arguments, {error})
			throw error
		})
	}

	this.logTask = function(taskArgs, data) {
		const curId = this.taskId(taskArgs)
		data.date = moment()
		this.taskHistory[curId] = data
	}

	this.getLastTask = function(name) {
		const curId = this.taskId(arguments)
		return this.taskHistory[curId]
	}
}