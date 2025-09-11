// public/app.js
const apiBase = '/api/recipes';

const el = id => document.getElementById(id);
const form = el('recipe-form');
const titleIn = el('title');
const ingredientsIn = el('ingredients');
const instructionsIn = el('instructions');
const timeIn = el('time');
const recipesList = el('recipes-list');
const message = el('message');
const recipeId = el('recipe-id');

// Fetch and render all recipes
async function loadRecipes() {
  recipesList.innerHTML = 'Loading...';
  try {
    const res = await fetch(apiBase);
    const json = await res.json();
    if (!json.success) throw new Error('Failed to load');
    const items = json.data;
    if (items.length === 0) recipesList.innerHTML = '<div class="text-sm text-gray-500">No recipes yet.</div>';
    else recipesList.innerHTML = items.map(r => recipeCard(r)).join('');
  } catch (err) {
    recipesList.innerHTML = '<div class="text-sm text-red-500">Error loading recipes</div>';
  }
}

function recipeCard(r) {
  return `
    <div class="border p-3 rounded">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-semibold">${escapeHtml(r.title || 'Untitled')}</h3>
          <div class="text-xs text-gray-500">${r.time ? r.time + ' min' : ''}</div>
        </div>
        <div class="flex gap-2">
          <button onclick="editRecipe('${r._id}')" class="text-sm bg-yellow-400 px-2 py-1 rounded">Edit</button>
          <button onclick="deleteRecipe('${r._id}')" class="text-sm bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </div>
      </div>
      <div class="mt-2 text-sm"><strong>Ingredients:</strong> ${escapeHtml((r.ingredients||[]).join(', '))}</div>
      <div class="mt-2 text-sm"><strong>Instructions:</strong> ${escapeHtml(r.instructions || '')}</div>
    </div>
  `;
}

function escapeHtml(text){
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replac