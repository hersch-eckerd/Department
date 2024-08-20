import React, {useEffect, useState} from 'react';

const ResourceTags = ({params, setParams}) => {
    const [checkboxes, setCheckboxes] = useState([0])

    useEffect(() => {
        axios(`/resource-tag`)
        .then( tags => setCheckboxes(tags.data.map(post => ({id: post.id, name: post.name, checked: false}))))
    }, [])

    const handleCheckboxChange = (event, id) => {
        // Update checkbox checked state
        setCheckboxes(checkboxes.map(item => item.id === id ? {...item, checked: event.target.checked} : item ));
        // Update params state
        if (event.target.checked) {
            setParams(prevState => ({
                ...prevState,
                'resource-tag': [...prevState['resource-tag'], id]}))
        }
        else {
            setParams(prevState => ({
                ...prevState,
                'resource-tag': prevState['resource-tag'].filter(tag => tag !== id)
            }))
        }
    }

    return  <>
                <Typography variant='h3'>Categories</Typography>
                <Typography>Select the category you would like to display</Typography>
                <FormGroup
                    id={`CategoryChoice`}
                    name={`CategoryChoice`}
                    value={params['resource-tag']}
                    row
                    >
                    {checkboxes.map((tag) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={params['resource-tag']?.includes(tag.id)}
                                    onChange={(event) => handleCheckboxChange(event, tag.id)}
                                    value={tag.id}
                                />
                            }
                            label={tag.name}
                            key={tag.id}
                            value={tag.id}
                        />
                    ))}
                </FormGroup>
            </> 
}

export default ResourceTags;