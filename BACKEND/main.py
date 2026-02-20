from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Added this [cite: 2026-02-18]
from pydantic import BaseModel
from typing import List, Optional
from math import radians, sin, cos, sqrt, atan2

app = FastAPI()

# 1. ADD CORS MIDDLEWARE [cite: 2026-02-18]
# This allows your Java ngrok URL to access this Python service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ungrateful-noninflationary-pinkie.ngrok-free.dev"], # In production, replace "*" with your Java ngrok URL [cite: 2026-02-18]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. DATA MODELS
class Order(BaseModel):
    id: Optional[int] = None
    hostName: Optional[str] = None
    restaurantName: Optional[str] = None
    latitude: float
    longitude: float
    timeWindowMinutes: Optional[int] = None
    status: str = "OPEN"

class FilterRequest(BaseModel):
    target_lat: float
    target_long: float
    orders: List[Order]

# 3. THE MATH
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c

# 4. THE ENDPOINT
@app.post("/filter-nearby")
def filter_orders(request: FilterRequest):
    nearby_list = []
    
    for order in request.orders:
        dist_km = calculate_distance(
            request.target_lat, 
            request.target_long, 
            order.latitude, 
            order.longitude
        )
        
        # INCREASED RADIUS: 2.0 KM is better for testing [cite: 2026-02-18]
        if dist_km <= 2.0: 
            nearby_list.append(order)
            
    print(f"📡 AI Filter: Received {len(request.orders)} | Returning {len(nearby_list)} nearby.")
    return {"nearby_orders": nearby_list}