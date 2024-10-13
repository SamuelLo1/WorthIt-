from fastapi import FastAPI
import requests
import uvicorn
from dotenv import load_dotenv
import os
from urllib.parse import urlencode
import json
import pytesseract
from PIL import Image

# Load the .env file
load_dotenv()

# Access the environment variable
# API_KEY = os.getenv('APP_ID')
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "Worlds"}

@app.get("/test")
async def read_item():
    baseURL ='https://openexchangerates.org/api/latest.json'
    base = 'USD'
    access_key = os.getenv('APP_ID')
    params = {
        "app_id": access_key,  # The API key
        "symbols": "EUR,GBP,CAD,PLN,JPY,CNY"  # The currency symbols to fetch
    }

    # Construct the full URL with the parameters
    url = f"{baseURL}?{urlencode(params)}"

    # Make the request
    # response = requests.get(url)
    # if response.status_code != 200:
    #     return {'error': 'Failed to fetch data'}
    return {url}


@app.get("/item/{item}")
def retrieve_item(item: str):
    response = requests.get('https://fakestoreapi.com/products')
    products = response.json()
    filtered_products = [
        product for product in products if item.lower() in product['title'].lower()
    ]
    
    return filtered_products

# Pytesseract (Image to text)
image_input = "backend/public/avocado_oil.jpeg"
price_tag = Image.open(image_input)

grayscale_image = price_tag.convert("L")
threshold_value = 150 
binary_image = grayscale_image.point(
    lambda x: 0 if x < threshold_value else 255, '1')
resized_image = binary_image.resize((price_tag.width * 11, price_tag.height * 11))

text = pytesseract.image_to_string(resized_image, config='--psm 11')
print(text)

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)