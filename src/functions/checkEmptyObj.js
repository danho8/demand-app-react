
function checkIfEmptyValueExists(obj) {
    let allValues = obj;

    for (let i in allValues) {
        if (allValues[i] === "" || allValues[i] === null) return true;
    }

    return false;
}

export default checkIfEmptyValueExists