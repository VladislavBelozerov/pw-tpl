import * as path from "path";
import ora from "ora";
import downloadZip from "../utils/downloadZip.js";

const init = () => new Promise((resolve, reject) => {
    const spinner = ora('Initializing project').start()
    const dir = process.cwd()

    spinner.text = 'Downloading files'
    spinner.color = 'yellow'

    downloadZip().then(({ zip }) => {
        try {
            zip.getEntries().forEach((entry) => {
                const p = entry.entryName.split('/')
                p.pop()
                p.shift()

                if (!entry.isDirectory) zip.extractEntryTo(entry.entryName, path.join(dir, p.join('/')),false, true)
            })
        } catch (err) {
            spinner.stop()
            reject(err)
        }

        spinner.stop()
        resolve()
    }).catch((err) => {
        spinner.stop()
        reject(err)
    })
})

export default init