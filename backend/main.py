from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import firebase_admin
from firebase_admin import credentials, auth
from fastapi.middleware.cors import CORSMiddleware
import uuid
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK with service account
try:
    cred = credentials.Certificate("apiverse-huma-firebase-adminsdk-fbsvc-70c3fa0329.json")
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print("Failed to initialize Firebase Admin SDK:", str(e))

# In-memory storage for API keys (user_id: api_key)
api_keys = {}

# OAuth2 scheme for token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        print("Verifying token:", token)
        decoded_token = auth.verify_id_token(token)
        print("Decoded token:", decoded_token)
        return decoded_token["uid"]
    except Exception as e:
        print("Token verification failed:", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/protected")
async def protected_route(user_id: str = Depends(get_current_user)):
    return {"message": f"Hello, user {user_id}!"}

@app.post("/generate-api-key")
async def generate_api_key(user_id: str = Depends(get_current_user)):
    # Generate a unique API key
    api_key = str(uuid.uuid4())
    api_keys[user_id] = api_key
    print(f"Generated API key {api_key} for user {user_id}")
    return {"api_key": api_key, "message": "API key generated successfully"}

@app.get("/get-api-key")
async def get_api_key(user_id: str = Depends(get_current_user)):
    api_key = api_keys.get(user_id)
    if api_key:
        return {"api_key": api_key}
    raise HTTPException(
        status_code=status.HTTP404_NOT_FOUND,
        detail="No API key found for this user"
    )

@app.post("/predict")
async def predict(data: dict, api_key: str = Depends(oauth2_scheme)):
    # Validate API key
    valid_user = None
    for user_id, key in api_keys.items():
        if key == api_key:
            valid_user = user_id
            break
    if not valid_user:
        raise HTTPException(
            status_code=status.HTTP401_UNAUTHORIZED,
            detail="Invalid API key"
        )

    # Mock prediction (replace with real ML model later)
    import random
    prediction = random.uniform(0, 1)
    return {"user_id": valid_user, "prediction": prediction, "timestamp": datetime.now().isoformat()}