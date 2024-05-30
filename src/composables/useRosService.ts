// rosService.ts

import ROSLIB from 'roslib'

interface ROSResponse {
  success: boolean;
}

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
    // Custom service handling logic
    console.log('Received service request:', request);

    // Example logic: Check if the request matches a view in the store
    const requestedViewName = request.view_name;
    const mapView = store.currentProfile.views.find(
      (view: { name: string }) => view.name === requestedViewName
    );

    if (mapView) {
      response.success = true;
      store.selectView(mapView);
    } else {
      response.success = false;
      console.warn('Map View not found');
    }

    response.send();
  });
};
