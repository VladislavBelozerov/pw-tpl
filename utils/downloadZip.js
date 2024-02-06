import request from "superagent";
import fs from "fs";
import AdmZip from "adm-zip";
import path, {dirname} from "path";
import {fileURLToPath} from "url";

const ENV_KEY = 'GITLAB_API_TOKEN'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function downloadZip() {
    const scriptDir = path.resolve(__dirname, '../')
    const zipName = 'template'

    return new Promise((resolve, reject) => {
        const token = process.env[ENV_KEY]

        if (!token) {
            reject('No GitLab API token found in environment variables.')
            return
        }

        request.get('https://paraweb.space/api/v4/projects/508/repository/archive.zip').set('PRIVATE-TOKEN', token).then((response) => {
            fs.writeFileSync(`${scriptDir}/${zipName}.zip`, response.body)
            const zip = new AdmZip(`${scriptDir}/${zipName}.zip`, {})

            if (fs.existsSync(`${scriptDir}/Module`)) {
                fs.rmSync(`${scriptDir}/Module`, { recursive: true, force: true })
            }

            resolve({ zip })
        }).catch((err) => {
            reject(err)
        })
    })
}

export default downloadZip