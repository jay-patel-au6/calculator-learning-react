import React, { Component } from 'react'
import './../style/Row.css'

export default class Row extends Component {
    render() {
        return (
            <div className="Row">
                {this.props.children}
            </div>
        )
    }
}
