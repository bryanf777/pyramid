const express = require("express")
const app = express()

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html")
})

let isPyramidWord = function(word) {
  
  console.log("word:", word)
  
  // Special cases...
  
  // Don't consider a non-string a word.
  if (typeof word != "string") {
    return false
  }
  
  if (word.length == 1) {
    return true
  }
  
  if (word.length == 0) {
    return false
  }

  // For all other strings...
  
  let result = false

  // Get count of each character in word.
  let characterMap = new Map()  
  for (const char in word) {
    characterMap.set(word[char], isNaN(characterMap.get(word[char])) ? 1 : characterMap.get(word[char]) + 1)
  }
  
  // Sort counts into array.
  let values = [...characterMap.values()].sort()

  // Check if each count increases by one.
  result = values.every((element, index, array) => { 
    console.log(element,index,array)
    if (index + 1 == array.length) {
      // You've reached the last character without short circuiting -- it's a pyramid!
      return true
    }

    // Adding one to the current element should equal the next element. If it does, returning true will 
    // have "every" continue to next character in array.
    return element + 1 == array[index+1]
  })
  
  console.log("result:", result) 
  return result
}

app.get("/pyramid", (request, response) => {
  // Expecting query string ?word=xxxxx. Redirect if "word" isn't passed in query string.
  if (typeof request.query.word === 'undefined') {
    response.redirect('/')
  } else {
    response.json({"isPyramidWord" : isPyramidWord(request.query.word)})
  }
})

// Some lightweight tests...
app.get("/test", (request, response) => {
  try {
    // Without gaps
    if (isPyramidWord('banana') != true) throw("banana not true")
    if (isPyramidWord('aaaaaa') != true) throw("aaaaaa not true")
    if (isPyramidWord('22333444455555') != true) throw("22333444455555 not true")

    // With gaps
    if (isPyramidWord('33355555') != false) throw("33355555 not false")
    if (isPyramidWord('bananaa') != false) throw("bananaa not false")
    
    // Empty
    if (isPyramidWord('') != false) throw("empty not false")

    // With same character counts
    if (isPyramidWord('111222') != false) throw("111222 not false")
    if (isPyramidWord('aaabbbccc') != false) throw("aaabbbccc not false")

    // Consider single character pyramid
    if (isPyramidWord('a') != true) throw("a not true")
    if (isPyramidWord('1') != true) throw("a not true")
    
    // Consider space characters as characters to count
    if (isPyramidWord('a bbb cccc') != true) throw("'a bbb cccc' not true")

    response.json({"passed": true, "msg" : "passed"})
  }
  catch (error) {
    response.json({"passed": false, "msg" : error})
  }
})

// listen for requests
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
