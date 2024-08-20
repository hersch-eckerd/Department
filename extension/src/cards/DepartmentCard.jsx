import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import Resources from '../components/Resources';
import { Grid} from '@ellucian/react-design-system/core';
import BlogList from '../components/BlogList';
import Summary from '../components/Summary';
import Contact from '../components/Contact';
import Background from '../components/Background';
import DeptDD from '../components/DeptDD';
import { useCardInfo, useUserInfo } from '@ellucian/experience-extension-utils';
import axios  from 'axios';

const styles = () => ({
    card: {
        position: 'relative',
        height: '100%',
        overflow: 'hidden'
    },
    cardContent: {
        position: 'relative',
        height: '100%',
        zIndex: 2,
        width: '100%',
        overflow: 'auto',
        padding: 20
    }
})

// Component for the contact info of the department

const DepartmentCard = ({ classes }) => {
    // get config info and destruct into variables
    const { configuration: { customConfiguration }} = useCardInfo()
    const [backgroundURL, setBackgroundURL] = useState();
    const [dropdownVal, setDropdownVal] = useState('Resources');
    const {department, category} = customConfiguration;

    const {roles} = useUserInfo();
    const [resources, setResources] = useState();
    const url = process.env.WORDPRESS_URL + `wp-json/wp/v2`
    axios.defaults.baseURL = url;

    const fetchResources = async (groups) => {
        const params = {
            'user-group': groups.join(','),
            'department': department?.id,
            'orderby': 'title',
            '_fields': 'id,acf,title.rendered',
            'order': 'asc',
            'per_page': 100
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
        .then(groups => fetchResources(groups))
    }, [roles])

    return  <Grid className={classes.card}>
                <Background  backgroundURL={backgroundURL} />
                <div className={classes.cardContent}>
                    <DeptDD setDropdownVal={setDropdownVal} dropdownVal={dropdownVal} />
                    {dropdownVal == 'Summary' && <Summary department={department} />}
                    {dropdownVal == 'Resources' && <Resources resources={resources} fontColor={'white'} />}
                    {dropdownVal == 'Blog' && <BlogList category={category} />}
                    {dropdownVal == 'Contact' && <Contact contactInfo={department.acf} textColor={'white'} />}
                </div>
            </Grid>
}
DepartmentCard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DepartmentCard);