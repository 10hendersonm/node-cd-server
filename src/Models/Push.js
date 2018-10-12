class PushModel {
  constructor(reqBody) {
    this.pusherName = reqBody.pusher.name
    this.repo = reqBody.repository.name
    this.base = reqBody
  }
  pusherName = null
  repo = null
  base = null
}

export default PushModel
