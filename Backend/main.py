from fastapi import FastAPI, HTTPException
import requests
import uvicorn
from dotenv import load_dotenv
import os
from urllib.parse import urlencode
import json
import pytesseract
from PIL import Image

from pydantic import BaseModel
import base64
from io import BytesIO

# Load the .env file
load_dotenv()

# Access the environment variable
# API_KEY = os.getenv('APP_ID')
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
@app.get("/")
def read_root():
    return {"Hello": "Worlds"}

@app.get("/test/")
async def read_item(currentType: str, translateType: str, price: str):
    baseURL ='https://openexchangerates.org/api/latest.json'
    base = 'USD' # other currency rates require a pay wall
    access_key = os.getenv('APP_ID')
    params = {
        "app_id": access_key,  # The API key
        "base": base,  # The base currency
        "symbols": "EUR,GBP,CAD,PLN,JPY,CNY"  # The currency symbols to fetch
    }

    # Construct the full URL with the parameters
    url = f"{baseURL}?{urlencode(params)}"
    url = url.replace('+%23+currency+API', "")
    
    # return ({'t': {url}, 'b': {"https://openexchangerates.org/api/latest.json?app_id=69a2849383304924b556cb86e305216b&symbols=EUR%2CGBP%2CCAD%2CPLN%2CJPY%2CCNY"}})
    url = url.replace('+%23+currency+API', "")
    
    # return ({'t': {url}, 'b': {"https://openexchangerates.org/api/latest.json?app_id=69a2849383304924b556cb86e305216b&symbols=EUR%2CGBP%2CCAD%2CPLN%2CJPY%2CCNY"}})
    # Make the request
    response = requests.get(url)
    if response.status_code != 200:
        return {'error': 'Failed to fetch data'}
    
    #perform calculation: get currentType to USD, then multiply that by the translateType
    if translateType != 'USD':
        convertedPrice = format((float(price) / float(response.json().get('rates').get(currentType))) * float(response.json().get('rates').get(translateType)), ".2f") #format to 2 decimal places
        return str(convertedPrice)
    else: 
        convertedPrice = format(float(price) / float(response.json().get('rates').get(currentType)), ".2f") #format to 2 decimal places
        return str(convertedPrice)
    


@app.get("/item/{item}")
def retrieve_item(item: str):
    response = requests.get('https://fakestoreapi.com/products')
    products = response.json()
    filtered_products = [
        product for product in products if item.lower() in product['title'].lower()
    ]
    
    return filtered_products

# Pytesseract (Image to text)
class ImageData(BaseModel):
    base64Image: str

@app.post("/upload-base64")
async def process_image(image_data: ImageData):
    print("trigged image endpoint")
    try:
        # Checking if the image starts with "data:image/" to remove the header
        if image_data.base64Image.startswith("data:image/"):
            image_data.base64Image = image_data.base64Image.split(",")[1]
        
        # Decode the base64 image data
        image_bytes = base64.b64decode(image_data.base64Image)
        image = Image.open(BytesIO(image_bytes))

        # Convert image to grayscale and resize it for better OCR
        grayscale_image = image.convert("L")
        threshold_value = 150
        binary_image = grayscale_image.point(lambda x: 0 if x < threshold_value else 255, '1')
        resized_image = binary_image.resize((image.width * 8, image.height * 8))

        # Use pytesseract to extract text from the image
        text = pytesseract.image_to_string(resized_image, config='--psm 11')
        return {"extracted_text": text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)