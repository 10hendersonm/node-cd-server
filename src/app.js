import Docker from 'dockerode'

const docker = new Docker()

console.log(docker.getConfig())

// // express
// import express from 'express'
// import bodyParser from 'body-parser'
// import router from './router'

// // misc
// import chalk from 'chalk'

// const app = express()
// const port = process.env.PORT || 8080

// app.use(bodyParser.json())
// app.use(router)

// app.listen(port, () => {
//   console.log(chalk.blue(`App available on port`), chalk.yellow(port))
// })