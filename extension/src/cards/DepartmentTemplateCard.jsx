import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import ResourceList from '../components/ResourceList';
import { Button, Typography, Grid, Dropdown, DropdownItem } from '@ellucian/react-design-system/core';
import { ChevronRight, ClipboardList } from '@ellucian/ds-icons/lib';
import Blog from '../components/Blog';
import { useCardInfo, useUserInfo } from '@ellucian/experience-extension-utils';
import axios from 'axios';

const styles = () => ({
    card: {
        position: 'relative',
        height: '100%',
        overflow: 'hidden'
    },
    cardBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
        // backgroundAttachment: 'fixed'
        },
    cardContent: {
        position: 'relative',
        height: '100%',
        zIndex: 2,
        width: '100%',
        overflow: 'auto',
        padding: 20
    },
    wrapper: {
        paddingLeft: 20,
        paddingRight: 20
    },
    dropDown: {
        marginBottom: 20,
        marginTop: 20
    }
})
const Summary = ({department}) => {
    const {acf, description} = department;
    const URL = acf.websiteHomepage
    return (
        <>
            <Typography variant="h4" color='white' >{description}</Typography>
            <Button href={URL} style={{ marginTop:20 }}>Visit Site</Button>
        </>
    )
}
// Component for the contact info of the department

const Contact = ({contactInfo, textColor}) => {
    const { email, phone, hoursOpen, hoursClosed, building, personName, personTitle, websiteHomepage } = contactInfo;
    const start = moment(hoursOpen, "HH:mm").format("h:mm A");
    const end = moment(hoursClosed, "HH:mm").format("h:mm A");
    return (
        <Grid>
            {phone && <Typography variant="h4" style={{color:textColor}}>Phone: {phone}</Typography>}
            {email && <Typography variant="h4" style={{color:textColor}}>Email: {email}</Typography>}
            {building && <Typography variant="h4" style={{color:textColor}}>Location: {building}</Typography>}
            {personName && <Typography variant="h4" style={{color:textColor}}>{personName}</Typography>}
            {personTitle && <Typography variant="h4" style={{color:textColor}}>{personTitle}</Typography>}
            {hoursOpen && hoursClosed && <Typography variant="h4" style={{color:textColor}}>{start} - {end}</Typography>}
            {<Button href={websiteHomepage} style={{ marginTop:20 }}>Visit Site</Button>}
        </Grid>
    )
}
const DepartmentTemplateCard = ({ classes }) => {
    // get config info and destruct into variables
    const { configuration: { customConfiguration }} = useCardInfo()
    const {roles} = useUserInfo();
    const [resources, setResources] = useState();
    const [backgroundURL, setBackgroundURL] = useState();
    const [value, setValue] = useState('Resources');
    const {department, category} = customConfiguration;
    // set up parameters for the api call

    const features = ['Summary', 'Resources', 'Contact', 'Blog']
    const url = process.env.WORDPRESS_URL + `wp-json/wp/v2`
    axios.defaults.baseURL = url;
    axios.defaults.params = {
        'order': 'asc',
        'per_page': 100
    }
    const fetchResources = async (groups) => {
        const params = {
            'user-group': groups,
            'department': department?.id,
            'orderby': 'title',
            '_fields': 'id,acf,title.rendered'
        };
        const response = await axios(`/resources`, { params });
        if (response.data.length === 100) {
            const nextResponse = await axios(`/resources`, { params: {...params, 'page': 2} });
            response.data = response.data.concat(nextResponse.data);
        }
        setResources(response.data)
    }

    useEffect(() => {
        axios.all([axios(`/user-group`), axios(`/media/`+ department.acf.featuredImage)])
        .then(axios.spread((groups, image) => {
            setBackgroundURL(image.data.media_details.sizes.medium.source_url)
            return groups.data.filter(group => roles.includes(group.name)).map(group => group.id)
            }
        ))
        .then(groups => {fetchResources(groups)})
    }, [roles])

    return (
        <Grid className={classes.card}>
            <div
                className={classes.cardBackground}
                style={{
                    backgroundImage:
                        `linear-gradient(
                        rgba(0, 0, 0, 0.6),
                        rgba(0, 0, 0, 0.4)
                        ), url(${backgroundURL})`
                    }}>
            </div>
            <div className={classes.cardContent}>
                <Dropdown
                    label="Department Information"
                    onChange={(e) => setValue(e.target.value)}
                    className={classes.dropDown}
                    value={value} >
                    {features.map((item) =>
                        <DropdownItem
                            key={item}
                            id={item}
                            label={item}
                            value={item}
                            RightIconComponent= { <ChevronRight /> }
                        />
                    )}
                </Dropdown>
                {value == 'Summary' && <Summary department={department} />}
                {value == 'Resources' && <ResourceList resources={resources} fontColor={'white'} />}
                {value == 'Blog' && <Blog category={category} />}
                {value == 'Contact' && <Contact contactInfo={department.acf} textColor={'white'} />}
            </div>
        </Grid>
    )
}
DepartmentTemplateCard.propTypes = {
    classes: PropTypes.object.isRequired
};

Summary.propTypes = {
    description: PropTypes.string,
    acf: PropTypes.object,
    textColor: PropTypes.string,
    department: PropTypes.object
}

Contact.propTypes = {
    contactInfo: PropTypes.object,
    textColor: PropTypes.string
}
ResourceList.propTypes = {
    classes: PropTypes.object.isRequired,
    resources: PropTypes.array.isRequired
}

export default withStyles(styles)(DepartmentTemplateCard);