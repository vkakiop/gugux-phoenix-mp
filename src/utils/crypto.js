import CryptoJS from 'crypto-js'

export function encodeBlekey(word,keyStr) {
    var key = CryptoJS.enc.Utf8.parse(keyStr) //秘钥
    var srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
}

export function decodeBlekey(word, keyStr) {
    //console.log('decrypt key:' + keyStr);
    let keyHex = CryptoJS.enc.Utf8.parse(keyStr); //
    //let ivHex = CryptoJS.enc.Utf8.parse("0000000000000000")
    let base64 = CryptoJS.enc.Utf8.parse(word)
    let src = CryptoJS.enc.Utf8.stringify(base64)
    var decrypt = CryptoJS.AES.decrypt(src, keyHex,
        {
            //iv: ivHex,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypt.toString(CryptoJS.enc.Utf8)
}
