/*

const docker = new Docker()

docker.listContainers()
.then((containers) => {
  console.log(containers)
})
*/

import Docker from 'dockerode'
import SimpleGit from 'simple-git'
import fs from 'fs'
import rimraf from 'rimraf'
import path from 'path'
import chalk from 'chalk'
import jsYaml from 'js-yaml'

const simpleGit = SimpleGit()
// const startScript = '.cd.yml'

const execScripts = (scriptArr, workDir) => {
  const topScript = scriptArr.shift()
  console.log(`exec '${topScript}'`)
  return new Promise((resolve, reject) => {
    exec(topScript, {
      cwd: workDir,
    }, async () => {
      console.log(`completed ${topScript}`)
      if (scriptArr.length) {
        await execScripts(scriptArr, workDir)
      }
      resolve()
    })
  })
}

class Deployment {
  constructor(push) {
    this.push = push
    this.localPath = `./Apps/${this.push.repo}`
  }
  push = null
  childProcess = null
  localPath = null

  stop = () => {
    console.log('Stopping old deployment')
    if (this.childProcess) {
      this.childProcess.kill('SIGINT')
    }
    if (fs.existsSync(this.localPath)) {
      rimraf.sync(this.localPath)
    }
  }

  start = () => {
    if (fs.existsSync(this.localPath)) {
      console.log('Directory already exists. Removing...')
      rimraf.sync(this.localPath)
      console.log('Directory removed')
    }
    // git clone this.push.cloneUrl
    console.log(`Cloning '${this.push.cloneUrl}'`)
    simpleGit.clone(this.push.cloneUrl, this.localPath, () => {
      const scriptUrl = path.join(this.localPath, startScript)
      const scriptContent = fs.readFileSync(scriptUrl, 'utf8')
      const scriptLines = jsYaml.safeLoad(scriptContent)
      execScripts(scriptLines, this.localPath)
    })
  }
}

export default Deployment
