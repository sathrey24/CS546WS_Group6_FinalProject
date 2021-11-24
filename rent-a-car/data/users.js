const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;

module.exports = {
    async createUser(firstName,lastName,address,email,phoneNum,licenseNum,username, password){
        if (!username || !firstName || !lastName || !address || !email || !phoneNum || !password || !licenseNum)  
        throw 'All fields need to have valid values';
        const usersCollection = await users();
        const res = await usersCollection.findOne({ username: username.toLowerCase() });
        if (res != null) throw "User with this username already exist";
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
            carsRenting : [],
            reviewsGiven : [],
            role : "user"
        };
        const insertInfo = await usersCollection.insertOne(newUser);
          if (insertInfo.insertedCount === 0) throw 'Internal Server Error';
        else{
          return {userInserted: true};
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
          return {authenticated: true};
        }else{
          throw "Either the username or password is invalid";
        }
      }
};