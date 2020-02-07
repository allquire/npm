module.exports = function(id) {
  const pkg = id
    .replace(/.*npmjs.com\/(package\/)?/gi, '')
    .replace(/\?\.*/gi, '')
  console.log(pkg)
  const path = require('path').resolve('./node_modules/' + pkg)
  return require('fs')
    .promises.stat(path)
    .then((result) => {
      if (result.isDirectory())
        return new Promise((resolve) => resolve(require(pkg)))
      else throw new Error()
    })
    .catch(() => {
      return new Promise((resolve, reject) => {
        let log = ''
        const proc = require('child_process').exec('npm i ' + pkg)
        proc.stdout.on('data', (chunk) => (log += chunk))
        proc.on('exit', (code) => {
          if (code === 0) resolve(require(pkg))
          else reject(log)
        })
      })
    })
}
