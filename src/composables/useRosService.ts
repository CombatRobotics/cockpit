// rosService.ts

import L, { LatLngTuple ,Map} from 'leaflet';
import ROSLIB from 'roslib'


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

export function initializeRosService(ros: ROSLIB.Ros, serviceName: string, csvFilePath: string, map: Map) {
  // const ros = new ROSLIB.Ros({
  //   url: rosUrl,
  // });

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
    serviceType: 'interfaces/srv/ReturnPath',  // Use your actual package name
  });

  service.advertise(async (request, response) => {
    try {
      const coordinates = await readCoordinatesFromCSV(csvFilePath);
      console.log(csvFilePath);
      drawPolylineOnMap(coordinates, map);

      if (request.show_return_path) {
        const returnCoordinates = [...coordinates].reverse();
        drawPolylineOnMap(returnCoordinates, map, 'blue');
      }

      response.success = true;
    } catch (error) {
      console.log('Error processing service request: ', error);
      response.success = false;
    }
    response.success;
    return true;
  });
}

async function readCoordinatesFromCSV(filePath: string): Promise<LatLngTuple[]> {
  const response = await fetch(filePath);
  const data = await response.text();

  const polylineCoordinates: LatLngTuple[] = [];

  data.split('\n').forEach((line) => {
    const [latitude, longitude] = line.split(',').map(Number);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      polylineCoordinates.push([latitude, longitude]);
    }
  });

  return polylineCoordinates;
}

function drawPolylineOnMap(coordinates: LatLngTuple[], map: Map, color: string = 'green') {
  const polyline = L.polyline(coordinates, { color });
  polyline.addTo(map);
}
