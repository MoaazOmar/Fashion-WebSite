// Retrieve the guest favorites from localStorage (used when the user is not logged in)
export function getGuestFavorites(): string[] {
    return JSON.parse(localStorage.getItem('guest_favorites') || '[]');
}

// Add a product to the guest favorites if it's not already included
export function addGuestFavorite(productId: string): void {
    const favorites = getGuestFavorites();
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem('guest_favorites', JSON.stringify(favorites));
    }
}

// Remove the specified product from the guest favorites
export function removeGuestFavorite(productId: string): void {
    let favorites = getGuestFavorites();
    favorites = favorites.filter(id => id !== productId);
    localStorage.setItem('guest_favorites', JSON.stringify(favorites));
}
