const getInvoiceType = fpdm => {
  var invoiceType = "99"
  var tmp = ""
  var codes = [
    '144031539110',
    '131001570151',
    '133011501118',
    '111001571071']
  if (fpdm.length == 12) {
    tmp = fpdm.substring(7, 8)
    console.log(tmp)
    for (var x in codes) {
      if (fpdm == codes[x]) {
        invoiceType = "10"
        break
      }
    }
    if (invoiceType == "99") {
      if (fpdm.charAt(0) == '0' && fpdm.substring(10, 12)=="11") {
        invoiceType = "10"
      }
      if (fpdm.charAt(0) == '0' && (fpdm.substring(10, 12)=="04" ||
        fpdm.substring(10, 12)=="05")) {
        invoiceType = "04"
      }
      if (fpdm.charAt(0) == '0' && (fpdm.substring(10, 12)=="06" ||
        fpdm.substring(10, 12)=="07")) {
        invoiceType = "11"
      }
      if (fpdm.charAt(0) == '0' && fpdm.substring(10, 12)=="12") {
        invoiceType = "14"
      }
    }
    if (invoiceType == "99") {
      if (invoiceType=="99" && tmp=="2" &&
        fpdm.charAt(0) != '0') {
        invoiceType = "03"
      }
    }
  } else if (fpdm.length == 10) {
    tmp = fpdm.substring(7, 8)
    if (tmp=="1" || tmp=="5") {
      invoiceType = "01"
    } else if (tmp=="6" || tmp=="3") {
      invoiceType = "04"
    } else if (tmp=="7" || tmp=="2") {
      invoiceType = "02"
    }
  }
  return invoiceType
}
module.exports = {
  getInvoiceType:getInvoiceType
}


