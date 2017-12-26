
function UserService({Users}) {

	this.findUser = async ({name, email}) => {
		if (name)
			var query = {name}
		else if (email)
			var query = {email}
		return await Users.find(query).toArray()
	}

	this.createUser = async data => {
		const check = await this.findUser({email: data.credentials.email})
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