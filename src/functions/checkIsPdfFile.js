import {ExtensionFilesName} from '../constants'

function checkIsPdfFile (nameFile) {
    if (nameFile.split('.')[1] === ExtensionFilesName.pdf) return true

    return false
}

export default checkIsPdfFile