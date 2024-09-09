const crypto = require('crypto');
let input = 0;
while(true){
    const str = "100xdevs" + input.toString();
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    const res = hash.toString();
    if(res.substring(0,5) === '00000'){
        console.log('Input: '+ str);
        console.log('Hash: '+ hash);
        break;
    }
    input++;
}
