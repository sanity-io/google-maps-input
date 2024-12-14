import React, {useCallback} from 'react'
import {GoogleMap} from '../map/Map'
import {Marker} from '../map/Marker'
import {SearchInput} from '../map/SearchInput'
import type {Geopoint, LatLng} from '../types'

const fallbackLatLng: LatLng = {lat: 40.7058254, lng: -74.1180863}

interface SelectProps {
  api: typeof window.google.maps
  value?: Geopoint
  onChange: (latLng: LatLng) => void
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

  setValue(geoPoint: google.maps.LatLng) {
    if (this.props.onChange) {
      this.props.onChange(geoPoint)
    }
  }

  render() {
    const {api, defaultZoom, value, onChange} = this.props
    return (
      <GoogleMap
        api={api}
        location={this.getCenter()}
        onClick={this.handleMapClick}
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

export const LolGeopointSelect = ({
  api,
  defaultZoom = 9,
  defaultLocation = {lng: 10.74609, lat: 59.91273},
  value,
  onChange,
}: SelectProps) => {
  const getCenter = useCallback((): LatLng => {
    return {...fallbackLatLng, ...defaultLocation, ...value}
  }, [value, defaultLocation])

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) {
        return
      }

      onChange({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      })
    },
    [onChange],
  )

  const handlePlaceChanged = useCallback(
    (place) => {
      if (!place.geometry) {
        return
      }
      onChange({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
    },
    [onChange],
  )

  const handleMarkerDragEnd = useCallback(
    (event) => {
      onChange({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      })
    },
    [onChange],
  )

  return (
    <GoogleMap api={api} location={getCenter()} onClick={handleMapClick} defaultZoom={defaultZoom}>
      {(map) => (
        <>
          <SearchInput api={api} map={map} onChange={handlePlaceChanged} />
          {value && (
            <Marker
              api={api}
              map={map}
              position={value}
              onMove={onChange ? handleMarkerDragEnd : undefined}
            />
          )}
        </>
      )}
    </GoogleMap>
  )
}
