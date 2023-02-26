export function formatNumberForGLS(n) {
    let arrStr = String(n).split(".")
    if (arrStr[1] == undefined) {
      arrStr[1] = "0"
    }
    if (arrStr[1].length > 1) {
      if (Number(arrStr[1][0]) == 9) {
        arrStr[0] = String(Number(arrStr[0]) + 1)
        arrStr[1] = "0"
      } else {
        arrStr[1] = Number(arrStr[1][0]) + 1
      }
    }
    return arrStr.join(".")
  
  }
  