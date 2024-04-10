import React from 'react'
import {SearchInput} from '../map/SearchInput'
import {GoogleMap} from '../map/Map'
import {Marker} from '../map/Marker'
import {LatLng, Geopoint} from '../types'

const fallbackLatLng: LatLng = {lat: 40.7058254, lng: -74.1180863}

interface SelectProps {
  api: typeof window.google.maps
  value?: Geopoint
  onChange?: (latLng: google.maps.LatLng) => void
  onZoomChange?: (zoom: number) => void
  defaultLocation?: LatLng
  defaultZoom?: number
}

export class GeopointSelect extends React.PureComponent<SelectProps> {
  static defaultProps = {
    defaultZoom: 8,
    defaultLocation: {lng: 10.74609, lat: 59.91273},
  }

  mapRef = React.createRef<HTMLDivElement>()

  getCenter() {
    const {value = {}, defaultLocation = {}} = this.props
    const point: LatLng = {...fallbackLatLng, ...defaultLocation, ...value}
    return point
  }

  handlePlaceChanged = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) {
      return
    }

    this.setValue(place.geometry.location)
  }

  handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) this.setValue(event.latLng)
  }

  handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) this.setValue(event.latLng)
  }

  handleZoomChange = (zoom: number) => {
    this.setZoom(zoom)
  }

  setValue(geoPoint: google.maps.LatLng) {
    if (this.props.onChange) {
      this.props.onChange(geoPoint)
    }
  }

  setZoom(zoom: number) {
    if (this.props.onZoomChange) {
      this.props.onZoomChange(zoom)
    }
  }

  render() {
    const {api, defaultZoom, value, onChange} = this.props
    return (
      <GoogleMap
        api={api}
        location={this.getCenter()}
        onClick={this.handleMapClick}
        onZoomChange={this.handleZoomChange}
        defaultZoom={defaultZoom}
      >
        {(map) => (
          <>
            <SearchInput api={api} map={map} onChange={this.handlePlaceChanged} />
            {value && (
              <Marker
                api={api}
                map={map}
                position={value}
                onMove={onChange ? this.handleMarkerDragEnd : undefined}
              />
            )}
          </>
        )}
      </GoogleMap>
    )
  }
}
