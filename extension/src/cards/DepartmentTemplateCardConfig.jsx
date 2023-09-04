import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { TextField, Typography, TimePicker, Grid, Radio, RadioGroup, TextLink, FormControlLabel, Checkbox } from '@ellucian/react-design-system/core';
import Directory from '../components/Directory.jsx';
import Features from '../components/Config/Features.jsx';
import Image from '../components/Config/Image.jsx';
import axios from 'axios';
const styles = () => ({
    input: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20
    }
});
const DepartmentTemplateCardConfig = ({cardControl:{setCustomConfiguration, setIsCustomConfigurationValid}, cardInfo: {configuration: {customConfiguration}}, classes}) => {
    const [config, setConfig] = useState(customConfiguration ? customConfiguration : {
        client: {
            features: {
                showMore: false,
                blog: false,
                directory: false,
                forms: false,
                image: false,
                contact: false
            },
            department: '',
            resourceTags: [],
            sumText: '',
            buildText: '',
            blogEmail: '',
            contactEmail: '',
            smURL: '',
            lambdaURL: '',
            imageInfo: {},
            formList: [],
            startTime: '',
            endTime: '',
            contactPhone: ''
        },
        server: {
            dirCode: '',
            apiKey: ''
        }
    })
    const { sumText, department, blogEmail, smURL, lambdaURL, startTime, endTime, contactEmail, contactPhone, buildText} = config.client;
    const { showMore, blog, directory, forms, image, contact } = config.client.features;
    const { apiKey, dirCode } = config.server;
    const [departments, setDepartments] = useState([])
    const [resources, setResources] = useState([])
    const url = process.env.WORDPRESS_URL + `/wp-json/wp/v2`;
    useEffect(() => {
        axios.get(url + `/department?per_page=100`)
        .then(response => {setDepartments(response.data); console.log(response.data)})
    }, [])
    useEffect(() => {
        setCustomConfiguration({
            ...config,
            customConfiguration: config
        })
    }, [config])
    useEffect(() => {
        if (department?.id) {
            const departmentId = Number(department.id)
            axios.get(url + `/resources?&per_page=100&orderby=title&order=asc&department=${departmentId}`)
            .then(response => {setResources(response.data)})
        }
    }, [department])

    const handleChange = (tabLabel, e, type) => {
        const value = JSON.parse(e.target.value);
        const configType = type === "client" ? config.client : config.server;
        setConfig({
            ...config,
            [type]: {
                ...configType,
                [tabLabel]: value
            }
        })
    }
    const handleTime = (name, value) => {
        setConfig({
            ...config,
            client: {
                ...config.client,
                [name]: value
            }
        })
    }
    const handleBlur = e => {
        setIsCustomConfigurationValid(e.target.value !== '');
    }

    return (
        <Grid className={classes.card} direction="column" justifyContent="space-between" alignItems="flex-start">
            <Grid direction="column" justifyContent="space-evenly" alignItems="flex-start" >
                {departments.length > 0 && <>
                    <Typography variant='h3'>Department</Typography>
                    <Typography>Select the department you would like to display</Typography>
                    <RadioGroup
                        id={`DepartmentsChoice`}
                        name={`DepartmentsChoice`}
                        value={JSON.stringify(department)}
                        onChange={(e) => handleChange("department", e, "client")}
                        required
                        row
                        >
                        {departments.map((department, index) => (
                            <FormControlLabel
                                control={ <Radio/> }
                                label={department.name}
                                key={index}
                                value={JSON.stringify(department)}/>
                        ))}
                    </RadioGroup>
                </>}
                {resources.length > 0 && <>
                    <Typography variant='h3'>Resources</Typography>
                    {resources.map((resource) => (
                        <Typography key={resource.id}>
                            <TextLink href={resource.acf.resource_url}>
                                {resource.title.rendered}
                            </TextLink>
                        </Typography>
                    ))}
                </>}
                {contact == true && <>
                    <Typography variant='h3'>Contact Info</Typography>
                    <Typography>Provide contact information for your organization</Typography>
                    <TextField
                        label="Email"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("contactEmail", e, "client")}
                        value={contactEmail}
                    />
                    <TextField
                        label="Phone Number"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("contactPhone", e, "client")}
                        value={contactPhone}
                    />
                    <TextField
                        label="Building"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("buildText", e, "client")}
                        value={buildText}
                    />
                    <TimePicker
                        className={classes.input}
                        label="Start Time"
                        onChange={(e) => handleTime("startTime", e)}
                        helperText="From when is your office available?"
                        value={startTime}
                    />
                    <TimePicker
                        className={classes.input}
                        label="End Time"
                        onChange={(e) => handleTime("endTime", e)}
                        helperText="Until when is your office available?"
                        value={endTime}
                    />
                </>}
                {showMore == true && <>
                    <Typography variant='h3'>Home Website Link</Typography>
                    <Typography>Add a link to display beneath the summary of your organization</Typography>
                    <TextField
                        label= "Home Website Link"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("smURL", e, "client")}
                        placeholder="https://www.eckerd.edu"
                        value={smURL}
                    />
                </>}
                {directory == true && <>
                    <Typography variant='h3'>Directory</Typography>
                    <Typography>Display a directory of the people in your organization. Enter the Lambda function URL, the Banner from crosswalk-validation, and the API token from Ethos Integration</Typography>
                    <TextField
                        label= "AWS Lambda URL"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("lambdaURL", e, "client")}
                        placeholder="localhost:3000"
                        value={lambdaURL}
                    />
                    <TextField
                        label= "Banner Code from crosswalk-rules to sync groups with"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("dirCode", e, "server")}
                        placeholder="HR-FULL-TIME"
                        value={dirCode}
                    />
                    <TextField
                        label= "API Key to get token for directory"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("apiKey", e, "server")}
                        placeholder="21345"
                        value={apiKey}
                    />
                </>}
                {blog == true && <>
                    <Typography variant='h3'>Blog</Typography>
                    <Typography>Enter the email of the user from myEckerd that you would like to display blog posts from</Typography>
                    <TextField
                        label= "Email to pull blog posts from"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("blogEmail", e, "client")}
                        placeholder="test@eckerd.edu"
                        value={blogEmail}
                    />
                </>}
                {image == true && <Image setConfig={setConfig} config={config} />}
                {directory == true && <Directory config={config} />}
            </Grid>
        </Grid>
    );
};
DepartmentTemplateCardConfig.propTypes = {
    cardControl: PropTypes.object,
    cardInfo: PropTypes.object,
    classes: PropTypes.object
};
export default withStyles(styles)(DepartmentTemplateCardConfig);