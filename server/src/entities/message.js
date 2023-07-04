class Messages {
    constructor(db){
        this.db = db
    }
    create(login, message) {
      return new Promise(async (resolve, reject) => {
        const msg = {
          login : login,
          message : message
        }
        new Promise(async (resolve,reject) => {
          this.db.messages.find({login: login,message:message},function(err,docs){
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
          this.db.messages.insert(msg)
          this.db.messages.find({login: login, message:message},function(err,docs){
            resolve(docs[0]._id)
          })
        }).catch(() => reject("User deja present"))
      })
      }
    delete(login, message){
      return new Promise(async(resolve, reject) => {
        this.db.messages.remove({login:login, message:message})
          resolve(true)
          return
      });
    }

    supLike(idLiker,idM){
      return new Promise(async(resolve, reject) => {
        this.db.likes.remove({idLiker:idLiker, idM:idM})
          resolve(true)
          return
      });
    }

    get(login){
      return new Promise((resolve, reject) => {
        this.db.messages.find({login:login}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          resolve(docs)
          return
        })
      })
    }
    count(login){
      return new Promise(async(resolve, reject) => {
        await this.get(login).then((val)=>{
          var cpt = 0;
          for(let i = 0; i < val.length; i++){
            cpt += 1
          }
          resolve(cpt)
          return
        }).catch((err)=>{reject(err)
        return})
      });
    }
    set(login, messageold, messagenew){
      return new Promise(async(resolve, reject) => {
      this.db.messages.update({login:login, message:messageold}, {
        $set: {message:messagenew}
      })
      resolve(true)
      return
    })}
    exists(login, message){
      return new Promise(async (resolve, reject)=>{
        this.db.messages.find({login:login, message:message}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          if(docs.length == 0){
            resolve(false)
            return
          }
          resolve(true)
          return
        })
      })
    }
    getListMessage(login){
      return new Promise(async (resolve, reject)=>{
        await this.get(login).then((val)=>{
          var listMsg = []
          for(let i = 0; i < val.length; i++){
            listMsg.push(val[i].message)
          }
          resolve(listMsg)
          return
        }).catch((err)=>{
          reject(err)
          return
        })
      })
    }
    getAll(){
      return new Promise(async (resolve, reject)=>{
        this.db.messages.find({}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          resolve(docs)
          return
        })
      })
    }
    countAll(){
      return new Promise(async (resolve, reject)=>{
        await this.getAll().then((val)=>{
          var cpt = 0;
          for(let i = 0; i < val.length; i++){
            cpt ++;
          }
          resolve(cpt)
          return
        }).catch((err)=>reject(err))
      })
    }
    findUser(name){
      return new Promise(async (resolve, reject)=>{
        this.db.messages.find({login:name}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          resolve(docs)
          return
        })
      })
    }
    findMsg(keyword){
      return new Promise(async (resolve, reject)=>{
        this.db.messages.find({}, function(err, docs){
          var ls = []
          if(err){
            reject(err)
            return
          }
          
          for (let i = 0 ; i < docs.length ; i++){
            var sr = docs[i]
            if (String(sr.message).includes(String(keyword))){
              ls.push(docs[i])

            }
          }

          resolve(ls)
          return
        })
      })
    }

    getM(login,msg){
      return new Promise(async (resolve, reject)=>{
        this.db.messages.find({login:login, message : msg}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          if(docs.length == 0){
            reject("No Solution")
            return
          }
          resolve(docs[0]._id)
          return
        })
      })
    }

    like(idLiker,idM){
      return new Promise(async (resolve, reject)=>{
        const msg = {
          idLiker : idLiker,
          idM : idM
        }
        this.db.likes.insert(msg)
        resolve(true)
      })
    }

    checkLike(idLiker,idM){
      return new Promise(async (resolve, reject)=>{
        this.db.likes.find({idLiker : idLiker, idM : idM}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          if(docs.length == 0){
            resolve(false)
            return
          }
          else resolve(true)

          return
          
        })
      })
    }
    //renvoie le nombre de tweets qu un utilisateur like
    nbLike(idLiker){
      return new Promise(async (resolve, reject)=>{
        this.db.likes.find({idLiker:idLiker}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          if(docs.length == 0){
            resolve(0)
            return
          }
          resolve(docs.length)
          return
        })
      })
    }
    //renvoie la liste des messages du login
    listIdMessage(login){
      return new Promise(async (resolve, reject)=>{
        this.db.messages.find({login : login}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          if(docs.length == 0){
            resolve([])
            return
          }
          var liste = []
          for (let i = 0; i < docs.length; i++){
            liste.push(docs[i]._id)
          }
          resolve(liste)
          return
        })
      })
    }
    //renvoie le nbre de likes pour un msg
    nbLikeMsg(Msg){
      return new Promise(async (resolve, reject)=>{
        this.db.likes.find({idM : Msg}, function(err, docs){
          if(err){
            reject(err)
            return
          }
          resolve(docs.length)
          return
        })
      })
    }
}
exports.default = Messages;