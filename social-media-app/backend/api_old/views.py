from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, LoginSerializer

class SignupView(generics.CreateAPIView):
    serializer_class = UserSerializer

# User Login with Token Generation
# @csrf_exempt
# @api_view(['POST'])
# def login_view(request):
#     try:
#         data = json.loads(request.body)
#     except json.JSONDecodeError:
#         return JsonResponse({"error": "Invalid JSON data"}, status=400)

#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return JsonResponse({"error": "Email and password are required"}, status=400)

#     try:
#         user = User.objects.get(email=email)
#     except User.DoesNotExist:
#         return JsonResponse({"error": "Invalid email or password"}, status=400)

#     if check_password(password, user.password):
#         # Authenticate the user to ensure it's a User instance
#         user = authenticate(username=email, password=password)
#         if user is None:
#             return JsonResponse({"error": "Authentication failed"}, status=400)

#         # Generate or retrieve token
#         token, created = Token.objects.get_or_create(user=user)

#         userdata = UserSerializer(user).data
#         userdata['token'] = token.key

#         return JsonResponse({"user": userdata, "message": "Login successful!"})
#     else:
#         return JsonResponse({"error": "Invalid email or password"}, status=400)

# # Create Post (Requires Token Authentication)
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_post_view(request):
#     try:
#         user = request.user
#         content = request.data.get("content", "")

#         post = Post.objects.create(user=user, content=content)

#         uploaded_images = []
#         uploaded_videos = []

#         # ✅ Upload Images to Cloudinary
#         for image in request.FILES.getlist("images"):
#             upload_result = cloudinary.uploader.upload(image)
#             post_image = PostImage.objects.create(post=post, image=upload_result["secure_url"])
#             uploaded_images.append(post_image.image)

#         # ✅ Upload Videos to Cloudinary
#         for video in request.FILES.getlist("videos"):
#             upload_result = cloudinary.uploader.upload(video, resource_type="video")
#             post_video = PostVideo.objects.create(post=post, video=upload_result["secure_url"])
#             uploaded_videos.append(post_video.video)

#         return Response(
#             {
#                 "post": {
#                     "id": post.id,
#                     "content": post.content,
#                     "images": uploaded_images,
#                     "videos": uploaded_videos,
#                     "created_at": post.created_at,
#                     "user": {
#                         "id": post.user.id,
#                         "username": f"{post.user.first_name} {post.user.last_name}",
#                         "email": post.user.email,
#                         "image": post.user.profile_image.url if post.user.profile_image else None
#                     }
#                 },
#                 "message": "Post created successfully!",
#             },
#             status=status.HTTP_201_CREATED
#         )

#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
