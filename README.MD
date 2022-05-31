It´s pretty empty here but it is what it is.
ID = first post has 1 and it goes down from there.

To get all posts
http://localhost:5000/posts/

To get/delete/ one post
http://localhost:5000/posts/(id)/

To patch one post
http://localhost:5000/posts/(id)/ and add your object e.g { "action": "make dinner" } or { "complete": "true" }.
if you add an empty object the post will switch from true to false or false to true.

To post
http://localhost:5000/posts/ and add your object e.g { "action": "make dinner" }.

To put one post
http://localhost:5000/posts/(id)/ and add your object e.g { "action": "make dinner", "complete": "true" }.
