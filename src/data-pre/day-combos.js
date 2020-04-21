const equals = require('shallow-equals')

// TODO: Add remaining combos
let all = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].sort()
let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].sort()
let weekends = ["Sunday", "Saturday"].sort()
let sunday = ["Sunday"]
let monday = ["Monday"]
let tuesday = ["Tuesday"]
let wednesday = ["Wednesday"]
let thursday = ["Thursday"]
let friday = ["Friday"]
let saturday = ["Saturday"]
let mwf = ["Monday", "Wednesday","Friday"].sort()
let tuth = ["Tuesday","Thursday"].sort()
let mtu = ["Monday", "Tuesday"].sort()
let mtuw = ["Monday", "Tuesday", "Wednesday"].sort()
let mtuth = ["Monday", "Tuesday", "Thursday"].sort()
let mtuthf = ["Monday", "Tuesday", "Thursday", "Friday"].sort()
let mtuthfsa = ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"].sort()
let mtuthfsasu = ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"].sort()
let mtufsasu = ["Monday", "Tuesday", "Friday", "Saturday", "Sunday"].sort()
let mtusasu = ["Monday", "Tuesday", "Saturday", "Sunday"].sort()
let mtusu = ["Monday", "Tuesday", "Sunday"].sort()
let mtuwth = ["Monday", "Tuesday", "Wednesday", "Thursday"].sort()
let mtuwthf = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].sort()
let mtuwthfsa = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].sort()
let mwthfsasu = ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].sort()
let mw = ["Monday", "Wednesday"].sort()
let mwth = ["Monday", "Wednesday", "Thursday"].sort()
let mwthf = ["Monday", "Wednesday", "Thursday", "Friday"].sort()
let mwthfsa = ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"].sort()
let mwfsa = ["Monday", "Wednesday", "Friday", "Saturday"].sort()
let mwsa = ["Monday", "Wednesday", "Saturday"].sort()
let mwsasu = ["Monday", "Wednesday", "Saturday", "Sunday"].sort()
let mwsu = ["Monday", "Wednesday", "Sunday"].sort()
let mwfsasu = ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"].sort()
let mthfsasu = ["Monday", "Thursday", "Friday", "Saturday", "Sunday"].sort()
let mtuwthsu = ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"].sort()
let mfsasu = ["Monday", "Friday", "Saturday", "Sunday"].sort()
let msasu = ["Monday", "Saturday", "Sunday"].sort()
let msu = ["Monday", "Sunday"].sort()
let mth = ["Monday", "Thursday"].sort()
let mthf = ["Monday", "Thursday", "Friday"].sort()
let mthfsa = ["Monday", "Thursday", "Friday", "Saturday"].sort()
let mtuwthfsu = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"].sort()
let mtuwfsasu = ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday", "Sunday"].sort()
let mf = ["Monday", "Friday"].sort()
let mfsa = ["Monday", "Friday", "Saturday"].sort()
let msa = ["Monday", "Saturday"].sort()
let tuw = ["Tuesday", "Wednesday"].sort()
let tuwth = ["Tuesday", "Wednesday", "Thursday"].sort()
let tuwthf = ["Tuesday", "Wednesday", "Thursday", "Friday"].sort()
let tuwthfsa = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].sort()
let tuwthfsasu = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].sort()
let tuthfsasu = ["Tuesday", "Thursday", "Friday", "Saturday", "Sunday"].sort()
let tufsasu = ["Tuesday", "Friday", "Saturday", "Sunday"].sort()
let tusasu = ["Tuesday", "Saturday", "Sunday"].sort()
let tusu = ["Tuesday", "Sunday"].sort()
let tuthf = ["Tuesday", "Thursday", "Friday"].sort()
let tuthfsa = ["Tuesday", "Thursday", "Friday", "Saturday"].sort()
let tuf = ["Tuesday", "Friday"].sort()
let tufsa = ["Tuesday", "Friday", "Saturday"].sort()
let tusa = ["Tuesday", "Saturday"].sort()
let wth = ["Wednesday", "Thursday"].sort()
let wthf = ["Wednesday", "Thursday", "Friday"].sort()
let wthfsa = ["Wednesday", "Thursday", "Friday", "Saturday"].sort()
let wthfsasu = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].sort()
let wfsasu = ["Wednesday", "Friday", "Saturday", "Sunday"].sort()
let wsasu = ["Wednesday", "Saturday", "Sunday"].sort()
let wsu = ["Wednesday", "Sunday"].sort()
let wf = ["Wednesday", "Friday"].sort()
let wfsa = ["Wednesday", "Friday", "Saturday"].sort()
let wsa = ["Wednesday", "Saturday"].sort()
let thf = ["Thursday", "Friday"].sort()
let thfsa = ["Thursday", "Friday", "Saturday"].sort()
let thfsasu = ["Thursday", "Friday", "Saturday", "Sunday"].sort()
let thsasu = ["Thursday", "Saturday", "Sunday"].sort()
let thsu = ["Thursday", "Sunday"].sort()
let thsa = ["Thursday", "Saturday"].sort()
let fsa = ["Friday", "Saturday"].sort()
let fsasu = ["Friday", "Saturday", "Sunday"].sort()
let fsu = ["Friday", "Sunday"].sort()

