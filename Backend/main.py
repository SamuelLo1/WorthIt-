from fastapi import FastAPI, HTTPException
import requests
import uvicorn
from dotenv import load_dotenv
import os
from urllib.parse import urlencode
import json
import pytesseract
from PIL import Image
import re
from pydantic import BaseModel
import base64
from io import BytesIO

import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content

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

# OCR endpoint to extract text from image and use that for prompting
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
        threshold_value = 130
        binary_image = grayscale_image.point(lambda x: 0 if x < threshold_value else 255, '1')
        resized_image = binary_image.resize((image.width * 2, image.height * 2))

        # Use pytesseract to extract text from the image

        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(resized_image, config=custom_config)
        match = re.search(r'([A-Za-z\s]+)\s([\$€£])(\d+(\.\d{2})?)', text)
        if match:
            product_name = match.group(1).strip()
            currency = match.group(2)
            price = match.group(3)
        else: 
            product_name = None
            currency = None
            price = None

        return ({"extracted_text": text,
                "product_name": product_name,
                "currency": currency,
                "price": price
                })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    
# configuring AI response and model
genai.configure(api_key=os.getenv("GEMINI_KEY"))

generation_config = {
  "temperature": 1.25,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_schema": content.Schema(
    type = content.Type.OBJECT,
    properties = {
      "similarProds": content.Schema(
        type = content.Type.ARRAY,
        items = content.Schema(
          type = content.Type.STRING,
        ),
      ),
      "worthOrNot": content.Schema(
        type = content.Type.BOOLEAN,
      ),
      "details": content.Schema(
        type = content.Type.STRING,
      ),
    },
  ),
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

@app.get("/productAnalysis/")
async def gen_analysis(itemName:str, currentType: str, translateType: str, price: str):
    prompt = (f"I am buying {itemName} and I am in a region where {currentType} currency is used, the cost of {itemName} is {price} {currentType}, if I am originally from the region where {translateType} is used. Generate details of if the product is worth it considering prices of {itemName} in the region where I am from and region of {currentType} also consider comparing the price with online pricing, but take a firm bias in a string and provide an array of similar products. Finally provide a boolean of worthIt or not based on the bias")
    try: 
      response = model.generate_content(prompt)
      json_response = json.loads(response.text)
      return {
            "details": json_response["details"], 
            "worthOrNot": json_response["worthOrNot"], 
            "similarProds": json_response["similarProds"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}") 

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)