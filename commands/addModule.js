import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import ora from "ora";
import downloadZip from "../utils/downloadZip.js";
import _ from "lodash";
import os from "os";


const addModule = (name, options = {}) => new Promise((resolve, reject) => {
    const dir = process.cwd()
    const tempDir = os.tmpdir()

    const copyModule = () => new Promise((resolve, reject) => {
        const ccName = _.capitalize(_.camelCase(name))
        const kcName = _.kebabCase(name)
        const distModulesDir = `${dir}/src/modules`
        const distDir = path.join(distModulesDir, `/${ccName}`)

        if (fs.existsSync(distDir)) {
            reject('Module already exists')

            return
        }

        try {
            fs.mkdirSync(distDir)

            if (!!options.Vue) {
                const vue = fs.readFileSync(`${tempDir}/Module/index.vue`, { encoding: 'utf-8'})
                fs.writeFileSync(path.join(distDir, '/index.vue'), vue.replaceAll('Module', ccName), { encoding: 'utf-8' })

                resolve()
                return
            }

            const pug = fs.readFileSync(`${tempDir}/Module/index.pug`, { encoding: 'utf-8' })
            fs.writeFileSync(path.join(distDir, '/index.pug'), pug.replaceAll('module', kcName), { encoding: 'utf-8' })

            fs.copyFileSync(`${tempDir}/Module/index.scss`, path.join(distDir, '/index.scss'))

            if (!!options.Js) {
                const js = fs.readFileSync(`${tempDir}/Module/index.js`, { encoding: 'utf-8'})
                fs.writeFileSync(path.join(distDir, '/index.js'), js.replaceAll('_Module', ccName), { encoding: 'utf-8' })
            }

            resolve()
        } catch (e) {
            reject(e)
        }
    })
    const createModuleDir = (zip) => new Promise((resolve, reject) => {
        try {
            zip.getEntries().forEach((entry) => {
                if (entry.entryName.includes('/src/modules/Module')) {
                    if (!entry.isDirectory) {
                        zip.extractEntryTo(entry.entryName, path.join(tempDir, '/Module'), false, true)
                    }
                }
            })

            resolve()
        } catch (e) {
            reject(e)
        }
    })

    if (fs.existsSync(path.join(tempDir, '/Module'))) {
        copyModule().then(resolve).catch((err) => {
            reject(err)
        })

        return
    }

    if (fs.existsSync(path.join(tempDir, '/template.zip'))) {
        const zip = new AdmZip(`${tempDir}/template.zip`, {})

        createModuleDir(zip)
            .then(copyModule)
            .then(resolve)
            .catch((err) => { reject(err) })

        return;
    }

    const spinner = ora({ text: 'Downloading files', color: 'yellow' }).start()

    downloadZip().then(({ zip }) => {
        spinner.stop()
        return createModuleDir(zip)
    })
        .then(copyModule)
        .then(resolve)
        .catch((err) => {
            spinner.stop()
            reject(err)
        })
})

export default addModule