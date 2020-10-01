// console.log('DOM fully loaded and parsed');
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    //const cards = document.getElementsByClassName("card")
    let userLoggedIn = false;
    let demoUser = {
        "id": "1"
    }

    baseUrl = 'http://localhost:3000/'

    const fetchUser = userId => {
        fetch(baseUrl + 'users/' + userId)
        .then(res => res.json())
        .then(data => renderUserProfile(data["data"]["attributes"]))
    }

    const fetchArticles = () => {
        fetch(baseUrl + 'posts')
        .then(res => res.json())
        .then(data => renderArticles(data))
    }

    const checkRatings = (raterId, reviewId, score) => {
        fetch(baseUrl + 'ratings')
        .then(res => res.json())
        .then(data => findRating(data, raterId, reviewId, score))
    }

    const findRating = (ratings, raterId, reviewId, score) => {
        let matchArr = 0
        for(let i=0; i<ratings.length; i++){
            let valueArr = Object.values(ratings[i])

            if (valueArr[2] == raterId && valueArr[3] == reviewId) {
                matchArr = valueArr
            }
        }

        if (matchArr == 0) {
            createRating(score, raterId, reviewId)
        }
        else {
            modifyRating(score, matchArr[0])
            console.log('instance found-patch score here')
            console.log(matchArr)
        }

    }
    
    const fetchSpecificArticle = articleId => {
        fetch(baseUrl + 'posts/' + articleId)
        .then(res => res.json())
        .then(data => renderSpecificArticle(data["data"]["attributes"]))
    }

    const fetchArticleByTopic = topic => {
        fetch(baseUrl + 'posts/' + topic)
        .then(res => res.json())
        .then(data => renderArticles(data))
    }

    const renderArticle = article => {
        const articleDiv = document.createElement('div')
        const contentContainer = document.querySelector('.row')
        articleDiv.className = 'card col-lg-3 col-md-4'
        articleDiv.dataset.id =  article.id
        articleDiv.dataset.topic = article.topic
        articleDiv.innerHTML = `
        <img src=" ${article.image_url}"> 
            <div class="card-body">
                <h5 class="card-title"> ${article.title} </h5><span> ...</span>
                <p class="card-text">${article.reporter} </p>
            </div>
        
        `
        contentContainer.appendChild(articleDiv)

    }

    const renderArticles = articleArr => {
        articleArr.forEach(article => {
            renderArticle(article)
        })
    }



    const renderSpecificArticle = article => {
        const contentContainer = document.querySelector('.row')
        contentContainer.innerHTML = `
        <div class="article-container">
        
        <div class="article-card">
            <img src=" ${article.image_url}"> 
            <i class="far fa-5x fa-user-circle"></i>
            <h2>${article.reporter} </h2>
            <div class="article-icons">
                
                <i class="fas fa-2x fa-eye"></i>
                <i class="far fa-2x fa-comment"></i>

            </div>

        </div> 
        <h1> ${article.title} </h1>
        <p class="article-content"> ${article.content.substring(0,190)}... <a href="${article.source}">Full Article</a> </p>
        
        </div>
        `
    const articleForm = document.createElement('div')
    articleForm.className = 'review-form-div'
    if (userLoggedIn === true) {
    articleForm.innerHTML = `
    <form class="review-form" data-id="${article.id}">
    <h1> Article Reviews </h1>

    <div class="form-group">
    <label for="articleFormTextarea">Write a review:</label>
    <textarea class="form-control" id="articleFormTextarea" rows="3"></textarea>
    
    <button type="submit" class="btn btn-primary mb-2">Submit Review</button>
    </div>
    </form>
    `
    }

    else {
        articleForm.innerHTML = `
        <form class="review-form" data-id="${article.id}">
    <h1> Article Reviews </h1>
    </form>`
    }
    contentContainer.appendChild(articleForm)

    const articleReviewsDiv = document.createElement('div')
    articleReviewsDiv.className = 'reviews-div'
    
    
    for (i = 0; i < article.reviews.length; i++) {
        const review = document.createElement('div')
        review.className = "media"
        review.dataset.id = article.reviews[i].id
        review.innerHTML = `
        
        <img src="${article.users[i].image_url}" class="${article.users[i].ranking} user-img mr-3" alt="...">
        <div class="media-body">
        <h5 class="mt-0 profile-btn" data-id="${article.users[i].id}">${article.users[i].username}</h5>
        <p>${article.reviews[i].text}</p>
        
        
        
        </div>
        <div class="vote-btns">
            <i class="up-vote fas fa-2x fa-sort-up"></i>
            <div class="review-rating"> ${article.custom_reviews[i].review_rating}<span> /10 </span> </div>
            <i class="down-vote fas fa-2x fa-sort-down"></i>
        </div>
        `
        articleReviewsDiv.appendChild(review)
    }
    contentContainer.appendChild(articleReviewsDiv)

}

    const renderUserProfile = userObj => {
        hideDropDowns(true)
        const contentContainer = document.querySelector('.row')
        contentContainer.innerHTML = `
                <div class="flip-card ${userObj.ranking}">
                <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${userObj.image_url}" alt="Avatar" style="width:300px;height:300px;">
                </div>
                <div class="flip-card-back">
                    <p>Reviewer Score: <span>${userObj.my_score}</span></p> 
                </div>
                </div>
            </div>
            <div class= "profile-text">
                <h1>${userObj.username}</h1> 
                <h2>Reviewed Posts: </h2>
            </div>
         `

        const profileTextDiv = document.querySelector('.profile-text')
        const reviewedPosts = document.createElement('div')
        for (i = 0; i < userObj.posts.length; i++) {
            const reviewedPost = document.createElement('div')
            reviewedPost.className = 'profile-post alert alert-dark'
            reviewedPost.dataset.id = userObj.posts[i].id
            reviewedPost.innerHTML = `${userObj.posts[i].title}`
            reviewedPosts.appendChild(reviewedPost)
        }
        profileTextDiv.appendChild(reviewedPosts)
    }

    async function addReview(postId, userId, text) {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
        
            },
            body: JSON.stringify({
                "text": text,
                "user_id": userId,
                "post_id": postId,
            })
        }
        
        let response = await fetch(baseUrl + 'reviews', options);
        let data = await response.json()
        fetchSpecificArticle(postId)
        return data;
    }

    async function createRating(score, raterId, reviewId) {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
        
            },
            body: JSON.stringify({
                score,
                "rater_id": raterId,
                "review_id": reviewId
            })
        }
        

        let response = await fetch(baseUrl + 'ratings', options);
        let data = await response.json()
        console.log(data);

    }

    async function modifyRating(score, rating_id) {
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
        
            },
            body: JSON.stringify({
                score
            })
        }
        

        let response = await fetch(baseUrl + 'ratings/' + rating_id, options);
        let data = await response.json()
        console.log(data);

    }

    const hideDropDowns = (condition) => {
        const dropDownDiv = document.querySelector('#drop-downs')
        
        if (condition === true) {
            dropDownDiv.classList.add('hide')
        }
        else if (condition === false) {
            dropDownDiv.classList.remove('hide')
        }
        
    }

    const isLoggedIn = () => {
        const loginBtn = document.querySelector('.login-btn')
        const signupBtn = document.querySelector('.signup-btn')
        const logoutBtn = document.querySelector('.logout-btn')
        const infoDiv = document.querySelector('#info-div')
        
        if (userLoggedIn === false) {
            loginBtn.classList.add('hide')
            signupBtn.classList.add('hide')
            logoutBtn.classList.remove('hide')
            infoDiv.classList.add('hide')
            userLoggedIn = true;
        }
        else if (userLoggedIn === true) {
            loginBtn.classList.remove('hide')
            signupBtn.classList.remove('hide')
            logoutBtn.classList.add('hide')
            infoDiv.classList.remove('hide')
            userLoggedIn = false;
        }

    }

    const changeActive = activeBtn => {
        const activeElements = document.querySelectorAll('.active')
        console.log(activeElements)
        activeElements.forEach(element => {element.classList.remove('active')})
        activeBtn.classList.add('active')
    }


