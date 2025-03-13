from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .models import Post, Comment, PostImage, Share, Like
import cloudinary.uploader

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password', 'bio', 'image', 'date_of_birth', 'gender')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            bio=validated_data.get('bio', ''),
            image=validated_data.get('image', ''),
            date_of_birth=validated_data.get('date_of_birth', None),
            gender=validated_data.get('gender', '')
        )
        Token.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

# ✅ Like Serializer
class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Serialize user details

    class Meta:
        model = Like
        fields = ('id', 'user', 'post', 'created_at')
        read_only_fields = ('post',)  # Prevent modifying the post


# update user serializer
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'bio', 'image', 'date_of_birth', 'gender')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'bio': {'required': False},
            'image': {'required': False},
            'date_of_birth': {'required': False},
            'gender': {'required': False},
        }

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# ✅ Share Serializer
class ShareSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Serialize user details

    class Meta:
        model = Share
        fields = ('id', 'user', 'post', 'message', 'created_at')
        read_only_fields = ('post',)  # Prevent modifying the post


# ✅ Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Serialize user details

    class Meta:
        model = Comment
        fields = ('id', 'user', 'post', 'content', 'created_at')
        read_only_fields = ('post',)


# ✅ Post Image Serializer
class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']


# ✅ Post Serializer
class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Serialize user object
    images = PostImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    tagged_users = UserSerializer(many=True, read_only=True)  # Serialize tagged users
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    share_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'content', 'images', 'uploaded_images', 'tagged_users',
            'like_count', 'comment_count', 'share_count', 'created_at'
        ]
        read_only_fields = ['images', 'created_at']

    # ✅ Custom Methods to Get Counts
    def get_like_count(self, obj):
        return obj.likes.count()

    def get_comment_count(self, obj):
        return obj.post_comments.count()

    def get_share_count(self, obj):
        return obj.shares.count()

    # ✅ Create Post with Image Uploads and Tagged Users
    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])  # Extract images
        tagged_users_data = self.initial_data.get('tagged_users', [])  # Get tagged users
        post = Post.objects.create(**validated_data)  # Create the Post

        # ✅ Handle Tagged Users
        tagged_users = User.objects.filter(id__in=tagged_users_data)
        post.tagged_users.set(tagged_users)

        # ✅ Handle Image Uploads
        for image in uploaded_images:
            uploaded_image = cloudinary.uploader.upload(image)  # Upload to Cloudinary
            PostImage.objects.create(post=post, image=uploaded_image["secure_url"])

        return post
