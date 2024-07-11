import rclpy
import csv
from rclpy.node import Node
from sensor_msgs.msg import NavSatFix
from nav_msgs.msg import Path
from geometry_msgs.msg import PoseStamped
from arista_robot import alvin
from rclpy.qos import QoSProfile, ReliabilityPolicy

class GPS_Path(Node):

    def __init__(self):
        super().__init__('gps_path_publisher')
        self.get_logger().info("The node is running")
        custom_qos_profile = QoSProfile(
            reliability=ReliabilityPolicy.BEST_EFFORT,
            depth=1
        )
    
        self.subscription = self.create_subscription(
            NavSatFix,
            '/mavros/global_position/global',
            self.gps_callback,
            qos_profile=custom_qos_profile)
        self.publisher = self.create_publisher(Path, '/gps_path', 10)
        self.path_msg = Path()
        self.path_msg.header.frame_id = 'map'  # Set a default frame_id
        self.home_latitude = None
        self.home_longitude = None
        self.last_latitude = None
        self.last_longitude = None
        self.distance_threshold = 1.0  # Distance threshold in meters

        # Initialize CSV file and writer
        self.csv_filename = 'gps_path.csv'
        self.csv_file = open(self.csv_filename, mode='w', newline='')
        self.csv_writer = csv.writer(self.csv_file)
        self.csv_writer.writerow(['timestamp', 'frame_id', 'latitude', 'longitude'])

    def gps_callback(self, msg):
        if self.home_latitude is None or self.home_longitude is None:
            self.home_latitude = msg.latitude
            self.home_longitude = msg.longitude
            self.last_latitude = msg.latitude  # Initialize last coordinates
            self.last_longitude = msg.longitude
            self.get_logger().info(f"Home coordinates set to ({self.home_latitude}, {self.home_longitude})")
            self.store_coordinates(msg)
        else:
            distance = alvin.calculate_distance(self.last_latitude, self.last_longitude, msg.latitude, msg.longitude)
            if distance >= self.distance_threshold:
                self.store_coordinates(msg)

    def store_coordinates(self, msg):
        pose = PoseStamped()
        pose.header.stamp = self.get_clock().now().to_msg()
        pose.header.frame_id = 'map'  # Ensure consistency in frame_id
        pose.pose.position.x = msg.latitude
        pose.pose.position.y = msg.longitude

        self.path_msg.poses.append(pose)
        self.path_msg.header.stamp = pose.header.stamp  # Use the latest timestamp

        self.publisher.publish(self.path_msg)

        self.csv_writer.writerow([
            f"{pose.header.stamp.sec}.{pose.header.stamp.nanosec}",
            pose.header.frame_id,
            pose.pose.position.x,
            pose.pose.position.y,
        ])

        self.last_latitude = msg.latitude
        self.last_longitude = msg.longitude

    def destroy_node(self):
        self.csv_file.close()
        super().destroy_node()

def main(args=None):
    rclpy.init(args=args)
    gps_path_publisher = GPS_Path()
    rclpy.spin(gps_path_publisher)
    gps_path_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
