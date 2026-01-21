/**
 * OpenFreeMap Component
 * 
 * Interactive map component using Leaflet and OpenFreeMap tiles.
 * 
 * @see https://openfreemap.org/ - OpenFreeMap website and documentation
 * @see https://github.com/telleriacarolina/openfreemap - Git remote repository (fetch with: git fetch openfreemap)
 * 
 * This component integrates free, open-source map tiles from OpenFreeMap
 * to display NYC taxi ride locations without API keys or rate limits.
 * 
 * Features:
 * - Liberty style tiles from OpenFreeMap CDN
 * - Custom markers for earnings visualization
 * - Interactive popups with ride details
 * - Centered on NYC by default
 */

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface OpenFreeMapProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number]
    label: string
    earnings?: number
  }>
  className?: string
  onMarkerClick?: (label: string) => void
}

export function OpenFreeMap({
  center = [40.7128, -74.0060],
  zoom = 12,
  markers = [],
  className = '',
  onMarkerClick
}: OpenFreeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true
    })

    L.tileLayer('https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenFreeMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map
    markersLayerRef.current = L.layerGroup().addTo(map)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    mapInstanceRef.current.setView(center, zoom)
  }, [center, zoom])

  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return

    markersLayerRef.current.clearLayers()

    markers.forEach(marker => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: oklch(0.45 0.15 260);
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <span style="transform: rotate(45deg); font-size: 16px; font-weight: bold;">$</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })

      const leafletMarker = L.marker(marker.position, { icon })
        .addTo(markersLayerRef.current!)

      const popupContent = `
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <strong style="font-size: 14px; color: oklch(0.35 0.08 250);">${marker.label}</strong>
          ${marker.earnings ? `<div style="font-size: 12px; color: oklch(0.45 0.01 240); margin-top: 4px;">$${marker.earnings.toFixed(2)}</div>` : ''}
        </div>
      `

      leafletMarker.bindPopup(popupContent)

      if (onMarkerClick) {
        leafletMarker.on('click', () => onMarkerClick(marker.label))
      }
    })

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.position))
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [markers, onMarkerClick])

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  )
}
