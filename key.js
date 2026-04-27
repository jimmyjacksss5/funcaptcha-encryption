const fs = require('fs');
const src = fs.readFileSync('api.js', 'utf8');
const zeArrayMatch = src.match(/function Ze\(\)\s*\{\s*var t = (\[[\s\S]*?\])\s*;?\s*return \(Ze = function/);
const Ze_arr = eval(zeArrayMatch[1]);

let arr = [...Ze_arr];
for (let i = 0; i < arr.length; i++) {
    const sn = t => arr[t - 466];
    try {
        const r = parseInt(sn(986))/1 + (-parseInt(sn(661))/2) + (-parseInt(sn(913))/3)
                + parseInt(sn(642))/4 * (-parseInt(sn(603))/5) + parseInt(sn(468))/6
                + parseInt(sn(757))/7 * (parseInt(sn(805))/8) + parseInt(sn(853))/9;
        if (Math.abs(r - 620663) < 0.5) {
            const Xe = sn;
            const xorKey = Xe(984);
            
            const keyIndices = [563,615,520,517,795,847,898,924,843,605,580,794,644,1005,892,734,551,667,624,801,872,698,556,1008,883,748,552,919,965,641,574,687,592,523,996,513,739,740,688,726,660,658,519,681,486,683,654,897,737,968,912,977,809,665,891,635,979,881,498,944,501,962,573,1009,616,773,971];
            const enc = keyIndices.map(i => Xe(i)).join('');
            
            const quotePositions = [];
            for (let j = 0; j < enc.length; j++) {
                if (enc.charCodeAt(j) === 0x27) quotePositions.push(j);
            }
            console.log(`Quote positions: ${quotePositions.join(', ')}`);
            console.log(`String length: ${enc.length}`);

            const nn = (t, e) => [...t].map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ e.charCodeAt(i % e.length))).join('');
            
            for (const endPos of quotePositions) {
                if (endPos === 0) continue;
                const content = enc.slice(1, endPos); // strip surrounding quotes
                const dec = nn(content, xorKey);
                if (dec.includes('MIIBCgKCAQEA') || dec.includes('MIIBIjANBgkq')) {
                    console.log(`\nFound key! Quote at pos ${endPos}, content length ${content.length}`);
                    console.log(`Decrypted: ${dec}`);
                    
                    const start = dec.indexOf('MIIB');
                    const clean = dec.slice(start).replace(/[^A-Za-z0-9+/=]/g, '');
                    const pad = (4 - clean.length % 4) % 4;
                    const der = Buffer.from(clean + '='.repeat(pad), 'base64');
                    console.log(`\nDER: ${der.length} bytes`);
                    console.log(`Hex: ${der.toString('hex')}`);
                    
                    if (der[0] === 0x30 && der[1] === 0x82) {
                        const seqLen = (der[2] << 8) | der[3];
                        let p = 4;
                        if (der[p++] === 0x02) {
                            const nb = der[p] & 0x7f; p++;
                            let nLen = 0;
                            for (let k = 0; k < nb; k++) nLen = (nLen << 8) | der[p++];
                            console.log(`Modulus: ${nLen} bytes (${(nLen-1)*8} bits)`);
                            if (der[p] === 0x00) p++;
                            const mod = der.slice(p, p + nLen - 1);
                            p += nLen - 1;
                            console.log(`n = ${mod.toString('hex')}`);
                            if (der[p++] === 0x02) {
                                const eLen = der[p++];
                                let e = 0;
                                for (let k = 0; k < eLen; k++) e = (e << 8) | der[p++];
                                console.log(`e = ${e}`);
                            }
                        }
                    }
                    const pem = `-----BEGIN RSA PUBLIC KEY-----\n${der.toString('base64').match(/.{1,64}/g).join('\n')}\n-----END RSA PUBLIC KEY-----`;
                    console.log('\n' + pem);
                    process.exit(0);
                }
            }

            console.log('\nTrying all substrings...');
            for (let start = 0; start < enc.length - 100; start++) {
                for (let len = 360; len <= Math.min(400, enc.length - start); len++) {
                    const sub = enc.slice(start, start + len);
                    const dec = nn(sub, xorKey);
                    if (dec.includes('MIIBCgKCAQEA')) {
                        console.log(`Found at start=${start}, len=${len}`);
                        console.log(dec);
                        process.exit(0);
                    }
                }
            }
            console.log('Not found in any substring');
            break;
        }
    } catch(e) {}
    arr.push(arr.shift());
}
