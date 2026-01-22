/**
 * OpenFreeMap Component
 * 
 * Interactive map component using Leaflet and OpenFreeMap tiles with marker clustering.
 * 
 * @see https://openfreemap.org/ - OpenFreeMap website and documentation
 * @see https://github.com/telleriacarolina/openfreemap - Git remote repository (fetch with: git fetch openfreemap)
 * @see .github/openfreemap-reviews/terrain-commit-b06f5f2.diff - Terrain implementation reference from upstream
 * 
 * This component integrates free, open-source map tiles from OpenFreeMap
 * to display NYC taxi ride locations without API keys or rate limits.
 * 
 * Features:
 * - Multiple style options: Liberty (default), Bright, and Positron
 * - Custom markers for earnings visualization
 * - Interactive popups with ride details
 * - Marker clustering for large datasets (improves performance with 100+ markers)
 * - Color-coded cluster sizes (small: 1-20, medium: 21-100, large: 100+)
 * - Centered on NYC by default
 * - Dynamic style switching without remounting the map
 * - Optional hillshade terrain overlay for topography visualization
 * 
 * Terrain Feature:
 * - Hillshade overlay shows elevation changes in NYC (bridges, hills, terrain)
 * - Useful for understanding route difficulty and fuel efficiency factors
 * - Based on OpenFreeMap upstream commit b06f5f2 (MapLibre GL terrain example)
 * - Adapted to Leaflet using raster-dem tiles
 */

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.heat'

export type MapStyle = 'liberty' | 'bright' | 'positron'

interface OpenFreeMapProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number]
    label: string
    earnings?: number
  }>
  heatmapPoints?: Array<{
    position: [number, number]
    intensity: number
  }>
  className?: string
  onMarkerClick?: (label: string) => void
  enableClustering?: boolean
  clusterRadius?: number
  style?: MapStyle
  enableTerrain?: boolean
  terrainOpacity?: number
  enableHeatmap?: boolean
  heatmapOptions?: {
    radius?: number
    blur?: number
    maxZoom?: number
    max?: number
    minOpacity?: number
    gradient?: { [key: number]: string }
  }
}

export function OpenFreeMap({
  center = [40.7128, -74.0060],
  zoom = 12,
  markers = [],
  heatmapPoints = [],
  className = '',
  onMarkerClick,
  enableClustering = true,
  clusterRadius = 80,
  style = 'liberty',
  enableTerrain = false,
  terrainOpacity = 0.5,
  enableHeatmap = false,
  heatmapOptions = {}
}: OpenFreeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | L.MarkerClusterGroup | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const terrainLayerRef = useRef<L.TileLayer | null>(null)
  const heatmapLayerRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true
    })

    tileLayerRef.current = L.tileLayer(`https://tiles.openfreemap.org/styles/${style}/{z}/{x}/{y}.png`, {
      maxZoom: 19,
      attribution: '© OpenFreeMap contributors'
    }).addTo(map)

    // Add terrain/hillshade layer if enabled (inspired by commit b06f5f2)
    // Note: Using hillshade tiles from USGS or similar service for NYC area
    // Can be replaced with custom DEM tiles for better NYC coverage
    if (enableTerrain) {
      terrainLayerRef.current = L.tileLayer('https://tiles.openfreemap.org/terrain/{z}/{x}/{y}.png', {
        maxZoom: 19,
        opacity: terrainOpacity,
        attribution: '© OpenFreeMap terrain'
      }).addTo(map)
    }

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
    if (!mapInstanceRef.current || !tileLayerRef.current) return

    tileLayerRef.current.setUrl(`https://tiles.openfreemap.org/styles/${style}/{z}/{x}/{y}.png`)
  }, [style])

  // Handle terrain layer toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (enableTerrain && !terrainLayerRef.current) {
      terrainLayerRef.current = L.tileLayer('https://tiles.openfreemap.org/terrain/{z}/{x}/{y}.png', {
        maxZoom: 19,
        opacity: terrainOpacity,
        attribution: '© OpenFreeMap terrain'
      }).addTo(mapInstanceRef.current)
    } else if (!enableTerrain && terrainLayerRef.current) {
      mapInstanceRef.current.removeLayer(terrainLayerRef.current)
      terrainLayerRef.current = null
    } else if (terrainLayerRef.current) {
      terrainLayerRef.current.setOpacity(terrainOpacity)
    }
  }, [enableTerrain, terrainOpacity])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (enableHeatmap && heatmapPoints.length > 0) {
      if (heatmapLayerRef.current) {
        mapInstanceRef.current.removeLayer(heatmapLayerRef.current)
      }

      const defaultGradient = {
        0.0: 'rgba(0, 0, 255, 0)',
        0.2: 'rgba(0, 0, 255, 0.5)',
        0.4: 'rgba(0, 255, 255, 0.6)',
        0.6: 'rgba(0, 255, 0, 0.7)',
        0.8: 'rgba(255, 255, 0, 0.8)',
        1.0: 'rgba(255, 0, 0, 0.9)'
      }

      const heatData = heatmapPoints.map(point => [
        point.position[0],
        point.position[1],
        point.intensity
      ] as [number, number, number])

      heatmapLayerRef.current = (L as any).heatLayer(heatData, {
        radius: heatmapOptions.radius || 35,
        blur: heatmapOptions.blur || 25,
        maxZoom: heatmapOptions.maxZoom || 13,
        max: heatmapOptions.max || 1.0,
        minOpacity: heatmapOptions.minOpacity || 0.4,
        gradient: heatmapOptions.gradient || defaultGradient
      }).addTo(mapInstanceRef.current)
    } else if (!enableHeatmap && heatmapLayerRef.current) {
      mapInstanceRef.current.removeLayer(heatmapLayerRef.current)
      heatmapLayerRef.current = null
    }
  }, [enableHeatmap, heatmapPoints, heatmapOptions])

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
