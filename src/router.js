import {Router} from 'express'

const router = Router()

router.post('/cd', (req, res) => {
  console.log(req.body)
  res.json({
    message: 'Hello World',
  })
})

export default router
