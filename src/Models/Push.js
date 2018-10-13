class PushModel {
  constructor(req) {
    this.repoId = req.repository.id
    this.repo = req.repository.name
    this.commitId = req.head_commit.id
    this.cloneUrl = req.repository.clone_url
    this.pusher = req.pusher.email
    this.repoOwner = req.repository.owner.email
    this.pushedByOwner = this.pusher === this.repoOwner
    this.base = req
  }
  repoId = null
  repo = null
  commitId = null
  cloneUrl = null
  pusher = null
  repoOwner = null
  pushedByOwner = false
  base = null
}

export default PushModel
