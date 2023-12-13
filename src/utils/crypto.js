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

export function encodeBlekeyAb(word,keyStr) {
    let encodeBase64 = encodeBlekey(uni.arrayBufferToBase64(hex2ab(word)),keyStr)
    return uni.base64ToArrayBuffer(encodeBase64)
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

export function decodeBlekeyAb(word,keyStr) {
    console.log('hex2ab',uni.arrayBufferToBase64(hex2ab(word)))
    console.log('keyStr',keyStr)
    //end debug
    let decodeBase64 = decodeBlekey(uni.arrayBufferToBase64(hex2ab(word)),keyStr)
    return uni.base64ToArrayBuffer(decodeBase64)
}

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

export function decimal2hex(decimal) {
    return decimal.toString(16)
}

// export function ab2base64(buffer) {
//     //第一步，将ArrayBuffer转为二进制字符串
//     var binary = '';
//     var bytes = new Uint8Array(buffer);
//     for (var len = bytes.byteLength, i = 0; i < len; i++) {
//         binary += String.fromCharCode(bytes[i]);
//     }
//     //将二进制字符串转为base64字符串
//     return window.btoa(binary);
// }
//
// export function base642ab(base64) {
//     const binaryStr = window.atob(base64);
//     const byteLength = binaryStr.length;
//     const bytes = new Uint8Array(byteLength);
//     for(let i=0;i<byteLength;i++){
//         bytes[i] = binary.charCodeAt(i);
//     }
//     return bytes.buffer;
// }

// function blob2ab(blob) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onerror = reject;
//         reader.onload = () => {
//             resolve(reader.result);
//         };
//         reader.readAsArrayBuffer(blob);
//     });
// }
//
//
// function ab2blob(arrayBuffer) {
//     return new Blob([arrayBuffer], {type: "image/png"});
// }

// function base642blob(base64) {
//     let binary = atob(base64);
//     let array = [];
//     for (let i = 0; i < binary.length; i++) {
//         array.push(binary.charCodeAt(i));
//     }
//     return new Blob([new Uint8Array(array)], { type: "image/png" });
// }
//
//
// function blob2base64(blob) {
//     return new Promise((resolve,reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(blob);
//         reader.onload = () => {
//             const base64 = reader.result;
//             resolve(base64);
//         }
//         reader.onerror = error => reject(error);
//     });
// }
