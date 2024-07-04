import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64
from flask import Flask, render_template_string
from flask_socketio import SocketIO
import threading

app = Flask(__name__)
socketio = SocketIO(app)
latest_data = 0

class IntSubscriber(Node):

    def __init__(self):
        super().__init__('int_subscriber')
        self.subscription = self.create_subscription(
            Float64,
            '/system_ping',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        global latest_data
        latest_data = msg.data
        self.get_logger().info('Received: "%.3f"' % msg.data)
        socketio.emit('update_value', {'value': latest_data})

def flask_thread():
    socketio.run(app, host='0.0.0.0', port=5000)
    # http://127.0.0.1:5000

@app.route('/')
def index():
    return render_template_string('''
        <!DOCTYPE html>
        <html>
        <head>
            <title>ROS 2 Float64 Subscriber</title>
            <style>
                .value {
                    font-size: 24px;
                    font-weight: bold;
                }
                .green {
                    color: green;
                }
                .yellow {
                    color: rgb(255, 166, 0);
                }
                .red {
                    color: red;
                }
                .wifi-symbol {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    background-image: url('https://img.icons8.com/ios-filled/50/000000/wifi.png');
                    background-size: contain;
                    vertical-align: middle;
                }
            </style>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.0/socket.io.js"></script>
            <script type="text/javascript">
                document.addEventListener('DOMContentLoaded', (event) => {
                    var socket = io();
                    socket.on('update_value', function(data) {
                        var roundedValue = parseFloat(data.value).toFixed(3);
                        var valueElement = document.getElementById('value');
                        
                        // Update the value text
                        valueElement.innerText = roundedValue;
                        
                        // Apply color based on the value
                        if (data.value >= 100) {
                            valueElement.className = 'value red';
                        } else if (data.value >= 50) {
                            valueElement.className = 'value yellow';
                        } else {
                            valueElement.className = 'value green';
                        }
                    });
                });
            </script>
        </head>
        <body>
            <div id="value" class="value green">0.000</div>
        </body>
        </html>
    ''')

def main(args=None):
    rclpy.init(args=args)
    int_subscriber = IntSubscriber()
    
    flask_app_thread = threading.Thread(target=flask_thread)
    flask_app_thread.start()

    rclpy.spin(int_subscriber)

    int_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()




# import rclpy
# from rclpy.node import Node
# from std_msgs.msg import Float64
# from flask import Flask, render_template_string
# from flask_socketio import SocketIO
# import threading

# app = Flask(__name__)
# socketio = SocketIO(app)
# latest_data = 0

# class IntSubscriber(Node):

#     def __init__(self):
#         super().__init__('int_subscriber')
#         self.subscription = self.create_subscription(
#             Float64,
#             '/system_ping',
#             self.listener_callback,
#             10)
#         self.subscription  # prevent unused variable warning

#     def listener_callback(self, msg):
#         global latest_data
#         latest_data = msg.data
#         self.get_logger().info('Received: "%.3f"' % msg.data)
#         socketio.emit('update_value', {'value': latest_data})

# def flask_thread():
#     socketio.run(app, host='0.0.0.0', port=5000)

# @app.route('/')
# def index():
#     return render_template_string('''
#         <!DOCTYPE html>
#         <html>
#         <head>
#             <title>ROS 2 Float64 Subscriber</title>
#             <style>
#                 .value {
#                     color: green;
#                     font-size: 24px;
#                     font-weight: bold;
#                 }
#                 .wifi-symbol {
#                     display: inline-block;
#                     width: 24px;
#                     height: 24px;
#                     background-image: url('https://img.icons8.com/ios-filled/50/000000/wifi.png');
#                     background-size: contain;
#                     vertical-align: middle;
#                 }
#             </style>
#             <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.0/socket.io.js"></script>
#             <script type="text/javascript">
#                 document.addEventListener('DOMContentLoaded', (event) => {
#                     var socket = io();
#                     socket.on('update_value', function(data) {
#                         var roundedValue = parseFloat(data.value).toFixed(3);
#                         document.getElementById('value').innerText = roundedValue;
#                     });
#                 });
#             </script>
#         </head>
#         <body>
#             <div class="value" id="value">{{ value }}</div>
#         </body>
#         </html>
#     ''')

# def main(args=None):
#     rclpy.init(args=args)
#     int_subscriber = IntSubscriber()
    
#     flask_app_thread = threading.Thread(target=flask_thread)
#     flask_app_thread.start()

#     rclpy.spin(int_subscriber)

#     int_subscriber.destroy_node()
#     rclpy.shutdown()

# if __name__ == '__main__':
#     main()
