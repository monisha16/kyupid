# Kyupid
![image](https://github.com/monisha16/kyupid/assets/25998193/5677acae-8b33-43fa-9640-25465cef3168)



Kyupid is a dating app/service for Bangalore users. <br/>
This web application uses MapboxGL to represent Kyupid's users data and provide area wise insights on their app usage.
### API Details

```jsx
API_URL: https://kyupid-api.vercel.app/api
```

The sample GeoJSON data for areas in Bangalore

```jsx
ENDPOINT: /areas
METHOD: GET
```

```jsx
{
    "type": "FeatureCollection",
    "features": [
        ...
        {
            "type": "Feature",
            "properties": {
                "area_id": 124,
                "name": "Koramangala",
		   "pincode": 12345
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [] // coordinates for the polygon
            }
        }
        ...
    ]
}
```

Sample API response for the users

```jsx
ENDPOINT: /users
METHOD: GET
```

```jsx
{
    "users": [
        {
            "user_id": 1,
            "area_id": 124, // represents the area user belongs to
            "age": 23,
            "gender": M, // M -> Male, F -> Female
            "is_pro_user": true,
            "total_matches": 5,
        }
    ]
}
```

