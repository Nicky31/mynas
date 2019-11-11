import { DataScheme } from 'model-graph';

const datascheme = new DataScheme(
	{
		users: {
			idAttribute: '_id'
		},

        files: {}
    },
    
	{ idAttribute: 'id' }
);


export default datascheme