import {TileLayer,Marker,Popup,MapContainer, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './StationMap.css';
import L, { map } from 'leaflet';
import {useState} from 'react';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function StationMarker({station,setActiveStation,...props}){
    return(
        <Marker key={props.key} position={[station.location.M.lat.N,station.location.M.lng.N]} 
            eventHandlers={{
                click(){setActiveStation(station)}
            }}>
        </Marker>
    );
}

export default function StationMap({stationList,setActiveStation}){

    const markers = stationList.map( (s,i) => <StationMarker key={i} station={s} setActiveStation={setActiveStation}></StationMarker>)

    return (<MapContainer style={{height:"100%"}} center={[40.497,15.015]} zoom={13} scrollWheelZoom>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {
        markers
    }
    
  </MapContainer>)
}