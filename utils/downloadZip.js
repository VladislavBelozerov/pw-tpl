import request from "superagent";
import fs from "fs";
import AdmZip from "adm-zip";
import os from 'os'
import path from "path";
import enquirer from 'enquirer'

async function downloadZip(onStart, onEnd) {
    const tempDir = os.tmpdir()
    const zipName = 'template'

    const askToken = async (message = 'Please enter your Gitlab access token, read_api scope required') => {
        const { token } = await enquirer.prompt([{
            type: 'input',
            name: 'token',
            message,
        }])

        return token
    }

    const configFilePath = path.join(os.homedir(), '.pw-tpl', 'config.json')

    let token = ''
    let attempt = 0

    if (!fs.existsSync(configFilePath)) {
        token = await askToken()
    } else {
        const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
        token = config.token || ''

        if (!token) {
            token = await askToken()
        }
    }

    const download = async () => {
        ++attempt
        onStart?.()

        try {
            const response = await request.get('https://paraweb.space/api/v4/projects/508/repository/archive.zip').set('PRIVATE-TOKEN', token)

            fs.writeFileSync(`${tempDir}/${zipName}.zip`, response.body)

            if (!fs.existsSync(path.join(os.homedir(), '.pw-tpl'))) {
                fs.mkdirSync(path.join(os.homedir(), '.pw-tpl'))
            }

            fs.writeFileSync(configFilePath, JSON.stringify({ token }),  'utf-8')

            const zip = new AdmZip(`${tempDir}/${zipName}.zip`, {})

            if (fs.existsSync(`${tempDir}/Module`)) {
                fs.rmSync(`${tempDir}/Module`, { recursive: true, force: true })
            }

            onEnd?.()

            return ({ zip })
        } catch (e) {
            onEnd?.()

            if (attempt < 3 && [401, 500].includes(e.status)) {
                token = await askToken('Invalid token. Please try again.')
                return download()
            } else {
                throw e
            }
        }
    }

    return await download()
}

export default downloadZip