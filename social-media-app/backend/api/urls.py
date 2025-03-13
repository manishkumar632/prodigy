from django.urls import path
from .views import signup_view, login_view, post_view, update_user_view, get_user_posts_view, add_user_like

urlpatterns = [
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('posts/', post_view, name='posts'),
    path('update-user/', update_user_view, name='update-user'),
    path('user-posts/', get_user_posts_view, name='get_user_posts'),  # Ensure this line exists
    path('add-user-like/<int:post_id>/', add_user_like, name='add_user_like'),

]
