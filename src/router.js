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

const commands = [
  'echo 1',
  'git clone https://github.com/10hendersonm/dnd-character-sheet.git /build',
  'echo 2',
  'cd /build',
  'echo 3',
  'yarn',
  'echo 4',
  'yarn build',
  'echo 5',
  'docker build -t asdf .',
]

// const Dockerfile = createDockerfile({
//   projectName: 'node-cd-test',
//   commitId: '1234',
//   cloneUrl: 'https://github.com/10hendersonm/dnd-character-sheet.git',
//   buildSteps: [
//     'yarn',
//     'yarn build',
//   ],
// })

docker.createContainer({
  Image: 'node',
  name: `tmp-builder-${uuid()}`,
  AttachStdout: true,
  AttachStderr: true,
  Binds: [
    '/var/run/docker.sock:/var/run/docker.sock',
  ],
  Cmd: ['/bin/sh', '-c', 'git clone https://github.com/10hendersonm/dnd-character-sheet.git'],
}, (err, container) => {
  if (err) {
    console.log('error creating container')
    console.log(err)
    return
  }
  container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
    stream.pipe(process.stdout);
  });
  console.log('created container')
  container.start((err, data) => {
    if (err) {
      console.log('error starting container', err)
    }
    console.log('data', data)
  })
})


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

// const dockerizeDir = path.join(__dirname, 'dockerize')
// fs.writeFileSync(path.join(dockerizeDir, 'Dockerfile'), Dockerfile)

// docker.buildImage({
//   context: dockerizeDir,
//   src: fs.readdirSync(dockerizeDir),
// }, {t: 'tmp-build'}).then((stream) => {
//   stream.pipe(process.stdout)
//   docker.modem.followProgress(stream, (err, res) => {
//     if (err) {
//       console.log('error in Dockerfile progress')
//       console.log(err)
//       return
//     }
//     docker.createContainer({
//       Image: 'tmp-build',
//       name: `tmp-builder-${uuid()}`,
//       AttachStdout: true,
//       AttachStderr: true,
//       Binds: [
//         '/var/run/docker.sock:/var/run/docker.sock',
//       ]
//     }, (err, container) => {
//       if (err) {
//         console.log('error creating container')
//         console.log(err)
//         return
//       }
//       console.log('created container')
//       container.start((err, data) => {
//         if (err) {
//           console.log('error starting container', err)
//         }
//         console.log('data', data)
//       })
//     })
//   })
// })



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
