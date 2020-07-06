import React, { Component } from 'react'
import './../style/Button.css'

export default class Button extends Component {
    constructor(props) {
        super(props)

        if(this.props.width === "broad")
            this.className = "Button Button-broad"
        else
            this.className = "Button"

        this.onClick = this.onClick.bind(this)
    }

    onClick(event) {
        event.preventDefault()
        this.props.onClick(this.props.val)
    }

    render() {
        return (
            <button type={this.props.type || "button"} className={this.className} onClick={this.onClick}>
                {this.props.val}
            </button>
        )
    }
}
