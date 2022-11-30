import './App.css';
import StationDetail from './StationDetail';
import StationMap from './StationMap';
import {useEffect, useState} from 'react';

var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1',accessKeyId:'local',secretAccessKey:'local'});
var dynamo = new AWS.DynamoDB({endpoint:'http://localhost:4566'});

export function App(){
    const [stationList,setStationList] = useState([]);
    const [activeStation,setActiveStation] = useState(null);

   
    useEffect( () => {
        dynamo.scan({TableName:'stations'},(err,data)=>{
            if(err){
                console.log("Can't retrieve data");
            } else if (data){
                setStationList(data.Items);
            }
        })
    },[setStationList]);

   

    return <div className="content">
        <div className="mapContainer">
            <StationMap stationList={stationList} setActiveStation={setActiveStation}></StationMap>
        </div>
        <div className="detailContainer"><StationDetail activeStation={activeStation}/></div>
    </div>
}