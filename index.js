const fs = require('node:fs/promises')
const path = require('path')

// Ejercicio 2
async function writeFile (filePath, data, callback) {
  const IS_DIRECTORY_ERROR = 'La ruta es un directorio, nombre del archivo: tmp.txt'
  const ERROR_DIRECTORY = 'Error al crear el directorio'
  const NAME_FILE = 'tmp.txt'
  const WRITING = 'Escribiendo archivo...'
  const ERROR_WRITING = 'Error al escribir el archivo'

  let pathFile = null
  try {
    const stats = await fs.stat(filePath)
    if (stats.isDirectory()) {
      pathFile = path.join(filePath, NAME_FILE)
    }
  } catch (error) {
    console.log(IS_DIRECTORY_ERROR)
    try {
      await fs.mkdir(filePath, { recursive: true })
      pathFile = path.join(filePath, NAME_FILE)
    } catch (error) {
      console.log(ERROR_DIRECTORY)
    }
  }

  try {
    console.log(WRITING, pathFile)
    await fs.writeFile(pathFile, data, 'utf-8')
    callback() // Call the callback after the write operation is complete
  } catch (error) {
    console.log(ERROR_WRITING, error)
    callback(error)
  }
}

// Ejercicio 3
async function readFileAndCount (word, callback) {
  const filePath = process.argv[2] ?? false
  const FILE_NOT_FOUND = 0
  const TEXT_NOT_FOUND = 'No se ha especificado la palabra a buscar'
  const PATH_NOT_FOUND = 'No se ha especificado el path del archivo'

  if (!word) {
    callback(new Error(TEXT_NOT_FOUND))
    return
  }

  if (!filePath) {
    callback(new Error(PATH_NOT_FOUND))
    return
  } else {
    try {
      await fs.access(filePath)
    } catch (error) {
      callback(null, FILE_NOT_FOUND)
      return
    }
  }

  try {
    const data = await fs.readFile(filePath, 'utf-8')
    let count = 0
    data.split(' ').forEach((w) => { if (w.includes(word)) count++ })
    callback(undefined, count)
  } catch (error) {
    callback(new Error(PATH_NOT_FOUND))
  }
}

module.exports = {
  writeFile,
  readFileAndCount
}
