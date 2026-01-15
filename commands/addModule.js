import path from "path";
import fs from "fs";
import ora from "ora";
import _ from "lodash";


const addModule = (name, options = {}) => new Promise((resolve, reject) => {
    const dir = process.cwd()

    const copyModule = () => new Promise((resolve, reject) => {
        const ccName = _.camelCase(name).split('').map((l, i) => {
            if (i === 0) {
                return l.toUpperCase()
            }

            return l
        }).join('')
        const kcName = _.kebabCase(name)
        const distModulesDir = `${dir}/src/modules`
        const distDir = path.join(distModulesDir, `/${ccName}`)

        if (fs.existsSync(distDir)) {
            reject('Module already exists')

            return
        }

        try {
            fs.mkdirSync(distDir)

            if (!!options.Jsx) {
                const vue = fs.readFileSync(`${dir}/src/modules/Module/app.jsx`, { encoding: 'utf-8'})
                fs.writeFileSync(path.join(distDir, '/app.jsx'), vue.replaceAll('_Module', ccName), { encoding: 'utf-8' })
            } else {
                const pug = fs.readFileSync(`${dir}/src/modules/Module/index.pug`, { encoding: 'utf-8' })
                fs.writeFileSync(path.join(distDir, '/index.pug'), pug.replaceAll('module', kcName), { encoding: 'utf-8' })
            }

            if (!!options.Tests) {
                const test = fs.readFileSync(`${dir}/src/modules/Module/index.test.js`, { encoding: 'utf-8' })
                fs.writeFileSync(path.join(distDir, '/index.test.js'), test.replaceAll('_Module', ccName), { encoding: 'utf-8' })
            }

            fs.copyFileSync(`${dir}/src/modules/Module/index.scss`, path.join(distDir, '/index.scss'))

            if (!!options.Js && !options.Jsx) {
                const js = fs.readFileSync(`${dir}/src/modules/Module/index.js`, { encoding: 'utf-8'})
                fs.writeFileSync(path.join(distDir, '/index.js'), js.replaceAll('_Module', ccName), { encoding: 'utf-8' })
            }

            resolve()
        } catch (e) {
            reject(e)
        }
    })

    const spinner = ora({ text: 'Downloading files', color: 'yellow' }).start()

    copyModule()
        .then(() => {
            spinner.stop()
            resolve()
        })
        .catch((err) => {
            spinner.stop()
            reject(err)
        })
})

export default addModule