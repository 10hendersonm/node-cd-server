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

  const dockerFileDirectory = path.join(__dirname, `dockerfile-${push.commitId}`)
  const dockerFileName = 'Dockerfile'
  const dockerFilePath = path.join(dockerFileDirectory, dockerFileName)
  const dockerFileContent = createDockerfile({
    projectName: push.repo,
    commitId: push.commitId,
    cloneUrl: push.cloneUrl,
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
  res.json({
    status: 'success?'
  })
})

export default router
