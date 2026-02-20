import requests
import random
import time

# CONNECTION TO JAVA
# We use localhost because both are on your machine now.
JAVA_URL = "http://localhost:8080/api/orders/create"

# CENTER POINT (e.g., Your College Campus)
CAMPUS_LAT = 28.6139 
CAMPUS_LON = 77.2090

# Fake Data Generators
restaurants = ["Dominos", "KFC", "Burger King", "Subway", "Chai Point"]
names = ["Rahul", "Sneha", "Amit", "Priya", "Vikram", "Anjali"]

def generate_fake_order():
    # Random offset to create "nearby" locations (approx 100-500m away)
    lat_offset = random.uniform(-0.003, 0.003)
    lon_offset = random.uniform(-0.003, 0.003)

    # UPDATED JSON STRUCTURE
    # Must match OrderRequestDTO fields exactly
    return {
        "name": random.choice(names),             # Changed from hostName to name
        "restaurantName": random.choice(restaurants),
        "latitude": CAMPUS_LAT + lat_offset,
        "longitude": CAMPUS_LON + lon_offset,
        "price": float(random.randint(200, 800)), # Added missing price field
        "timeWindowMinutes": random.choice([15, 30, 45, 60]) # Matches @Min(5)
    }

print("--- SplitBite Bot Started ---")
print(f"Targeting Java Backend at: {JAVA_URL}")

while True:
    try:
        # 1. Create the data
        order_data = generate_fake_order()
        
        # 2. Send POST request to Java
        response = requests.post(JAVA_URL, json=order_data)
        
        # 3. Log the result
        if response.status_code == 200:
            # Change this line in your while loop:
            print(f"✅ Created Order for {order_data['name']} at {order_data['restaurantName']}")
        else:
            print(f"❌ Failed: {response.text}")
            
    except Exception as e:
        print(f"⚠️ Connection Error: Is the Java Server running? {e}")

    # Wait 10 seconds before next order
    time.sleep(10)