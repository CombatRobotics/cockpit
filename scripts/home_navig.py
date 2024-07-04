import rclpy
from rclpy.node import Node
from sensor_msgs.msg import NavSatFix
from std_msgs.msg import Float32, Float64
from arista_robot import alvin
from rclpy.qos import QoSProfile, ReliabilityPolicy

class GPS_Navig(Node):
    def __init__(self):
        super().__init__('gps_navig_publisher')
        custom_qos_profile = QoSProfile(
            reliability=ReliabilityPolicy.BEST_EFFORT,
            depth=1
        )

        self.vehicle_heading = None
        self.heading_subscription = self.create_subscription(
            Float64,
            '/mavros/global_position/compass_hdg',
            self.vehicle_heading_callback,
            qos_profile=custom_qos_profile
        )

        self.subscription = self.create_subscription(
            NavSatFix,
            '/mavros/global_position/global',
            self.gps_heading_callback,
            qos_profile=custom_qos_profile
        )

        self.true_heading_publisher = self.create_publisher(Float32, '/true_heading', 10)
        self.distance_publisher = self.create_publisher(Float32, '/distance_from_home', 10)

        # Declare parameters for home location
        self.declare_parameter('home_latitude', 0.0)
        self.declare_parameter('home_longitude', 0.0)

        # Set initial home position
        self.home_latitude = self.get_parameter('home_latitude').get_parameter_value().double_value
        self.home_longitude = self.get_parameter('home_longitude').get_parameter_value().double_value

        self.get_logger().info(f"Home location set to ({self.home_latitude}, {self.home_longitude})")

        # Add a callback for parameter changes
        self.add_on_set_parameters_callback(self.parameter_update_callback)

    def vehicle_heading_callback(self, msg):
        self.vehicle_heading = msg.data
        self.get_logger().info(f"Vehicle heading updated: {self.vehicle_heading}")

    def gps_heading_callback(self, msg):
        latitude = msg.latitude
        longitude = msg.longitude

        x, y = alvin.ll2xy(latitude, longitude, self.home_latitude, self.home_longitude)

        if self.vehicle_heading is not None:
            true_heading = alvin.home_relative_heading(x, y, self.vehicle_heading)
            distance_from_home = alvin.real_time_distance(x, y)

            true_heading_msg = Float32()
            true_heading_msg.data = float(true_heading)
            self.true_heading_publisher.publish(true_heading_msg)

            distance_msg = Float32()
            distance_msg.data = distance_from_home
            self.distance_publisher.publish(distance_msg)

    def parameter_update_callback(self, params):
        for param in params:
            if param.name == 'home_latitude':
                self.home_latitude = param.value
            elif param.name == 'home_longitude':
                self.home_longitude = param.value

        self.get_logger().info(f"Home location updated to ({self.home_latitude}, {self.home_longitude})")
        return rclpy.parameter.ParameterEvent()

    def destroy_node(self):
        super().destroy_node()

def main(args=None):
    rclpy.init(args=args)
    gps_navig_publisher = GPS_Navig()
    rclpy.spin(gps_navig_publisher)
    gps_navig_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
