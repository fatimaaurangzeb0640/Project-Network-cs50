from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from datetime import date, datetime
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json

from .models import *


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        first_name = request.POST["firstname"]
        last_name = request.POST["lastname"]
        email = request.POST["email"]


        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password, first_name=first_name, last_name=last_name)
           # user.is_active = False
           # user.first_name = first_name
           # user.last_name = last_name
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def addpost(request):
    return render(request, "network/addpost.html")

def savepost(request):
    content = request.POST["content"]
    now = datetime.now()
    time = str(now.strftime("%H:%M"))
    date = str(now.strftime("%B %d, %Y"))
    likes = 0
    poster = User.objects.get(pk=request.user.id)

    post = Post(content=content, time=time, date=date, likes=likes, poster=poster)
    post.save()

    return HttpResponseRedirect(reverse("index"))

'''
def getposts(request):
    #start = int(request.GET.get("start") or 1)
    #end = int(request.GET.get("end") or start+9)
    postsc = Post.objects.all().count()
    # Generate list of posts
    #posts = [{"id":0,"content":"", "date":"", "time":"", "likes":0, "poster":""}]
    posts = []
    for i in range(1, postsc + 1):
        p = Post.objects.get(pk=i)
        posts.append({"id":i,"content":str(p.content), "date":str(p.date), "time":str(p.time), "likes":p.likes, "poster":str(p.poster.username)})        
    posts.reverse()

    # Return list of posts
    return JsonResponse({
        "posts": posts
    })
'''

def allposts(request):
    posts = Post.objects.all()
    postsc = posts.count()
    poststosend = []
    for i in range(0, postsc):
         #To check if the user likes the post
        liked = True
        try:
            Like.objects.get(Q(liker=request.user) & Q(post=posts[i]))
        except Like.DoesNotExist:
            liked = False
    
        #To get the number of likes
        likes = posts[i].postliked.all().count()

        poststosend.append({"content":str(posts[i].content), 
        "date":str(posts[i].date), 
        "time":str(posts[i].time), 
        "likes":likes, 
        "username":str(posts[i].poster.username),
        "id": posts[i].id,
        "liked":liked,
        })
    poststosend.reverse()
    json.dumps(poststosend)

    #For pagiantion: 10 posts on one page
    paginator = Paginator(poststosend, 10)
    page = request.GET.get('page')

    try:
        items = paginator.page(page)
    except PageNotAnInteger:
        items = paginator.page(1)
    except EmptyPage:
        items = paginator.page(paginator.num_pages)
    
    index = items.number - 1
    max_index = len(paginator.page_range)
    start_index = index - 5 if index >= 5 else 0
    end_index = index + 5 if index <= max_index - 5 else max_index
    page_range = paginator.page_range[start_index:end_index] 

    context = {
            "posts" : poststosend,
            "page_range" : page_range,
            "items": items, 
            "currentuser": request.user
        }
    return render(request, "network/allposts.html", context)

def userprofile(request, username):
    currentuser = request.user
    user = User.objects.get(username=username)
    
    #To check if the current user follows the user profile opened
    followsuser = True
    try:
        Follow.objects.get(Q(follower=currentuser) & Q(following=user))
    except Follow.DoesNotExist:
        followsuser = False

    #To check if the user is opening their own profile
    isuser = False
    if currentuser == user:
        isuser = True
    first_name = user.first_name
    last_name = user.last_name
    email = user.email
    followers = user.followerlist.all().count()
    followings = user.followinglist.all().count()
    posts = user.posters.all()
    postsc = user.posters.all().count()
    poststosend = []
    for i in range(0, postsc):
        #To check if the user likes their own post
        liked = True
        try:
            Like.objects.get(Q(liker=currentuser) & Q(post=posts[i]))
        except Like.DoesNotExist:
            liked = False
        
        #To get the number of likes
        likes = posts[i].postliked.all().count()

        poststosend.append({"content":str(posts[i].content), 
        "date":str(posts[i].date), 
        "time":str(posts[i].time), 
        "likes":likes,
        "id": posts[i].id,
        "liked":liked
        })
    poststosend.reverse()
    json.dumps(poststosend)

    #For pagiantion: 10 posts on one page
    paginator = Paginator(poststosend, 10)
    page = request.GET.get('page')

    try:
        items = paginator.page(page)
    except PageNotAnInteger:
        items = paginator.page(1)
    except EmptyPage:
        items = paginator.page(paginator.num_pages)
    
    index = items.number - 1
    max_index = len(paginator.page_range)
    start_index = index - 5 if index >= 5 else 0
    end_index = index + 5 if index <= max_index - 5 else max_index
    page_range = paginator.page_range[start_index:end_index] 


    context = {
        "currentuser": currentuser,
        "followsuser": followsuser,
        "isuser": isuser,
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "followers": followers,
        "followings": followings,
        "posts": poststosend,
        "page_range" : page_range,
        "items": items, 
    }
    return render(request, "network/userprofile.html", context)    

