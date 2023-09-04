import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import ResourceList from '../components/ResourceList';
import { FormGroup, Typography, Grid, Radio, RadioGroup, FormControlLabel, Checkbox, TextField } from '@ellucian/react-design-system/core';
import { useUserInfo, usePageControl } from '@ellucian/experience-extension-utils';
import axios from 'axios';

const styles = () => ({})
const Resources = () => {
    const { setLoadingStatus } = usePageControl()
    const {roles} = useUserInfo()
    const [params, setParams] = useState({
        'resource-tag': [],
        'department': '',
        'user-group': [],
        'orderby': 'title',
        'order': 'asc',
        'per_page': 100,
        '_fields': 'id,acf,title.rendered'
    });
    const [departments, setDepartments] = useState()
    const [resources, setResources] = useState([])
    const [checkboxes, setCheckboxes] = useState([0])
    const [search, setSearch] = useState('')
    const [popper, setPopper] = useState({anchorEl: null, open: false, index: null})
    const url = process.env.WORDPRESS_URL + `/wp-json/wp/v2`;
    const compareGroups = (groups) => {
        const ids = []
        groups.forEach(item => {
            if (roles.includes(item.name)) {
                ids.push(item.id)
            }
        });
        setParams({...params, 'user-group': ids})
    }
    const handleCheckboxChange = (event, id) => {
        // Update checkbox checked state
        setCheckboxes(checkboxes.map(item =>
          item.id === id ? {...item, checked: event.target.checked} : item
        ));
        // Update params state
        if(event.target.checked) {
          setParams(prevState => ({...prevState, 'resource-tag': [...prevState['resource-tag'], id]}));
        } else {
          setParams(prevState => ({...prevState, 'resource-tag': prevState['resource-tag'].filter(tag => tag !== id)}));
        }
    }
    useEffect(() => {
        axios.get(url + '/user-group')
        .then(response => {compareGroups(response.data)})
        axios.get(url + `/department?per_page=100`)
        .then(response => {setDepartments(response.data)})
        axios.get(url + `/resource-tag?per_page=100`)
        .then(response => {setCheckboxes(response.data.map(post => ({id: post.id, name: post.name, checked: false})))})
    }, [])
    useEffect(async () => {
        setLoadingStatus(true);
        if (search.length > 0 && search !== '') {
            axios.get(url + `/resources?search=${search}&per_page=100&_fields=id,acf.resource_url,title.rendered&user-group=${params['user-group']}`)
            .then(response => {setResources(response.data)})
        } else {
            if (params.department == 0) {delete params.department}
            const resources = []
            await axios.get(url + `/resources`, {params: params})
            .then(async response => {
                resources.push(...response.data)
                if (resources.length == 100) {
                    await axios.get(url +'/resources', {params: {...params, page: 2}})
                    .then(response => {
                        resources.push(...response.data)
                    })
                }
            })
            setResources(resources)
        }
        setLoadingStatus(false);
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

export default withStyles(styles)(Resources);