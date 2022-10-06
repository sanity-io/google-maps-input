import React from 'react'
import {createPlugin, SchemaType} from 'sanity'
import GeopointInput, {GeopointInputProps} from './input/GeopointInput'
import {setGeoConfig} from './global-workaround'
import {GeopointSchemaType} from './types'

export {GeopointArrayDiff, type DiffProps as GeopointArrayDiffProps} from './diff/GeopointArrayDiff'
export {GeopointFieldDiff, type DiffProps as GeopointFieldDiffProps} from './diff/GeopointFieldDiff'

export type {LatLng, GeopointSchemaType, Geopoint} from './types'
export {GeopointInput}
export type {GeopointInputProps}

export interface GoogleMapsInputConfig {
  apiKey: string
  defaultZoom?: number
  defaultLocale?: string
  defaultLocation?: {
    lat: number
    lng: number
  }
}

export const googleMapsInput = createPlugin<GoogleMapsInputConfig>((config) => {
  setGeoConfig(config)
  return {
    name: 'google-maps-input',
    form: {
      components: {
        input(props) {
          if (isGeopoint(props.schemaType)) {
            const castedProps = props as unknown as Omit<GeopointInputProps, 'geoConfig'>
            return <GeopointInput {...castedProps} geoConfig={config} />
          }
          return props.renderDefault(props)
        },
      },
    },
  }
})

function isGeopoint(schemaType: SchemaType): schemaType is GeopointSchemaType {
  return isType('geopoint', schemaType)
}

function isType(name: string, schema?: SchemaType): boolean {
  if (schema?.name === name) {
    return true
    // eslint-disable-next-line no-negated-condition
  } else if (!schema?.name) {
    return false
  }
  return isType(name, schema?.type)
}
