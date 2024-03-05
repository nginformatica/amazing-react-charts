const fs = require('fs')
const path = require('path')

function countTsxFiles(dirPath) {
    let numTsxFiles = 0
    const files = fs.readdirSync(dirPath)

    files.forEach(file => {
        const filePath = path.join(dirPath, file)
        if (fs.statSync(filePath).isDirectory()) {
            numTsxFiles += countTsxFiles(filePath)
        } else if (file.endsWith('.tsx') && !file.includes('stories.tsx')) {
            numTsxFiles++
        }
    })

    return numTsxFiles
}

const componentsPath = 'src/core/'
const testDirPath = 'src/test/'

const numTsxFiles = countTsxFiles(componentsPath)
const numSpecFiles = fs
    .readdirSync(testDirPath)
    .filter(file => file.endsWith('.spec.tsx')).length

console.log(
    `Quantidade de componentes em '${componentsPath}': ${numTsxFiles} |`,
    `Quantidade de arquivos de teste em '${testDirPath}': ${numSpecFiles}`
)

if (numTsxFiles !== numSpecFiles) {
    console.error(
        `Quantidade de componentes (${numTsxFiles}) não coincide com a quantidade de arquivos de teste (${numSpecFiles}).`
    )
    process.exit(1)
}

console.log(`Quantidade de componentes coincide com a quantidade de arquivos de teste.`)
