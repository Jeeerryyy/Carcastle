/**
 * Car Castle Goa - Supabase & Cloudinary Configuration
 * 
 * Provides unified, reactive client initialization for Supabase database
 * and Cloudinary image storage.
 */

const SUPABASE_STORAGE_KEY = 'carcastle_supabase_config';
const CLOUDINARY_STORAGE_KEY = 'carcastle_cloudinary_config';

/**
 * Retrieve saved Supabase configuration from localStorage, window global, or defaults
 */
export function getSupabaseConfig() {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(SUPABASE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.url && parsed.anonKey) {
          return {
            url: (parsed.url || '').trim(),
            anonKey: (parsed.anonKey || '').trim()
          };
        }
      }
    } catch (e) {
      console.warn('Error reading Supabase config from storage:', e);
    }
  }

  // Fallback to runtime window global if injected or loaded from /api/config
  if (typeof window !== 'undefined' && window.CARCASTLE_SUPABASE_CONFIG) {
    return {
      url: (window.CARCASTLE_SUPABASE_CONFIG.url || '').trim(),
      anonKey: (window.CARCASTLE_SUPABASE_CONFIG.anonKey || '').trim()
    };
  }

  return { url: '', anonKey: '' };
}

/**
 * Check if Supabase is properly configured with valid credentials
 */
export function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(
    config.url && 
    config.url.startsWith('https://') && 
    config.url.includes('.supabase.co') &&
    !config.url.includes('xyzcompany') &&
    config.anonKey &&
    config.anonKey.length > 20
  );
}

/**
 * Automatically discover production Supabase & Cloudinary config from /api/config
 */
export async function autoDiscoverCloudConfig() {
  if (isSupabaseConfigured()) {
    return getSupabaseConfig();
  }

  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (data.supabaseUrl && data.supabaseAnonKey && !data.supabaseUrl.includes('xyzcompany')) {
        const discovered = {
          url: data.supabaseUrl.trim(),
          anonKey: data.supabaseAnonKey.trim()
        };
        if (typeof window !== 'undefined') {
          window.CARCASTLE_SUPABASE_CONFIG = discovered;
        }
        if (typeof localStorage !== 'undefined' && !localStorage.getItem(SUPABASE_STORAGE_KEY)) {
          saveSupabaseConfig(discovered.url, discovered.anonKey);
        }
        if (data.cloudinaryCloudName && data.cloudinaryUploadPreset) {
          saveCloudinaryConfig(data.cloudinaryCloudName, data.cloudinaryUploadPreset);
        }
        return discovered;
      }
    }
  } catch (e) {
    // Silently fall back to manual config
  }
  return getSupabaseConfig();
}

/**
 * Save Supabase configuration to localStorage
 */
export function saveSupabaseConfig(url, anonKey) {
  try {
    const payload = {
      url: (url || '').trim().replace(/\/+$/, ''),
      anonKey: (anonKey || '').trim(),
      updatedAt: new Date().toISOString()
    };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify(payload));
    }
    if (typeof window !== 'undefined') {
      window.CARCASTLE_SUPABASE_CONFIG = payload;
    }
    cachedClient = null; // Invalidate cached client
    return true;
  } catch (e) {
    console.error('Failed to save Supabase config:', e);
    return false;
  }
}

/**
 * Retrieve saved Cloudinary configuration
 */
export function getCloudinaryConfig() {
  if (typeof localStorage === 'undefined') {
    return { cloudName: '', uploadPreset: '' };
  }
  try {
    const raw = localStorage.getItem(CLOUDINARY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        cloudName: (parsed.cloudName || '').trim(),
        uploadPreset: (parsed.uploadPreset || '').trim()
      };
    }
  } catch (e) {
    console.warn('Error reading Cloudinary config:', e);
  }
  return { cloudName: '', uploadPreset: '' };
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured() {
  const config = getCloudinaryConfig();
  return Boolean(config.cloudName && config.uploadPreset);
}

