import {GoogleMapsInputConfig} from './index'

let config: GoogleMapsInputConfig

export function getGeoConfig(): GoogleMapsInputConfig {
  return config as GoogleMapsInputConfig
}

export function setGeoConfig(newConfig: GoogleMapsInputConfig): void {
  config = newConfig
}
