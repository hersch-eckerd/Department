import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';

const styles = () => ({
    cardBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
        // backgroundAttachment: 'fixed'
        }
})

const Background = ({ classes, backgroundURL }) => {
    return  <div
                className={classes.cardBackground}
                style={{
                    backgroundImage:
                        `linear-gradient(
                        rgba(0, 0, 0, 0.6),
                        rgba(0, 0, 0, 0.4)
                        ), url(${backgroundURL})`
                    }}>
            </div>
}


Background.propTypes = {
    classes: PropTypes.object.isRequired,
    backgroundURL: PropTypes.string.isRequired
};

export default withStyles(styles)(Background);