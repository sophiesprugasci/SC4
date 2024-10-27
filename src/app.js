document.addEventListener("DOMContentLoaded", function () {
  // Store projects data
  let projects = [];

  // Load project data from projects.json
  function loadProjects() {
      return fetch('src/projects.json')
          .then(response => response.json())
          .then(data => {
              projects = data; // Store the projects globally
              populateCoverImages(); // Populate cover images
              setupProjectClickHandlers(); // Setup click handlers for project titles
              setupScrollSync(); // Setup scroll synchronization
          })
          .catch(error => console.error("JSON loading error", error));
  }

  // Populate cover images
  function populateCoverImages() {
      if (document.querySelector('.container[data-page="index"]')) {
          projects.forEach(project => {
              const coverDiv = document.querySelector(`.cover[data-id="${project.id}"]`);
              if (coverDiv && project.cover) {
                  const coverImg = document.createElement('img');
                  coverImg.src = project.cover;
                  coverDiv.appendChild(coverImg);
              }
          });
      }
  }

  // Setup click handlers for project titles
  function setupProjectClickHandlers() {
      const projectElements = document.querySelectorAll('.project-name');
      projectElements.forEach(element => {
          element.addEventListener('click', () => {
              const projectId = element.getAttribute('data-id');
              if (projectId) {
                  window.location.href = `project.html?id=${projectId}`;
              } else {
                  console.error("Project ID not found");
              }
          });
      });
  }

  // Setup scroll synchronization
  function setupScrollSync() {
      const titleContainer = document.getElementById("snap-container-title");
      const collabContainer = document.getElementById("snap-container-collab");

      titleContainer.addEventListener("scroll", function () {
          const centerElement = Array.from(titleContainer.children).find(child => {
              const rect = child.getBoundingClientRect();
              return rect.top >= 0 && rect.bottom <= window.innerHeight;
          });

          if (centerElement) {
              const id = centerElement.getAttribute('data-id');
              const targetElement = collabContainer.querySelector(`.project-collab[data-id="${id}"]`);
              if (targetElement) {
                  const targetPosition = targetElement.offsetTop;
                  collabContainer.scrollTo({ top: targetPosition, behavior: 'smooth' });
              } else {
                  console.warn(`Target element not found for ID: ${id}`);
              }
          } else {
              console.warn("No central element found.");
          }
      });
  }

  // Show project details if on project detail page
  function showProjectDetails() {
      const params = new URLSearchParams(window.location.search);
      const projectId = parseInt(params.get("id"));

      if (projectId) {
          const project = projects.find(item => item.id === projectId);
          if (project) {
              document.getElementById('bar').textContent = project.bar;
              document.getElementById('collaborators').textContent = project.collaborators;
              document.getElementById('project-title').textContent = project.title;
              document.getElementById('opencall').textContent = project.opencall;
              document.getElementById('vernissage').textContent = project.vernissage;
              document.getElementById('exhibition').textContent = project.exhibition;
              document.getElementById('archive').textContent = project.archive;

              const galleryDiv = document.getElementById('gallery');
              galleryDiv.innerHTML = project.gallery.map(imageUrl => `<img src="${imageUrl}" alt="${project.title}">`).join('');

              const descriptionDiv = document.getElementById('description');
              descriptionDiv.innerHTML = '';
              const paragraphs = project.description.split('\n');
              paragraphs.forEach(function(paragraphText) {
                  const paragraph = document.createElement('p');
                  paragraph.innerHTML = paragraphText.replace(/\[([^|\]]+)\|([^|\]]+)\]/g, '<a href="$2" target="_blank">$1</a>');
                  descriptionDiv.appendChild(paragraph);
              });
          } else {
              console.error("Project not found");
          }
      }
  }

  // Handle mouse enter and leave events to show/hide cover images
  function handleCoverImages() {
      const coverImgDiv = document.getElementById('cover-img');
      const containers = document.querySelectorAll('.container[data-page="index"]');

      document.querySelectorAll('.project-name').forEach(name => {
        name.addEventListener('mouseenter', function() {
            const projectId = this.getAttribute('data-id');
            const coverImgDiv = document.getElementById('cover-img');
            
            // Find the corresponding project in the JSON data
            const project = projects.find(p => p.id == projectId);
    
            if (project) {
                // Set the background image URL from the project cover
                coverImgDiv.style.backgroundImage = `url('${project.cover}')`; // Update the image path
                coverImgDiv.style.display = 'block'; // Show the cover image
            }
        });
    
        name.addEventListener('mouseleave', function() {
            const coverImgDiv = document.getElementById('cover-img');
            coverImgDiv.style.display = 'none'; // Hide the cover image when not hovering
        });
    });
    
  }

  // Load all projects and then setup additional functionalities
  loadProjects().then(() => {
      handleCoverImages(); // Setup cover image handlers
      showProjectDetails(); // Show project details if applicable
  });
});



//ARCHIVE CREATION AND FILTER SELECTION
document.addEventListener("DOMContentLoaded", function () {
  const galleryDiv = document.getElementById('gallery-archive');

  fetch('src/archive.json')
      .then(response => response.json())
      .then(data => {
          displayGallery(data);
          setupFilters(data);
      })
      .catch(error => console.error('Error loading JSON:', error));

  function displayGallery(data) {
      galleryDiv.innerHTML = data.map(item => `
          <div class="gallery-item">
              <img src="${item.imageUrl}" alt="${item.author}">
              <p>${item.author}</p>
          </div>
      `).join('');
  }

  function setupFilters(data) {
      const contests = [...new Set(data.map(item => item.contest))];
      const scores = [...new Set(data.map(item => item.score))];

      // Contest selector filter
      const contestSelect = document.createElement('select');
    contestSelect.classList.add('filter-select', 'contest-filter'); // Aggiungi classi
    contestSelect.innerHTML = `<option value="All">All Contests</option>` +
        contests.map(contest => `<option value="${contest}">${contest}</option>`).join('');
    contestSelect.addEventListener('change', () => filterGallery(data));

      // Score selector filter
      const scoreSelect = document.createElement('select');
    scoreSelect.classList.add('filter-select', 'score-filter'); // Aggiungi classi
    scoreSelect.innerHTML = `<option value="All">All Scores</option>` +
        scores.map(score => `<option value="${score}">${score}</option>`).join('');
    scoreSelect.addEventListener('change', () => filterGallery(data));

      // Selectors added to header section
      const header = document.querySelector('.header-title');
      header.appendChild(contestSelect);
      header.appendChild(scoreSelect);
  }

  function filterGallery(data) {
      const selectedContest = document.querySelector('select:nth-of-type(1)').value;
      const selectedScore = document.querySelector('select:nth-of-type(2)').value;

      const filteredData = data.filter(item => 
          (selectedContest === 'All' || item.contest === selectedContest) &&
          (selectedScore === 'All' || item.score === selectedScore)
      );

      displayGallery(filteredData); // Mostra i risultati filtrati
  }
});
