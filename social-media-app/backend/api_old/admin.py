from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)

# @admin.register(Post)
# class PostAdmin(admin.ModelAdmin):
#     list_display = ('user', 'content', 'created_at', 'updated_at')
#     search_fields = ('user__email', 'content')
#     list_filter = ('created_at', 'updated_at')

# @admin.register(PostImage)
# class PostImageAdmin(admin.ModelAdmin):
#     list_display = ('post', 'image')
#     search_fields = ('post__content',)

# @admin.register(PostVideo)
# class PostVideoAdmin(admin.ModelAdmin):
#     list_display = ('post', 'video')
#     search_fields = ('post__content',)

# @admin.register(Friendship)
# class FriendshipAdmin(admin.ModelAdmin):
#     list_display = ('from_user', 'to_user', 'created_at')
#     search_fields = ('from_user__email', 'to_user__email')
#     list_filter = ('created_at',)

# @admin.register(Like)
# class LikeAdmin(admin.ModelAdmin):
#     list_display = ('user', 'post', 'created_at')
#     search_fields = ('user__email', 'post__content')
#     list_filter = ('created_at',)

# @admin.register(Comment)
# class CommentAdmin(admin.ModelAdmin):
#     list_display = ('user', 'post', 'content', 'created_at')
#     search_fields = ('user__email', 'post__content', 'content')
#     list_filter = ('created_at',)

# @admin.register(TaggedUser)
# class TaggedUserAdmin(admin.ModelAdmin):
#     list_display = ('post', 'user')
#     search_fields = ('post__content', 'user__email')
