import { DataScheme } from 'model-graph';

const datascheme = new DataScheme(
	{
		users: {},

        files: {}
    },
    
	{ idAttribute: 'id' }
);


export default datascheme