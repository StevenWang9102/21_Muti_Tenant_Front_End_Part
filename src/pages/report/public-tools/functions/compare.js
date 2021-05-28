export const compare = (param) => {
    return function (m, n) {
        var a = m[param]
        var b = n[param]
        return a - b
    }
}