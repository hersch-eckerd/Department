import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Typography, Grid } from '@ellucian/react-design-system/core';

const Contact = ({contactInfo, textColor}) => {
    const { email, phone, hoursOpen, hoursClosed, building, personName, personTitle, websiteHomepage } = contactInfo;
    const start = moment(hoursOpen, "HH:mm").format("h:mm A");
    const end = moment(hoursClosed, "HH:mm").format("h:mm A");
    return  <Grid>
                {phone && <Typography variant="h4" style={{color:textColor}}>Phone: {phone}</Typography>}
                {email && <Typography variant="h4" style={{color:textColor}}>Email: {email}</Typography>}
                {building && <Typography variant="h4" style={{color:textColor}}>Location: {building}</Typography>}
                {personName && <Typography variant="h4" style={{color:textColor}}>{personName}</Typography>}
                {personTitle && <Typography variant="h4" style={{color:textColor}}>{personTitle}</Typography>}
                {hoursOpen && hoursClosed && <Typography variant="h4" style={{color:textColor}}>{start} - {end}</Typography>}
                {websiteHomepage && <Button href={websiteHomepage} style={{ marginTop:20 }}>Visit Site</Button>}
            </Grid>
}

Contact.propTypes = {
    contactInfo: PropTypes.object.isRequired,
    textColor: PropTypes.string.isRequired
};

export default Contact;