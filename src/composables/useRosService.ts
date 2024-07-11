// rosService.ts

// import L, { LatLngTuple ,Map} from 'leaflet';
import { ref,onMounted } from 'vue';
import L, { Map } from 'leaflet';
import ROSLIB from 'roslib'

type LatLngTuple = [number, number];



export const handleService = (
  ros: ROSLIB.Ros,
  store: any,
  serviceName: string,
  serviceType: string
) => {
  const service = new ROSLIB.Service({
    ros: ros,
    name: serviceName,
    serviceType: serviceType,
  });

  service.advertise((request: any, response) => {

    console.log('Received service request:', request);


    const requestedViewName = request.view_name;
    const mapView = store.currentProfile.views.find(
      (view: { name: string }) => view.name === requestedViewName
    );

    if (mapView) {
      response.success = true;
      console.log('Response :', response);
      store.selectView(mapView);
    } else {
      response.success = false;
      console.warn('Map View not found');
    }

    response.success;

    return true;
  });
};



export function initializeRosServicePolyline(rosUrl: string, serviceName: string, map: Map) {
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

  const service = new ROSLIB.Service({
    ros: ros,
    name: serviceName,
    serviceType: 'arista_interfaces/srv/SetHome', 
  });
  const polylineCoordinates: LatLngTuple[] = [];
  service.advertise((request, response) => {
    try {
      console.log('Received service request:', request);
      const latitude = request.latitude; 
      const longitude = request.longitude;

      const coordinates: LatLngTuple = [latitude, longitude];
      polylineCoordinates.push(coordinates);
      const polyline = L.polyline(polylineCoordinates, { color: 'green' });
      polyline.addTo(map);


      response.success = true;
    } catch (error) {
      console.log('Error processing service request: ', error);
      response.success = false;
    }
    return response.success;
  });
}
