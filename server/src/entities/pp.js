class pp {
    constructor(db){
        this.db = db
    }
    get(login){
        return new Promise((resolve, reject) => {
            this.db.pp.find({login:login}, function(err, docs){
              if(err){
                reject(err)
                return
              }
              if (docs.length == 0){
                  resolve(-1)
                  return
              }
              resolve(docs[0].pp)
              return
            })
          })
    }

    create(login, pp) {
        return new Promise(async (resolve, reject) => {
          const msg = {
            login : login,
            pp : pp
          }
          new Promise(async (resolve,reject) => {
            this.db.pp.find({login: login},function(err,docs){
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
                    this.db.pp.insert(msg)
                    this.db.pp.find({login: login, pp:pp},function(err,docs){
                    resolve(docs[0]._id)
                    })
                }
                else{
                    this.db.pp.update({_id:res}, {
                        $set: {pp:pp}
                    })
                    resolve(pp)
                    return
                }


          }).catch((res) => {
            console.log(res)
        })
        })}
}   
exports.default = pp;