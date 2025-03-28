from django.urls import path
from .views import SignupView
# login_view, create_post_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', SignupView.as_view(), name='signup'),
    # path('login/', login_view, name='login'),
    # path('create_post/', create_post_view, name='create_post'),
]
