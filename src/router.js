import {Router} from 'express'

import PushModel from './Models/Push'

const router = Router()

router.post('/cd', (req, res) => {
  const push = new PushModel(req.body)
  console.log(push)

  if (push.pusherName !== '10hendersonm') {
    res.status(401).send('Invalid pusher')
    return
  }
  
  res.json(push)
})

export default router
