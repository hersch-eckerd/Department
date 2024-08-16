import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Typography,  Grid } from '@ellucian/react-design-system/core';
import Resources from '../Resources.jsx';
import {Features, DeptConfig, BlogConfig} from './index.js';
import axios from 'axios';
const styles = () => ({
    input: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20
    }
});

const TemplateConfig = ({cardControl:{setCustomConfiguration}, cardInfo: {configuration: {customConfiguration}}, classes}) => {
    const [departments, setDepartments] = useState([])
    const [resources, setResources] = useState([])
    const [categories, setCategories] = useState([])
    const [config, setConfig] = useState(customConfiguration ? customConfiguration : {
        client: {
            features: {
                blog: false,
                summary: false,
                resources: false,
                contact: false
            },
            department: '',
            category: []
        }
    })
    const { department} = config.client;
    const url = process.env.WORDPRESS_URL + `wp-json/wp/v2`
    axios.defaults.baseURL = url;
    axios.defaults.params = {
        'order': 'asc',
        'per_page': 100
    }

    useEffect( () => {
        axios.all([axios(`/department`), axios(`/categories`)])
        .then(axios.spread((departments, categories) => {
            setDepartments(departments.data)
            setCategories(categories.data)
        }))
    }, [])
    useEffect(() => {fetchResources()}, [department])
    useEffect(() => {setCustomConfiguration({customConfiguration: config})}, [config])

    const fetchResources = async () => {
        const response = await axios(`/resources`, { params: {
            'department': department.id,
            'orderby': 'title'
        }});
        if (response.data.length === 100) {
            const nextResponse = await axios(`/resources`, { params: { 'page': 2} });
            response.data = response.data.concat(nextResponse.data);
        }
        setResources(response.data);
    }
    const handleCheckbox = (id) => {
        const blogIds = config.client.category ?? [0];
        const newCategories = blogIds.includes(id) ? blogIds.filter(item => item !== id) : [...blogIds, id];
        setConfig({ ...config,
            'client': {
                ...config.client,
                'category': newCategories
            }})
    }
    const handleChange = (e) => {
        const selectedDepartment = departments.find(dept => dept.id == e.target.value);
        setConfig(prevConfig => ({
            ...prevConfig,
            client: {
                ...prevConfig.client,
                department: selectedDepartment || ''
            }
        }));
    };
    return  <Grid className={classes.card} direction="column" justifyContent="space-between" alignItems="flex-start">
                <Typography variant='h3'>Features</Typography>
                <Typography>Select the features you would like to display on the department card</Typography>
                <Features
                    config={config}
                    setConfig={setConfig}
                    classes={classes} />
                {departments.length > 0 && <DeptConfig handleChange={handleChange} deptList={departments} department={department} /> }
                {config.client.features.blog && categories.length > 0 && <BlogConfig handleCheckbox={handleCheckbox} categories={categories} config={config} /> }
                {resources.length > 0 &&
                    <Resources
                        resources={resources}
                        classes={classes}
                        fontColor={'black'} />
                    }
            </Grid>
};
TemplateConfig.propTypes = {
    cardControl: PropTypes.object,
    cardInfo: PropTypes.object,
    classes: PropTypes.object
};

export default withStyles(styles)(TemplateConfig

);