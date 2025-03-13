from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class ChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages", null=True, blank=True)
    group_name = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)  # New field to track if the message is read

    def __str__(self):
        return f"{self.sender} -> {self.receiver or self.group_name}: {self.message[:50]}"
