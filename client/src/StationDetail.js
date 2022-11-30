import './StationDetail.css';

export default function StationDetail({activeStation}){
    return <div className="stationDetail">
        {
            activeStation ? <h1>Station ID:{activeStation.station_id.N}</h1> : <h1>No station selected.<br/>Click 👆 on the map to select one and show collected data</h1>
        }
    </div>
}