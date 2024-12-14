import {EditIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Dialog, Grid, Stack} from '@sanity/ui'
import React, {ForwardedRef, forwardRef, useCallback, useId, useState} from 'react'
import {
  ChangeIndicator,
  set,
  setIfMissing,
  unset,
  useTranslation,
  type ObjectInputProps,
} from 'sanity'
import {getGeoConfig} from '../global-workaround'
import {i18nNamespace} from '../i18n/namespace'
import type {GoogleMapsInputConfig} from '../index'
import {GoogleMapsLoadProxy} from '../loader/GoogleMapsLoadProxy'
import type {Geopoint, GeopointSchemaType, LatLng} from '../types'
import {DialogInnerContainer, PreviewImage} from './GeopointInput.styles'
import {GeopointSelect} from './GeopointSelect'

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

export const GeopointInput = forwardRef(function GeopointInput(
  props: GeopointInputProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const {changed, focused, geoConfig: config, onChange, path, readOnly, schemaType, value} = props
  const {t} = useTranslation(i18nNamespace)
  const geopointInputId = useId()
  const [modalOpen, setModalOpen] = useState(false)

  const handleToggleModal = useCallback(() => {
    setModalOpen((prevState) => !prevState)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  const handleChange = useCallback(
    (latLng: google.maps.LatLng) => {
      onChange([
        setIfMissing({
          _type: schemaType.name,
        }),
        set(latLng.lat(), ['lat']),
        set(latLng.lng(), ['lng']),
      ])
    },
    [schemaType, onChange],
  )

  const handleClear = useCallback(() => {
    onChange(unset())
  }, [onChange])

  if (!config || !config.apiKey) {
    // Intentionally kept in English, as this should be a developer-only message
    return (
      <div>
        <p>
          The <a href="https://sanity.io/docs/schema-types/geopoint-type">Geopoint type</a> needs a
          Google Maps API key with access to:
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
    <Stack space={3}>
      {value && (
        <ChangeIndicator path={path} isChanged={changed} hasFocus={!!focused}>
          <PreviewImage
            src={getStaticImageUrl(value, config.apiKey)}
            alt={t('preview-image.alt-text')}
          />
        </ChangeIndicator>
      )}

      <Box>
        <Grid columns={value ? 2 : 1} gap={3}>
          <Button
            mode="ghost"
            icon={value && EditIcon}
            padding={3}
            ref={ref}
            text={t(value ? 'action.edit' : 'action.set-location')}
            onClick={handleToggleModal}
            disabled={readOnly}
          />

          {value && (
            <Button
              tone="critical"
              icon={TrashIcon}
              padding={3}
              mode="ghost"
              text={t('action.remove')}
              onClick={handleClear}
              disabled={readOnly}
            />
          )}
        </Grid>
      </Box>

      {modalOpen && (
        <Dialog
          id={geopointInputId}
          onClose={handleCloseModal}
          header={t('edit-dialog.place-marker')}
          width={1}
        >
          <DialogInnerContainer>
            <GoogleMapsLoadProxy config={getGeoConfig()}>
              {(api) => (
                <GeopointSelect
                  api={api}
                  value={value || undefined}
                  onChange={readOnly ? undefined : handleChange}
                  defaultLocation={config.defaultLocation}
                  defaultZoom={config.defaultZoom}
                />
              )}
            </GoogleMapsLoadProxy>
          </DialogInnerContainer>
        </Dialog>
      )}
    </Stack>
  )
})
