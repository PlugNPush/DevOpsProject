class Users {
  constructor(db) {
    this.db = db
    // suite plus tard avec la BD
  }

  create(login, password, lastname, firstname) {
    return new Promise(async (resolve, reject) => {
      const raclo = {
        login : login,
        password : password,
        lastname : lastname,
        firstname : firstname,
        connected : true
      }
      new Promise(async (resolve,reject) => {
        this.db.users.find({login: login},function(err,docs){
          if(err){
            reject(err)
          }
          if (docs.length != 0){
            reject(err)
          }
          else
            resolve(1)
        })
      }).then(() => {
        this.db.users.insert(raclo)
        this.db.users.find({login: login},function(err,docs){
          resolve(docs[0]._id)
        })
      }).catch(() => reject("User deja present"))
    })
  }

  get(userid) {

    return new Promise((resolve, reject) => {
      this.db.users.find({_id : userid},function(err,docs){
        if(err){
          reject(err)
          return
        } 
        if (docs.length == 0){
          reject(err)
          return
        }
          resolve(docs[0])
          return
      })
    });
  }
  exists(id) {
    return new Promise(async (resolve,reject) => {
      this.db.users.find({_id: id},function(err,docs){
        if(err){
          reject(err)
          return
        }
        if (docs.length != 0){
          resolve(true)
          return
        }
        else{
          resolve(false)
          return
        }
      })
    })
  }

  checkpassword(login, password) {
    return new Promise(async (resolve, reject) => {
        this.db.users.find({login : login},{password : 1},function(err,docs) {
          if(docs.length == 0){
            return
          }
          if (err) {
            reject(err)
            return
          }
          if (docs[0].password != password){
            resolve(false)
            return
          }
          else  {
            resolve(true)
            return
          }
        })
      }
    );
  }

  login(login){
    return new Promise(async (resolve, reject) => {
      this.db.users.find({login : login},function(err,docs){
        if(docs.length == 0){
          return
        }
        if(err) {
          reject(err)
          return
        }
        else{
          resolve(docs[0]._id)
          return
        }
      })
    });
  }

  logout(login){
      return new Promise((resolve, reject) => {
          resolve(true)
  })
}
  getID(pseudo){
    return new Promise(async (resolve, reject) => {
      this.db.users.find({login : pseudo},function(err,docs){
        if(docs.length == 0){
          resolve(null)
          return
        }
        if(err) {
          reject(err)
          return
        }
        else{
          resolve(docs[0]._id)
          return
        }
      })
    });
  }
  getLogin(id){
    return new Promise(async (resolve, reject) => {
      this.db.users.find({_id : id},function(err,docs){
        if(docs.length == 0){
          return
        }
        if(err) {
          reject(err)
          return
        }
        else{
          resolve(docs[0].login)
          return
        }
      })
    });
  }
  getAll(){
    return new Promise((resolve, reject) => {
      // À remplacer par une requête bd
      this.db.users.find({}, function(err, docs){
        if(err){
          reject(err)
          return
        }
        resolve(docs)
        return
      })
    });
  }
  delete(login){
    return new Promise(async(resolve, reject) => {
      this.db.users.remove({login:login})
      resolve(true)
      return
    });
  }
  count(){
    return new Promise(async (resolve, reject)=>{
      await this.getAll().then((val)=>{
        var cpt = 0;
        for(let i = 0; i < val.length; i++){
          cpt ++
        }
        resolve(cpt)
        return
      }).catch((err)=>{
        reject(err)
        return
      })
    })
  }
  getToken(login){
    return new Promise(async (resolve, reject)=>{
      this.db.users.find({login:login}, function(err, docs){
        if(err){
          reject(err)
          return
        }
        console.log(docs)
        if(docs.length == 0){
          reject("Utilisateur inconnu")
          return
        }
        resolve(docs[0]._id)
      })
    })
  }
}

exports.default = Users;

