import pandas as pd
import requests
import json
import geojson
from datetime import datetime

with open('./fiets_routes_CC.geojson') as f:
    data = json.load(f)
features = data["features"]

routes = []
for feature in features:
    properties = feature["properties"]
    route_id = properties["TripID"]
    start_time = properties["STARTTIME"]
    start_time =  datetime.strptime(start_time,'%Y-%m-%d %H:%M:%S').isoformat()

    geometry = feature["geometry"]
    coordinates = geometry["coordinates"]
    start_point = coordinates[0][::-1]
    start_point = "geo!"+str(start_point[0])+","+str(start_point[1])
    stop_point = coordinates[-1][::-1]
    stop_point = "geo!" + str(stop_point[0]) + "," + str(stop_point[1])

    payload = {'waypoint0': start_point, 'waypoint1': stop_point, 'departure': start_time, 'routeattributes':'waypoints,shape','app_id': '1ieXCwy1y12Q16FZ60a5', 'app_code': 'BcPxiurC5L_L09Tdb-7T3Q', 'mode':'fastest;car;traffic:enabled'}
    r = requests.post('https://route.cit.api.here.com/routing/7.2/calculateroute.json', params=payload)
    response = json.loads(r.text)["response"]

    shape = response["route"][0]["shape"]
    duration = response["route"][0]["leg"][0]["travelTime"]

    route = {"tripID":route_id,"shape":shape,"duration":duration}
    routes.append(route)

output = {"routes":routes}
with open('carroutes.json', 'w') as outfile:
    json.dump(output, outfile)
