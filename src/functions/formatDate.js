
export const formatDate = (data) => {
    let newDate = new Date(data)
    let month = newDate.getMonth() + 1
    let day = newDate.getDate()
    return `${day < 10 ? "0" + day : day}` + "/" + `${month < 10 ? "0" + month : month}` + "/" + `${newDate.getFullYear()}`
}
