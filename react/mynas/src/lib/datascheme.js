import { DataScheme } from 'model-graph';

const datascheme = new DataScheme(
	{
		users: {},

        files: {}
    },
    
	{ idAttribute: '_id' }
);


export default datascheme