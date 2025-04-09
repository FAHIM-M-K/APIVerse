from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import FileResponse # for favicon
import pyrebase
import os

app = FastAPI()

# Firebase configuration (use environment variables in production)
firebase_config = {
    "apiKey": "AIzaSyAC_roXLUTT90OqdmRPkAQH833kSijWuEo",
    "authDomain": "apiverse-huma.firebaseapp.com",
    "projectId": "apiverse-huma",
    "storageBucket": "apiverse-huma.firebasestorage.app",
    "messagingSenderId": "970662891138",
    "appId": "1:970662891138:web:49eab0a727df9a26066e9b",
    "databaseURL": "https://apiverse-huma.firebaseio.com"  # Not needed for auth/storage
}

# Initialize Firebase
firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

# OAuth2 scheme for token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token["uid"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/protected")
async def protected_route(user_id: str = Depends(get_current_user)):
    return {"message": f"Hello, user {user_id}!"}

@app.get("/")
async def root():
    return {"message": "Welcome to Apiverse!"}

#optional -can remove
@app.get("/favicon.ico")
async def favicon():
    return FileResponse("favicon.ico")