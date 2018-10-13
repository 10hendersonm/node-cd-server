const docker = require('dockerode')()

const [,,imageName, ...args] = process.argv

console.log('Building image: ', imageName)

docker.buildImage({
  src: ['Dockerfile'],
}, {t: imageName}).then((stream) => {
  stream.pipe(process.stdout)
  docker.modem.followProgress(stream, (err, res) => {
    if (err) {
      console.log('error in Dockerfile progress')
      console.log(err)
      return
    }
    console.log('Image created')
  })
})


// docker.buildImage({
//   context: __dirname,
//   src: ['Dockerfile'],
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
//       name: 'tmp-builder',
//       Binds: [
//         '/var/run/docker.sock:/var/run/docker.sock',
//       ]
//     }, (err, container) => {
//       if (err) {
//         console.log('error creating container')
//         console.log(err)
//         return
//       }
//       container.start()
//     })
//   })
// })