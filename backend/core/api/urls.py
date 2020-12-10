from django.urls import path

from .views import (
    AddressUpdateView,
    AddressDeleteView,
    ItemListView, 
    ItemDetailView,
    AddToCartView, 
    OrderDetailView, 
    PaymentView, 
    AddCouponView,
    AddressListView,
    AddressCreateView,
    CountryListView,
    UserIDView,
    OrderItemDeleteView,
    OrderQuantityUpdateView,
    PaymentListView
    )

urlpatterns = [
    path('addresses/', AddressListView.as_view(), name='address-list'),
    path('payments/', PaymentListView.as_view(), name='payment-list'),
    path('address/create/', AddressCreateView.as_view(), name='address-create'),
    path('address/<pk>/update/',
         AddressUpdateView.as_view(), name='address-update'),
    path('address/<pk>/delete/',
         AddressDeleteView.as_view(), name='address-delete'),
    path('products/', ItemListView.as_view(), name='product-list'),
    path('products/<pk>/', ItemDetailView.as_view(), name='product-detail'),
    path('add-to-cart/', AddToCartView.as_view(), name="add-to-cart"),
    path('order-summary/', OrderDetailView.as_view(), name="order-summary"),
    path('checkout/', PaymentView.as_view(), name="checkout"),
    path('add-coupon/', AddCouponView.as_view(), name="add-coupon"),
    path('user-id/', UserIDView.as_view(), name="user-id"),
    path('order-item/update-quantity/', OrderQuantityUpdateView.as_view(), name="order-item-update-quantity"),
    path('order-item/<pk>/delete/', OrderItemDeleteView.as_view(), name='order-item-delete'),
    path('countries/', CountryListView.as_view(), name='country-list'),
]
