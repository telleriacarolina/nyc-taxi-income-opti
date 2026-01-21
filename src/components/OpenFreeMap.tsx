/**
 * OpenFreeMap Component
 * 
 * Interactive map component using Leaflet and OpenFreeMap tiles with marker clustering.
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
 * - Marker clustering for large datasets (improves performance with 100+ markers)
 * - Color-coded cluster sizes (small: 1-20, medium: 21-100, large: 100+)
 * - Centered on NYC by default
 */

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

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
  enableClustering?: boolean
  clusterRadius?: number
}

export function OpenFreeMap({
  center = [40.7128, -74.0060],
  zoom = 12,
  markers = [],
  className = '',
  onMarkerClick,
  enableClustering = true,
  clusterRadius = 80
}: OpenFreeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | L.MarkerClusterGroup | null>(null)

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
    
    if (enableClustering) {
      markersLayerRef.current = L.markerClusterGroup({
        maxClusterRadius: clusterRadius,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount()
          let size = 'small'
          let sizeClass = 'marker-cluster-small'
          
          if (count > 100) {
            size = 'large'
            sizeClass = 'marker-cluster-large'
          } else if (count > 20) {
            size = 'medium'
            sizeClass = 'marker-cluster-medium'
          }
          
          return L.divIcon({
            html: `<div><span>${count}</span></div>`,
            className: `marker-cluster ${sizeClass}`,
            iconSize: L.point(40, 40)
          })
        }
      }).addTo(map)
    } else {
      markersLayerRef.current = L.layerGroup().addTo(map)
    }

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [enableClustering, clusterRadius])

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

      markersLayerRef.current!.addLayer(leafletMarker)
    })

    if (markers.length > 0 && !enableClustering) {
      const bounds = L.latLngBounds(markers.map(m => m.position))
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
    } else if (markers.length > 0 && enableClustering) {
      const bounds = L.latLngBounds(markers.map(m => m.position))
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
    }
  }, [markers, onMarkerClick, enableClustering])

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  )
}
