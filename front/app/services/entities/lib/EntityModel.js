'use strict';

/*
 *	Model attribute 
 *	entityAttr: {
 *		default: 'defaultValue',
 *		alias: 'otherAttrName',
 *		link: {
 *			list: false,
 *			spread_obj: true,
 *			model: 'modelName'
 *		}
 *	}
 */
function EntityModel(name, attrs, config = {}) {
	EntityModel.registerEntityModel(name, this);
	this.name = name
	this.updateCallbacks = config.updateCallbacks || {};
	this.attrs = attrs;

	this.bindHelpers = obj => {
		if (config.helpers) {
			Object.keys(config.helpers).forEach(helper => {
				obj[helper] = config.helpers[helper].bind(obj)
			})
		}
	}

	this.getDefaultValues = () => {
		var values = {}
		for (var key in this.attrs)
			if (typeof this.attrs[key].default != 'undefined')
				values[key] = this.attrs[key].default
		return (values);
	}

	this.constructLinkedEntity = (input, linkAttr) => {
		const instantiate = (input, model) => {
			if (typeof input == 'object')
				return model.hydrateEntity(input, model.getDefaultValues());
			// Simple id, we should request other mgrs for the id
			return input;
		}
		var attr = this.attrs[linkAttr]
		const model = EntityModel.store[attr.link.model]
		var entity = false

		if (attr.link.list) { // : linkAttr is an entity collection
			if (Array.isArray(input)) {
				entity = input.map(cur => instantiate(cur, model));
			} else
				entity = []
		} else if (typeof input == 'object') { // : whole entity is stored
			entity = instantiate(input, model);
		} else {
			console.log(this.name + " :retrieved only id for " + linkAttr )
			// TODO: get linked entity by an id
		}

		if (entity && EntityModel.onNewLinkedEntity)
			EntityModel.onNewLinkedEntity(model.name, entity)
		return entity;
	};

	this.computeAttr = (key, value, out) => {
		const attr = this.attrs[key]
		if (!attr || attr === true) {
			out[key] = value;	
			return (value);
		}
		if (attr.link && value && !value.__model) {
			value = this.constructLinkedEntity(value, key)
			if (!value) {
				return null
			}
			if (attr.link.spread_obj) {
				value.__model.bindHelpers(out)
				delete value.__model //TODO: pas générique
				delete value.update
				Object.assign(out, value);
			}

		}
		if (attr.alias)
			out[attr.alias] = value;
		if (!attr.link || !attr.link.spread_obj) {
			out[key] = value;
		}
		return value;
	};

	this.hydrateEntity = (input, entity) => {
		if (!entity)
			entity = {};
		if (!entity.__model) { // entity creation
			entity.__model = this;
			entity.update = datas => {
				entity.__model.hydrateEntity(datas, entity)
			}
			this.bindHelpers(this);
		}
		Object.keys(input).forEach(cur => {
			if ((cur in this.attrs)) {
				this.computeAttr(cur, input[cur], entity)
			} else
				entity[cur] = input[cur];
			if (cur in this.updateCallbacks) { // attributs calculés
				this.updateCallbacks[cur].call(entity, entity[cur], input[cur]);
			}
		});
		return (entity);
	};


	['attrs', 'updateCallbacks', 'hydrateEntity', 'getDefaultValues', 'constructLinkedEntity', 'computeAttr']
	.forEach(curProp => Object.defineProperty(this, curProp, {
		writable : true,
		enumerable : false,
		configurable : true
	}));
}

EntityModel.store = {};
EntityModel.registerEntityModel = (key, model) => {
	EntityModel.store[key] = model;
}
EntityModel.onNewLinkedEntity = undefined;

export default EntityModel