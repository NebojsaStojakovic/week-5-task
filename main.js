
const searchBar = document.querySelector('.github__search');
const githubContent = document.querySelector('.github__content');
const gitUrl = 'https://api.github.com/users/';
const noResults = document.querySelector('.github__search-error');
const searchBtn = document.querySelector('.github__search-btn');
const input = document.querySelector('.github__search-input');
const avatarMobile = document.querySelector('.mobile-avatar');
const avatarDesktop = document.querySelector('.desktop-avatar');
const userName = document.querySelector('.github__content-name');
const user = document.querySelector('.github__content-user');
const date = document.querySelector('.github__content-date');
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const about = document.querySelector('.github__content-about');
const repos = document.getElementById('repos');
const followers = document.getElementById('followers');
const following = document.getElementById('following');
const userLocation = document.getElementById('location');
const page = document.getElementById('website');
const twitter = document.getElementById('twitter');
const company = document.getElementById('company');
const me = 'nebojsaStojakovic';
const body = document.querySelector("body")
const themeButton = document.querySelector('.github__switch');
const darkTheme = 'dark-theme';
const selectedTheme = localStorage.getItem('selected-theme');
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
searchBtn.addEventListener('click', function () {
    resetValues();
    if (input.value !== "") {
        getUserData(gitUrl + input.value);
    }
})
input.addEventListener("keydown", function (e) {
    if (!e) {
        var e = window.event;
    }
    if (e.key == "Enter") {
        resetValues()
        if (input.value !== "") {
            getUserData(gitUrl + input.value);
        }
    }
}, false);
input.addEventListener('input', function () {
    noResults.style.display = "none"
    githubContent.classList.remove('active')
    searchBar.classList.add('active')
})
function getUserData(gitUrl) {
    fetch(gitUrl)
        .then(response => response.json())
        .then(data => {
            updateProfile(data)
        })
        .catch(error => {
            throw error;
        })
}
function checkNull(param1, param2) {
    if ((param1 === "") || (param1 === null)) {
        param2.parentNode.style.opacity = 0.5;
        param2.style.pointerEvents = "none";
        return "Not available"
    } else {
        param2.style.pointerEvents = "auto";
        return `${param1}`
    }
}
function updateProfile(data) {
    if (data.message !== "Not Found") {
        noResults.style.display = "none";
        avatarMobile.src = `${data.avatar_url}`
        avatarDesktop.src = `${data.avatar_url}`
        userName.innerText = (data.name == null) ? `${data.login}` : `${data.name}`
        user.innerText = `@${data.login}`
        dateSegments = data.created_at.split("T").shift().split("-")
        date.innerText = `Joined ${dateSegments[2]} ${months[dateSegments[1] - 1]} ${dateSegments[0]}`
        if (data.bio == null) {
            about.style.opacity = 0.5;
            about.innerText = "This profile has no bio";
        } else {
            about.innerText = `${data.bio}`;
        }
        repos.innerText = `${data.public_repos}`
        followers.innerText = `${data.followers}`
        following.innerText = `${data.following}`
        userLocation.innerText = checkNull(data.location, userLocation)
        page.innerText = checkNull(data.blog, page)
        page.setAttribute("href", data.blog)
        twitter.innerText = checkNull(data.twitter_username, twitter)
        company.innerText = checkNull(data.company, company)
        searchBar.classList.toggle('active')
        githubContent.classList.toggle('active')
    } else {
        noResults.style.display = "inline-block";
    }
}
function resetValues() {
    const contentLinks = document.querySelectorAll('.github__content-link')
    contentLinks.forEach(link => {
        link.style.opacity = 1;
        link.lastChild.innerHTML = '';
    })
    about.style.opacity = 1;
}
if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
}
themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    localStorage.setItem('selected-theme', getCurrentTheme())
});
body.addEventListener('load', getUserData(gitUrl + me))