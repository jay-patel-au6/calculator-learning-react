import React, { Component } from 'react'
import './../style/History.css'

export default class History extends Component {
    render() {
        return (
            <div className="History">
                {this.props.history.map(old => <p key={Math.random()}>{old}</p>)}
            </div>
        )
    }
}
