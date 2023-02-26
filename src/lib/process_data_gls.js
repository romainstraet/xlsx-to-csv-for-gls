import { formatNumberForGLS } from "./format_number_gls"
import { replaceAccented } from "./replace_accented"

export function processDataForGLS(data) {
    const dataWithoutHeaders = data.slice(1)
    const cleanData = dataWithoutHeaders.map((v,i) => {
        v[0] = v[0].split('/OUT/').join("")
        v[1] = replaceAccented(v[1]).split("-").join("").split("&").join("")
        v[2] = replaceAccented(v[2]).split("-").join("").split("&").join("")
        v[10] = formatNumberForGLS(v[10])
        return v
    })
    const processedData = []
    cleanData.forEach((val, i) => {
        let arr = []
        arr[0] = "IMPSH" //A = fixe
        arr[1] = "" //B = num client (osef)
        arr[2] = val[0] //C = référence
        arr[3] = "" //D = code destinataire (osef)
        arr[4] = val[1] //E = nom destinataire
        arr[5] = val[3] //F = zone
        arr[6] = val[2] //G = rue
        arr[7] = "" //H = num (osef)
        arr[8] = "" //I = boite (osef)
        arr[9] = val[6] //J = code pays
        arr[10] = val[4] //K = code postal
        arr[11] = val[5] //L =ville
        arr[12] = "" //M = contact (osef)
        arr[13] = val[7] //N = téléphone
        arr[14] = "B" //O = B = adresse société 
        arr[15] = "" //P osef
        arr[16] = "" //Q osef
        arr[17] = "" //R osef
        arr[18] = "" //S osef
        arr[19] = val[9] //T = Nombre de colis
        arr[20] = "0" // U = osef
        arr[21] = val[10] //V = Pods des colis
        arr[22] = "" //W osef
        arr[23] = "" //X osef
        arr[24] = "" //Y osef
        arr[25] = "" //Z osef
        arr[26] = "" //AA = PREUVE DE LIVRAISON E = email = whaaat ??
        arr[27] = "" //AB osef
        arr[28] = "" //AC osef
        arr[29] = "" //AD osef
        arr[30] = "" //AE osef
        arr[31] = "" //AF osef
        arr[32] = val[8] //AG = Adresse email
        arr[33] = "" //AH osef
        arr[34] = "" //AI osef
        arr[35] = "" //AJ osef
        arr[36] = "" //AK osef
        arr[37] = "" //AL osef
        arr[38] = "" //AM osef
        arr[39] = "NONE" //AN fixe
        processedData.push(arr)
        
      })
      return processedData
    
}