import PropTypes from 'prop-types';
import React, { useState } from 'react';
import moment from 'moment';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { Button, Typography, Dropdown, DropdownItem, Grid } from '@ellucian/react-design-system/core';
import { ChevronRight, ClipboardList } from '@ellucian/ds-icons/lib';
import Directory from "../components/Directory";
import Blog from "../components/Blog.jsx";
import FilteredForms from "../components/FilteredForms.jsx";
import { useCardInfo } from '@ellucian/experience-extension-utils';

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
        zIndex: 2,
        height: '100%',
        padding: 20,
        overflow: 'auto'
    },
    input: {
        marginTop: spacing40,
        marginBottom: spacing40
    }
})
// Component for the summary of the department

const Summary = ({ sumText, smURL, showMore, textColor }) => {
    return (
        <Grid>
            <Typography variant="h4" style={{color:textColor}}>{sumText}</Typography>
            {showMore && <Button href={smURL} style={{marginTop:20}}>Visit Site</Button> }
        </Grid>
    )
}
// Component for the contact info of the department

const Contact = ({ contactEmail, contactPhone, startTime, endTime, buildText, textColor }) => {
    const start = moment(startTime, "HH:mm").format("h:mm A");
    const end = moment(endTime, "HH:mm").format("h:mm A");

    return (
        <Grid>
            <Typography variant="h4" style={{color:textColor}}>Phone: {contactPhone}</Typography>
            <Typography variant="h4" style={{color:textColor}}>Email: {contactEmail}</Typography>
            <Typography variant="h4" style={{color:textColor}}>Building: {buildText}</Typography>
            {startTime && endTime && <Typography variant="h4" style={{color:textColor}}>{start} - {end}</Typography>}
        </Grid>
    )
}
const DepartmentTemplateCard = ({ classes }) => {
    // get config info and destruct into variables
    const { configuration: { customConfiguration }} = useCardInfo();
    const { features, sumText, blogEmail, formList, smURL, imageInfo, startTime, endTime, contactPhone, contactEmail, buildText } = customConfiguration ? customConfiguration : {};
    const {contact, showMore, forms, blog, directory} = features ? features : {};
    const [value, setValue] = useState('Summary');
    const textColor = imageInfo?.url ? 'white' : 'black'
    const imageSet = imageInfo?.url !== undefined
    const handleChange = event => {setValue(event.target.value)}
    console.log(customConfiguration)
    return (
        <Grid className={classes.card}>
            {
            // if image is set, display it as the background of a div with a gradient overlay
            imageSet &&
            <div
                className={classes.cardBackground}
                style={{ backgroundImage:
                `linear-gradient(
                rgba(0, 0, 0, 0.6), 
                rgba(0, 0, 0, 0.4)
                ), url(${imageInfo.url})` }}>
            </div>}
            <Grid className={classes.cardContent}>
                <Dropdown
                    label="Organization Information"
                    onChange={handleChange}
                    className={classes.input}
                    value={value}
                    >
                        <DropdownItem id={`Summary`} label="Summary" value="Summary" RightIconComponent= { <ChevronRight /> } />
                        {contact ? <DropdownItem id={`Contact`} label="Contact" value="Contact" RightIconComponent= { <ChevronRight /> } /> : null}
                        {directory ? <DropdownItem id={`Directory`} label="Directory" value="Directory" RightIconComponent= { <ChevronRight /> } /> : null }
                        {blog ? <DropdownItem id={`Blog`} label="Blog" value="Blog" RightIconComponent= { <ChevronRight /> } /> : null }
                        {forms ? <DropdownItem id={`Forms`} label="Forms" value="Forms" RightIconComponent= { <ClipboardList /> } /> : null }
                </Dropdown>
                {value == "Summary" && <Summary sumText={sumText} showMore={showMore} smURL={smURL} textColor={textColor}/>}
                {value == "Directory" && <Directory /> }
                {value == "Blog" && <Blog blogEmail={blogEmail} /> }
                {value == "Forms" && <FilteredForms formList={formList} /> }
                {value == "Contact" && <Contact
                    startTime={startTime}
                    textColor={textColor}
                    endTime={endTime}
                    contactPhone={contactPhone}
                    contactEmail={contactEmail}
                    buildText={buildText} /> }
            </Grid>
        </Grid>
    );
};
DepartmentTemplateCard.propTypes = {
    classes: PropTypes.object.isRequired
};

Summary.propTypes = {
    sumText: PropTypes.string,
    smURL: PropTypes.string,
    showMore: PropTypes.bool,
    textColor: PropTypes.string
}

Contact.propTypes = {
    contactEmail: PropTypes.string.isRequired,
    contactPhone: PropTypes.string.isRequired,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    buildText: PropTypes.string,
    textColor: PropTypes.string
}

export default withStyles(styles)(DepartmentTemplateCard);