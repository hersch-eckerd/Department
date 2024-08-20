import React, {useEffect, useState} from 'react';
import { Typography } from '@ellucian/react-design-system/core';
import BlogCategory from './BlogCategory';
import PropTypes from 'prop-types';
import axios from 'axios';

const BlogConfig = ({config, setConfig}) => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios(`/categories`)
        .then( (response) => {setCategories(response.data) })
        }, [])
    return  <>
                <Typography variant='h3'>Blog Categories</Typography>
                <Typography>Select the Blog Categories you would like to display</Typography>
                    {categories.map((wpcategory) =>
                    <BlogCategory
                        key={wpcategory.id}
                        config={config}
                        setConfig={setConfig}
                        wpcategory={wpcategory}
                        />)}
            </>
}

BlogConfig.propTypes = {
    config: PropTypes.object,
    setConfig: PropTypes.func
};

export default BlogConfig;