import React from 'react';
import { Accordion } from '@contentful/f36-accordion';
import { AssetCard, Box, Button, Form, FormControl, MenuItem, Switch, Textarea, TextInput } from '@contentful/f36-components';

import { useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  useAutoResizer();
  const sdk = useSDK();
  const value = sdk.field.getValue();
  const [data, setData] = React.useState(value || {
    title: '',
    description: '',
    keywords: '',
    canonical: '',
    noindex: false,
    nofollow: false,
    socialImage: null,
  });

  const getAssetValues = (asset) => {
    return {
      fields: asset.fields,
      sys: {
        id: asset.sys.id,
        type: 'Link',
        linkType: 'Asset',
        publishedAt: asset.sys.publishedAt || false,
      }
    }
  }

  return (
    <Accordion>
      <Accordion.Item title="Metadata"
      >
        <Form>
          <FormControl>
            <FormControl.Label>Title</FormControl.Label>
            <TextInput name="title" value={data.title}  onChange={
              (e) => {
                setData({...data, title: e.currentTarget.value})
                sdk.field.setValue({...data, title: e.currentTarget.value})
              }
              } />
          </FormControl>

          <FormControl>
            <FormControl.Label>Description</FormControl.Label>
            <Box>
              <Textarea name="description" value={data.description} onChange={
                (e) => {
                  setData({...data, description: e.currentTarget.value})
                  sdk.field.setValue({...data, description: e.currentTarget.value})
                }
                } />
            </Box>
          </FormControl>

          <FormControl>
            <FormControl.Label>Keywords</FormControl.Label>
            <TextInput name="keywords" value={data.keywords} onChange={
              (e) => {
                setData({...data, keywords: e.currentTarget.value})
                sdk.field.setValue({...data, keywords: e.currentTarget.value})
              }
              } />
            <FormControl.HelpText>Separate keywords with commas</FormControl.HelpText>
          </FormControl>

          <FormControl>
            <FormControl.Label>Social Image</FormControl.Label>
              {data.socialImage && (
              <Box>
                <AssetCard
                  status={ data.socialImage.sys?.publishedAt ? 'published' : 'draft'}
                  type={data.socialImage.fields.file[sdk.field.locale].contentType.split('/')[0]}
                  title={data.socialImage.fields.title[sdk.field.locale]}
                  src={`https:${data.socialImage.fields.file[sdk.field.locale].url}`}
                  actions={[
                    <MenuItem key="edit" onClick={() => {
                      sdk.navigator
                        .openAsset(data.socialImage.sys.id, { slideIn: { waitForClose: true }  })
                        .then((asset) => {
                          setData({ ...data, socialImage: getAssetValues(asset.entity) });
                          sdk.field.setValue({ ...data, socialImage: getAssetValues(asset.entity) });
                        });
                    }}>Edit</MenuItem>,
                    <MenuItem key="remove" onClick={() => {
                      setData({ ...data, socialImage: null })
                      sdk.field.setValue({ ...data, socialImage: null })
                    }}>Remove</MenuItem>,
                  ]}
                />
                </Box>
            )}
            {!data.socialImage && (
              <Box>
                <Button onClick={() => sdk.dialogs.selectSingleAsset({
                  locale: sdk.field.locale,
                }).then((selectedAsset) => {
                  setData({ ...data, socialImage: getAssetValues(selectedAsset) });
                  sdk.field.setValue({ ...data, socialImage: getAssetValues(selectedAsset) });
                })}>Select asset</Button>
              </Box>
            )}
          </FormControl>

          <FormControl>
            <FormControl.Label>Canonical URL</FormControl.Label>
            <TextInput name="canonical" value={data.canonical} onChange={
              (e) => {
                setData({...data, canonical: e.currentTarget.value})
                sdk.field.setValue({...data, canonical: e.currentTarget.value})
              }
              } />
          </FormControl>

          <FormControl>
            <FormControl.Label>No index</FormControl.Label>
            <Switch name="noindex" defaultChecked={data.noindex} onChange={
              (e) => {
                setData({...data, noindex: !data.noindex})
                sdk.field.setValue({...data, noindex: !data.noindex})
              }
              } />
          </FormControl>
          <FormControl>
            <FormControl.Label>No follow</FormControl.Label>
            <Switch name="nofollow" defaultChecked={data.nofollow} onChange={
              (e) => {
                setData({...data, nofollow: !data.nofollow})
                sdk.field.setValue({...data, nofollow: !data.nofollow})
              }} />
          </FormControl>
        </Form>
      </Accordion.Item>
    </Accordion>
  );
};

export default Field;
