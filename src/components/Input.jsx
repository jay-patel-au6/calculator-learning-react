import React from 'react'
import './../style/Input.css'

const Input = React.forwardRef((props, ref) => {
    return (
        <input ref={ref} className="Input" type="text" value={props.val || ''} onChange={props.onChange}/>
    )

})

export default Input
