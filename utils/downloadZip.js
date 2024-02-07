import request from "superagent";
import fs from "fs";
import AdmZip from "adm-zip";
import os from 'os'

const ENV_KEY = 'GITLAB_API_TOKEN'

function downloadZip() {
    const tempDir = os.tmpdir()
    const zipName = 'template'

    return new Promise((resolve, reject) => {
        const token = process.env[ENV_KEY]

        if (!token) {
            reject('No GitLab API token found in environment variables.')
            return
        }

        request.get('https://paraweb.space/api/v4/projects/508/repository/archive.zip').set('PRIVATE-TOKEN', token).then((response) => {
            fs.writeFileSync(`${tempDir}/${zipName}.zip`, response.body)
            const zip = new AdmZip(`${tempDir}/${zipName}.zip`, {})

            if (fs.existsSync(`${tempDir}/Module`)) {
                fs.rmSync(`${tempDir}/Module`, { recursive: true, force: true })
            }

            resolve({ zip })
        }).catch((err) => {
            reject(err)
        })
    })
}

export default downloadZip