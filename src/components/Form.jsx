import React, { Component } from 'react'

export default class Form extends Component {
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.props.children}
            </form>
        )
    }
}
