const connectMongo = require('./mongo-connector');
const bcrypt = require('bcrypt');
const Services = require('./services').default;


(async function(){
    var [ email, password ] = [process.argv[2], process.argv[3]]

    password = bcrypt.hashSync(password, 10)    
    var mongo = await connectMongo()
    const services = Services(mongo)

    var ret = await services.UserService.createUser({
        credentials: {
            email,
            password
        }
    })
    
    console.log(`User ${email} created`)
    console.log(ret)
})()
