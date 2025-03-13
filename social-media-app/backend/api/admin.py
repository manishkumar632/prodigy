from django.contrib import admin
from .models import CustomUser, Post, Like, Share, PostImage, Comment

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_active', 'is_staff')
    ordering = ('email',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'content', 'created_at', 'like_count', 'share_count', 'comment_count')
    search_fields = ('user__email', 'content')
    list_filter = ('created_at',)
    ordering = ('-created_at',)


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'created_at')
    search_fields = ('user__email', 'post__id')
    list_filter = ('created_at',)
    ordering = ('-created_at',)


@admin.register(Share)
class ShareAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'message', 'created_at')
    search_fields = ('user__email', 'post__id', 'message')
    list_filter = ('created_at',)
    ordering = ('-created_at',)


@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'image')
    search_fields = ('post__id',)
    ordering = ('id',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'content', 'created_at')
    search_fields = ('user__email', 'post__id', 'content')
    list_filter = ('created_at',)
    ordering = ('-created_at',)
