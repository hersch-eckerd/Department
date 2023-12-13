import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Typography } from '@ellucian/react-design-system/core';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import {  useData } from '@ellucian/experience-extension-utils';
import PropTypes from 'prop-types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const styles = () => ({
});

function Directory({config}) {
    // State for the JWT and response from the server.
    const { dirCode, apiKey } = config.server;
    const [jwt, setJwt] = useState(null);
    const [serverResponse, setServerResponse] = useState(null);

    // Assuming useData is a custom hook that returns an object
    // with the getExtensionJwt function.
    const { getExtensionJwt } = useData();

    useEffect(async () => {
      const newJwt = await getExtensionJwt()
      const headers = {
        'Authorization': `Bearer ${newJwt}`,
        'Content-Type': 'application/json'
      }
      axios('http://localhost:3000/api/jitbit-auth', headers)
        .then(response => {console.log(response)})
        .catch(error => {console.log(error)});
    }, []);

    return (
      <>
        <h1>Your Component</h1>
        {jwt && <p>Your JWT: {jwt}</p>}
        {serverResponse && <p>Your data: {JSON.stringify(serverResponse)}</p>}
      </>
    );
  }

Directory.propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
};
export default withStyles(styles)(Directory);