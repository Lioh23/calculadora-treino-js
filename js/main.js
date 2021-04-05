const buttonCollection = document.getElementsByTagName('button')
const arrayOfNumbers = []
const arrayOfOperators = []

for(i in buttonCollection) {
  if(typeof buttonCollection[i] == "object") {

    if( !isNaN( parseInt( buttonCollection[i].textContent ) ) || buttonCollection[i].textContent == '.' ) {
      
      arrayOfNumbers.push(buttonCollection[i])
      // arrayOfNumbers[i].setAttribute("onclick", `calculator.showNumbersOnDisplay(${i})`)

    } else if(buttonCollection[i].textContent != '=' && buttonCollection[i].textContent != 'C') {

      arrayOfOperators.push(buttonCollection[i])
    
    }

  }
}


calculator = {
  
  numberButtons: arrayOfNumbers,
  operatorButtons: arrayOfOperators,
  displayMemory: '',
  resetButton: document.getElementById('reset'),
  submitButton: document.getElementsByClassName('enter')[0],
  display: document.getElementsByClassName('resultado')[0],
  dotIsTyped: false,
  operationIsInserted: false,

  load() {
    this.insertOnClickInAllOfButtons()
  },

  insertOnClickInAllOfButtons() {
    for(i in this.numberButtons) this.numberButtons[i].setAttribute('onclick', `calculator.writeNumbersAndDotInDisplay(${i})`)
    for(i in this.operatorButtons) this.operatorButtons[i].setAttribute('onclick', `calculator.insertOperation(${i})`)
    this.submitButton.setAttribute("onclick", `calculator.makeOperation()`) 
    this.resetButton.setAttribute('onclick', 'calculator.reset()')
  },

  writeNumbersAndDotInDisplay(i) {
    
    // verifica se o display está vazio
    if( (this.display.value == "") && (i == 9) ) {
      return
      
      //lógica com ponto
    } else if( (this.display.value == "") && (i == 10)) {

      this.display.value += "0."
      this.dotIsTyped = true
      //logica sem ponto
    } else if(i != 10) {

      this.display.value += this.numberButtons[i].textContent
    } else if (i == 10 && this.dotIsTyped == false) {
      
      this.display.value += this.numberButtons[i].textContent
      this.dotIsTyped = true
    } 
    
  },      

  insertOperation(i) {
            
    //captar numeros negativos
    if(this.display.value == '' && this.operatorButtons[i].textContent === '-') {
      this.display.value = this.operatorButtons[i].textContent
      return
    } 

    if(this.display.value == '' && this.displayMemory == '') return

    // não permitir que ele repita operações
    if( this.display.value != '' && !isNaN(parseInt(this.display.value)) ) {
      this.operationIsInserted = false
    } 

    if(this.operationIsInserted == false) {
      this.insertOnDisplayMemory(this.display.value)
      this.insertOnDisplayMemory(this.operatorButtons[i].textContent === 'x' ? '*' : this.operatorButtons[i].textContent)
    
      //zerar display
      this.display.value = ''
      this.dotIsTyped = false
      this.operationIsInserted = true
    }
   
  },

  makeOperation() {
    
    if(this.displayMemory == '') return
    if(this.operationIsInserted == true && this.display.value == '') return

    this.displayMemory += this.display.value

    console.log('display memory: ' + this.displayMemory)

    const arrDisplay = this.displayMemory.trim().split(' ')
    let operation = '';


    // procurar por operações de multiplicação e divisão
    for(let i = 0 ; i < arrDisplay.length ; i++) {
      i = parseInt(i)
      let arrCurrentLength = arrDisplay.length

      if(arrDisplay[i] == '*' || arrDisplay[i] == '/') {

          
        operation = eval(`${arrDisplay[i-1]} ${arrDisplay[i]} ${arrDisplay[i+1]}`)
        operation = `${operation}`
        
        arrDisplay.splice(i-1, 3, operation)

      }

      if(arrCurrentLength != arrDisplay.length) {
        i = 0
        arrCurrentLength = arrDisplay.length
      }
    }


    //fazer o resto das operações
    for(let i = 0 ; i < arrDisplay.length ; i++) {
      i = parseInt(i)
      let arrCurrentLength = arrDisplay.length

      if(arrDisplay[i] == '+' || arrDisplay[i] == '-') {
        operation = eval(`${arrDisplay[i-1]} ${arrDisplay[i]} ${arrDisplay[i+1]}`)
        operation = `${operation}`
          
        arrDisplay.splice(i-1, 3, operation)
      }
      
      if(arrCurrentLength != arrDisplay.length) {
        i = 0
        arrCurrentLength = arrDisplay.length
      }
    }
  
    let dotConference = arrDisplay[0].split('')
    for(e of dotConference) {
      
      if(e == '.') {
        this.dotIsTyped = true
        break
      } else {
        this.dotIsTyped = false
      }
    }
    this.display.value = arrDisplay[0]          
    this.displayMemory = '';
    
  },

  reset() {
    this.displayMemory = ''
    this.display.value = ''
  },

  insertOnDisplayMemory(data) {
    this.displayMemory += `${data} `
  }
}