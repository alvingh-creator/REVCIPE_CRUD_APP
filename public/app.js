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
    if (items.length === 0) {
      recipesList.innerHTML = '<div class="text-sm text-gray-500">No recipes yet.</div>';
    } else {
      recipesList.innerHTML = items.map(r => recipeCard(r)).join('');
    }
  } catch (err) {
    recipesList.innerHTML = '<div class="text-sm text-red-500">Error loading recipes</div>';
    console.error(err);
  }
}

// Generate HTML for a recipe card
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
  return text.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;');
}

// Save or update recipe
form.addEventListener('submit', async function(e){
  e.preventDefault(); // Prevent page refresh

  const id = recipeId.value;
  const title = titleIn.value.trim();
  const ingredients = ingredientsIn.value.trim();
  const instructions = instructionsIn.value.trim();
  const time = timeIn.value.trim();

  if(!title || !ingredients || !instructions || !time){
    message.innerText = 'Please fill in all fields';
    return;
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${apiBase}/${id}` : apiBase;

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, ingredients, instructions, time })
    });
    const data = await res.json();
    if(!data.success) throw new Error(data.message);

    message.innerText = id ? 'Recipe updated!' : 'Recipe added!';
    form.reset();
    recipeId.value = '';
    loadRecipes(); // Refresh the list
  } catch(err){
    message.innerText = 'Error saving recipe';
    console.error(err);
  }
});

// Edit a recipe
async function editRecipe(id){
  try {
    const res = await fetch(`${apiBase}/${id}`);
    const json = await res.json();
    if(!json.success) throw new Error(json.message);

    const r = json.data;
    recipeId.value = r._id;
    titleIn.value = r.title;
    ingredientsIn.value = r.ingredients.join(', ');
    instructionsIn.value = r.instructions;
    timeIn.value = r.time;
  } catch(err){
    console.error(err);
  }
}

// Delete a recipe
async function deleteRecipe(id){
  if(!confirm('Are you sure you want to delete this recipe?')) return;
  try {
    const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if(!json.success) throw new Error(json.message);
    loadRecipes(); // Refresh list
  } catch(err){
    console.error(err);
  }
}

// Clear form
el('clear-btn').addEventListener('click', function(){
  form.reset();
  recipeId.value = '';
  message.innerText = '';
});

// Automatically load recipes on page load
window.addEventListener('DOMContentLoaded', loadRecipes);
