// console.log('DOM fully loaded and parsed');
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    //const cards = document.getElementsByClassName("card")
    let userLoggedIn = false;
    let demoUser = {
        "id": "1"
    }

    baseUrl = 'http://localhost:3000/'
    const fetchArticles = () => {
        fetch(baseUrl + 'posts')
        .then(res => res.json())
        .then(data => renderArticles(data))
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
        <h5 class="mt-0" data-id="${article.users[i].id}">${article.users[i].username}</h5>
        <p>${article.reviews[i].text}</p>
        
        
        
        </div>
        <div class="vote-btns">
            <i class="up-vote fas fa-2x fa-sort-up"></i>
            <i class="down-vote fas fa-2x fa-sort-down"></i>
        </div>
        `
        articleReviewsDiv.appendChild(review)
    }
    contentContainer.appendChild(articleReviewsDiv)
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

    async function createRating(score, raterId, reviewId, postId) {
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
        fetchSpecificArticle(postId)
        console.log(data);
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
    
    contentContainer.innerHTML = `
    <div class="wrapper fadeInDown">
  <div id="formContent">
    <div class="fadeIn first">
        <a class="navbar-brand" href="#">Credifier</a>
    </div>

 
    <form id="login-form">
      <input type="text" id="login" class="fadeIn second" name="login" placeholder="login">
      <input type="text" id="password" class="fadeIn third" name="login" placeholder="password">
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
            const contentContainer = document.querySelector('.row')
            if(e.target.parentNode.matches('.card')){
                const cardDiv = e.target.parentNode
                articleId = cardDiv.getAttribute('data-id')
                console.log(articleId)
                fetchSpecificArticle(articleId)
                

            }
            else if(e.target.matches('.home-btn')) {
                contentContainer.innerHTML= ``
                fetchArticles()
                changeActive(e.target)
            }

            else if(e.target.matches('.politics-btn')) {
                
                contentContainer.innerHTML= ``
                fetchArticleByTopic('politics')
                changeActive(e.target)
                
            }

            else if(e.target.matches('.science-btn')) {
                
                contentContainer.innerHTML= ``
                fetchArticleByTopic('science')
                changeActive(e.target)
                
            }

            else if(e.target.matches('.sports-btn')) {
                contentContainer.innerHTML= ``
                fetchArticleByTopic('sports')
                changeActive(e.target)
            }

            else if(e.target.matches('.login-btn')) {
                loginPage()
            }

            else if(e.target.matches('.up-vote')){
                const reviewId = e.target.parentNode.parentNode.getAttribute("data-id")
                addScore(10, reviewId)
            }

            else if(e.target.matches('.down-vote')){
                const reviewId = e.target.parentNode.parentNode.getAttribute("data-id")
                addScore(10, reviewId)
            }
            else if(e.target.matches('.logout-btn')) {
                isLoggedIn()
                homePage()
                
            }
        })
    }

    const addScore = (score, reviewId) => {
        const raterId = demoUser.id 
        const postId = document.querySelector('.review-form').getAttribute("data-id")        
        
        createRating(score, raterId, reviewId, postId)
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

// ///// edit score functions
// async function editScore(score, raterId, reviewId){
//     const options = {
//         method:"POST",
//         body: JSON.stringify(score)
//     }
//     let response = await fetch(baseUrl + "users/" + user_id, options)
//     let data = await response.json
//     return data
// }

// const incrementScore = (score) => {
//     score +=1
//     editScore(score)
// }

// const decrementScore  = (score) => {
//     score -=1
//     editScore(score)
// }
// /////////

    
    const homePage = () => {
        const contentContainer = document.querySelector('.row')
        contentContainer.innerHTML = ``
        fetchArticles()
    }
    
 
    fetchArticles()
    documentSubmit()
    documentClick()
});

