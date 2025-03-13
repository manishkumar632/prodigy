from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        Token.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

# class PostImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PostImage
#         fields = ["id", "image"]

# class PostVideoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PostVideo
#         fields = ["id", "video"]

# class PostSerializer(serializers.ModelSerializer):
#     images = PostImageSerializer(many=True, read_only=True)
#     videos = PostVideoSerializer(many=True, read_only=True)
#     user = UserSerializer(read_only=True)

#     class Meta:
#         model = Post
#         fields = ['id', 'content', 'images', 'videos', 'created_at', 'user']
