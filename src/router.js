import {Router} from 'express'

import PushModel from './Models/Push'
import Deployment from './Models/Deployment';
import Docker from 'dockerode'
import fs from 'fs'
import {createDockerfile} from './utils'

const router = Router()
export const docker = new Docker()

docker.buildImage({
  context: __dirname,
  src: ['Dockerfile'],
}, {t: 'node-src-asdf'}, (err, response) => {
  if (err) {
    console.log('error building Dockerfile')
    console.log(err)
    return
  }
  console.log(response)
})



var deployments
docker.listContainers((err, containers) => {
  if (err) {
    console.log('Error retrieving containers', err)
    return
  }
  deployments = containers //.filter((container) => container.Image !== 'node-cd-server')
  console.log('deployments', deployments)
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
