import os
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content

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
#test params for model
#later setup fastAPI endpoint to be dynamic
itemName = "plastic water bottle"
price = "10000"
currentType = "JPY"
translateType = "USD"

prompt = (f"I am buying {itemName} and I am in a region where {currentType} currency is used, the cost of {itemName} is {price} {currentType}, if I am originally from the region where {translateType} is used. Generate details of if the product is worth it considering prices of {itemName} in the region where I am from and region of {currentType} also consider comparing the price with online pricing, but take a firm bias in a string and provide an array of similar products. Finally provide a boolean of worthIt or not based on the bias")
response = model.generate_content(prompt)
print(response)
