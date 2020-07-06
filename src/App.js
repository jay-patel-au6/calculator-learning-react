import React, { Component } from 'react';
import './App.css';

import Form from './components/Form.jsx'
import History from './components/History.jsx'
import Input from './components/Input.jsx'
import Row from './components/Row.jsx'
import Button from './components/Button.jsx'

class App extends Component {
	constructor() {
		super()

		this.inputEle = React.createRef()
		this.state = {
			inputVal: "0",
			history: []
		}

		this.allowedCharacters = "0123456789./*+-%="
		this.operations = "/*+-%="

		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleNormalBtnPress = this.handleNormalBtnPress.bind(this)
		this.handleArgs = this.handleArgs.bind(this)
		this.clearInputVal = this.clearInputVal.bind(this)
		this.makeNegative = this.makeNegative.bind(this)
		this.handleOnClick = this.handleOnClick.bind(this)
	}


	handleInputChange(event) {
		let eventCopy = {...event}
		let curChar = event.target.value.substr(-1)
		if(this.allowedCharacters.includes(curChar)) {
			if(this.state.inputVal !== undefined && this.operations.includes(this.state.inputVal.substr(-1)) && this.operations.includes(curChar) && this.state.inputVal.substr(-1) !== '%') {
				this.setState({inputVal: this.state.inputVal.substr(0, this.state.inputVal.length - 1) + curChar},
					this.handleInputChangeAux(eventCopy, curChar)
				)
			} else this.handleInputChangeAux(eventCopy, curChar)

		}
	}

	handleInputChangeAux(event, curChar) {
		if(curChar === "=") {
			this.handleArgs()
		} else if(this.state.inputVal === "0" && curChar !== "." && !this.operations.includes(curChar)) this.setState({inputVal: event.target.value[1]})
		else if(curChar === "*" || curChar === "/") this.setState({inputVal: "(" + this.state.inputVal + ")" + curChar})
		else this.setState({inputVal: event.target.value})
	}


	handleNormalBtnPress(curChar) {
		if(this.operations.includes(this.state.inputVal.substr(-1)) && this.operations.includes(curChar) && this.state.inputVal.substr(-1) !== '%') {
			this.setState({inputVal: this.state.inputVal.substr(0, this.state.inputVal.length - 1)}, 
				this.handleNormalBtnPressAux(curChar)
			)
		} else this.handleNormalBtnPressAux(curChar)
	}

	handleNormalBtnPressAux(curChar) {
		if(this.state.inputVal === "0" && curChar !== "." && !this.operations.includes(curChar)) this.setState({inputVal: curChar})
		else if(curChar === "*" || curChar === "/") this.setState({inputVal: "(" + this.state.inputVal + ")" + curChar})
		else this.setState({inputVal: this.state.inputVal + curChar})
	}

	handleArgs() {
		if(this.operations.includes(this.state.inputVal.substr(-1))  && this.state.inputVal.substr(-1) !== '%') {
			this.setState({inputVal: this.state.inputVal.substr(0, this.state.inputVal.length - 1)}, this.handleArgsAux)
		} else this.handleArgsAux()
	}

