const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;

module.exports = {
    async createUser(firstName,lastName,address,email,phoneNum,licenseNum,username, password){
        if (!username || !firstName || !lastName || !address || !email || !phoneNum || !password || !licenseNum)  
        throw 'All fields need to have valid values';
        const usersCollection = await users();
        const res = await usersCollection.findOne({ username: username.toLowerCase() });
        if (res != null) throw "User with this username already exists";
        const hashPasswd = await bcrypt.hash(password, saltRounds);
        let newUser = {
            firstName:firstName,
            lastName:lastName,
            address:address,
            email:email,
            phoneNum:phoneNum,
            licenseNum:licenseNum,
            username: username.toLowerCase(),
            password: hashPasswd,
            reviewsGiven : [],
            role : "user"
        };
        const insertInfo = await usersCollection.insertOne(newUser);
          if (insertInfo.insertedCount === 0) throw 'Internal Server Error';
        else{
          const id = insertInfo.insertedId.toString()
          return {userInserted: true, userId: id , username : username};
        }
      },

    
      async checkUser(username, password){
        let compareToMatch = false;
        if (!username || !password) 
        throw 'All fields need to have valid values';
        const usersCollection = await users();
        const res = await usersCollection.findOne({ username: username.toLowerCase() });
        if (res === null) throw "Either the username or password is invalid";
        compareToMatch = await bcrypt.compare(password, res.password);
        if(compareToMatch){
          return {authenticated: true,role : res.role};
        }else{
          throw "Either the username or password is invalid";
        }
      },

      async getUserDetails(username){
        const usersCollection = await users()
        const user = await usersCollection.findOne({ username: username.toLowerCase() });
        if (user === null) {throw "No user with that name"}
        return user
      },
};