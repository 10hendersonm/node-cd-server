import {spawn} from 'child_process'
import SimpleGit from 'simple-git'
import fs from 'fs'
import rimraf from 'rimraf'
import path from 'path'

const simpleGit = SimpleGit()
const startScript = '.cd.sh'

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
    simpleGit.clone(this.push.cloneUrl, this.localPath)
    const scriptUrl = path.join(this.localPath, startScript)
    console.log('Starting child process')
    this.childProcess = spawn(scriptUrl)
    this.childProcess.on('error', (err) => {
      console.log('Error in child process', err)
    })
  }
}

export default Deployment
