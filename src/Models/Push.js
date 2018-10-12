class PushModel {
  constructor(req) {
    this.repo = req.repository.name
    this.pusher = req.pusher.email
    this.repoOwner = req.repository.owner.email
    this.pushedByOwner = this.pusher === this.repoOwner
    this.base = req
  }
  repo = null
  pusher = null
  repoOwner = null
  pushedByOwner = false
  base = null
}

export default PushModel
