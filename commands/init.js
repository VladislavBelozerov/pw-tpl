import request from "superagent"
import fs from "fs"
import AdmZip from "adm-zip";
import * as path from "path";
import ora from "ora";

const ENV_KEY = 'GITLAB_API_TOKEN'

const init = () => new Promise((resolve, reject) => {
    const spinner = ora('Initializing project').start()
    const dir = process.cwd()
    const projectName = 'pug-template'

    const abort = (err) => {
        spinner.stop()
        // if (fs.existsSync(dir)) {
        //     fs.rmdirSync(dir)
        // }
        if (fs.existsSync(`${dir}/${projectName}.zip`)) {
            fs.rmSync(`${dir}/${projectName}.zip`, { force: true })
        }

        reject(err)
    }

    // if (fs.existsSync(dir)) {
    //     spinner.stop()
    //     reject(`Directory "${projectName}" already exists.`)
    // } else {
    //     fs.mkdirSync(dir)
    // }

    const token = process.env[ENV_KEY]

    if (!token) {
        abort('No GitLab API token found in environment variables.')
    }

    spinner.text = 'Downloading files'
    spinner.color = 'yellow'
    request.get('https://paraweb.space/api/v4/projects/508/repository/archive.zip').set('PRIVATE-TOKEN', token).then((response) => {
        fs.writeFileSync(`${dir}/${projectName}.zip`, response.body)
        const zip = new AdmZip(`${dir}/${projectName}.zip`, {})
        fs.rmSync(`${dir}/${projectName}.zip`, { force: true })
        zip.getEntries().forEach((entry) => {
            const p = entry.entryName.split('/')
            p.pop()
            p.shift()

            if (!entry.isDirectory) zip.extractEntryTo(entry.entryName, path.join(dir, p.join('/')),false, true)
        })
        spinner.stop()
        resolve()
    }).catch((err) => {
        abort(err)
    })
})

export default init