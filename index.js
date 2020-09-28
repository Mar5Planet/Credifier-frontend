document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    baseUrl = 'http://localhost:3000/'
    const fetchArticles = () => {
        fetch(baseUrl + 'posts')
        .then(res => res.json())
        .then(data => renderArticles(data))
    }

    renderArticle = article => {
        const articleDiv = document.createElement('div')
        const contentContainer = document.querySelector('.row')
        articleDiv.className = 'card col-lg-3 col-sm-4'
        articleDiv.dataset.topic = article.topic
        articleDiv.innerHTML = `
        <img src=" ${article.image_url}"> 
            <div class="card-body">
                <h5 class="card-title" id="${article.id}"> ${article.title} </h5><span> ...</span>
                <p class="card-text">${article.reporter} </p>
            </div>
        
        `
        contentContainer.appendChild(articleDiv)

    }

    renderArticles = articleArr => {
        articleArr.forEach(article => {
            renderArticle(article)
        })
    }

    fetchArticles()



});