
function UserService({Users}) {

	this.formatMongoQuery = ({name, email, id}) => {
		if (name)
			return {name}
		else if (email)
			return {email}
		else if (id)
			return {id}
		return {}		
	}

	this.findOneUser = async (query) => {
		return await Users.findOne(this.formatMongoQuery(query))
	}

	this.findUsers = async (query) => {
		return await Users.find(this.formatMongoQuery(query)).toArray()
	}

	this.createUser = async data => {
		const check = await this.findUsers({email: data.credentials.email})
		if (check.length) {
			throw 'E-mail already existant'
		}
		const newUser = {
			name: data.name,
			email: data.credentials.email,
			password: data.credentials.password
		}
		const response = await Users.insert(newUser)
      // delete newUser.password
      return Object.assign({id: response.insertedIds[0]}, newUser)
  }
}

export default UserService