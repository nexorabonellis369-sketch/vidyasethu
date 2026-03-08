// Bookmarks utility — localStorage-backed bookmarked topics
const BOOKMARKS_KEY = 'vidyasetu_bookmarks';
const DOUBTS_KEY = 'vidyasetu_doubts_count';

export function getBookmarks() {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
}

export function isBookmarked(courseCode, unitNum, topic) {
    return getBookmarks().some(b => b.courseCode === courseCode && b.unitNum === unitNum && b.topic === topic);
}

export async function toggleBookmark(courseCode, courseTitle, unitNum, unitTitle, topic) {
    const bookmarks = getBookmarks();
    const idx = bookmarks.findIndex(b => b.courseCode === courseCode && b.unitNum === unitNum && b.topic === topic);

    let isAdded = false;
    if (idx !== -1) {
        bookmarks.splice(idx, 1);
        isAdded = false;
    } else {
        bookmarks.unshift({ courseCode, courseTitle, unitNum, unitTitle, topic, savedAt: new Date().toISOString() });
        isAdded = true;
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks.slice(0, 100)));

    // Sync with InsForge
    try {
        const { insforge, isConfigured } = await import('../lib/insforge.js');
        const user = JSON.parse(localStorage.getItem('vidyasetu_user') || 'null');

        if (isConfigured && user?.insforge_id) {
            if (isAdded) {
                await insforge.from('bookmarks').insert({
                    user_id: user.insforge_id,
                    course_code: courseCode,
                    topic: topic,
                    unit_num: unitNum
                });
            } else {
                await insforge.from('bookmarks')
                    .delete()
                    .match({
                        user_id: user.insforge_id,
                        course_code: courseCode,
                        topic: topic
                    });
            }
        }
    } catch (err) {
        console.error('❌ Bookmark Sync Error:', err);
    }

    return isAdded;
}

export async function syncBookmarksWithCloud() {
    try {
        const { insforge, isConfigured } = await import('../lib/insforge.js');
        const user = JSON.parse(localStorage.getItem('vidyasetu_user') || 'null');

        if (!isConfigured || !user?.insforge_id) return;

        const localBookmarks = getBookmarks();
        if (localBookmarks.length === 0) return;

        console.log('🔄 Syncing local bookmarks to cloud...');

        // Simple strategy: insert all local bookmarks
        // InsForge will handle duplicates if we have a unique constraint, 
        // but for now we'll just insert what we have.
        const toSync = localBookmarks.map(b => ({
            user_id: user.insforge_id,
            course_code: b.courseCode,
            topic: b.topic,
            unit_num: b.unitNum
        }));

        const { error } = await insforge.from('bookmarks').upsert(toSync, { onConflict: 'user_id, course_code, topic' });
        if (error) console.error('❌ Sync error:', error);
        else console.log('✅ Cloud bookmarks synced.');
    } catch (err) {
        console.error('❌ Sync failed:', err);
    }
}

export function clearBookmarks() {
    localStorage.removeItem(BOOKMARKS_KEY);
}

export function incrementDoubtCount() {
    const count = parseInt(localStorage.getItem(DOUBTS_KEY) || '0') + 1;
    localStorage.setItem(DOUBTS_KEY, String(count));
    return count;
}

export function getDoubtCount() {
    return parseInt(localStorage.getItem(DOUBTS_KEY) || '0');
}

export function getStats() {
    const notes = JSON.parse(localStorage.getItem('vidyasetu_saved_notes') || '[]');
    const bookmarks = getBookmarks();
    const doubts = getDoubtCount();
    return {
        notesCrafted: notes.length,
        doubtsSolved: doubts,
        keyBookmarks: bookmarks.length
    };
}
