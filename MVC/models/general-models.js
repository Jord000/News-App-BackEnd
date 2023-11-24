const fsPromise = require('fs/promises')


exports.selectEndPoints = () => {
    return fsPromise.readFile(`${__dirname}/../../endpoints.json`).then((data) => {
      return JSON.parse(data)
    })
  }