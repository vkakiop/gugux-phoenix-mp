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


// ArrayBuffer转16进度字符串示例
export function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )
    return hexArr.join('');
}

export function hex2ab(value) {
    var typedArray = new Uint8Array(value.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16);
    }))
    return typedArray.buffer;
}

export function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
    var bufView = new Uint8Array(buf);// Uint8Array可换成其它
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export function ab2str(arrayBuffer) {
    return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
}
