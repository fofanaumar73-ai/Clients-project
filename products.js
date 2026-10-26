// Load products for the current store
async function loadAllStoreProducts(storeId) {
    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Products error:", error);
        return [];
    }

    return (data || []).filter(
        product => product.is_active !== false
    );
}
