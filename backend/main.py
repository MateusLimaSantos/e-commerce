import sys
import shutil
import uuid
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
FRONTEND_DIR = BASE_DIR / "frontend"
DB_PATH = BASE_DIR / "shop_store.db"

UPLOAD_DIR = FRONTEND_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

sys.path.append(str(BACKEND_DIR))

from models.product import Product
from api import auth
from api.auth import get_current_admin

engine = create_engine(f'sqlite:///{DB_PATH}', echo=False)
SessionLocal = sessionmaker(bind=engine)

app = FastAPI(title="Shop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["Auth"])

class ProductCreate(BaseModel):
    name: str
    category: str
    size: str
    price: float
    old_price: float | None = None
    is_on_sale: bool = False
    image_url: str | None = None
    description: str | None = None

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...), admin = Depends(get_current_admin)):
    try:
        extension = file.filename.split(".")[-1]
        file_name = f"{uuid.uuid4().hex}.{extension}"
        full_path = UPLOAD_DIR / file_name
        
        with open(full_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {"image_url": f"uploads/{file_name}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

@app.get("/api/produtos")
def get_products():
    session = SessionLocal()
    products = session.query(Product).all()
    session.close()
    return [product.to_dict() for product in products]

@app.post("/api/produtos")
def add_product(product: ProductCreate, admin = Depends(get_current_admin)):
    session = SessionLocal()
    new_product = Product(**product.dict())
    session.add(new_product)
    session.commit()
    session.refresh(new_product) 
    session.close()
    return new_product.to_dict()

@app.delete("/api/produtos/{product_id}")
def delete_product(product_id: int, admin = Depends(get_current_admin)):
    session = SessionLocal()
    product = session.query(Product).filter(Product.id == product_id).first()
    if not product:
        session.close()
        raise HTTPException(status_code=404, detail="Product not found.")
    session.delete(product)
    session.commit()
    session.close()
    return {"message": "Product successfully deleted."}

if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
else:
    print("WARNING: Frontend directory not found.")