import React from 'react'
import { Popper, IconButton } from '@ellucian/react-design-system/core'
import {Icon} from '@ellucian/ds-icons/lib';
import PropTypes from 'prop-types'
import { withStyles } from '@ellucian/react-design-system/core/styles'

const styles = () => ({
    icon: {
        marginRight: '20px'
    },
    resourceList: {
        backgroundColor:'transparent'
    },
    resourceItem: {
        '&:hover': {
            backgroundColor: '#b2b3b7'
        },
        padding: '5px'
    }
})

const ResourceDesc = ({index, description, setPopper, popper, classes}) => {
    const handleOpen = (event, index) => {setPopper({anchorEl: event.currentTarget, open: true, index: index})}
    const handleClose = () => {setPopper({anchorEl: null, open: false, index: null})}
    return  <>
                <IconButton
                    onMouseEnter={(e) => handleOpen(e, index)}
                    onMouseLeave={handleClose}
                    className={classes.icon}
                    color='gray'
                >
                    <Icon name="help" />
                </IconButton>
                {popper.open && popper.index === index &&
                <Popper
                    open={true}
                    anchorEl={popper.anchorEl}
                    placement="bottom-start"
                    text={description}
                />
                }
            </>
        }
ResourceDesc.propTypes = {
    index: PropTypes.number,
    description: PropTypes.string,
    setPopper: PropTypes.func,
    popper: PropTypes.object,
    classes: PropTypes.object
}

export default withStyles(styles)(ResourceDesc)