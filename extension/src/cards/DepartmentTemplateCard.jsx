import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import ResourceList from '../components/ResourceList';
import { Button, Typography, Grid, Dropdown, DropdownItem } from '@ellucian/react-design-system/core';
import { ChevronRight, ClipboardList } from '@ellucian/ds-icons/lib';
import { useCardInfo, useUserInfo, useCardControl } from '@ellucian/experience-extension-utils';
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
const Summary = (department) => {
    const {acf, description} = department.department;
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
    console.log(contactInfo)
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
    const { configuration: { customConfiguration }} = useCardInfo();
    const department = customConfiguration?.department;
    const {setLoadingStatus} = useCardControl();
    // set up parameters for the api call
    const params = {
        'user-group': [],
        'department': department?.id,
        'orderby': 'title',
        'order': 'asc',
        'per_page': 100,
        '_fields': 'id,acf.resource_url,title.rendered'
    };
    const {roles} = useUserInfo();
    // const [popper, setPopper] = useState({anchorEl: null, open: false, index: null})
    const [resources, setResources] = useState();
    const [backgroundURL, setBackgroundURL] = useState();
    const [value, setValue] = useState('Summary');
    const url = process.env.WORDPRESS_URL + `/wp-json/wp/v2`;
    const features = ['Summary', 'Resources', 'Contact']
    const compareGroups = (groups) => {
        const ids = []
        groups.forEach(item => {
            if (roles.includes(item.name)) {
                ids.push(item.id)
            }
        });
        params['user-group'] = ids
    }
    useEffect(async () => {
        await axios.get(url + '/media/' + department.acf.featuredImage)
        .then(response => {setBackgroundURL(response.data.media_details.sizes.medium.source_url)})
    }, [])
    useEffect(() => {
        axios.get(url + '/user-group')
        .then(response => {compareGroups(response.data)})
        .then(async () => {
            const response = await axios.get(url + `/resources`, {params})
            setResources(response.data)
            setLoadingStatus(false)
        })
    }, [])
    return (
        <Grid className={classes.card}>
            <div
                className={classes.cardBackground}
                style={{ backgroundImage:
                `linear-gradient(
                rgba(0, 0, 0, 0.6), 
                rgba(0, 0, 0, 0.4)
                ), url(${backgroundURL})` }}>
            </div>
            <div className={classes.cardContent}>
                <Dropdown
                    label="Department Information"
                    onChange={(e) => setValue(e.target.value)}
                    className={classes.dropDown}
                    value={value}
                    >
                        {features.map((item) => {return (
                            <DropdownItem
                                key={item}
                                id={item}
                                label={item}
                                value={item}
                                RightIconComponent= { <ChevronRight /> } />
                            )})}
                </Dropdown>
                {value == 'Summary' && <Summary department={department} />}
                {value == 'Resources' && <ResourceList resources={resources} fontColor={'white'} />}
                {value == 'Contact' && <Contact
                contactInfo={department.acf}
                textColor={'white'} />}
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