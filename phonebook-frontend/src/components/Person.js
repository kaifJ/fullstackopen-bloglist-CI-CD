const Person = (props) => {
    let { name, number, handleDelete,id } = props
    return (
        <div>{name} {number} <button onClick={() => handleDelete(id)}>Delete</button></div>
    )
}

export default Person