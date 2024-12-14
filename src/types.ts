import type {DiffComponent, DiffComponentOptions, ObjectDiff} from 'sanity'
import type {ObjectSchemaType} from 'sanity'

export interface LatLng {
  lat: number
  lng: number
}

export interface Geopoint {
  _type: 'geopoint'
  _key?: string
  lat: number
  lng: number
  alt?: number
}

export interface GeopointSchemaType extends ObjectSchemaType {
  diffComponent?: DiffComponent<ObjectDiff<Geopoint>> | DiffComponentOptions<ObjectDiff<Geopoint>>
}

export interface GoogleMapsInputConfig {
  apiKey: string
  defaultZoom?: number
  defaultLocale?: string
  defaultLocation?: {
    lat: number
    lng: number
  }
}
