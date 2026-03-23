from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = 'products' 

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False) 
    brand = Column(String(50), default="Loja Modelo")
    
    category = Column(String(50), nullable=False) 
    size = Column(String(10), nullable=False) 
    
    price = Column(Float, nullable=False) 
    old_price = Column(Float, nullable=True) 
    is_on_sale = Column(Boolean, default=False) 
    
    image_url = Column(String(255), nullable=True) 
    description = Column(String(500), nullable=True) 

    def __repr__(self):
        return f"<Product(name='{self.name}', size='{self.size}', price={self.price})>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "category": self.category,
            "size": self.size,
            "price": self.price,
            "old_price": self.old_price,
            "is_on_sale": self.is_on_sale,
            "image_url": self.image_url,
            "description": self.description 
        }