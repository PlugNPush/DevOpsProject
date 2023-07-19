
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const fs = require('fs');
const { exit } = require("process");

async function init() {

    // Download all files from S3
    await s3.getObject({
        Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
        Key: `bdUser.json`,
    }).promise().then((data) => {
        fs.writeFileSync("/tmp/bdUser.json", data.Body)
    }
    )

    await s3.getObject({
        Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
        Key: `bdFriend.json`,
    }).promise().then((data) => {
        fs.writeFileSync("/tmp/bdFriend.json", data.Body)
    }
    )

    await s3.getObject({
        Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
        Key: `bdMessage.json`,
    }).promise().then((data) => {
        fs.writeFileSync("/tmp/bdMessage.json", data.Body)
    }
    )

    await s3.getObject({
        Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
        Key: `bdLike.json`,
    }).promise().then((data) => {
        fs.writeFileSync("/tmp/bdLike.json", data.Body)
    }
    )

    await s3.getObject({
        Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
        Key: `bdPP.json`,
    }).promise().then((data) => {
        fs.writeFileSync("/tmp/bdPP.json", data.Body)
    }
    )

    await s3.getObject({
        Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
        Key: `bdBIO.json`,
    }).promise().then((data) => {
        fs.writeFileSync("/tmp/bdBIO.json", data.Body)
    }
    )

    console.log("Files downloaded from S3 (in theory)")

}

async function sync(db) {

    // Re-download all files from S3, then upload them again
    if (!fs.existsSync("/tmp/bdUser.json")) {
        console.log("Local file does not exist, creating it")
        fs.copyFileSync("./bdUser.json", "/tmp/bdUser.json")
        fs.copyFileSync("./bdFriend.json", "/tmp/bdFriend.json")
        fs.copyFileSync("./bdMessage.json", "/tmp/bdMessage.json")
        fs.copyFileSync("./bdLike.json", "/tmp/bdLike.json")
        fs.copyFileSync("./bdPP.json", "/tmp/bdPP.json")
        fs.copyFileSync("./bdBIO.json", "/tmp/bdBIO.json")
        console.log("Local files created. Now downloading from S3...")
        var isInTest = typeof global.it === 'function';
        if (!isInTest) {
          await init().then(() => console.log("Should now be up to date"))
        } else {
          console.log("In test, skipping init to avoid edited database (it might break tests)")
        }
    }

    var isInTest = typeof global.it === 'function';
        if (!isInTest) {
            // If db is not empty, we need to merge it with the local file
            if (Object.keys(db).length !== 0) {
              await db.users.persistence.compactDatafile()
              await db.friends.persistence.compactDatafile()
              await db.messages.persistence.compactDatafile()
              await db.likes.persistence.compactDatafile()
              await db.pp.persistence.compactDatafile()
              await db.bio.persistence.compactDatafile()
              console.log("DB compacted")
            }
    
            await s3.putObject({
                Body: fs.readFileSync("/tmp/bdUser.json"),
                Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
                Key: `bdUser.json`,
            }).promise()

            await s3.putObject({
                Body: fs.readFileSync("/tmp/bdFriend.json"),
                Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
                Key: `bdFriend.json`,
            }).promise()
            
            await s3.putObject({
                Body: fs.readFileSync("/tmp/bdMessage.json"),
                Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
                Key: `bdMessage.json`,
            }).promise()
            
            await s3.putObject({
                Body: fs.readFileSync("/tmp/bdLike.json"),
                Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
                Key: `bdLike.json`,
            }).promise()
            
            await s3.putObject({
                Body: fs.readFileSync("/tmp/bdPP.json"),
                Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
                Key: `bdPP.json`,
            }).promise()
            
            await s3.putObject({
                Body: fs.readFileSync("/tmp/bdBIO.json"),
                Bucket: "cyclic-outstanding-wetsuit-tick-eu-central-1",
                Key: `bdBIO.json`,
            }).promise()

            console.log("Files synced with S3 (in theory)")
  } else {
    console.log("In test, skipping sync to avoid accessing the production database (it might break tests)")
  }
}


sync().then( () => {

  // Call sync every day
  setInterval(sync, 60 * 24 * 60 * 1000)

  const app = require("./app.js");
  const port = 3000;
  var server = app.default.listen(port, () => {
    console.log(`Serveur actif sur le port ${port}`);
  });

})

module.exports = { sync };