module.exports = function (arr) {
  let range = ""
  let days = arr.sort()

  if (equals(days, all)) {
    // TODO: Fix all sequential combos to include hypen instead of comma separated
    range = "Everyday"
  } else if (equals(days, weekdays)) {
    range = "Weekdays"
  } else if (equals(days, weekends)) {
    range = "Weekends"
  } else if (equals(days, sunday)) {
    range = "Sundays"
  } else if (equals(days, monday)) {
    range = "Mondays"
  } else if (equals(days, tuesday)) {
    range = "Tuesdays"
  } else if (equals(days, wednesday)) {
    range = "Wednesdays"
  } else if (equals(days, thursday)) {
    range = "Thursdays"
  } else if (equals(days, friday)) {
    range = "Fridays"
  } else if (equals(days, saturday)) {
    range = "Saturdays"
  } else if (equals(days, mwf)) {
    range = "M, W, F"
  } else if (equals(days, tuth)) {
    range = "Tu, Th"
  } else if (equals(days, mtu)) {
    range = "M-Tu"
  } else if (equals(days, mtuw)) {
    range = "M, Tu, W"
  } else if (equals(days, mtuwth)) {
    range = "M, Tu, W, Th"
  } else if (equals(days, mw)) {
    range = "M, W"
  } else if (equals(days, mwth)) {
    range = "M, W, Th"
  } else if (equals(days, mwthf)) {
    range = "M, W, Th, F"
  } else if (equals(days, mwthfsa)) {
    range = "M, W, Th, F, Sat"
  } else if (equals(days, mth)) {
    range = "M, Th"
  } else if (equals(days, mthf)) {
    range = "M, Th, F"
  } else if (equals(days, mthfsa)) {
    range = "M, Th, F, Sat"
  } else if (equals(days, mf)) {
    range = "M, F"
  } else if (equals(days, mfsa)) {
    range = "M, F, Sat"
  } else if (equals(days, msa)) {
    range = "M, Sat"
  } else if (equals(days, mtuwthsu)) {
    range = "M-Th, Sun"
  } else if (equals(days, mtuwfsasu)) {
    range = "M-W, F-Sun"
  } else if (equals(days, mtuwthfsu)) {
    range = "M-F, Sun"
  } else if (equals(days, tuw)) {
    range = "Tu-W"
  } else if (equals(days, tuwth)) {
    range = "Tu-Th"
  } else if (equals(days, tuwthf)) {
    range = "Tu-F"
  } else if (equals(days, tuwthfsa)) {
    range = "Tu-Sat"
  } else if (equals(days, tuthf)) {
    range = "Tu, Th, F"
  } else if (equals(days, tuthfsa)) {
    range = "Tu, Th, F, Sat"
  } else if (equals(days, tuf)) {
    range = "Tu, F"
  } else if (equals(days, tufsa)) {
    range = "Tu, F, Sat"
  } else if (equals(days, tusa)) {
    range = "Tu, Sat"
  } else if (equals(days, wth)) {
    range = "W-Th"
  } else if (equals(days, wthf)) {
    range = "W-F"
  } else if (equals(days, wthfsa)) {
    range = "W-Sat"
  } else if (equals(days, wf)) {
    range = "W, F"
  } else if (equals(days, wfsa)) {
    range = "W, F, Sat"
  } else if (equals(days, wsa)) {
    range = "W, Sat"
  } else if (equals(days, thf)) {
    range = "Th-F"
  } else if (equals(days, thfsa)) {
    range = "Th-Sat"
  } else if (equals(days, thsa)) {
    range = "Th, Sat"
  } else if (equals(days, mthfsasu)) {
    range = "M, Th, F, Sat, Sun"
  } else if (equals(days, mfsasu)) {
    range = "M, F, Sat, Sun"
  } else if (equals(days, mtuwthfsa)) {
    range = "M-Sat"
  } else if (equals(days, msasu)) {
    range = "M, Sat, Sun"
  } else if (equals(days, msu)) {
    range = "M, Sun"
  } else if (equals(days, tuwthfsasu)) {
    range = "T-Sun"
  } else if (equals(days, tuthfsasu)) {
    range = "T, Th, F, Sat, Sun"
  } else if (equals(days, tufsasu)) {
    range = "T, F, Sat, Sun"
  } else if (equals(days, tusasu)) {
    range = "T, Sat, Sun"
  } else if (equals(days, tusu)) {
    range = "T, Sun"
  } else if (equals(days, wthfsasu)) {
    range = "W-Sun"
  } else if (equals(days, wfsasu)) {
    range = "W, F, Sat, Sun"
  } else if (equals(days, wsasu)) {
    range = "W, Sat, Sun"
  } else if (equals(days, wsu)) {
    range = "W, Sun"
  } else if (equals(days, thfsasu)) {
    range = "Th-Sun"
  } else if (equals(days, thsasu)) {
    range = "T, Sat, Sun"
  } else if (equals(days, thsu)) {
    range = "Th, Sun"
  } else if (equals(days, fsa)) {
    range = "F-Sat"
  } else if (equals(days, fsasu)) {
    range = "F, Sat, Sun"
  } else if (equals(days, fsu)) {
    range = "F, Sun"
  } else {
    range = `ERROR`
    console.log("\n\n\nERROR:", arr, "\n\n\n")
  }
  return range
}
