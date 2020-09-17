document.addEventListener('DOMContentLoaded', () => {
    //To open a user's profile
    document.addEventListener('click', event => {
        const element = event.target;
        if (element.className === 'userprofile') {
            const username = element.innerHTML;
            const request = new XMLHttpRequest();
            request.open(`GET`, `/${username}`, true);
            request.onload = () => { window.location.replace(`${username}`) };
            request.send();
        };
    });

    //To follow a user
    document.addEventListener('click', event => {
        const element = event.target;
        if (element.id === 'follow') {
            var username = document.getElementById('follow').dataset.user;
            console.log(username);
            const request = new XMLHttpRequest();
            request.open(`GET`, `/${username}/follow`, true);
            request.onload = () => {
                element.innerHTML = "Unfollow";
                element.id = "unfollow";
            };
            request.send();


            // follow('follow')
        };
        //   if (element.id === 'unfollow') {
        //      follow('unfollow')
        // };
    });

    //To unfollow a user
    document.addEventListener('click', event => {
        const element = event.target;
        if (element.id === 'unfollow') {
            var username = document.getElementById('unfollow').dataset.user;
            console.log(username);
            const request = new XMLHttpRequest();
            request.open(`GET`, `/${username}/unfollow`, true);
            request.onload = () => {
                element.innerHTML = "Follow";
                element.id = "follow";

            };
            request.send();
        };
    });

    //To edit the post
    var posts = document.querySelectorAll('.edit');
    posts.forEach(post => {
        post.onclick = () => {
            var postdiv = post.parentElement;
            var childrencount = (postdiv.children).length
            for (i = 0; i < childrencount; i++) {
                if (postdiv.children[i].className === "post-content") {
                    var postcontentelement = postdiv.children[i];
                    console.log(postcontentelement.innerHTML);
                    var postcontent = postcontentelement.innerHTML;
                    postcontentelement.style.display = "none";
                    var postedit = document.createElement('textarea');
                    postedit.className = "post-edit";
                    postedit.innerHTML = postcontent;
                    postdiv.append(postedit);
                    var editbutton = document.createElement('button');
                    editbutton.className = "save-post";
                    editbutton.innerHTML = "Save";
                    postdiv.append(editbutton);
                }
                if (postdiv.children[i].className === "edit") {
                    var eb = postdiv.children[i];
                    eb.style.display = "none";
                }
            }
            //To save the edited post
            var saveposts = document.querySelectorAll('.save-post');
            saveposts.forEach(savepost => {
                savepost.onclick = () => {
                    console.log("saving");
                    console.log(post.dataset.id);
                    var post_id = post.dataset.id;
                    var content = postedit.value;
                    console.log(content);

                    fetch(`/editpost?post_id=${post_id}&content=${content}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data.message);
                            console.log(data.post_id);
                            console.log(data.content);
                            postedit.style.display = "none";
                            editbutton.style.display = "none";
                            postcontentelement.style.display = "block";
                            postcontentelement.innerHTML = content;
                            eb.style.display = "block";

                        })

                }
            })
        }
    })

    //To like a post
    document.addEventListener('click', event => {
        const element = event.target;
        //console.log(element.parentElement);
        if (element.parentElement.className === 'like-post') {
            var post_id = element.parentElement.dataset.id;
            console.log(post_id);
            fetch(`/likepost?post_id=${post_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.message);
                    console.log(data.post_id);
                    var unlike = element.parentElement;
                    unlike.style.display = "none";
                    var like = document.createElement('img');
                    like.src = "static/network/like.jpg";
                    like.width = "30";
                    like.height = "30";
                    var imglink = document.createElement('a');
                    imglink.href = "javascript:void(0)";
                    imglink.className = "unlike-post";
                    imglink.dataset.id = post_id;
                    imglink.append(like);

                    var pd = element.parentElement.parentElement;
                    console.log(pd);
                    var pdchildren = pd.children;
                    for (i = 0; i < pdchildren.length; i++) {
                        if (pdchildren[i].className === "edit") {
                            var editb = pdchildren[i];
                            editb.style.display = "none";

                        }
                        if (pdchildren[i].className === "post-likes") {
                            var no_of_likes = pdchildren[i];
                            fetch(`/getlikes?post_id=${post_id}`)
                                .then(response => response.json())
                                .then(data => { no_of_likes.innerHTML = data.likes; })
                        }
                    }

                    pd.append(imglink);
                    editb.style.display = "inline";
                    pd.append(editb);
                    console.log(editb);
                    console.log(imglink.className);
                    console.log(imglink.dataset.id);


                })

        }
    })


    //To unlike a post
    document.addEventListener('click', event => {
        const element = event.target;
        console.log(element.parentElement);
        if (element.parentElement.className === 'unlike-post') {
            var post_id = element.parentElement.dataset.id;
            console.log(post_id);
            fetch(`/unlikepost?post_id=${post_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.message);
                    console.log(data.post_id);
                    var like = element.parentElement;
                    like.style.display = "none";
                    var unlike = document.createElement('img');
                    unlike.src = "static/network/unlike.jpg";
                    unlike.width = "30";
                    unlike.height = "30";
                    var imglinku = document.createElement('a');
                    imglinku.href = "javascript:void(0)";
                    imglinku.className = "like-post";
                    imglinku.dataset.id = post_id;
                    imglinku.append(unlike);

                    var pdu = element.parentElement.parentElement;
                    //console.log(pdu);
                    var pdchildren = pdu.children;
                    for (i = 0; i < pdchildren.length; i++) {
                        if (pdchildren[i].className === "edit") {
                            var editb = pdchildren[i];
                            editb.style.display = "none";

                        }
                        if (pdchildren[i].className === "post-likes") {
                            var no_of_likes = pdchildren[i];
                            fetch(`/getlikes?post_id=${post_id}`)
                                .then(response => response.json())
                                .then(data => { no_of_likes.innerHTML = data.likes; })
                        }
                    }
                    pdu.append(imglinku);
                    editb.style.display = "inline";
                    pdu.append(editb);
                    console.log(editb);
                    console.log(imglinku.className);
                    console.log(imglinku.dataset.id);


                })
        }
    })


})

/* function follow(followorunfollow)
 var username = document.getElementById(followorunfollow).dataset.user;
 console.log(username);
 const request = new XMLHttpRequest();
 request.open(`GET`, `/${username}/${followorunfollow}`, true);
 request.onload = () => {
     //follow = document.getElementById(followorunfollow).innerHTML
     //window.location.replace(`${username}`)
     element.innerHTML = followorunfollow;
     element.id = followorunfollow;
 };
 request.send();

});
*/
