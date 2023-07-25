const fs = require('node:fs/promises')
const path = require('path')

// Ejercicio 2
async function writeFile (filePath, data, callback) {
  let pathFile = null
  try {
    const stats = await fs.stat(filePath)
    if (stats.isDirectory()) {
      pathFile = path.join(filePath, 'tmp.txt')
    }
  } catch (error) {
    console.log('La ruta es un directorio, nombre del archivo: tmp.txt')
    await fs.mkdir(filePath, { recursive: true })
    pathFile = path.join(filePath, 'tmp.txt')
  }

  try {
    console.log('Escribiendo archivo...', pathFile)
    await fs.writeFile(pathFile, data, 'utf-8')
    callback() // Call the callback after the write operation is complete
  } catch (error) {
    console.log('Error al escribir el archivo', error)
    process.exit(0)
  }
}

// Ejercicio 3
async function readFileAndCount (word, callback) {
  const filePath = process.argv[2]
  const FILE_NOT_FOUND = 0
  const TEXT_NOT_FOUND = 'No se ha especificado la palabra a buscar'
  const PATH_NOT_FOUND = 'No se ha especificado el path del archivo'

  if (!word) {
    callback(new Error(TEXT_NOT_FOUND))
    process.exit(0)
  }

  if (!filePath) {
    callback(new Error(PATH_NOT_FOUND))
    process.exit(0)
  }

  try {
    await fs.access(filePath)
  } catch (error) {
    callback(null, FILE_NOT_FOUND) // ?
    process.exit(0)
  }

  try {
    const data = await fs.readFile(filePath, 'utf-8')
    const count = data.split(word).length - 1
    callback(undefined, count)
  } catch (error) {
    console.log('Error al leer el archivo', error)
    callback(new Error(PATH_NOT_FOUND))
    process.exit(0)
  }
}

module.exports = {
  writeFile,
  readFileAndCount
}
