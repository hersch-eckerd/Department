import React from 'react'
import { Popper, IconButton } from '@ellucian/react-design-system/core'
import {Icon} from '@ellucian/ds-icons/lib';
import PropTypes from 'prop-types'

const ResourceDesc = ({index, description, setPopper, popper}) => {
    const handleOpen = (event, index) => {setPopper({anchorEl: event.currentTarget, open: true, index: index})}
    const handleClose = () => {setPopper({anchorEl: null, open: false, index: null})}
    return  <IconButton
                onMouseEnter={(e) => handleOpen(e, index)}
                onMouseLeave={handleClose}
                style={{marginRight: '20px'}}
                color='gray'
            >
                <Icon name="help" />
                {popper.open && popper.index === index &&
                <Popper
                    open={true}
                    anchorEl={popper.anchorEl}
                    placement="bottom-start"
                    text={description}
                />
                }
            </IconButton>
}
ResourceDesc.propTypes = {
    index: PropTypes.number,
    description: PropTypes.string,
    setPopper: PropTypes.func,
    popper: PropTypes.object,
    classes: PropTypes.object
}

export default (ResourceDesc)