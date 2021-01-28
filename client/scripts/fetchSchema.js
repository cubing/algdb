import https from 'https'
import fs from 'fs'

const file = fs.createWriteStream('./src/generated/schema.ts')
https.get(
    'https://api.algdb.net/schema.ts',
    function (response) {
        response.pipe(file)
    }
)