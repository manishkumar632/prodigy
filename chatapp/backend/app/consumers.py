import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from channels.db import database_sync_to_async
from .models import ChatMessage

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
    data = json.loads(text_data)
    message = data['message']
    sender = self.scope['user']

    if not sender.is_authenticated:
        return

    # Save message with read=False
    chat_message = await self.save_message(sender, message)

    # Notify only the receiver (if one-on-one chat)
    if chat_message.receiver:
        await self.send_unread_notification(chat_message.receiver)

    # Broadcast the message
    await self.channel_layer.group_send(
        self.room_group_name,
        {
            "type": "chat_message",
            "message": message,
            "sender": sender.username,
            "timestamp": str(chat_message.timestamp),
        }
    )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, sender, message):
        return ChatMessage.objects.create(sender=sender, message=message, group_name=self.room_name)

    @database_sync_to_async
    def send_unread_notification(self, receiver):
        unread_count = ChatMessage.objects.filter(receiver=receiver, read=False).count()
        self.channel_layer.group_send(
            f"user_{receiver.username}",
            {"type": "notification", "unread_count": unread_count}
        )