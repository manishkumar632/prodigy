from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
import json
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.core.serializers import serialize
from django.views.decorators.http import require_POST
from django.core.files.base import ContentFile
import base64
from django.core.exceptions import ObjectDoesNotExist
import cloudinary.uploader
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, permissions
# from .serializers import PostSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# from .models import User, Post, PostImage, PostVideo


# user sign up view
@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # ✅ Safely parse JSON data
            print(data)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        email = data.get('email')
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"message": "User already exists, please login."}, status=400)

        # ✅ Use `.get()` to avoid KeyError
        user = User(
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            email=email,
            password=make_password(data.get('password', '')),
            date_of_birth=data.get('date_of_birth', None),
            gender=data.get('gender', '')
        )
        user.save()

        # ✅ Corrected f-string and removed incorrect semicolon
        userdata = {
            'id': user.id,
            'username': f'{user.first_name} {user.last_name}',
            'email': user.email,
            'image': user.profile_image.url if user.profile_image else None
        }

        return JsonResponse({"user": userdata, "message": "User created successfully!"})
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

# user login view
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({"error": "Email and password are required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"error": "Invalid email or password"}, status=400)
        if check_password(password, user.password):
            userdata = {
                'id': user.id,
                'username': f'{user.first_name} {user.last_name}',
                'email': user.email,
                'image': user.profile_image.url if user.profile_image else None
            }
            return JsonResponse({"user": userdata, "message": "Login successful!"})
        else:
            return JsonResponse({"error": "Invalid email or password"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def fetch_posts_view(request):
    if request.method == 'GET':
        posts = Post.objects.all().order_by('-created_at')
        posts_data = []
        
        for post in posts:
            images = PostImage.objects.filter(post=post).values_list('image', flat=True)
            image_urls = [request.build_absolute_uri(img) for img in images]  # Convert to full URLs
            
            post_data = {
                'id': post.id,
                'content': post.content,
                'images': image_urls,  # Now returns a list of image URLs
                'created_at': post.created_at,
                'user': {
                    'id': post.user.id,
                    'username': f'{post.user.first_name} {post.user.last_name}',
                    'email': post.user.email,
                    'image': request.build_absolute_uri(post.user.profile_image.url) if post.user.profile_image else None
                }
            }
            posts_data.append(post_data)

        return JsonResponse({"posts": posts_data}, safe=False)
    
    return JsonResponse({"error": "Invalid request method"}, status=400)

# @csrf_exempt
# @require_POST
# def create_post_view(request):
#     try:
#         user = User.objects.get(id=request.POST.get('user_id'))
#         content = request.POST.get('content', '')
#         images = request.FILES.getlist('images')
#         videos = request.FILES.getlist('videos')
#         print("Received images:", images)  # Debugging line

#         post = Post(user=user, content=content)
#         post.save()

#         uploaded_images = []
#         uploaded_videos = []

#         for image in images:
#             post_image = PostImage(post=post, image=image)
#             post_image.save()
#             upload_result = cloudinary.uploader.upload(image)

#         for video in videos:
#             post_video = PostVideo(post=post, video=video)
#             post_video.save()

#         post_data = {
#             'id': post.id,
#             'content': post.content,
#             'images': [post_image.image.url for post_image in post.postimage_set.all()],
#             'videos': [post_video.video.url for post_video in post.postvideo_set.all()],
#             'created_at': post.created_at,
#             'user': {
#                 'id': post.user.id,
#                 'first_name': post.user.first_name,
#                 'last_name': post.user.last_name,
#                 'email': post.user.email,
#                 'image': post.user.profile_image.url if post.user.profile_image else None
#             }
#         }

#         return JsonResponse({"post": post_data, "message": "Post created successfully!"}, status=201)
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post_view(request):
    try:
        user = request.user
        content = request.data.get("content", "")

        post = Post.objects.create(user=user, content=content)

        uploaded_images = []
        uploaded_videos = []

        # ✅ Upload Images to Cloudinary
        for image in request.FILES.getlist("images"):
            upload_result = cloudinary.uploader.upload(image)
            post_image = PostImage.objects.create(post=post, image=upload_result["secure_url"])
            uploaded_images.append(post_image.image)

        # ✅ Upload Videos to Cloudinary
        for video in request.FILES.getlist("videos"):
            upload_result = cloudinary.uploader.upload(video, resource_type="video")
            post_video = PostVideo.objects.create(post=post, video=upload_result["secure_url"])
            uploaded_videos.append(post_video.video)

        return Response(
            {
                "post": PostSerializer(post).data,
                "message": "Post created successfully!",
            },
            status=status.HTTP_201_CREATED
        )
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)