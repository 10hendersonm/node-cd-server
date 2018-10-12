import {Router} from 'express'

import PushModel from './Models/Push'
import Deployment from './Models/Deployment';
import Docker from 'dockerode'

const router = Router()
const docker = new Docker()

var deployments
docker.listContainers((containers) => {
  deployments = containers.filter((container) => container.Image !== 'node-cd-server')
  console.log('deployments', deployments)
})

router.post('/cd', (req, res) => {
  console.log('New Request')
  const push = new PushModel(req.body)
  console.log(push)

  if (!push.pushedByOwner) {
    res.status(401).send('Invalid pusher')
    return
  }

  if (deploymentList[push.repoId]) {
    // stop old process
    var oldDeployment = deploymentList[push.repoId]
    oldDeployment.stop()
    oldDeployment = null
  }

  const deployment = new Deployment(push)
  deployment.start()
  deploymentList[push.repoId] = deployment
  
  res.json({
    status: 'success?'
  })
})

export default router
