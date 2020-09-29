document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    //const cards = document.getElementsByClassName("card")

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
        <p class="article-content"> ${article.content} </p>
        
        </div>
        `
    const articleForm = document.createElement('div')
    articleForm.className = 'review-form-div'
    articleForm.innerHTML = `
    <form class="review-form">
    <h1> Review Article: </h1>

    <div class="form-group">
    <label for="articleFormTextarea">Example textarea</label>
    <textarea class="form-control" id="articleFormTextarea" rows="3"></textarea>
    </div>
    <button type="submit" class="btn btn-primary mb-2">Confirm identity</button>
    </form>
    `
    contentContainer.appendChild(articleForm)

    const articleReviewsDiv = document.createElement('div')
    articleReviewsDiv.className = 'reviews-div'
    
    
    for (i = 0; i < article.reviews.length; i++) {
        const review = document.createElement('div')
        review.innerHTML = `
        <div class="media">
        <img src="${article.users[i].image_url}" class="mr-3" alt="...">
        <div class="media-body">
        <h5 class="mt-0" data-id="${article.users[i].id}">${article.users[i].username}</h5>
        ${article.reviews[i].text}
        </div>
        </div>
        `
        articleReviewsDiv.appendChild(review)
    }
    contentContainer.appendChild(articleReviewsDiv)
}

    const changeActive = activeBtn => {
        const activeElements = document.querySelectorAll('.active')
        console.log(activeElements)
        activeElements.forEach(element => {element.classList.remove('active')})
        activeBtn.classList.add('active')
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

        })
    }



 
    fetchArticles()
    documentClick()



});
