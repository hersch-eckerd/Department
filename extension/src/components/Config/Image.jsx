import AWS from 'aws-sdk';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Alert, Button, Grid } from '@ellucian/react-design-system/core';
import { withStyles } from '@ellucian/react-design-system/core/styles';

const styles = () => ({
    button: {
        marginTop: 20,
        marginBottom: 20
    }
});

// get AWS info from .env file and set up AWS config

const AWS_KEY = process.env.REACT_APP_ACCESS_KEY_ID
const AWS_SECRET = process.env.REACT_APP_AWS_SECRET
AWS.config.update({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
    region: 'us-east-1'
    });
const s3 = new AWS.S3();

function ImageUploader({setConfig, config, classes}) {
    const {url, fileName} = config.client.imageInfo;
    const [file, setFile] = useState(null);
    const [AWSUrl, setAWSUrl] = useState()
    const [AWSFileName, setAWSFileName] = useState()
    const [preview, setPreview] = useState()
    const [alert, setAlert] = useState({ open: false, alertType: '', text: '' })
    useEffect(() => {
        if (url && fileName) {
            setAWSFileName(fileName);
            setAWSUrl(url);
            setPreview(url)
        }
    }, [AWSFileName, AWSUrl]);

    const handleAddImage = (image) => {
        setConfig({
            ...config,
            client: {
                ...config.client,
                imageInfo: image
            }
        })
    }
    const handleFileSelect = (e) => {
        if (e.target.files.length === 0) {
            setFile()
            setAlert({ open: true, alertType: 'error', text: 'No file selected.' })
        }
        if (e.target.files[0].size < 1000000 && e.target.files[0].type.includes('image')) {
            setFile(e.target.files[0]);
            setAlert({ open: false, alertType: '', text: '' })
            setPreview(URL.createObjectURL(e.target.files[0]))
        } else {
            setFile()
            setAlert({ open: true, alertType: 'error', text: 'File must be less than 1MB and an image.' })
        }
    }
    const uploadToS3 = async () => {
        if (!file) {
            return;
        }
        const uploadName = `${Date.now()}.${file.name}`
        const params = {
            Bucket: 'experience-extensions',
            Key: uploadName,
            Body: file
        };
        const { Location } = await s3.upload(params).promise();
        const cardInfo = {
            'fileName': uploadName,
            'url': Location
        }
        setAWSFileName(uploadName)
        setAWSUrl(Location)
        handleAddImage(cardInfo)
    }
    const deleteFromS3 = () => {
        const params = {
            Bucket: "experience-extensions",
            Key: AWSFileName
        };
        s3.deleteObject(params, (err) => {
            if (err) {
                console.log(err, err.stack)
            }
            else {
                setAWSUrl()
                setAWSFileName()
                setFile()
                setPreview()
                handleAddImage({})
            }}
        );
    }

    return (
        <Grid direction="column" justifyContent="flex-start" alignItems="flex-start">
            <Grid direction="row" justifyContent="flex-start" alignItems="center">
                <Grid item direction="column" justifyContent="flex-start" alignItems="flex-start">
                    <Typography variant="h3">Image Upload</Typography>
                    <Typography >Use the button below to upload an image as a background for your card. Image must be less than 2MB</Typography>
                </Grid>
                <input
                    type="file"
                    onChange={(e) => handleFileSelect(e)}
                    accept='image/*'
                    id="contained-button-file"
                    style={{ display: 'none' }}
                />
                <label htmlFor="contained-button-file">
                    <Button className={classes.button} color="primary" component="span">
                        Upload Image
                    </Button>
                </label>
                {config.client.imageInfo.url && config.client.imageInfo.fileName &&
                <Button color="primary" style={{marginLeft:10}} onClick={deleteFromS3}>
                    Delete Image
                </Button>}
            </Grid>
            {file &&
                <div style={{ marginTop: '10px' }}>
                    <Button color="primary" component="span" onClick={uploadToS3}>
                        Save to Card
                    </Button>
                </div>
            }
            {alert.open &&
                <Alert
                    alertType={alert.alertType}
                    text={alert.text}
                    open={alert.open}
                    onClose={() => setAlert({open: false, alertType: '', text: ''})}
                />
            }
            {preview != undefined &&
                <img style={{ width: '300px' }} src={preview} alt="uploaded" />
            }
        </Grid>
    );
}
ImageUploader.propTypes = {
    classes: PropTypes.object.isRequired,
    setConfig: PropTypes.func,
    config: PropTypes.object
};

export default withStyles(styles)(ImageUploader);