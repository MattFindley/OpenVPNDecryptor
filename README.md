For some reason OpenVPNConnect decided it would help to encrypt the passwords it stores in Windows Credential Manager making it annoying to recover passwords.<br>
Quick and easy program to decrypt those creds.<br>
`npm install keytar`<br>
`./decrypt.js`  with no arguments will dump all creds from the local machine store<br>
`./decrypt.js <base64> <accountname>`   will decrypt cred recovered from another machine<br>
