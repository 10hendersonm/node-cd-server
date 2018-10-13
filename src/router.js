import {Router} from 'express'

import PushModel from './Models/Push'
import Deployment from './Models/Deployment';
import Docker from 'dockerode'
import fs from 'fs'
import path from 'path'
import {createDockerfile} from './utils'
import uuid from 'uuid/v4'


const router = Router()
export const docker = new Docker()

// docker.createContainer({
//   Image: 'node',
//   name: `tmp-builder-${uuid()}`,
//   AttachStdout: true,
//   AttachStderr: true,
//   Binds: [
//     '/var/run/docker.sock:/var/run/docker.sock',
//   ],
//   // Cmd: ['/bin/sh'],
// }, (err, container) => {
//   if (err) {
//     console.log('error creating container')
//     console.log(err)
//     return
//   }
//   console.log('created container')
//   container.start((err) => {
//     if (err) {
//       console.log('error starting container', err)
//       return
//     }
//     console.log('started container')
//     container.exec({
//       Cmd: ['/bin/sh', '-c', commands.join(' && ')],
//       AttachStdout: true,
//       AttachStderr: true,
//     }, (err, exec) => {
//       if (err) {
//         console.log('error creating exec')
//         console.log(err)
//         return
//       }
//       console.log('created exec')
//       exec.start((err, stream) => {
//         if (err) {
//           console.log('error starting exec')
//           console.log(err)
//           return
//         }
//         console.log('started exec')
//         stream.pipe(process.stdout)
//       })
//     })
//   })
// })


// docker.createContainer({
//   Image: 'node',
//   name: 'asdf1',
//   Cmd: commands.map((command) => ['/bin/bash', '-c', command]),
//   Binds: [
//     '/var/run/docker.sock:/var/run/docker.sock',
//   ],
//   AttachStdout: true,
//   AttachStderr: true,
// }, (err, container) => {
//   if (err) {
//     console.log('error creating container')
//     console.log(err)
//     return
//   }
//   console.log('container created')
//   container.start((err, data) => {
//     console.log(data)
//   })
// })

const repoId = uuid()
const dockerFileDirectory = path.join(__dirname, `dockerfile-${repoId}`)
const dockerFileName = 'Dockerfile'
const dockerFilePath = path.join(dockerFileDirectory, dockerFileName)
const dockerFileContent = createDockerfile({
  projectName: 'dnd-character-sheet',
  commitId: repoId,
  cloneUrl: 'https://github.com/10hendersonm/dnd-character-sheet.git',
  buildSteps: [
    'yarn',
    'yarn build',
  ],
})
fs.mkdirSync(dockerFileDirectory)
fs.writeFileSync(dockerFilePath, dockerFileContent)

docker.buildImage({
  context: dockerFileDirectory,
  src: [dockerFileName],
}, {t: 'tmp-build'}).then((stream) => {
  stream.pipe(process.stdout)
  docker.modem.followProgress(stream, (err, res) => {
    if (err) {
      console.log('error in Dockerfile progress')
      console.log(err)
      return
    }
    console.log('Finished creating container')
    docker.createContainer({
      Image: 'tmp-build',
      name: `tmp-builder-${repoId}`,
      AttachStdout: true,
      AttachStderr: true,
      Binds: [
        '/var/run/docker.sock:/var/run/docker.sock',
      ],
      Tty: true,
    }, (err, container) => {
      if (err) {
        console.log('error creating container')
        console.log(err)
        return
      }
      console.log('created container')
      container.attach({stream: true, stdout: true, stderr: true}, (err, stream) => {
        stream.pipe(process.stdout);
      });


      container.start((err) => {
        if (err) {
          console.log('error starting container', err)
        }
        console.log('started container')
      })
    })
  })
})



var deployments
docker.listContainers((err, containers) => {
  if (err) {
    console.log('Error retrieving containers', err)
    return
  }
  deployments = containers //.filter((container) => container.Image !== 'node-cd-server')
  // console.log('deployments', deployments)
})

router.post('/cd', (req, res) => {
  const push = new PushModel(req.body)

  if (!push.pushedByOwner) {
    res.status(401).send('Invalid pusher')
    return
  }

  // var Dockerfile = createDockerfile({
  //   projectName: push.repo,
  //   commitId: push.commitId,
  //   cloneUrl: push.cloneUrl,
  //   buildSteps: [
  //     'yarn start',
  //   ],
  // })
  
  // if (deploymentList[push.repoId]) {
  //   // stop old process
  //   var oldDeployment = deploymentList[push.repoId]
  //   oldDeployment.stop()
  //   oldDeployment = null
  // }

  const deployment = new Deployment(push)
  deployment.start()
  deploymentList[push.repoId] = deployment
  
  res.json({
    status: 'success?'
  })
})

export default router
