import math
import numpy as np

def  mdeglat(lat):
    '''
    Provides meters-per-degree latitude at a given latitude
    
    Args:
    lat (float): latitude

    Returns:
    float: meters-per-degree value
    '''
    latrad = lat*2.0*math.pi/360.0 ;

    dy = 111132.09 - 566.05 * math.cos(2.0*latrad) \
        + 1.20 * math.cos(4.0*latrad) \
        - 0.002 * math.cos(6.0*latrad)
    return dy

def mdeglon(lat):
    '''
    Provides meters-per-degree longitude at a given latitude

    Args:
    lat (float): latitude in decimal degrees

    Returns:
    float: meters per degree longitude
    '''
    latrad = lat*2.0*math.pi/360.0 
    dx = 111415.13 * math.cos(latrad) \
        - 94.55 * math.cos(3.0*latrad) \
    + 0.12 * math.cos(5.0*latrad)
    return dx

def ll2xy(lat, lon, orglat, orglon):
    '''
    AlvinXY: Lat/Long to X/Y
    Converts Lat/Lon (WGS84) to Alvin XYs using a Mercator projection.

    Args:
      lat (float): Latitude of location
      lon (float): Longitude of location
      orglat (float): Latitude of origin location
      orglon (float): Longitude of origin location

    Returns:
      tuple: (x,y) where...
        x is Easting in m (Alvin local grid)
        y is Northing in m (Alvin local grid)
    '''
    x = (lon - orglon) * mdeglon(orglat);
    y = (lat - orglat) * mdeglat(orglat);
    return (x,y)

def xy2ll(x, y, orglat, orglon):

    '''
    X/Y to Lat/Lon
    Converts Alvin XYs to Lat/Lon (WGS84) using a Mercator projection.

    Args:
      x (float): Easting in m (Alvin local grid)
      x (float): Northing in m (Alvin local grid)
      orglat (float): Latitude of origin location
      orglon (float): Longitude of origin location

    Returns:
      tuple: (lat,lon) 
    '''
    lon = x/mdeglon(orglat) + orglon
    lat = y/mdeglat(orglat) + orglat

    return (lat, lon)

def home_relative_heading(x,y,relative_heading):
    # calculate the relative heading off the home coordinates from the real time 
    # rover coordinates in absolute degress from true north

    # case 1
    if x>0 and y>0:
        h = math.atan2(x,y)
        rh = math.degrees(h)
        relative_heading = abs(180 + rh-relative_heading)
    # case 2
    elif x<0 and y>0:
        h = math.atan2(y,-x)
        rh = math.degrees(h)
        relative_heading = abs(90+rh-relative_heading)
    # case 3
    elif x<0 and y<0:
        h = math.atan2(-y,-x)
        rh = math.degrees(h)
        if rh>180:
            relative_heading=abs(math.atan2(-x,-y)+360-relative_heading)
        else:
            relative_heading = abs(90-rh-relative_heading)
    # case 4
    elif x>0 and y<0:
        h = math.atan2(-y,x)
        rh = math.degrees(h)
        relative_heading = abs(270 + rh-relative_heading)
    else:
        relative_heading = 0

    return (relative_heading)
    
def real_time_distance(x,y):
    distance = math.sqrt(x**2 + y**2)
    return(distance)

def calculate_distance(lat1, long1, lat2, long2):
    #  distance in meters between two coordinates
    orglat=lat1
    orglon=long1
    x,y=ll2xy(lat2, long2, orglat, orglon)
    dist = math.sqrt(x**2 + y**2)
    return(dist)

# Vectorize
vxy2ll = np.vectorize(xy2ll)
vll2xy = np.vectorize(ll2xy)