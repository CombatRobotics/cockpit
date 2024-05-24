import { ref,onMounted } from 'vue';
import ROSLIB from 'roslib';
// import * as L from 'leaflet';
import L, { type LatLngTuple, Map } from 'leaflet';


// interface LatLngTuple {
//   lat: number;
//   lng: number;
// }

export function getHomeHeading(topicName: string, messageType: string) {
  const greenMarkerValue = ref(0);

  const ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'
  });

  ros.on('connection', () => {
    console.log('Connected to websocket server.');
  });

  ros.on('error', (error) => {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', () => {
    console.log('Connection to websocket server closed.');
  });

  const listener = new ROSLIB.Topic({
    ros: ros,
    name: topicName,
    messageType: messageType
  });

  listener.subscribe((message: any) => {
    greenMarkerValue.value = message.data;
  });

  return {
    greenMarkerValue
  };
}

export function initializeRosPolyline(rosUrl: string, topicName: string, messageType: string, map: Map) {
  const ros = new ROSLIB.Ros({
    url: rosUrl,
  });

  ros.on('connection', () => {
    console.log('Connected to ROS websocket server.');
  });

  ros.on('error', (error) => {
    console.log('Error connecting to ROS websocket server: ', error);
  });

  ros.on('close', () => {
    console.log('Connection to ROS websocket server closed.');
  });

  const topic = new ROSLIB.Topic({
    ros: ros,
    name: topicName,
    messageType: messageType,
  });

  const polylineCoordinates: LatLngTuple[] = [];

  topic.subscribe((message: any) => {
    const { latitude, longitude } = message;
    if (latitude !== undefined && longitude !== undefined) {
      const coordinates: LatLngTuple = [latitude, longitude];
      polylineCoordinates.push(coordinates);

      const polyline = L.polyline(polylineCoordinates, { color: 'green' });
      polyline.addTo(map);
    }
  });
}