import cloudinary.uploader

import os
from decouple import config
cloudinary.config(
    cloud_name= config('CLOUDINARY_CLOUD_NAME'),
    api_key= config('CLOUDINARY_CLOUD_API'),
    api_secret= config('CLOUDINARY_CLOUD_API_SECRET')
)

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': config('CLOUDINARY_CLOUD_API'),
    'API_SECRET': config('CLOUDINARY_CLOUD_API_SECRET'),
}


response = cloudinary.uploader.upload("c:\\Users\\manis\\Pictures\\Screenshots\\Screenshot 2025-02-25 000131.png")
print(response)
