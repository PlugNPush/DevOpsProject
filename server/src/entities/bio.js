class Bio {
    constructor(db){
        this.db = db
    }
    create(login, bio) {
        return new Promise(async (resolve, reject) => {
          const msg = {
            login : login,
            bio : bio
          }
          new Promise(async (resolve,reject) => {
            this.db.bio.find({login: login},function(err,docs){
              if(err){
                reject(err)
              }
              if (docs.length != 0){
                resolve(docs[0]._id)
              }
              else
                resolve(-1)
            })
          }).then((res) => {
                if (res == -1){
                    this.db.bio.insert(msg)
                    this.db.bio.find({login: login, bio:bio},function(err,docs){
                    resolve(docs[0]._id)
                    })
                }
                else{
                    this.db.bio.update({_id:res}, {
                        $set: {bio:bio}
                    })
                    resolve(bio)
                    return
                }


          }).catch((res) => {
            console.log(res)
        })
        })}

        get(login){
            return new Promise((resolve, reject) => {
                this.db.bio.find({login:login}, function(err, docs){
                  if(err){
                    reject(err)
                    return
                  }
                  if (docs.length == 0){
                      resolve("Aucune bio ici ...")
                      return
                  }
                  resolve(docs[0].bio)
                  return
                })
              })
        }
    
}

exports.default = Bio;