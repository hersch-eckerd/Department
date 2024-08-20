import React, {useEffect, useState} from 'react';
import Resources from '../components/Resources';
import { Typography, Grid, Radio, RadioGroup, FormControlLabel, TextField } from '@ellucian/react-design-system/core';
import { useUserInfo } from '@ellucian/experience-extension-utils';
import axios from 'axios';

const ResourcesPage = () => {
    const {roles} = useUserInfo()
    const [resources, setResources] = useState([])
    const [search, setSearch] = useState('')
    const [departments, setDepartments] = useState()
    axios.defaults.baseURL = process.env.WORDPRESS_URL + `wp-json/wp/v2`;
    axios.defaults.params = {
        'per_page': 100,
        'order': 'asc'
    }
    const [params, setParams] = useState({
        '_fields': 'id,acf,title.rendered',
        'orderby': 'title',
        ...(search && {search})
    })

    const handleDeptChange = (event) => {
        if (event.target.value === '') {
            const {department, ...rest} = params
            setParams(rest)
         }
        else {setParams({...params, 'department': event.target.value})}
    }

    const fetchResources = async () => {
        const response = await axios(`/resources`, { params });
        if (response.data.length === 100) {
            const nextResponse = await axios(`/resources`, {params: {...params, 'page': 2} });
            response.data = response.data.concat(nextResponse.data);
        }
        setResources(response.data)
    }

    useEffect(() => {
        axios.all([axios('/user-group'), axios(`/department`)])
        .then(axios.spread((groups, departments) => {
            setDepartments(departments.data)
            setParams({...params, 'user-group': groups.data.filter(group => roles.includes(group.name)).map(group => group.id)})
        }))
        .then(() => {fetchResources()})
    }, [])
    useEffect( () => {fetchResources()}, [search, params])

    return  <Grid>
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
                        onChange={(e) => handleDeptChange(e)}
                        row
                        >
                        <FormControlLabel
                            control={ <Radio/> }
                            label='All'
                            key='all'
                            value={''} />
                        {departments.map((department, index) => (
                            <FormControlLabel
                                control={ <Radio/> }
                                label={department.name}
                                key={index}
                                value={department.id} />
                        ))}
                    </RadioGroup>
                </>}
                <Resources resources={resources} />
            </Grid>
}

export default (ResourcesPage);