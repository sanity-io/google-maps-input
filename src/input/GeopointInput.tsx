import React from 'react'
import {uniqueId} from 'lodash'
import {Box, Button, Dialog, Grid} from '@sanity/ui'
import {EditIcon, TrashIcon} from '@sanity/icons'
import {ObjectInputProps, set, setIfMissing, unset, ChangeIndicator} from 'sanity'
import {GoogleMapsLoadProxy} from '../loader/GoogleMapsLoadProxy'
import {Geopoint, GeopointSchemaType, LatLng} from '../types'
import {GeopointSelect} from './GeopointSelect'
import {DialogInnerContainer, PreviewImage} from './GeopointInput.styles'
import {GoogleMapsInputConfig} from '../index'
import {getGeoConfig} from '../global-workaround'

const getStaticImageUrl = (value: LatLng, apiKey: string) => {
  const loc = `${value.lat},${value.lng}`
  const params = {
    key: apiKey,
    center: loc,
    markers: loc,
    zoom: 13,
    scale: 2,
    size: '640x300',
  } as const
  const qs = Object.keys(params).reduce((res, param) => {
    return res.concat(`${param}=${encodeURIComponent(params[param as keyof typeof params])}`)
  }, [] as string[])

  return `https://maps.googleapis.com/maps/api/staticmap?${qs.join('&')}`
}

export type GeopointInputProps = ObjectInputProps<Geopoint, GeopointSchemaType> & {
  geoConfig: GoogleMapsInputConfig
}

type Focusable = any

interface InputState {
  modalOpen: boolean
}

class GeopointInput extends React.PureComponent<GeopointInputProps, InputState> {
  _geopointInputId = uniqueId('GeopointInput')

  editButton: Focusable | undefined

  constructor(props: GeopointInputProps) {
    super(props)

    this.state = {
      modalOpen: false,
    }
  }

  setEditButton = (el: Focusable) => {
    this.editButton = el
  }

  focus() {
    if (this.editButton) {
      this.editButton.focus()
    }
  }

  handleToggleModal = () => {
    this.setState((prevState) => ({modalOpen: !prevState.modalOpen}))
  }

  handleCloseModal = () => {
    this.setState({modalOpen: false})
  }

  handleChange = (latLng: google.maps.LatLng) => {
    const {schemaType, onChange} = this.props
    onChange([
      setIfMissing({
        _type: schemaType.name,
      }),
      set(latLng.lat(), ['lat']),
      set(latLng.lng(), ['lng']),
    ])
  }

  handleClear = () => {
    const {onChange} = this.props
    onChange(unset())
  }

  render() {
    const {value, readOnly, geoConfig: config, path, changed, focused} = this.props

    const {modalOpen} = this.state

    if (!config || !config.apiKey) {
      return (
        <div>
          <p>
            The <a href="https://sanity.io/docs/schema-types/geopoint-type">Geopoint type</a> needs
            a Google Maps API key with access to:
          </p>
          <ul>
            <li>Google Maps JavaScript API</li>
            <li>Google Places API Web Service</li>
            <li>Google Static Maps API</li>
          </ul>
          <p>
            Please enter the API key with access to these services in your googleMapsInput plugin
            config.
          </p>
        </div>
      )
    }

    return (
      <>
        {value && (
          <ChangeIndicator path={path} isChanged={changed} hasFocus={!!focused}>
            <PreviewImage src={getStaticImageUrl(value, config.apiKey)} alt="Map location" />
          </ChangeIndicator>
        )}

        {!readOnly && (
          <Box marginTop={4}>
            <Grid columns={2} gap={2}>
              <Button
                mode="ghost"
                icon={value && EditIcon}
                padding={3}
                ref={this.setEditButton}
                text={value ? 'Edit' : 'Set location'}
                onClick={this.handleToggleModal}
              />

              {value && (
                <Button
                  tone="critical"
                  icon={TrashIcon}
                  padding={3}
                  mode="ghost"
                  text={'Remove'}
                  onClick={this.handleClear}
                />
              )}
            </Grid>
          </Box>
        )}

        {modalOpen && (
          <Dialog
            id={`${this._geopointInputId}_dialog`}
            onClose={this.handleCloseModal}
            header="Place the marker on the map"
            width={1}
          >
            <DialogInnerContainer>
              <GoogleMapsLoadProxy config={getGeoConfig()}>
                {(api) => (
                  <GeopointSelect
                    api={api}
                    value={value || undefined}
                    onChange={readOnly ? undefined : this.handleChange}
                    defaultLocation={config.defaultLocation}
                    defaultZoom={config.defaultZoom}
                  />
                )}
              </GoogleMapsLoadProxy>
            </DialogInnerContainer>
          </Dialog>
        )}
      </>
    )
  }
}

export default GeopointInput
