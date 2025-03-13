from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, LoginSerializer, PostSerializer, UserUpdateSerializer
from .models import Post, PostImage
from cloudinary.uploader import upload, destroy
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
import re
from .models import CustomUser, Like

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    serializer = UserSerializer(data=request.data)
    if CustomUser.objects.filter(email=request.data.get('email')).exists():
        return Response({'message': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': serializer.data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(username=serializer.validated_data['email'], password=serializer.validated_data['password'])
        if user:
            token, created = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data  # ✅ Serialize user object properly
            return Response({'user': user_data, 'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# update user
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_view(request):
    user = request.user  # Get the authenticated user

    # print user
    print(user.image)
    try:
        extracted_part = user.image.split("upload/")[1].split("/", 1)[1].split(".")[0]
        # print(extracted_part)
        res = destroy(extracted_part)
        print(res)
    except:
        print("No image to delete")
    # Handle image upload
    image = request.FILES.get('image')
    if image:  # Upload only if an image is provided
        try:
            result = upload(image, folder="user_profile_image")
            request.data['image'] = result['secure_url']  # Replace image with uploaded URL
        except Exception as e:
            return Response({'error': f'Image upload failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserUpdateSerializer(user, data=request.data, partial=True)

    if not serializer.is_valid():
        print("Serializer Errors:", serializer.errors)  # Debugging - Print validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()
    return Response({'message': 'User updated successfully', 'user': serializer.data}, status=status.HTTP_200_OK)

# Post view
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_view(request):
    if request.method == 'GET':
        posts = Post.objects.all().select_related('user').order_by('-created_at')  # ✅ Optimize DB query and sort by latest date created
        serializer = PostSerializer(posts, many=True)
        return Response({"posts": serializer.data})

    if request.method == 'POST':
        content = request.data.get('content', '')
        images = request.FILES.getlist('images', [])  # Get uploaded images

        post = Post.objects.create(user=request.user, content=content)

        # ✅ Upload images to Cloudinary and save their URLs
        for image in images:
            try:
                result = upload(image, folder="post_images")
                PostImage.objects.create(post=post, image=result['secure_url'])
            except Exception as e:
                print(f"❌ Image Upload Failed: {e}")

        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Set up logging
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_posts_view(request):
    user = request.user  # Get the authenticated user
    posts = Post.objects.filter(user=user).select_related('user').order_by('-created_at')  # Get posts for the current user
    
    serializer = PostSerializer(posts, many=True)  # Serialize the posts
    # Check if there are no posts and log the information
    if not posts.exists():
        return Response({"message": "No posts found for this user."}, status=status.HTTP_404_NOT_FOUND)
    return Response({"posts": serializer.data}, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_user_like(request, post_id):  # Ensure this matches the URL pattern
    user = request.user

    # Get the post by ID
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user has already liked the post
    existing_like = Like.objects.filter(user=user, post=post).first()
    if existing_like:
        # If the user already liked the post, remove the like
        existing_like.delete()
        return Response({'message': 'Like removed successfully!', 'like_count': post.like_count()}, status=status.HTTP_200_OK)
    else:
        # Create a new like
        Like.objects.create(user=user, post=post)
        return Response({'message': 'Post liked successfully!', 'like_count': post.like_count()}, status=status.HTTP_201_CREATED)