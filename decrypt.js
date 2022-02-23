const keytar = require('keytar')
const crypto = require('crypto');

const args = process.argv.slice(2)

if (args.length >= 2) {
    console.log(decrypt(args[0], args[1]));
    return
} else if (args.length >= 1) {
    console.log("Use format")
    console.log("./decrypt.js Base64secert \"accountname\"")
    return
}

var allcreds = keytar.findCredentials("org.openvpn.client.")
Promise.all([allcreds]).then(
    things => {
        things.forEach(function(morethings, index) {
            morethings.forEach(function(thing, index) {
                console.log("Account:" + thing.account + "\nPassword:" + decrypt(thing.password, thing.account) + "\n");
            });
        });
    }
).catch((error) => {
    console.log(error);
});


function decrypt(base64data, accountname) {
	var rawbytes = Buffer.from(base64data, "base64")
	var salt = rawbytes.slice(0, 16);
	var thebytes = rawbytes.slice(16)
	var key = crypto.pbkdf2Sync(Buffer.from(accountname,"utf8"), salt, 32767, 16, "sha1")
	
	var iv = thebytes.slice(0,12);
	var passdata = thebytes.slice(12, thebytes.length - 16);
	var authtag = thebytes.slice(passdata.length + 12);
	var i = crypto.createDecipheriv("aes-128-gcm", key, iv);
	return (i.setAuthTag(authtag),Buffer.concat([i.update(passdata),i.final()])).toString("utf8")
}