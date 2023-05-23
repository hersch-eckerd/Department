import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Typography } from '@ellucian/react-design-system/core';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import {  useData } from '@ellucian/experience-extension-utils';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const styles = () => ({
});

const Directory = ( ) => {
    const { getExtensionJwt } = useData();
    const [data, setData] = useState(null);
    const fetchData = async () => {
        try {
            const jwt = await getExtensionJwt();
            const response = await axios.get('http://localhost:3000/api/directory', {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }
    return ( "Directory")
}

Directory.propTypes = {
    classes: PropTypes.object.isRequired,
    dirCode: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired
};
export default withStyles(styles)(Directory);