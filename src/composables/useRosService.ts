// rosService.ts

// import L, { LatLngTuple ,Map} from 'leaflet';
import { ref,onMounted } from 'vue';
import L, { type LatLngTuple, Map } from 'leaflet';
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

// export function initializeRosService(ros: ROSLIB.Ros, serviceName: string, map: Map) {
//   // const ros = new ROSLIB.Ros({
//   //   url: rosUrl,
//   // });

//   ros.on('connection', () => {
//     console.log('Connected to ROS websocket server.');
//   });

//   ros.on('error', (error) => {
//     console.log('Error connecting to ROS websocket server: ', error);
//   });

//   ros.on('close', () => {
//     console.log('Connection to ROS websocket server closed.');
//   });

//   const service = new ROSLIB.Service({
//     ros: ros,
//     name: serviceName,
//     serviceType: 'arista_interfaces/srv/ReturnPath',
//   });

//   service.advertise(async (request, response) => {
//     try {
//       const coordinates = await readCoordinatesFromCSV(csvFilePath);
//       console.log(csvFilePath);
//       drawPolylineOnMap(coordinates, map);

//       if (request.show_return_path) {
//         const returnCoordinates = [...coordinates].reverse();
//         drawPolylineOnMap(returnCoordinates, map, 'blue');
//       }

//       response.success = true;
//     } catch (error) {
//       console.log('Error processing service request: ', error);
//       response.success = false;
//     }
//     response.success;
//     return true;
//   });
// }


export function initializeRosService(rosUrl: string, serviceName: string, map: Map) {

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

  service.advertise((request, response) => {
    try {
      const { latitude, longitude } = request;

      // Use the latitude and longitude to create a coordinate object
      const coordinates: LatLngTuple = [latitude, longitude];
      // const coordinate = { lat: latitude, lng: longitude };
      // const polylineCoordinates: LatLngTuple[] = [];

      // Draw the polyline on the map
      drawPolylineOnMap([coordinates], map);

      // Optionally handle the set_home flag if needed
      if (request.set_home) {
        // Handle the set_home logic here if necessary
        console.log('Set home requested');
      }

      response.success = true;
    } catch (error) {
      console.log('Error processing service request: ', error);
      response.success = false;
    }
    return response.success;
  });
}

// async function readCoordinatesFromCSV(filePath: string): Promise<LatLngTuple[]> {
//   const response = await fetch(filePath);
//   const data = await response.text();

//   const polylineCoordinates: LatLngTuple[] = [];

//   data.split('\n').forEach((line) => {
//     const [latitude, longitude] = line.split(',').map(Number);
//     if (!isNaN(latitude) && !isNaN(longitude)) {
//       polylineCoordinates.push([latitude, longitude]);
//     }
//   });

//   return polylineCoordinates;
// }

function drawPolylineOnMap(coordinates: LatLngTuple[], map: Map, color: string = 'green') {
  const polyline = L.polyline(coordinates, { color });
  polyline.addTo(map);
}
