# Import necessary modules from SQLAlchemy and SerializerMixin for serialization.
import re

from config import bcrypt, db
from sqlalchemy import MetaData, null
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from helpers import (
    validate_not_blank,
    validate_type,
)
from sqlalchemy.ext.hybrid import hybrid_property


class Item(db.Model, SerializerMixin):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String)
    imageAlt = db.Column(db.String)
    inStock = db.Column(db.Boolean, default=True)

    # Relationships

    item_categories = db.relationship(
        "ItemCategory", back_populates="item", cascade="all, delete-orphan"
    )
    categories = association_proxy("item_categories", "category")

    # Serializations

    serialize_rules = ("-item_categories",)

    # Validations

    @validates("name", "description", "image_url", "imageAlt")
    def validate_not_blank(self, key, value):
        return validate_not_blank(value, key)

    def to_dict(self, convert_price_to_dollars=True):
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "imageAlt": self.imageAlt,
            "inStock": self.inStock,
        }
        return data

    def __repr__(self):
        return f"<Product {self.name}>"


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    # Relationships

    item_categories = db.relationship(
        "ItemCategory", back_populates="category", cascade="all, delete-orphan"
    )
    items = association_proxy("item_categories", "item")

    # Serializations

    serialize_rules = ("-item_categories",)

    # Validations

    @validates("name")
    def validate_name(self, key, name):
        return validate_not_blank(name, key)

    def __repr__(self):
        return f"<Category {self.name}>"


class ItemCategory(db.Model, SerializerMixin):
    __tablename__ = "item_categories"

    id = db.Column(db.Integer, primary_key=True)

    # ForeignKeys

    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)

    # Relationships

    item = db.relationship("Item", back_populates="item_categories")
    category = db.relationship("Category", back_populates="item_categories")

    # Serializations

    serialize_rules = ("-item.item_categories", "-category.item_categories")

    # Validations

    @validates("item_id", "category_id")
    def validate_ids(self, key, value):
        value = validate_type(value, key, int)
        if value is None:
            raise ValueError(f"{key} must not be null.")
        return value

    def __repr__(self):
        return f"<ItemCategory Item: {self.product_id}, Category: {self.category_id}>"


class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(255), nullable=True)
    lastname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    _password_hash = db.Column(db.String(255), nullable=False)
    address = db.Column((db.Text), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)
    zip = db.Column(db.String(255), nullable=False)

    # Relationships

    orders = db.relationship(
        "Order", back_populates="user", cascade="all, delete-orphan"
    )

    # Serializations

    serialize_rules = ("-orders",)

    # Validations

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed.")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

    @validates("email")
    def validate_email(self, key, value):
        # Check if the provided email is in a valid format
        if not re.match("[^@]+@[^@]+\.[^@]+", value):
            raise ValueError("Invalid email address.")
        # Check if the provided email already exists in the database
        existing_user = User.query.filter(User.email == value).first()
        if existing_user and existing_user is not self:
            raise ValueError("Email already exists. Please choose a different email.")
        return value


class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relationships

    order_details = db.relationship(
        "OrderDetail", back_populates="order", cascade="all, delete-orphan"
    )
    user = db.relationship("User", back_populates="orders")

    # Serializations

    serialize_rules = (
        "-order_detail",
        "user",
    )


class OrderDetail(db.Model, SerializerMixin):
    __tablename__ = "order_details"
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)

    # Relationships

    order = db.relationship("Order", back_populates="order_details")
    item = db.relationship("Item")

    # Serializations

    serialize_rules = (
        "-order",
        "-item",
    )
