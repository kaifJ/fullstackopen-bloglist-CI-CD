import Person from './Person'

const Persons = (props) => {
    let { filter, persons, filteredValues, handleDelete } = props
    return (
        <div>
            {filter ? filteredValues.map(value => (
                <Person
                    id={value.id}
                    key={value.name}
                    name={value.name}
                    number={value.number}
                    handleDelete={handleDelete}
                />
            )) :
                persons.map((person, index) => (
                    <Person
                        id={person.id}
                        key={`${person.name}~${index}`}
                        name={person.name}
                        number={person.number}
                        handleDelete={handleDelete}
                    />
                ))}
        </div>
    )
}

export default Persons