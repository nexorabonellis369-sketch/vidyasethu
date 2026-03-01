// User Notes Component
// Uses IndexedDB to store user uploaded PDFs, images, and notes mapped to specific courses.

const DB_NAME = 'BscAppSci_UserNotes';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (e) => reject("IndexedDB error: " + e.target.error);
        request.onsuccess = (e) => resolve(e.target.result);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('courseCode', 'courseCode', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}

function saveNote(note) {
    return initDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.add(note);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Failed to save note");
        });
    });
}

function getNotesByCourse(courseCode) {
    return initDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const index = store.index('courseCode');
            const request = courseCode === 'All' ? store.getAll() : index.getAll(courseCode);
            request.onsuccess = () => resolve(request.result.sort((a, b) => b.timestamp - a.timestamp));
            request.onerror = () => reject("Failed to fetch notes");
        });
    });
}

function deleteNote(id) {
    return initDB().then(db => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject("Failed to delete note");
        });
    });
}

export async function renderUserNotes(container, { allSemesters }) {
    // Collect all courses from all semesters for the dropdown
    const allCourses = allSemesters.flatMap(sem => sem.courses);

    container.innerHTML = `
    <div class="animate-fade">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-icon" style="background:var(--accent-orange); color:#fff; border-radius:8px;">📁</div>
          <div>
            <div class="card-title">My Personal Notes</div>
            <div class="card-desc">Upload, organize, and view your own PDFs, Images, and files by subject.</div>
          </div>
        </div>
      </div>

      <div class="card" style="padding:20px; margin-bottom: 20px;">
        <h3>Upload New Note / Media</h3>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">
            <div>
                <label style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:4px; display:block;">Select Subject:</label>
                <select id="notes-subject-select" class="btn" style="width:100%; text-align:left; background:var(--bg-secondary); border:1px solid var(--border-color);">
                    <option value="General">General (No Subject)</option>
                    ${allCourses.map(c => `<option value="${c.code}">${c.code} - ${c.title}</option>`).join('')}
                </select>
            </div>
            
            <div>
                <label style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:4px; display:block;">Note Title:</label>
                <input type="text" id="notes-title" placeholder="e.g. Unit 2 Handwritten Notes" class="btn" style="width:100%; text-align:left; background:var(--bg-secondary); border:1px solid var(--border-color); cursor:text; padding:10px;">
            </div>

            <div>
                <label style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:4px; display:block;">Upload File (PDF, Image, etc):</label>
                <input type="file" id="notes-file" class="btn" style="width:100%; text-align:left; background:var(--bg-secondary); border:1px solid var(--border-color); padding:8px;">
            </div>

            <button id="notes-upload-btn" class="btn btn-primary" style="margin-top:8px;">📤 Upload & Save Note</button>
        </div>
      </div>

      <div class="card" style="padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3>My Saved Notes</h3>
            <select id="notes-filter" class="btn btn-sm" style="background:var(--bg-secondary); border:1px solid var(--border-color);">
                <option value="All">All Subjects</option>
                <option value="General">General</option>
                ${allCourses.map(c => `<option value="${c.code}">${c.code}</option>`).join('')}
            </select>
        </div>
        
        <div id="notes-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
            <div style="color:var(--text-tertiary); grid-column:1/-1; text-align:center; padding:20px;">Loading your notes...</div>
        </div>
      </div>
    </div>
  `;

    // UI elements
    const uploadBtn = document.getElementById('notes-upload-btn');
    const subjectSelect = document.getElementById('notes-subject-select');
    const titleInput = document.getElementById('notes-title');
    const fileInput = document.getElementById('notes-file');
    const filterSelect = document.getElementById('notes-filter');
    const notesGrid = document.getElementById('notes-grid');

    // Utility to convert file to base64 so we can put it in IndexedDB
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Handle Upload
    uploadBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        const title = titleInput.value.trim();
        const courseCode = subjectSelect.value;

        if (!file) return alert('Please select a file to upload.');
        if (!title) return alert('Please provide a title for this note.');

        uploadBtn.disabled = true;
        uploadBtn.innerText = 'Uploading...';

        try {
            const base64Data = await fileToBase64(file);
            const noteObj = {
                title,
                courseCode,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                data: base64Data,
                timestamp: Date.now()
            };

            await saveNote(noteObj);

            // Reset form
            titleInput.value = '';
            fileInput.value = '';

            alert('Note saved successfully!');
            loadAndRenderNotes(filterSelect.value, allCourses);

        } catch (err) {
            console.error(err);
            alert('Failed to upload note. File might be too large.');
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.innerText = '📤 Upload & Save Note';
        }
    });

    // Handle Filtering
    filterSelect.addEventListener('change', () => {
        loadAndRenderNotes(filterSelect.value, allCourses);
    });

    // Render Logic
    async function loadAndRenderNotes(filterCourseCode, allCoursesMap) {
        try {
            const notes = await getNotesByCourse(filterCourseCode);
            notesGrid.innerHTML = '';

            if (notes.length === 0) {
                notesGrid.innerHTML = `<div style="color:var(--text-tertiary); grid-column:1/-1; text-align:center; padding:40px; background:var(--bg-secondary); border-radius:8px;">No notes found for this subject.</div>`;
                return;
            }

            notes.forEach(note => {
                const dateObj = new Date(note.timestamp);
                const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const isImage = note.fileType.startsWith('image/');

                const kbSize = (note.fileSize / 1024).toFixed(1);

                // Try to find course title
                const course = allCoursesMap.find(c => c.code === note.courseCode);
                const subjectBadge = course ? `${note.courseCode} · ${course.title.substring(0, 20)}...` : note.courseCode;

                const card = document.createElement('div');
                card.style.cssText = `background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; overflow:hidden; display:flex; flex-direction:column; transition:transform 0.2s;`;

                card.innerHTML = `
                  <div style="padding:12px; background:var(--bg-primary); border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                      <span style="font-size:0.75rem; font-weight:600; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.5px;">${subjectBadge}</span>
                      <button class="delete-note-btn btn icon-btn" style="color:var(--accent-rose); padding:4px;" data-id="${note.id}" title="Delete Note">🗑️</button>
                  </div>
                  <div style="padding:16px; flex:1; display:flex; flex-direction:column;">
                      <h4 style="margin:0 0 8px 0; color:var(--text-primary); font-size:1.1rem; line-height:1.3;">${note.title}</h4>
                      <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px; display:flex; align-items:center; gap:6px;">
                          <span>📄 ${note.fileName}</span>
                          <span>•</span>
                          <span>${kbSize} KB</span>
                      </div>
                      ${isImage ? `<div style="margin-bottom:12px; text-align:center; background:#000; border-radius:4px; max-height:120px; overflow:hidden;"><img src="${note.data}" style="max-width:100%; max-height:120px; object-fit:contain;"></div>` : ''}
                      <div style="margin-top:auto; display:flex; gap:8px;">
                          <a href="${note.data}" download="${note.fileName}" class="btn btn-primary" style="flex:1; padding:8px 0; text-align:center; text-decoration:none; font-size:0.9rem;">⬇️ Download</a>
                          <button class="btn btn-outline view-btn" style="flex:1; padding:8px 0; font-size:0.9rem;" data-type="${note.fileType}" data-data="${note.data}">👁️ View</button>
                      </div>
                  </div>
              `;

                card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-2px)');
                card.addEventListener('mouseleave', () => card.style.transform = 'none');

                // Attach delete handler
                card.querySelector('.delete-note-btn').addEventListener('click', async (e) => {
                    if (confirm('Are you sure you want to delete this note?')) {
                        await deleteNote(Number(e.currentTarget.dataset.id));
                        loadAndRenderNotes(filterSelect.value, allCourses);
                    }
                });

                // Attach View handler
                card.querySelector('.view-btn').addEventListener('click', (e) => {
                    const data = e.currentTarget.dataset.data;
                    const type = e.currentTarget.dataset.type;

                    if (type.startsWith('image/')) {
                        // Open image viewer
                        const w = window.open();
                        w.document.write(`<body style="margin:0; background:#111; display:flex; justify-content:center; align-items:center; height:100vh;"><img src="${data}" style="max-width:100%; max-height:100vh; object-fit:contain;"></body>`);
                    } else if (type === 'application/pdf') {
                        // Open PDF
                        const w = window.open();
                        w.document.write(`<iframe src="${data}" style="border:0; width:100vw; height:100vh;"></iframe>`);
                    } else {
                        alert('Browser cannot directly preview this file type. Please download it.');
                    }
                });

                notesGrid.appendChild(card);
            });
        } catch (err) {
            console.error(err);
            notesGrid.innerHTML = `<div style="color:var(--accent-rose); padding:20px;">Error loading notes.</div>`;
        }
    }

    // Initial load
    loadAndRenderNotes('All', allCourses);
}
