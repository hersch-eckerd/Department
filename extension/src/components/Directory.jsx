import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Typography } from '@ellucian/react-design-system/core';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import {  useData } from '@ellucian/experience-extension-utils';
import PropTypes from 'prop-types';
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

    useEffect(() => {
      async function fetchJwtAndData() {
        const newJwt = await getExtensionJwt();
        setJwt(newJwt);

        if(newJwt) {
          const response = await fetch('http://localhost:3000/api/directory', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newJwt}`,
              'Content-Type': 'application/json'
            }
          });

          if(response.ok) {
            const data = await response.json();
            setServerResponse(data);
          } else {
            console.error('Failed to fetch data from server');
          }
        }
      }

      fetchJwtAndData();
    }, [getExtensionJwt, dirCode, apiKey]);

    return (
      <div>
        <h1>Your Component</h1>
        {jwt && <p>Your JWT: {jwt}</p>}
        {serverResponse && <p>Your data: {JSON.stringify(serverResponse)}</p>}
      </div>
    );
  }

Directory.propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
};
export default withStyles(styles)(Directory);