from fastapi import FastAPI
from src.main import app as main_app

api = FastAPI()

api.mount("/", main_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(api, host="0.0.0.0", port=8000)