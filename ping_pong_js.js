let n = [1,3,5,2,6,2]
function sumOfN(n) {
    let N = 2
    let sum = 0
    for (let index = 0; index <= N - 1; index += 1) {
        sum = sum + n[index]
    }
    return(sum)
}
test = sumOfN(n)
console.log(test)