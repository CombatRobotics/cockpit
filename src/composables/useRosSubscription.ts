import { ref } from 'vue';
import ROSLIB from 'roslib';

export function useRosSubscription(topicName: string, messageType: string) {
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
