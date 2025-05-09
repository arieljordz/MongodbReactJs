// utils/storageUtils.js

export const setItemWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl, // Expiry time in milliseconds
    };
    localStorage.setItem(key, JSON.stringify(item));
};

export const getItemWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key); // Remove expired item
        return null;
    }
    return item.value;
};

