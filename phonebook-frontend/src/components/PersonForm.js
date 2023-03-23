const PersonForm = (props) => {
    let {
        handleNameChange, 
        handleNumberChange, 
        newName, newNumber, 
        handleSubmit
    } = props

    return (
        <div>
            <form>
                <div>name: <input value={newName} onChange={handleNameChange} /></div>
                <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
                <div><button type="submit" onClick={handleSubmit}>add</button></div>
            </form>
        </div>
    )
}

export default PersonForm