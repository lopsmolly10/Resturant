import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL);

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables. Falling back to local data.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Maps a Supabase `inventory_ingredients` row to the UI inventory item model.
 */
export function mapRowToInventoryItem(row) {
  const qty = Number(row.current_quantity) || 0;
  const reorder = Number(row.minimum_reorder_level) || 0;

  let status = 'In Stock';
  if (qty <= 0) {
    status = 'Out of Stock';
  } else if (qty <= reorder) {
    status = 'Low Stock';
  }

  const dateStr = row.updated_at || row.created_at || new Date().toISOString();
  const lastUpdated = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;

  return {
    id: row.id,
    name: row.ingredient_name || '',
    category: row.category || 'Produce',
    unit: row.measurement_unit || 'kg',
    quantity: qty,
    reorderLevel: reorder,
    costPerUnit: Number(row.cost_per_unit_ugx) || 0,
    supplier: row.vendor_supplier || '',
    status,
    lastUpdated
  };
}

/**
 * Maps UI inventory item / form data to Supabase `inventory_ingredients` column payload.
 */
export function mapInventoryItemToRow(itemData) {
  const payload = {};

  if (itemData.name !== undefined) {
    payload.ingredient_name = String(itemData.name).trim();
  }
  if (itemData.category !== undefined) {
    payload.category = itemData.category;
  }
  if (itemData.unit !== undefined) {
    payload.measurement_unit = itemData.unit;
  }
  if (itemData.quantity !== undefined && itemData.quantity !== '') {
    payload.current_quantity = Number(itemData.quantity) || 0;
  }
  if (itemData.reorderLevel !== undefined && itemData.reorderLevel !== '') {
    payload.minimum_reorder_level = Number(itemData.reorderLevel) || 0;
  }
  if (itemData.costPerUnit !== undefined && itemData.costPerUnit !== '') {
    payload.cost_per_unit_ugx = Number(itemData.costPerUnit) || 0;
  }
  if (itemData.supplier !== undefined) {
    payload.vendor_supplier = itemData.supplier ? String(itemData.supplier).trim() : '';
  }

  return payload;
}

/**
 * Fetch all inventory ingredients from Supabase
 */
export async function getInventoryIngredients() {
  if (!supabase) return { data: null, error: new Error('Supabase client not initialized') };

  const { data, error } = await supabase
    .from('inventory_ingredients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Failed to fetch inventory:', error);
    return { data: null, error };
  }

  return { data: data.map(mapRowToInventoryItem), error: null };
}

/**
 * Insert a new ingredient into Supabase
 */
export async function insertInventoryIngredient(itemData) {
  if (!supabase) return { data: null, error: new Error('Supabase client not initialized') };

  const payload = mapInventoryItemToRow(itemData);

  const { data, error } = await supabase
    .from('inventory_ingredients')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to insert ingredient:', error);
    return { data: null, error };
  }

  return { data: mapRowToInventoryItem(data), error: null };
}

/**
 * Update an existing ingredient in Supabase
 */
export async function updateInventoryIngredient(id, fields) {
  if (!supabase) return { data: null, error: new Error('Supabase client not initialized') };

  const payload = {
    ...mapInventoryItemToRow(fields),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('inventory_ingredients')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to update ingredient:', error);
    return { data: null, error };
  }

  return { data: mapRowToInventoryItem(data), error: null };
}

/**
 * Delete an ingredient from Supabase
 */
export async function deleteInventoryIngredient(id) {
  if (!supabase) return { error: new Error('Supabase client not initialized') };

  const { error } = await supabase
    .from('inventory_ingredients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Failed to delete ingredient:', error);
    return { error };
  }

  return { error: null };
}
