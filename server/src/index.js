
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

async function sync() {

    // Re-download all files from S3, then upload them again
    if (!fs.existsSync("/tmp/bdUser.json")) {
        console.log("Local file does not exist, creating it")
        await init().then(() => console.log("Files downloaded from S3 (in theory)"))
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
}

async function abort(server, appdef) {
  console.log('TERMINATION signal received: closing HTTP server')
  await sync().then(() => console.log("Backup done!")).catch(() => console.log("Backup failed!"))
  server.close(() => {
    appdef.emit('close');
    console.log('HTTP server closed')
  })
}


sync().then( () => {

  // Call sync every day
  setInterval(sync, 60 * 24 * 60 * 1000)

  const app = require("./app.js");
  const port = 3000;
  var server = app.default.listen(port, () => {
    console.log(`Serveur actif sur le port ${port}`);
  });



  process.on('SIGTERM', () => {
    abort(server, app.default).then(() => {console.log("SIGTERM"); exit(0);})
  })

  process.on('SIGINT', () => {
    abort(server, app.default).then(() => {console.log("SIGINT"); exit(0);})
  })

})