// Sidebar
const menuItem = document.querySelectorAll('.menu-item');

// Messages
const messagesNotification = document.querySelector('#messages-notification');
const messages = document.querySelector('.messages');
const message = messages.querySelectorAll('.message');
const messageSearch = document.querySelector('#message-search');

// THEME
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme');
const fontSizes = document.querySelectorAll('.choose-size span');
var root = document.querySelector(':root');
const colorPalette = document.querySelectorAll('.choose-color span');
const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');


// STORIES

// const stories = document.querySelectorAll('.story');
// WORKING CODE
//
// async function showStories() {
//     for (const story of stories) {
//
//         story.style.display = 'block';
//         await new Promise(resolve => setTimeout(resolve, 15000)); // Wait for 15 seconds
//         story.style.display = 'none';
//     }
// }

// async function showStories() {
//     const stories = document.querySelectorAll('.story');
//
//     stories.forEach(story => {
//         story.addEventListener('click', async () => {
//             story.style.display = 'block';
//             await new Promise(resolve => setTimeout(resolve, 15000)); // Wait for 15 seconds
//             story.style.display = 'none';
//         });
//     });
// }
function showStories() {
    const stories = document.querySelectorAll('.story');
    let currentStoryIndex = 0;

    function showStoryContent(story) {
        const photoUrl = story.querySelector('.profile-photo img').src;
        const popup = createPopup(photoUrl);
        document.body.appendChild(popup);
    }

    function createPopup(photoUrl) {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const popup = document.createElement('div');
        popup.classList.add('popup');

        const photo = document.createElement('img');
        photo.src = photoUrl;
        popup.appendChild(photo);

        overlay.appendChild(popup);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        return overlay;
    }

    function showNextStory() {
        const currentStory = stories[currentStoryIndex];
        currentStory.style.display = 'none';
        currentStoryIndex = (currentStoryIndex + 1) % stories.length;
        const nextStory = stories[currentStoryIndex];
        nextStory.style.display = 'block';
    }

    stories.forEach(story => {
        story.addEventListener('click', () => {
            showStoryContent(story);
            setTimeout(() => {
                document.body.removeChild(overlay);
                showNextStory();
            }, 5000);
        });
    });

    showNextStory();
}

showStories();



// CREATE POST
//  WORKING CODE
// const form = document.querySelector('.create-post');
// const input = document.querySelector('#create-post');
//
// form.addEventListener('submit', (event) => {
//     event.preventDefault();
//
//     const postContent = input.value;
//     const fileName = `post_${Date.now()}.txt`;
//
//     const blob = new Blob([postContent], {type: 'text/plain'});
//
//
//     const downloadLink = document.createElement('a');
//     downloadLink.href = URL.createObjectURL(blob);
//     downloadLink.download = fileName;
//
//     downloadLink.click();
//
//     input.value = '';
// });

async function fetchPosts() {
    try {
        // Make a GET request to the server's API endpoint to fetch all posts
        var response = await fetch('/api/posts');

        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        // Retrieve the posts from the response
        var posts = await response.json();

        // Clear the existing posts in the feed
        var feedsContainer = document.getElementById('feeds');
        feedsContainer.innerHTML = '';

        // Create and append the post elements to the feed
        posts.forEach((post) => {
            var postElement = createPostElement(post);
            feedsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error(error);
        // Handle error scenario
    }
}

// Function to create a post element
function createPostElement(post) {
    var newPost = document.createElement('div');
    newPost.className = 'feed';

    var postContent = document.createElement('div');
    postContent.className = 'post-content';
    postContent.textContent = post.text;

    var actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    actionButtons.innerHTML = `
    <span><i class="uil uil-heart"></i></span>
    <span><i class="uil uil-comment-dots"></i></span>
    <span><i class="uil uil-share-alt"></i></span>
  `;

    newPost.appendChild(postContent);
    newPost.appendChild(actionButtons);

    return newPost;
}

// Fetch all posts when the page loads
fetchPosts();

document.getElementById('create-post-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    // Get the input value
    var input = document.querySelector('.create-post-input');
    var postText = input.value;

    // Create a new post object
    var newPost = {
        text: postText
    };

    try {
        // Make a POST request to the server's API endpoint to create a new post
        var response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        });

        if (!response.ok) {
            throw new Error('Failed to create post');
        }

        // Retrieve the created post from the response
        var createdPost = await response.json();

        // Create a new post element
        var postElement = createPostElement(createdPost);

        // Prepend the new post to the feeds container
        var feedsContainer = document.getElementById('feeds');
        feedsContainer.insertBefore(postElement, feedsContainer.firstChild);

        // Clear the input field
        input.value = '';
    } catch (error) {
        console.error(error);
        // Handle error scenario
    }
});




// Sidebar

// remove active class
const changeActiveItem = () => {
    menuItem.forEach(item => {
        item.classList.remove('active');
    })
}

// menuItem.forEach(item =>{
//     item.addEventListener('click', () =>{
//         changeActiveItem();
//         item.classList.add('active');
//         if(item.id != 'notifications'){
//             document.querySelector('.notifications-popup').style.display = 'none';
//         }
//         else{
//             document.querySelector('.notification-popup').style.display = 'block';
//             document.querySelector('#notifications .notification-count').style.display = 'none';
//         }
//     })
// })

