import ROSLIB from 'roslib';

export class RosService {
  private ros: ROSLIB.Ros;
  private listener: ROSLIB.Topic;

  constructor() {
    this.ros = new ROSLIB.Ros({
      url: 'ws://localhost:9090'
    });

    this.ros.on('connection', () => {
      console.log('Connected to websocket server.');
    });

    this.ros.on('error', (error) => {
      console.log('Error connecting to websocket server: ', error);
    });

    this.ros.on('close', () => {
      console.log('Connection to websocket server closed.');
    });

    this.listener = new ROSLIB.Topic({
      ros: this.ros,
      name: '/true_heading',
      messageType: 'std_msgs/Float32'
    });
  }

  public startListening(callback: (data: number) => void): void {
    this.listener.subscribe((message: any) => {
      callback(message.data);
    });
  }

  public stopListening(): void {
    this.listener.unsubscribe();
  }
}
