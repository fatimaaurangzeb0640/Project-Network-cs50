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

    //To open follow a user
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

    //To open unfollow a user
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
    function load() {

        // Set start and end post numbers, and update counter
        const start = 1;
        const end = 10;
        //counter = end + 1;

        // Get new posts and add posts
        /* fetch(`/getposts?start=${start}&end=${end}`)
             .then(response => response.json())
             .then(data => {
                 data.posts.forEach(add_post);
             })
             */
        fetch(`/getposts`)
            .then(response => response.json())
            .then(data => {
                data.posts[1]["likes"]
                data.posts.forEach(add_post);
            })
    };

    function add_post(contents) {
        // Create new post
        const post = document.createElement('div');
        post.className = 'post';
        const id = contents["id"]
        if (id !== 0) {
            //console.log(contents["id"]);
            const poster = document.createElement('a');
            poster.className = "poster";
            poster.innerHTML = contents["poster"];
            poster.href = "#";

            const content = document.createElement('p');
            content.className = "content";
            content.innerHTML = contents["content"];
            const date = document.createElement('p');
            date.className = "date";
            date.innerHTML = contents["date"];
            const time = document.createElement('time');
            time.className = "time";
            time.innerHTML = contents["time"];
            const likes = document.createElement('likes');
            likes.className = "likes";
            likes.innerHTML = "likes: " + contents["likes"];
            //const editbutton = document.createElement('button');
            // editbutton.className = "editpost";
            //editbutton.innerHTML = "Edit Post";

            post.append(poster);
            post.append(content);
            post.append(likes);
            post.append(date);
            post.append(time);
            //post.append(editbutton);
        }
        document.getElementById('posts').append(post);
    };

});