import React from 'react'
import {SearchInput} from '../map/SearchInput'
import {GoogleMap} from '../map/Map'
import {Marker} from '../map/Marker'
import {LatLng, Geopoint} from '../types'

const fallbackLatLng: LatLng = {lat: 40.7058254, lng: -74.1180863}

interface SelectProps {
  api: typeof window.google.maps
  value?: Geopoint
  onChange?: (latLng: google.maps.LatLng | google.maps.LatLng[]) => void
  handleClear?: () => void
  defaultLocation?: LatLng
  defaultZoom?: number
  drawPolygon?: boolean
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
    if (this.props.drawPolygon) return
    if (!place.geometry?.location) {
      return
    }

    this.setValue(place.geometry.location)
  }

  handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (this.props.drawPolygon) return
    if (event.latLng) this.setValue(event.latLng)
  }

  handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (this.props.drawPolygon) return
    if (event.latLng) this.setValue(event.latLng)
  }

  handlePolygonDraw = (geoPoint: google.maps.LatLng[]) => {
    this.setValue(geoPoint)
  }

  setValue(geoPoint: google.maps.LatLng | google.maps.LatLng[]) {
    if (this.props.onChange) {
      this.props.onChange(geoPoint)
    }
  }

  render() {
    const {api, defaultZoom, value, onChange, drawPolygon, handleClear} = this.props
    return (
      <GoogleMap
        api={api}
        location={this.getCenter()}
        onClick={this.handleMapClick}
        defaultZoom={defaultZoom}
        drawPolygon={drawPolygon}
        handlePolygonDraw={this.handlePolygonDraw}
        value={value}
        handleClear={handleClear}
      >
        {(map) => (
          <>
            <SearchInput api={api} map={map} onChange={this.handlePlaceChanged} />
            {value && !drawPolygon && (
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