	handleArgsAux() {
		let equation = this.state.inputVal
		let argStr = ""
		let operation = null
		let result = null
		let arg1 = null
		let arg2 = null
		let m = 1
		let pwr = 0

		let i = 0
		

		do {

			if(equation[i] === "(" || equation[i] === ")" ) {
				i++;
				if(equation[i - 1] && equation[i] === "-") {
					m = -1
					i++
				}		
				continue
			}
			if(equation[i] === 'e') {
				i++
				for(let j = i + 1; j <= equation.length - 1; j++) {
					if(this.operations.includes(equation[j])) break
					else pwr += equation[j]
				}
				if(equation[i] === '+') pwr = parseFloat(pwr)
				else if(equation[i] === '-') pwr = parseFloat(pwr) * (-1)
			}
			
			if(this.operations.includes(equation[i])) {

				arg2 = m * parseFloat(argStr) * (10 ** pwr)
				argStr = ""
				m = 1
				pwr = 0


				if(arg1 !== null) {
					if(equation[i] === '%') {
						if(operation === '+' || operation === '-') arg2 = arg2*arg1/100
						else if(operation === '*' || operation === '/') arg2 = arg2/100
						i++
					}

					if(operation === '+') result = this.add(arg1, arg2)
					if(operation === '-') result = this.subtract(arg1, arg2)
					if(operation === '*') result = this.multiply(arg1, arg2)
					if(operation === '/') result = this.divide(arg1, arg2)
				
				} else result = arg2

				arg1 = result
				arg2 = null
				operation = equation[i]

			} else {
				argStr += equation[i]
			}

			i++
		} while(i < equation.length && !(i === equation.length - 1 && equation[i] === '%'))



		arg2 = m * parseFloat(argStr)
		argStr = ""
		m = 1


		if(arg1 !== null) {
			if(equation[i] === '%') {
				if(operation === '+' || operation === '-') arg2 = arg2*arg1/100
				else if(operation === '*' || operation === '/') arg2 = arg2/100
				i++
			}
			if(operation === '+') result = this.add(arg1, arg2)
			if(operation === '-') result = this.subtract(arg1, arg2)
			if(operation === '*') result = this.multiply(arg1, arg2)
			if(operation === '/') result = this.divide(arg1, arg2)

		} else result = arg2
		arg1 = result
		arg2 = null


		this.setState({inputVal: String(result)}, () => {
			this.setState({history: [...this.state.history, equation + " = " + result]})
		})

	}

	add(arg1, arg2) {
		return arg1 + arg2
	}

	subtract(arg1, arg2) {
		return arg1 - arg2
	}

	multiply(arg1, arg2) {
		return arg1 * arg2
	}

	divide(arg1, arg2) {
		return arg1 / arg2
	}

	clearInputVal() {
		this.setState({inputVal: "0"})
	}

	makeNegative() {
		let inputVal = this.state.inputVal
		if(inputVal && inputVal.length && inputVal !== "0") {
			if(inputVal.substr(-1) !== ")" && !this.operations.includes(inputVal.substr(-1))) {
				for(let i = inputVal.length - 1; i >= 0; i--) {
					if(this.operations.includes(inputVal[i])) {
						inputVal = inputVal.substr(0, i + 1) + '(-' + inputVal.substr(i + 1) + ')'
						break
					}
					else if(i === 0) inputVal = inputVal.substr(0, i) + '(-' + inputVal.substr(i) + ')'
				}
			} else if(inputVal.substr(-1) === ")") {
				for(let i = inputVal.length - 1; i >= 0; i--) {
					if(inputVal[i] === '-' && inputVal[i - 1] === '(') {
						inputVal = inputVal.substr(0, i - 1) + inputVal.substr(i + 1)
						inputVal = inputVal.substr(0, inputVal.length - 1)
					}
				}
			}
		}
		this.setState({inputVal: inputVal})
	}

	render() {
		return (
			<div onClick={this.handleOnClick} className="App">
				<History history={this.state.history}/>
	
				<Form>
					<Input ref={this.inputEle} val={this.state.inputVal} onChange={this.handleInputChange}/>
					<Row>
						<Button val="AC" onClick={this.clearInputVal}/>
						<Button val="+/-" onClick={this.makeNegative}/>
						<Button val="%" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="/" onClick={(val) => this.handleNormalBtnPress(val)}/>
					</Row>
					<Row>
						<Button val="7" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="8" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="9" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="*" onClick={(val) => this.handleNormalBtnPress(val)}/>
					</Row>
					<Row>
						<Button val="4" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="5" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="6" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="-" onClick={(val) => this.handleNormalBtnPress(val)}/>
					</Row>
					<Row>
						<Button val="1" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="2" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="3" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="+" onClick={(val) => this.handleNormalBtnPress(val)}/>
					</Row>
					<Row>
						<Button width="broad" val="0" onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button val="." onClick={(val) => this.handleNormalBtnPress(val)}/>
						<Button type="submit" val="=" onClick={this.handleArgs}/>
					</Row>
				</Form>	
			</div>
		);
	}

	componentDidMount() {
		this.inputEle.current.focus()
	}

	componentDidUpdate() {
		this.inputEle.current.focus()
	}

	handleOnClick() {
		this.inputEle.current.focus()
	}
}


export default App;
