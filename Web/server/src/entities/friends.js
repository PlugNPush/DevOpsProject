class Friend {
    constructor(db){
        this.db = db
    }
    create(loginUser, numToAdd) {
      return new Promise(async (resolve, reject) => {
        const amitie = {
          idUser : loginUser,
          loginToAdd : numToAdd
        }
        await new Promise(async (resolve,reject) => {
          this.db.friends.find({idUser: loginUser, loginToAdd : numToAdd},function(err,docs){
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
          this.db.friends.insert(amitie)
          this.db.friends.find({idUser: loginUser, loginToAdd : numToAdd},function(err,docs){
            resolve(docs[0]._id)
          })
        }).catch(() => reject("Deja Amis"))
      })
    }
    get(id){
        return new Promise(async (resolve, reject) => {
            this.db.friends.find({idUser: id},function(err,docs){
              if(err){
                reject(err)
                return
              }
              if (docs.length == 0){
                reject(err)
                return
              }
              else{
                resolve(docs)
                return
              }
            })
          })
    }

    isFriend(id1,login2){
      return new Promise(async(resolve, reject) => {
        this.db.friends.find({idUser: id1, loginToAdd:login2},function(err,docs){
          if(err){
            reject(err)
            return
          }
          if (docs.length == 0){
            reject(false)
            return
          }
          else{
            resolve(true)
            return
          }
        })
      })
      
      
    }

    delete(id1,login2){
        return new Promise(async(resolve, reject) => {
          this.db.friends.remove({idUser:id1, loginToAdd:login2})
          resolve(true)
          return
        });
    }
    getNbFollowers(login){
      return new Promise(async (resolve, reject) => {
        this.db.friends.find({loginToAdd:login}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          if(docs.length == 0){
            resolve(0)
            return
          }
          var cpt = 0;
          for(let i = 0; i < docs.length; i++){
            cpt += 1
          }
          resolve(cpt)
          return
        })
      })
    }
}

exports.default = Friend;