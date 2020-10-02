
const POSTS_URL = "http://facebook.com/vincent/1"

function getPost(url){
    fetch(url)
        .then((data) => {
            displayPost(data)
        })
}

getPost(POSTS_URL)
displayMenu()
displayFriendsList()
displayNotifications()










const POSTS_URL = "http://facebook.com/vincent/1"

function getPost(url){
    fetch(url) // returns Promise object while resolving
        .then(displayPost) // automatically attachs displayPost to the returned object
}

getPost(POSTS_URL)
displayMenu()
displayFriendsList()
displayNotifications()





const POSTS_URL = "http://facebook.com/vincent/1"

const post = getPost(POSTS_URL)
// execution of code results in a 2000ms request and response time from Facebook

displayPost(posts)
displayMenu()
displayFriendsList()
displayNotifications()






const POSTS_URL = "http://facebook.com/vincent/1"

function getPost(url){
    fetch(url)
        .then((data) => {
            displayPost(data)
        })
}

getPost(POSTS_URL)
displayMenu()
displayFriendsList()
displayNotifications()























