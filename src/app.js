import Docker from 'dockerode'

const docker = new Docker()

docker.listContainers()
  .then((containers) => {
    console.log(containers)
  })

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