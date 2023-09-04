import React from 'react';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Popper, ListItemText, IconButton, Grid } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import {Icon} from '@ellucian/ds-icons/lib';
const styles = () => ({
  form: {
    height: '50px',
    marginLeft: '10px'
  },
  icon: {
    marginRight: '20px'
  }
});
function Form({form, index, popper, setPopper, classes}) {
  // functions handle description popper from parent
  const handleOpen = (event, index) => {
    setPopper({anchorEl: event.currentTarget, open: true, index: index})
  }
  const handleClose = () => {
    setPopper({anchorEl: null, open: false, index: null})
  }

  // return the form and the description popper, if description is present
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center" className={classes.form}>
      <ListItemText primary={form.label} />
        {form.description &&
        <>
          <IconButton
            onMouseEnter={(e) => handleOpen(e, index)}
            onMouseLeave={handleClose}
            className={classes.icon}
          >
            <Icon name="help" />
          </IconButton>
          {popper.open && popper.index === index &&
            <Popper
              open={true}
              anchorEl={popper.anchorEl}
              placement="bottom-start"
              text={form.description}
            >
            </Popper>
          }
        </>
      }
    </Grid>
  )
}

Form.propTypes = {
  form: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  popper: PropTypes.object.isRequired,
  setPopper: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Form)