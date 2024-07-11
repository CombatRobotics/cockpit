import rclpy
from rclpy.node import Node
from sensor_msgs.msg import NavSatFix
from arista_interfaces.msg import ReturnPath
from geographiclib.geodesic import Geodesic

class GPSReturnPathNode(Node):

    def __init__(self):
        super().__init__('gps_return_path_node')
        self.last_published_position = None

        self.subscription = self.create_subscription(
            NavSatFix,
            '/mavros/global_position/global',
            self.gps_callback,
            10)
        self.subscription  

        self.publisher_ = self.create_publisher(
            ReturnPath,
            '/return_home_path',
            10)

    def gps_callback(self, msg):
        current_position = (msg.latitude, msg.longitude)

        if self.last_published_position is None:
            self.publish_point(msg)
        else:
            distance = self.calculate_distance(self.last_published_position, current_position)

            if distance >= 5.0: 
                self.publish_point(msg)
                self.last_published_position = current_position 

    def publish_point(self, msg):
        return_path_msg = ReturnPath()
        return_path_msg.latitude = msg.latitude
        return_path_msg.longitude = msg.longitude
        self.publisher_.publish(return_path_msg)

    def calculate_distance(self, pos1, pos2):
        geod = Geodesic.WGS84
        return geod.Inverse(pos1[0], pos1[1], pos2[0], pos2[1])['s12']

def main(args=None):
    rclpy.init(args=args)
    gps_return_path_node = GPSReturnPathNode()
    rclpy.spin(gps_return_path_node)
    gps_return_path_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
