import { createClient } from '@insforge/sdk';

/**
 * InsForge Client Initialization
 * 
 * To use this, you must set VITE_INSFORGE_PROJECT_ID and 
 * VITE_INSFORGE_API_KEY in your .env file.
 */

const projectId = import.meta.env.VITE_INSFORGE_PROJECT_ID;
const apiKey = import.meta.env.VITE_INSFORGE_API_KEY;

export const isConfigured = projectId && projectId !== 'your_project_id_here' &&
    apiKey && apiKey !== 'your_api_key_here' &&
    projectId !== '59035482-f5f1-49f9-bf34-dff0bb32d0cf_PLACEHOLDER'; // Internal check

if (!isConfigured) {
    console.warn('⚠️ InsForge is not fully configured. Some cloud features will be disabled.');
}

export const insforge = createClient({
    projectId: isConfigured ? projectId : 'placeholder',
    apiKey: isConfigured ? apiKey : 'placeholder',
});

console.log('🔗 InsForge Client:', isConfigured ? 'Ready' : 'Mock Mode');
