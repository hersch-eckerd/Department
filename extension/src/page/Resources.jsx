import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import ResourceList from '../components/ResourceList';
import { FormGroup, Typography, Grid, Radio, RadioGroup, FormControlLabel, Checkbox, TextField } from '@ellucian/react-design-system/core';
import { useUserInfo, usePageControl } from '@ellucian/experience-extension-utils';
import axios from 'axios';

const Resources = () => {
    const {roles} = useUserInfo()
    const [resources, setResources] = useState([])
    const [search, setSearch] = useState('')
    const [departments, setDepartments] = useState()
    const [checkboxes, setCheckboxes] = useState([0])
    const [params, setParams] =useState({
        'per_page': 100,
        'order': 'asc'
    })
    const url = process.env.WORDPRESS_URL + `/wp-json/wp/v2`;
    const fetchResources = async () => {
        const response = await axios(`${url}/resources`, { params });
        if (response.data.length === 100) {
            const nextResponse = await axios.get(`${url}/resources`, { params: {...params, 'page': 2} });
            response.data = response.data.concat(nextResponse.data);
        }
        setResources(response.data)
    }

    const handleCheckboxChange = (event, id) => {
        // Update checkbox checked state
        setCheckboxes(checkboxes.map(item => item.id === id ? {...item, checked: event.target.checked} : item ));
        // Update params state
        if (event.target.checked) {setParams(prevState => ({...prevState, 'resource-tag': [...prevState['resource-tag'], id]}))}
        else { setParams(prevState => ({...prevState, 'resource-tag': prevState['resource-tag'].filter(tag => tag !== id)}))}
    }
    useEffect(() => {
        axios.all([axios(url + '/user-group'), axios(url + `/department?per_page=100`), axios(url + `/resource-tag?per_page=100`)])
        .then(axios.spread((groups, departments, tags) => {
            setDepartments(departments.data)
            setCheckboxes(tags.data.map(post => ({id: post.id, name: post.name, checked: false})))
            setParams({...params, 'user-group': groups.data.filter(group => roles.includes(group.name)).map(group => group.id)})
        }))
        .then(() => {fetchResources()})
    }, [])
    useEffect( () => {
        const params = {
            'orderby': 'title',
            '_fields': 'id,acf,title.rendered',
            'department': '',
            ...(search && {search})
        };
        fetchResources(params)
    }, [params, search])

    return (
        <Grid>
            <Typography variant = 'h4'>Use the filters below to find the resources you need.</Typography>
            <Typography variant = 'h3'>Search</Typography>
            <TextField
                label="Search"
                name="Search"
                value={search}
                onChange={(event) => {setSearch(event.target.value)}}
                />
            {departments && departments.length > 0 &&
            <>
                <Typography variant='h3'>Department</Typography>
                <Typography>Select the department you would like to display</Typography>
                <RadioGroup
                    id={`DepartmentsChoice`}
                    name={`DepartmentsChoice`}
                    value={params.department}
                    onChange={(event) => {setParams({...params, 'department': event.target.value})}}
                    row
                    >
                    <FormControlLabel
                        control={ <Radio/> }
                        label='All'
                        key='all'
                        value={0} />
                    {departments.map((department, index) => (
                        <FormControlLabel
                            control={ <Radio/> }
                            label={department.name}
                            key={index}
                            value={department.id}/>
                    ))}
                </RadioGroup>
            </>}
            {checkboxes && checkboxes.length > 0 &&
            <>
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
                                    checked={params['resource-tag'].includes(tag.id)}
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
            </>}
            <ResourceList resources={resources} />
        </Grid>
    )
}

Resources.propTypes = {
    classes: PropTypes.object
};

export default (Resources);