menuItem.forEach(item => {
    item.addEventListener('click', () => {
        changeActiveItem();
        item.classList.add('active');
        if (item.id !== 'notifications') {
            document.querySelector('.notifications-popup').style.display = 'none';
        } else {
            document.querySelector('.notification-popup').style.display = 'block';
            document.querySelector('#notifications .notification-count').style.display = 'none';
        }
    });
});

// Add event listener to close notifications when clicking outside
document.addEventListener('click', (event) => {
    const notificationsPopup = document.querySelector('.notification-popup');
    const notificationsMenu = document.querySelector('#notifications');
    const isOutsideNotifications = !notificationsMenu.contains(event.target);

    if (isOutsideNotifications && notificationsPopup.style.display === 'block') {
        notificationsPopup.style.display = 'none';
        document.querySelector('.notifications-popup').style.display = 'none';
    }
});


// MESSAGES
// search chats
const searchMessage = () => {
    const val = messageSearch.value.toLowerCase();
    console.log(val);
    message.forEach(user =>{
        let name = user.querySelector('h5').textContent.toLowerCase();
        if(name.indexOf(val) != -1){
            user.style.display = 'flex';
        }
        else{
            user.style.display = 'none';
        }
    })
}


// search chat
messageSearch.addEventListener('keyup', searchMessage);


// highlight messages card when clicked
messagesNotification.addEventListener('click', () =>{
    messages.style.boxShadow = '0 0 1rem var(--color-primary)';
    messagesNotification.querySelector('.notification-count').style.display = 'none';
    setTimeout(() =>{
        messages.style.boxShadow = 'none';
    }, 2000);
})

// THEME DISPLAY CUSTOMIZATION

// open Modal
const openThemeModal = () => {
    themeModal.style.display = 'grid';
}

// closes Modal
const closeThemeModal = (e) =>{
    if(e.target.classList.contains('customize-theme')){
        themeModal.style.display = 'none';
    }
}

// close Modal
themeModal.addEventListener('click', closeThemeModal);

theme.addEventListener('click', openThemeModal);


// Fonts
// remove active class from spans or font size selectors
const removeSizeSelector = () =>{
    fontSizes.forEach(size => {
        size.classList.remove('active');
    })
}

fontSizes.forEach(size =>{
    size.addEventListener('click', () =>{
        removeSizeSelector();
        let fontSize;
        size.classList.toggle('active');

        if(size.classList.contains('font-size-1')){
            fontSize = '13px';
            root.style.setProperty('--sticky-top-left', '5.4rem');
            root.style.setProperty('--sticky-top-right', '5.4rem');
        }
        else if(size.classList.contains('font-size-2')){
            fontSize = '16px';
            root.style.setProperty('--sticky-top-left', '5.4rem');
            root.style.setProperty('--sticky-top-right', '-7rem');
        }

        else if(size.classList.contains('font-size-3')){
            fontSize = '18px';
            root.style.setProperty('--sticky-top-left', '-2rem');
            root.style.setProperty('--sticky-top-right', '-17rem');
        }

        else if(size.classList.contains('font-size-4')){
            fontSize = '20px';
            root.style.setProperty('--sticky-top-left', '-5rem');
            root.style.setProperty('--sticky-top-right', '-25rem');
        }

        else if(size.classList.contains('font-size-5')){
            fontSize = '22px';
            root.style.setProperty('--sticky-top-left', '-12rem');
            root.style.setProperty('--sticky-top-right', '-35rem');
        }
        // change font size of the root html element
        document.querySelector('html').style.fontSize = fontSize;
    })

})

// remove active class from colors
const changeActiveColorClass = () =>{
    colorPalette.forEach(colorPicker =>{
        colorPicker.classList.remove('active');
    })
}


// change primary Colors
colorPalette.forEach(color => {
    color.addEventListener('click', () =>{
        let primary;
        changeActiveColorClass();

        if(color.classList.contains('color-1')){
            primaryHue = 252;
        }
        else if(color.classList.contains('color-2')){
            primaryHue = 52;
        }
        else if(color.classList.contains('color-3')){
            primaryHue = 352;
        }
        else if(color.classList.contains('color-4')){
            primaryHue = 152;
        }
        else if(color.classList.contains('color-5')){
            primaryHue = 202;
        }
        color.classList.add('active');

        root.style.setProperty('--primary-color-hue', primaryHue);
    })
})

// Theme background values
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

// changes background color
const changeBG = () => {
    root.style.setProperty('--light-color-lightness', lightColorLightness);
    root.style.setProperty('--white-color-lightness', whiteColorLightness);
    root.style.setProperty('--dark-color-lightness', darkColorLightness);
}

Bg1.addEventListener('click', () => {
    // add active class
    Bg1.classList.add('active');
    // remove active class from the others
    Bg2.classList.remove('active');
    Bg3.classList.remove('active');
    // remove customized changes from local storage
    window.location.reload()
});


Bg2.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '20%';
    lightColorLightness = '15%';

    // add active class
    Bg2.classList.add('active');

    // remove active class from others
    Bg1.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();
});

Bg3.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';

    // add active class
    Bg3.classList.add('active');
    // remove active class from others
    Bg1.classList.remove('active');
    Bg2.classList.remove('active');
    changeBG();
});

// End