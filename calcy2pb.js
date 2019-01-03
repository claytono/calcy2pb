if (typeof readFile != "function") {
  function readFile(filename) {
    let fs = require ("fs")
    return fs.readFileSync(filename, "utf8")
  }
}
if (typeof flash != "function") {
  function flash(msg) { console.warn(msg) }
}

if (typeof file == "undefined") {
  var file = process.argv[2]
}

function from_csv(line) {
  return line.split(',')
}

function get_headers(line) {
  var cols = from_csv(line)
  var headers = {}
  for (var i = 0; i < cols.length; i++) {
    headers[cols[i]] = i
  }
  return headers
}

function get_data(filename) {
  var csv = readFile(file)
  var lines = csv.split("\n")
  var header_line = lines.shift()
  var headers = get_headers(header_line)
  var output = ""
  output += header_line

  var count = 0
  for (var i = 0; i < lines.length; i++) {
    var cols = from_csv(lines[i])
    if (cols[headers["Saved"]] != "1") {
      continue
    }
    if (cols[headers["Fast move"]].trim() == "-") {
      continue
    }
    if (cols[headers["Special move"]].trim() == "-") {
      continue
    }
    if (cols[headers["Special move 2"]].trim() == "-") {
      cols[headers["Special move 2"]] = ""
    }
    if (cols[headers["Name"]] == "Giratina Altered") {
      cols[headers["Name"]] = "Giratina"
    }
    cols[headers["Nickname"]] = cols[headers['Name']] + " " + cols[headers["Nickname"]]
    output += "\n" + cols.join(",")
    count += 1
  }
  flash(`Processed ${count} Pokemon`)

  return output
}

output = get_data(file)
console.log(output)