/**
 * Save Cloudinary configuration to localStorage
 */
export function saveCloudinaryConfig(cloudName, uploadPreset) {
  try {
    const payload = {
      cloudName: (cloudName || '').trim(),
      uploadPreset: (uploadPreset || '').trim(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(CLOUDINARY_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.error('Failed to save Cloudinary config:', e);
    return false;
  }
}

// Cached Supabase client singleton
let cachedClient = null;
let clientInitPromise = null;

/**
 * Dynamically load and return the Supabase JS client
 * Uses official ES module build via jsDelivr CDN
 */
export async function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (cachedClient) {
    return cachedClient;
  }
  if (clientInitPromise) {
    return clientInitPromise;
  }

  clientInitPromise = (async () => {
    try {
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      const { url, anonKey } = getSupabaseConfig();
      cachedClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return cachedClient;
    } catch (err) {
      console.warn('Failed to load Supabase SDK from CDN, attempting REST fallback:', err);
      // REST API client fallback in case CDN is unreachable
      const { url, anonKey } = getSupabaseConfig();
      cachedClient = createRestFallbackClient(url, anonKey);
      return cachedClient;
    } finally {
      clientInitPromise = null;
    }
  })();

  return clientInitPromise;
}

/**
 * Lightweight REST-based client fallback for environments where CDN ES module loading fails
 */
function createRestFallbackClient(supabaseUrl, anonKey) {
  const headers = {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  return {
    from(tableName) {
      const endpoint = `${supabaseUrl}/rest/v1/${tableName}`;
      return {
        async select(columns = '*') {
          const res = await fetch(`${endpoint}?select=${encodeURIComponent(columns)}&order=order.asc`, { headers });
          if (!res.ok) throw new Error(`Supabase select error: ${res.statusText}`);
          const data = await res.json();
          return { data, error: null };
        },
        async insert(records) {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(records)
          });
          if (!res.ok) throw new Error(`Supabase insert error: ${res.statusText}`);
          const data = await res.json();
          return { data, error: null };
        },
        update(updates) {
          return {
            async eq(column, value) {
              const res = await fetch(`${endpoint}?${column}=eq.${encodeURIComponent(value)}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(updates)
              });
              if (!res.ok) throw new Error(`Supabase update error: ${res.statusText}`);
              const data = await res.json();
              return { data, error: null };
            }
          };
        },
        delete() {
          return {
            async eq(column, value) {
              const res = await fetch(`${endpoint}?${column}=eq.${encodeURIComponent(value)}`, {
                method: 'DELETE',
                headers
              });
              if (!res.ok) throw new Error(`Supabase delete error: ${res.statusText}`);
              return { data: null, error: null };
            }
          };
        }
      };
    }
  };
}

/**
 * Test connectivity with Supabase using configured credentials
 */
export async function testSupabaseConnection(url, anonKey) {
  const testUrl = (url || getSupabaseConfig().url).trim().replace(/\/+$/, '');
  const testKey = (anonKey || getSupabaseConfig().anonKey).trim();

  if (!testUrl || !testKey) {
    throw new Error('Supabase URL and Anon Key are required.');
  }

  const endpoint = `${testUrl}/rest/v1/cars?select=id&limit=1`;
  const res = await fetch(endpoint, {
    headers: {
      'apikey': testKey,
      'Authorization': `Bearer ${testKey}`
    }
  });

  if (res.status === 404 || res.status === 400) {
    const errText = await res.text();
    if (errText.includes('relation') && errText.includes('does not exist')) {
      return {
        success: true,
        needTable: true,
        message: 'Connected to Supabase! (The "cars" table has not been created yet).'
      };
    }
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Connection failed (${res.status}): ${errText || res.statusText}`);
  }

  return {
    success: true,
    needTable: false,
    message: 'Successfully connected to Supabase "cars" database!'
  };
}
