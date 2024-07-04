from flask import Flask, send_file
import cv2
from io import BytesIO
from PIL import Image

app = Flask(__name__)

@app.route('/')
def home():
    # Path to your image
    image_path = 'resources/Home Page.png'
    
    # Read the image using OpenCV
    image = cv2.imread(image_path)
    # Convert the image from BGR to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Convert the image to a PIL object
    pil_image = Image.fromarray(image)
    
    # Save the image to a BytesIO object
    img_io = BytesIO()
    pil_image.save(img_io, 'JPEG')
    img_io.seek(0)
    
    # Send the image as a file response
    return send_file(img_io, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True, port=8080)
