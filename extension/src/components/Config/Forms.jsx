import React, {useState} from 'react';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Button, Chip, TextField, List, FormControl, FormControlLabel, FormLabel, FormGroup, Checkbox, ListItem, Grid, Typography } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import Form from '../Form.jsx';
const styles = () => ({
    forms: {
      paddingTop: 20,
      paddingBottom: 20
    },
    form: {
      paddingLeft: 20,
      paddingRight: 20,
      marginTop: 20,
      marginBottom: 20,
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    input: {
      marginTop: 20,
      marginBottom: 20,
      marginRight:20
    },
    icon: {
      margin: 10
    },
    chip: {
      margin: 5
    }
});
function Roles({roleList, setNewForm, newForm}) {

  const handleRole = name => event => {
    setNewForm({...newForm, roles: {...newForm.roles, [name]: event.target.checked}})
    if (name == 'all') {
      const reset = roleList.reduce((obj, roleName) => ({...obj, [roleName]: false}), {})
      setNewForm({...newForm, roles: {...newForm.roles, ...reset, all: event.target.checked}})
    }
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Display form to following roles:</FormLabel>
      <FormGroup row={true}>
        <FormControlLabel
          key='all'
          control={
            <Checkbox
              checked={newForm.roles.all}
              onChange={handleRole('all')}
              value={newForm.roles.all}
              />
            }
          label='all'
        />
        {roleList.filter(roleName => roleName !== 'all').map((roleName, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={newForm.roles.all ? false : newForm.roles[roleName]}
                disabled={newForm.roles.all}
                onChange={handleRole(roleName)}
                value={newForm.roles.all ? false : newForm.roles[roleName]}
                />
              }
            label={roleName}
          />
        ))}
      </FormGroup>
    </FormControl>
  )
}
function Forms({config, setConfig, classes}) {
  const { formList } = config.client
  // hard coded list of roles for now, until ellucian provides a way to get programatically get roles.
  const roleList = [ 'all', 'advisor', 'alumni', 'faculty-official@eckerd.edu', 'ITS Staff', 'prospectiveStudent', 'staff-official@eckerd.edu', 'employee', 'instructor', 'student', 'Eckerd Students', 'vendor'];
  // set up hover for description
  const [popper, setPopper] = useState({anchorEl: null, open: false, index: null})
  // set up form state, for each role add a false boolean to the roles object
  const [newForm, setNewForm] = useState({
    url: '',
    label: '',
    description: '',
    roles: roleList.reduce((obj, roleName) => ({...obj, [roleName]: false}), {})
  })
  const handleSubmit = () => {
    // check if form is valid
    if (newForm.url == '' || newForm.label == '') {
      return
    }
    // if there are forms already, add the new form to the list, otherwise create a new list with the new form
    if (formList.length != 0) {
      setConfig({
          ...config,
          client: {
              ...config.client,
              formList: [...config.client.formList, newForm]
          }
      })
    } else {
      setConfig({
          ...config,
          client: {
              ...config.client,
              formList: [newForm]
          }
      })
    }
    // reset the form
    setNewForm({
      url: '',
      label: '',
      description: '',
      roles: roleList.reduce((obj, roleName) => ({...obj, [roleName]: false}), {})
    })
  }
  // handle form changes
  const handleChange = (prop, value) => {
    setNewForm(prevForm => ({ ...prevForm, [prop]: value }));
  }
  // handle form edits
  const handleEdit = (index) => {
    const form = formList[index]
    setNewForm(form)
    handleDelete(index)
  }
  // handle form deletes
  const handleDelete = (index) => {
    // create a new list to avoid mutating state
    const newFormList = formList
    // remove form from list
    newFormList.splice(index, 1)
    // if there are forms left, set the new list, otherwise set the list to empty
    if (newFormList != null) {
      setConfig({
        ...config,
        client: {
          ...config.client,
          formList: newFormList
        }
      })
    } else {
      setConfig({
        ...config,
        client: {
            ...config.client,
            formList: []
        }
      })
    }
  }

  return (
    <>
      <Typography variant="h3">Add Form</Typography>
      <Grid direction="column" justifyContent="space-evenly" alignItems="flex-start" >
        <>
          <div>
            <TextField
                className={classes.input}
                value={newForm.label}
                onChange={(e) => handleChange('label', e.target.value)}
                label= "Label of Form" />
            <TextField
                className={classes.input}
                value={newForm.url}
                onChange={(e) => handleChange('url', e.target.value)}
                label= "URL of Form" />
          </div>
          <TextField
            className={classes.input}
            value={newForm.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            label= "Description of Form" />
          <Roles
            setNewForm={setNewForm}
            newForm={newForm}
            roleList={roleList} />
          <Button
            className={classes.input}
            onClick={handleSubmit} >
              Add Value
          </Button>
        </>
        { !formList || !Array.isArray(formList) || formList.length == 0
        ? <Typography color="textSecondary">
            No forms found.
          </Typography>
        : <List className={classes.forms}>
            <Typography variant="h3">List of Forms:</Typography>
            {formList.length != 0 && formList.map( (form, index) => (
              <ListItem id="Form" key={index} className={classes.form} divider>
                <Form
                  form={form}
                  index={index}
                  popper={popper}
                  setPopper={setPopper} />
                <div >
                  <Button className={classes.icon} onClick={() => handleDelete(index)}>Delete</Button>
                  <Button className={classes.icon} onClick={() => handleEdit(index)}>Edit</Button>
                </div>
                <Grid direction="row" justifyContent="flex-start" alignItems="space-between" >
                  {Object.keys(form.roles).map( (roleName, index) => (form.roles[roleName] ? <Chip className={classes.chip} key={index} label={roleName} /> : null ))}
                </Grid>
              </ListItem>
            ))}
          </List> }
      </Grid>
    </>
  )
}

Forms.propTypes = {
  config: PropTypes.object,
  setConfig: PropTypes.func,
  classes: PropTypes.object.isRequired
};

Roles.propTypes = {
  roles: PropTypes.object,
  roleList: PropTypes.array,
  setNewForm: PropTypes.func,
  newForm: PropTypes.object
};

export default withStyles(styles)(Forms)