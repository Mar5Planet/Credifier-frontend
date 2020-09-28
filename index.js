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
        .then(data => renderSpecificArticle(data))
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

/* <div class="media">
  <img src="" class="mr-3" alt="...">
  <div class="media-body">
    <h5 class="mt-0">Media heading</h5>
    Cras sit amet nibh libero, in gravida n
    </div>
</div> */