def follow(request, username):
    follower = request.user
    following = User.objects.get(username=username)
    Follow.objects.create(follower=follower, following=following)
    
    return HttpResponseRedirect(reverse("userprofile", args=(username,)))

def unfollow(request, username):
    follower = request.user
    following = User.objects.get(username=username)
    follow = Follow.objects.get(Q(follower=follower) & Q(following=following))
    follow.delete()
    
    return HttpResponseRedirect(reverse("userprofile", args=(username,)))

def followingposts(request):
    if request.user.is_authenticated:
            posts = []
            p = Post.objects.all()
            pc = p.count()

            user = request.user
            following = user.followinglist.all()
            followingcount = following.count()

            for i in range(0, pc):
                for j in range(0, followingcount):
                    if p[i].poster == following[j].following:
                        posts.append(p[i])

            postsc = len(posts)
            poststosend = []
            for i in range(0, postsc):
                #To check if the user likes the post
                liked = True
                try:
                    Like.objects.get(Q(liker=request.user) & Q(post=posts[i]))
                except Like.DoesNotExist:
                    liked = False
                
                #To get the number of likes
                likes = posts[i].postliked.all().count()

                poststosend.append({"content":str(posts[i].content), 
                "date":str(posts[i].date), 
                "time":str(posts[i].time), 
                "likes":likes, 
                "username":str(posts[i].poster.username),
                "id": posts[i].id,
                "liked":liked,})
            poststosend.reverse()
            json.dumps(poststosend)

            #For pagiantion: 10 posts on one page
            paginator = Paginator(poststosend, 10)
            page = request.GET.get('page')

            try:
                items = paginator.page(page)
            except PageNotAnInteger:
                items = paginator.page(1)
            except EmptyPage:
                items = paginator.page(paginator.num_pages)
    
            index = items.number - 1
            max_index = len(paginator.page_range)
            start_index = index - 5 if index >= 5 else 0
            end_index = index + 5 if index <= max_index - 5 else max_index
            page_range = paginator.page_range[start_index:end_index] 

            context = {
                    "posts" : poststosend,
                    "page_range" : page_range,
                    "items": items, 
                }
            return render(request, "network/allposts.html", context) 
    else:
        context = {
            "message": "Login to proceed."
        }
        return render(request, "network/error.html", context)  

def editpost(request):
    post_id = int(request.GET.get("post_id"))
    content = request.GET.get("content")
    post = Post.objects.get(pk=post_id)
    post.content = content
    post.save()

    return JsonResponse({
        "post_id": post_id,
        "content": content,
        "message": "updated",

    }) 

def likepost(request):
    liker = request.user
    post_id = int(request.GET.get("post_id"))
    post = Post.objects.get(pk=post_id)
    like = Like.objects.create(liker=liker, post=post)
    like.save()

    return JsonResponse({
        "post_id": post_id,
        "message": "liked",

    }) 

def unlikepost(request):
    liker = request.user
    post_id = int(request.GET.get("post_id"))
    post = Post.objects.get(pk=post_id)
    like = Like.objects.get(Q(liker=liker) & Q(post=post))
    like.delete()

    return JsonResponse({
        "post_id": post_id,
        "message": "unliked",

    }) 

def getlikes(request):
    post_id = int(request.GET.get("post_id"))
    post = Post.objects.get(pk=post_id)
    likes = post.postliked.all().count()

    return JsonResponse({
        "likes": likes,

    })

def getfollowdetails(request):
    username = request.GET.get("username")
    user = User.objects.get(username=username)
    followers = user.followerlist.all().count()
    followings = user.followinglist.all().count()

    return JsonResponse({
        "followers": followers,
        "followings": followings,
    }) 
 


