import {LatLng} from '../types'

export function latLngAreEqual(
  latLng1: LatLng | google.maps.LatLng,
  latLng2: LatLng | google.maps.LatLng
): boolean {
  const lat1 = typeof latLng1.lat === 'function' ? latLng1.lat() : latLng1.lat
  const lng1 = typeof latLng1.lng === 'function' ? latLng1.lng() : latLng1.lng

  const lat2 = typeof latLng2.lat === 'function' ? latLng2.lat() : latLng2.lat
  const lng2 = typeof latLng2.lng === 'function' ? latLng2.lng() : latLng2.lng

  return lat1 === lat2 && lng1 === lng2
}

export function getPolyCenter(coords: LatLng[]): google.maps.LatLng {
  const bounds = new google.maps.LatLngBounds()
  let i

  for (i = 0; i < coords.length; i++) {
    bounds.extend(coords[i])
  }

  return bounds.getCenter()
}

export function getPolyBounds(coords: LatLng[]): google.maps.LatLngBounds {
  const bounds = new google.maps.LatLngBounds()
  let i

  for (i = 0; i < coords.length; i++) {
    bounds.extend(coords[i])
  }

  return bounds
}
