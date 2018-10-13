const docker = require('dockerode')()

const [,,imageName, ...args] = process.argv

docker.buildImage({
  src: ['Dockerfile'],
}, {t: imageName})