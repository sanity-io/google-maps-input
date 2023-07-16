import React from 'react'
import {LatLng} from '../types'
import {latLngAreEqual} from './util'
import {MapContainer} from './Map.styles'
import {waitForTheElement} from 'wait-for-the-element'

interface MapProps {
  api: typeof window.google.maps
  location: LatLng
  bounds?: google.maps.LatLngBounds
  defaultZoom?: number
  drawPolygon?: boolean
  mapTypeControl?: boolean
  scrollWheel?: boolean
  controlSize?: number
  onClick?: (event: google.maps.MapMouseEvent) => void
  children?: (map: google.maps.Map) => React.ReactElement
}

interface MapState {
  map: google.maps.Map | undefined
  polygon: google.maps.Polygon | undefined
  drawingManager: google.maps.drawing.DrawingManager | undefined
  deleteButton: HTMLButtonElement | undefined
}

export class GoogleMap extends React.PureComponent<MapProps, MapState> {
  static defaultProps = {
    defaultZoom: 8,
    scrollWheel: true,
  }

  state: MapState = {
    map: undefined,
    polygon: undefined,
    deleteButton: undefined,
    drawingManager: undefined,
  }
  clickHandler: google.maps.MapsEventListener | undefined
  mapRef = React.createRef<HTMLDivElement>()
  mapEl: HTMLDivElement | null = null

  componentDidMount() {
    this.attachClickHandler()
  }

  attachClickHandler = () => {
    const map = this.state.map
    if (!map) {
      return
    }

    const {api, onClick} = this.props
    const {event} = api

    if (this.clickHandler) {
      this.clickHandler.remove()
    }

    if (onClick) {
      this.clickHandler = event.addListener(map, 'click', onClick)
    }
  }

  componentDidUpdate(prevProps: MapProps) {
    const map = this.state.map
    if (!map) {
      return
    }

    const {onClick, location, bounds} = this.props

    if (prevProps.onClick !== onClick) {
      this.attachClickHandler()
    }

    if (!latLngAreEqual(prevProps.location, location)) {
      map.panTo(this.getCenter())
    }

    if (bounds && (!prevProps.bounds || !bounds.equals(prevProps.bounds))) {
      map.fitBounds(bounds)
    }
  }

  componentWillUnmount() {
    if (this.clickHandler) {
      this.clickHandler.remove()
    }
  }

  getCenter(): google.maps.LatLng {
    const {location, api} = this.props
    return new api.LatLng(location.lat, location.lng)
  }

  async deletePolygon() {
    this.state.polygon?.setMap(null)
    this.setState((state) => ({...state, polygon: undefined}))
  }

  async addDeleteControl(api: typeof window.google.maps, map: google.maps.Map) {
    const dragButton = await waitForTheElement('[role="menuitemradio"]:not([id])')
    const menuBar = dragButton?.parentElement?.parentElement as HTMLDivElement
    if (!menuBar) return

    const deleteButton = dragButton?.cloneNode(true) as HTMLButtonElement
    if (!deleteButton) return

    menuBar.appendChild(deleteButton)
    // @ts-ignore
    deleteButton.querySelector(
      'img'
    ).parentElement.innerHTML = `<svg data-sanity-icon="close" width="100%" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 7L7 18M7 7L18 18" stroke="#f00" stroke-width="1.2"></path></svg>`

    this.setState((state) => ({...state, deleteButton}))

    deleteButton.addEventListener('click', () => this.deletePolygon())
  }

  constructPolygon(api: typeof window.google.maps, map: google.maps.Map) {
    const drawingManager = new api.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: true,
        draggable: true,
      },
    })

    drawingManager.setMap(map)
    this.setState((state) => ({...state, drawingManager}))

    this.addDeleteControl(api, map)

    api.event.addListener(
      drawingManager,
      'overlaycomplete',
      (e: google.maps.drawing.OverlayCompleteEvent) => {
        if (this.state.polygon) {
          e.overlay?.setMap(null)
          return
        }
        // @ts-ignore
        this.setState((state) => ({...state, polygon: e.overlay}))
      }
    )

    return drawingManager
  }

  constructMap(el: HTMLDivElement) {
    const {defaultZoom, api, mapTypeControl, controlSize, bounds, scrollWheel, drawPolygon} =
      this.props

    const map = new api.Map(el, {
      zoom: defaultZoom,
      center: this.getCenter(),
      scrollwheel: scrollWheel,
      streetViewControl: false,
      mapTypeControl,
      controlSize,
    })

    if (bounds) {
      map.fitBounds(bounds)
    }

    if (drawPolygon) {
      this.constructPolygon(api, map)
    }

    return map
  }

  setMapElement = (element: HTMLDivElement | null) => {
    if (element && element !== this.mapEl) {
      const map = this.constructMap(element)
      this.setState({map}, this.attachClickHandler)
    }

    this.mapEl = element
  }

  render() {
    const {children} = this.props
    const {map} = this.state
    return (
      <>
        <MapContainer ref={this.setMapElement} />
        {children && map ? children(map) : null}
      </>
    )
  }
}
