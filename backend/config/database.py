import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from models.product import Base, Product
from models.admin import Admin
from core.security import get_password_hash

engine = create_engine('sqlite:///shop_store.db', echo=False)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

if session.query(Product).count() == 0:
    print("Initializing product database...")
    pass
else:
    print("Product catalog is already populated.")

if session.query(Admin).count() == 0:
    print("Creating default admin user...")
    
    hashed_pwd = get_password_hash("123456")
    
    default_admin = Admin(
        email="admin@lojamodelo.com.br",
        hashed_password=hashed_pwd,
        is_active=True
    )
    session.add(default_admin)
    session.commit()
    print("Success! Default admin created: admin@lojamodelo.com.br / 123456")
else:
    print("Admin user already exists in the database.")

session.close()