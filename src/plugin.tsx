import React from 'react'
import {definePlugin, SchemaType} from 'sanity'
import GeopointInput, {GeopointInputProps} from './input/GeopointInput'
import {setGeoConfig} from './global-workaround'
import {GeopointSchemaType} from './types'

export interface GoogleMapsInputConfig {
  apiKey: string
  defaultZoom?: number
  defaultLocale?: string
  defaultLocation?: {
    lat: number
    lng: number
  }
}

export const googleMapsInput = definePlugin<GoogleMapsInputConfig>((config) => {
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
