const Input = props => {
    return(
        <div className="mb-3">
            <label htmlFor={props.name} className="form-label">{props.title}</label>
            <input
                type={props.type}
                className="form-control"
                id={props.name}
                name={props.name}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.handleChange}
            />
        </div>
    )
}

export default Input;