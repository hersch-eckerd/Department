import React from 'react'
import { useState } from 'react'
import { List, ListItem, Popper, Typography, TextLink, IconButton } from '@ellucian/react-design-system/core'
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
    return <>
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
const ResourceList = ({ resources, classes, fontColor }) => {
    const [popper, setPopper] = useState({anchorEl: null, open: false, index: null})
    const color = fontColor ?? 'default'
    switch (resources) {
        case undefined:
            return <Typography color="textSecondary">Loading...</Typography>
        case 0:
            return <Typography color="textSecondary">No resources found.</Typography>
        default:
            return (
                <List className={classes.resourceList} id="ResourceList">
                    <Typography variant='h3' color={color}>Resources</Typography>
                    {resources.map((resource, index) => (
                        <ListItem button component="a" className={classes.resourceItem} href={resource.acf.resource_url} key={resource.title.rendered} divider>
                            <Typography style={{'color':color}} >
                                {resource.title.rendered}
                            </Typography>
                            {resource.acf.resource_description &&
                            <ResourceDesc
                                index={index}
                                description={resource.acf.resource_description}
                                popper={popper}
                                setPopper={setPopper}
                                classes={classes} /> }
                        </ListItem>
                    ))}
                </List>
            )
    }
}

ResourceList.propTypes = {
    classes: PropTypes.object,
    resources: PropTypes.array,
    fontColor: PropTypes.string
}
ResourceDesc.propTypes = {
    index: PropTypes.number,
    description: PropTypes.string,
    setPopper: PropTypes.func,
    popper: PropTypes.object,
    classes: PropTypes.object
}
export default withStyles(styles)(ResourceList)