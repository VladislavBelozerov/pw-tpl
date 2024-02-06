import chalk from "chalk";

const runCommand = (command, ...args) => {
    const start = new Date()

    command(...args).then(() => {
        const end = new Date()
        console.log(chalk.green(`Done in ${Math.ceil((end - start) / 1000)}s`))
        process.exit(0)
    }).catch((err) => {
        console.log(chalk.red(err))
        process.exit(1)
    })
}

export { runCommand }