const loginPage = () => {
    const contentContainer = document.querySelector('.row')
    hideDropDowns(true)
    contentContainer.innerHTML = `
    <div class="wrapper fadeInDown">
  <div id="formContent">
    <div class="fadeIn first">
        <a class="navbar-brand" href="#">Credifier</a>
    </div>

 
    <form id="login-form">
      <input type="text" id="login" class="login-input fadeIn second" name="login" placeholder="login">
      <input type="password" id="password" class="login-input fadeIn third" name="login" placeholder="password">
      <input type="submit" class="fadeIn fourth" value="Log In">
    </form>

    <div id="formFooter">
      <a class="underlineHover" href="#">Forgot Password?</a>
    </div>

  </div>
</div>
    `
}
    
    const documentClick = () => {
        document.addEventListener('click', e => {
            console.log(e.target)
            const contentContainer = document.querySelector('.row')
            if(e.target.parentNode.matches('.card')){
                const cardDiv = e.target.parentNode
                articleId = cardDiv.getAttribute('data-id')
                console.log(articleId)
                fetchSpecificArticle(articleId)
                hideDropDowns(true)
                

            }
            else if(e.target.matches('.home-btn')) {
                homePage()
                changeActive(e.target)
            }

            else if(e.target.matches('.politics-btn')) {
                hideDropDowns(false)
                contentContainer.innerHTML= ``
                fetchArticleByTopic('politics')
                changeActive(e.target)
                
            }

            else if(e.target.matches('.science-btn')) {
                hideDropDowns(false)
                contentContainer.innerHTML= ``
                fetchArticleByTopic('science')
                changeActive(e.target)
                
            }

            else if(e.target.matches('.sports-btn')) {
                hideDropDowns(false)
                contentContainer.innerHTML= ``
                fetchArticleByTopic('sports')
                changeActive(e.target)
            }

            else if(e.target.matches('.login-btn')) {
                loginPage()
            }

            else if(e.target.matches('.up-vote')){
                const reviewId = e.target.parentNode.parentNode.getAttribute("data-id")
                async function incrementScore() {
                    await addScore(10, reviewId)
                const postId = document.querySelector('.review-form').getAttribute("data-id")  
                console.log(postId)
                await fetchSpecificArticle(postId)}
                incrementScore()
            }

            else if(e.target.matches('.down-vote')){
                const reviewId = e.target.parentNode.parentNode.getAttribute("data-id")
                const postId = document.querySelector('.review-form').getAttribute("data-id")  
                addScore(0, reviewId)
                fetchSpecificArticle(postId)
            }
            else if(e.target.matches('.logout-btn')) {
                isLoggedIn()
                homePage()
                
            }

            else if(e.target.matches(".profile-btn")) {
                const userId = e.target.getAttribute("data-id")
                fetchUser(userId)
            }

            else if(e.target.matches(".profile-post")) {
                const postId = e.target.getAttribute('data-id')
                fetchSpecificArticle(postId)
            }
        })
    }


    const addScore = (score, reviewId) => {
        const raterId = demoUser.id       
        
       checkRatings(raterId, reviewId, score)
        
    }

    const documentSubmit = () => {
        document.addEventListener('submit', e => {
            e.preventDefault();

            if (e.target.matches('.review-form')) {
                const reviewText = document.querySelector('.form-control').value
                const userId= demoUser.id
                const postId = e.target.getAttribute("data-id")
                addReview(postId, demoUser.id, reviewText)
                
            
            }
            
            if (e.target.matches("#login-form")) {
                isLoggedIn()
                homePage()

            }
        

        })
    }

    
    const homePage = () => {
        const contentContainer = document.querySelector('.row')
        contentContainer.innerHTML = ``
        fetchArticles()
        hideDropDowns(false)
    }
    
 

    
    fetchArticles()
    documentSubmit()
    documentClick()
    fetchUser(1)
    
    

    
});

