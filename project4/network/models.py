from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Post(models.Model):
    content = models.CharField(max_length=200)
    date = models.CharField(max_length=64)
    time = models.CharField(max_length=64)
    likes = models.IntegerField()
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posters")

    def __str__(self):
        return f"{self.poster}: ({self.content})  {self.time} {self.date} Likes:{self.likes}"

class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followinglist")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followerlist")

    def __str__(self):
        return f"{self.follower} follows {self.following}"

class Like(models.Model):
    liker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="postliker")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="postliked")

    def __str__(self):
        return f"{self.liker} likes {self.post}"